const express = require('express')
const router = express.Router()
const { google } = require('googleapis')
const supabase = require('../utils/supabaseAdmin')
const auth = require('../middleware/authMiddleware')
const fs = require('fs')
const path = require('path')

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

const DATA_FILE = path.join(__dirname, '..', 'data', 'integrations.json')
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}))
}

// GET /api/integrations/google/auth
router.get('/google/auth', (req, res) => {
  const userId = req.query.userId
  if (!userId) return res.status(400).send('Missing userId')
  
  const scopes = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.sleep.read'
  ]
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: userId,
    prompt: 'consent'
  })
  res.redirect(url)
})

// GET /api/integrations/google/callback
router.get('/google/callback', async (req, res) => {
  const { code, state } = req.query
  if (!code || !state) return res.status(400).send('Missing code or state')
  
  try {
    const { tokens } = await oauth2Client.getToken(code)
    
    // Save to local JSON
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    data[state] = { google: tokens }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    
    res.redirect(`${process.env.CLIENT_URL}/integrations?success=true`)
  } catch (error) {
    console.error('Error fetching Google tokens', error)
    res.redirect(`${process.env.CLIENT_URL}/integrations?error=google_auth_failed`)
  }
})

// POST /api/integrations/google/sync
router.post('/google/sync', auth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    const userTokens = data[userId]?.google
    
    if (!userTokens) {
      return res.status(401).json({ error: 'Google Fit not connected' })
    }
    
    oauth2Client.setCredentials(userTokens)
    const fitness = google.fitness({ version: 'v1', auth: oauth2Client })
    
    const end = Date.now()
    const start = end - (24 * 60 * 60 * 1000) // last 24 hrs
    
    // Fetch steps
    const resSteps = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
        }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: start,
        endTimeMillis: end
      }
    });
    
    let totalSteps = 0
    const buckets = resSteps.data.bucket || []
    for (const b of buckets) {
      for (const ds of b.dataset) {
        for (const pt of ds.point) {
          totalSteps += pt.value[0].intVal || 0
        }
      }
    }
    
    // Inject real data or fallback
    if (totalSteps > 0) {
       await supabase.from('workout_logs').insert({
         user_id: userId,
         exercise_name: 'Walking (Google Fit)',
         duration_mins: Math.round(totalSteps / 100),
         intensity: 'Low',
         muscle_groups: ['Legs'],
         energy_after: 'Good'
       })
    } else {
       await supabase.from('workout_logs').insert({
         user_id: userId,
         exercise_name: 'Google Fit Checked (0 Steps)',
         duration_mins: 0,
         intensity: 'Low',
         muscle_groups: ['None'],
         energy_after: 'Normal'
       })
    }
    
    res.json({ success: true, steps: totalSteps })
  } catch (err) {
    console.error('Google Fit Sync Error:', err)
    next(err)
  }
})

// GET /api/integrations/status
router.get('/status', auth, (req, res) => {
    const userId = req.user.id
    let data = {}
    if (fs.existsSync(DATA_FILE)) {
        data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    }
    res.json({
        googleConnected: !!(data[userId] && data[userId].google)
    })
})

// POST /api/integrations/google/disconnect
router.post('/google/disconnect', auth, (req, res) => {
    const userId = req.user.id
    let data = {}
    if (fs.existsSync(DATA_FILE)) {
        data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
        if(data[userId] && data[userId].google) {
            delete data[userId].google
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
        }
    }
    res.json({ success: true })
})

module.exports = router
