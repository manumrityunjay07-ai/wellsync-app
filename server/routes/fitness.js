const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const supabase = require('../utils/supabaseAdmin')
const { askGemini } = require('../utils/geminiClient')

// POST /api/fitness/log
router.post('/log', auth, async (req, res, next) => {
  try {
    const { exercise_name, duration_mins, intensity, muscle_groups, energy_after } = req.body
    const { data, error } = await supabase.from('workout_logs').insert({
      user_id: req.user.id,
      exercise_name, duration_mins, intensity, muscle_groups, energy_after,
    }).select().single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// GET /api/fitness/log?days=30
router.get('/log', auth, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30
    const since = new Date(Date.now() - days * 86400000).toISOString()
    const { data, error } = await supabase
      .from('workout_logs').select('*')
      .eq('user_id', req.user.id)
      .gte('logged_at', since)
      .order('logged_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/fitness/streak
router.get('/streak', auth, async (req, res, next) => {
  try {
    const { data: logs } = await supabase
      .from('workout_logs').select('logged_at')
      .eq('user_id', req.user.id)
      .order('logged_at', { ascending: false })
      .limit(60)
    
    if (!logs?.length) return res.json({ streak: 0 })
    
    let streak = 0
    const today = new Date()
    today.setHours(0,0,0,0)
    
    const uniqueDays = [...new Set(logs.map(l => new Date(l.logged_at).toDateString()))]
    
    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date(today)
      expected.setDate(today.getDate() - i)
      if (new Date(uniqueDays[i]).toDateString() === expected.toDateString()) {
        streak++
      } else break
    }
    
    res.json({ streak })
  } catch (err) { next(err) }
})

// GET /api/fitness/plan
router.get('/plan', auth, async (req, res, next) => {
  try {
    // In production, this would cache in DB. For now, return null.
    res.json(null)
  } catch (err) { next(err) }
})

module.exports = router
