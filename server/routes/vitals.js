const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const supabase = require('../utils/supabaseAdmin')
const { askGemini } = require('../utils/geminiClient')

// POST /api/vitals/log
router.post('/log', auth, async (req, res, next) => {
  try {
    const { vital_type, value, unit } = req.body
    const { data, error } = await supabase.from('vital_logs').insert({
      user_id: req.user.id,
      vital_type, value, unit, ai_flag: null,
    }).select().single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// GET /api/vitals/log?days=14
router.get('/log', auth, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 14
    const since = new Date(Date.now() - days * 86400000).toISOString()
    const { data, error } = await supabase
      .from('vital_logs').select('*')
      .eq('user_id', req.user.id)
      .gte('logged_at', since)
      .order('logged_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/vitals/medications
router.get('/medications', auth, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('medications').select('*')
      .eq('user_id', req.user.id)
      .order('logged_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (err) { next(err) }
})

// POST /api/vitals/medications
router.post('/medications', auth, async (req, res, next) => {
  try {
    const { name, dosage, frequency, side_effect_note } = req.body
    const { data, error } = await supabase.from('medications').insert({
      user_id: req.user.id, name, dosage, frequency, side_effect_note,
    }).select().single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// PATCH /api/vitals/medications/:id
router.patch('/medications/:id', auth, async (req, res, next) => {
  try {
    const { taken_today } = req.body
    const { data, error } = await supabase
      .from('medications')
      .update({ taken_today })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select().single()
    if (error) throw error
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/vitals/alerts
router.get('/alerts', auth, async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 14 * 86400000).toISOString()
    const { data: vitals } = await supabase
      .from('vital_logs').select('*')
      .eq('user_id', req.user.id)
      .gte('logged_at', since)
    
    if (!vitals?.length) return res.json({ alerts: [], overall_status: 'stable' })
    
    const { data: user } = await supabase
      .from('users').select('condition_profile')
      .eq('id', req.user.id).single()
    
    const prompt = `You are a medical data analyst AI. Analyse the user's last 14 days of vital readings.
Identify any concerning trends and flag them clearly.
Respond ONLY in raw JSON, no markdown:
{
  "alerts": [
    {
      "vital": string,
      "trend": string,
      "severity": "info" | "warning" | "urgent",
      "message": "plain English explanation for a non-medical person",
      "action": "what the user should do"
    }
  ],
  "overall_status": "stable" | "monitor" | "consult doctor"
}
User condition: ${JSON.stringify(user?.condition_profile)}
Last 14 days of vitals: ${JSON.stringify(vitals)}`
    
    const result = await askGemini(prompt)
    res.json(result)
  } catch (err) {
    res.json({ alerts: [], overall_status: 'stable' })
  }
})

// GET /api/vitals/report-data
router.get('/report-data', auth, async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 30 * 86400000).toISOString()
    const [vitalsRes, medsRes] = await Promise.all([
      supabase.from('vital_logs').select('*').eq('user_id', req.user.id).gte('logged_at', since),
      supabase.from('medications').select('*').eq('user_id', req.user.id),
    ])
    res.json({ vitals: vitalsRes.data, medications: medsRes.data })
  } catch (err) { next(err) }
})

module.exports = router
