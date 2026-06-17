const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const supabase = require('../utils/supabaseAdmin')

// POST /api/nutrition/log
router.post('/log', auth, async (req, res, next) => {
  try {
    const { meal_description, meal_type, ai_calories, ai_protein_g, ai_carbs_g, ai_fats_g } = req.body
    const { data, error } = await supabase.from('meal_logs').insert({
      user_id: req.user.id,
      meal_description, meal_type,
      ai_calories: ai_calories || null,
      ai_protein_g: ai_protein_g || null,
      ai_carbs_g: ai_carbs_g || null,
      ai_fats_g: ai_fats_g || null,
    }).select().single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// GET /api/nutrition/log?days=7
router.get('/log', auth, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7
    const since = new Date(Date.now() - days * 86400000).toISOString()
    const { data, error } = await supabase
      .from('meal_logs').select('*')
      .eq('user_id', req.user.id)
      .gte('logged_at', since)
      .order('logged_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/nutrition/today — totals for today
router.get('/today', auth, async (req, res, next) => {
  try {
    const todayStart = new Date()
    todayStart.setHours(0,0,0,0)
    const { data, error } = await supabase
      .from('meal_logs').select('ai_calories, ai_protein_g, ai_carbs_g, ai_fats_g')
      .eq('user_id', req.user.id)
      .gte('logged_at', todayStart.toISOString())
    if (error) throw error
    
    const totals = (data || []).reduce((acc, meal) => ({
      calories: acc.calories + (meal.ai_calories || 0),
      protein_g: acc.protein_g + (meal.ai_protein_g || 0),
      carbs_g: acc.carbs_g + (meal.ai_carbs_g || 0),
      fats_g: acc.fats_g + (meal.ai_fats_g || 0),
    }), { calories: 0, protein_g: 0, carbs_g: 0, fats_g: 0 })
    
    res.json(totals)
  } catch (err) { next(err) }
})

// GET /api/nutrition/grade
router.get('/grade', auth, async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 7 * 86400000).toISOString()
    const { data } = await supabase
      .from('meal_logs').select('logged_at')
      .eq('user_id', req.user.id)
      .gte('logged_at', since)
    
    const daysLogged = new Set((data || []).map(l => new Date(l.logged_at).toDateString())).size
    const grade = daysLogged >= 6 ? 'A' : daysLogged >= 5 ? 'B' : daysLogged >= 3 ? 'C' : 'D'
    res.json({ grade, days_logged: daysLogged })
  } catch (err) { next(err) }
})

module.exports = router
