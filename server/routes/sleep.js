const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const supabase = require('../utils/supabaseAdmin')

// POST /api/sleep/log
router.post('/log', auth, async (req, res, next) => {
  try {
    const { bedtime, wake_time, duration_hrs, quality_rating, restedness_rating } = req.body
    const { data, error } = await supabase.from('sleep_logs').insert({
      user_id: req.user.id,
      bedtime, wake_time, duration_hrs, quality_rating, restedness_rating,
    }).select().single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// GET /api/sleep/log?days=14
router.get('/log', auth, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 14
    const since = new Date(Date.now() - days * 86400000).toISOString()
    const { data, error } = await supabase
      .from('sleep_logs').select('*')
      .eq('user_id', req.user.id)
      .gte('logged_at', since)
      .order('logged_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/sleep/recovery
router.get('/recovery', auth, async (req, res, next) => {
  try {
    const { data } = await supabase
      .from('sleep_logs').select('*')
      .eq('user_id', req.user.id)
      .order('logged_at', { ascending: false })
      .limit(1)
      .single()
    
    if (!data) return res.json({ score: 'yellow', message: 'No sleep data' })
    
    let score = 'yellow'
    if (data.duration_hrs >= 7.5 && data.quality_rating >= 4) score = 'green'
    else if (data.duration_hrs < 5.5 || data.quality_rating <= 2) score = 'red'
    
    res.json({ score, duration_hrs: data.duration_hrs, quality: data.quality_rating })
  } catch (err) { next(err) }
})

// GET /api/sleep/debt
router.get('/debt', auth, async (req, res, next) => {
  try {
    const { data } = await supabase
      .from('sleep_logs').select('duration_hrs')
      .eq('user_id', req.user.id)
      .gte('logged_at', new Date(Date.now() - 7 * 86400000).toISOString())
    
    const target = 7 * 7 // 7 hours per night for 7 days
    const actual = (data || []).reduce((a, l) => a + l.duration_hrs, 0)
    const debt = Math.max(0, target - actual)
    
    res.json({ debt_hrs: parseFloat(debt.toFixed(1)), days_tracked: (data || []).length })
  } catch (err) { next(err) }
})

module.exports = router
