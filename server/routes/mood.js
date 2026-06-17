const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const supabase = require('../utils/supabaseAdmin')
const { askGeminiText } = require('../utils/geminiClient')

// POST /api/mood — Log mood + AI tone detection
router.post('/', auth, async (req, res, next) => {
  try {
    const { mood, stress_level, journal_note, ai_tone } = req.body
    const { data, error } = await supabase.from('mood_logs').insert({
      user_id: req.user.id,
      mood, stress_level, journal_note,
      ai_tone: ai_tone || 'neutral',
    }).select().single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// GET /api/mood/history?days=30
router.get('/history', auth, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30
    const since = new Date(Date.now() - days * 86400000).toISOString()
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .gte('logged_at', since)
      .order('logged_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/mood/patterns — AI pattern analysis
router.get('/patterns', auth, async (req, res, next) => {
  try {
    const { data: logs } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .order('logged_at', { ascending: false })
      .limit(30)
    
    if (!logs?.length) return res.json({ patterns: [] })
    
    const prompt = `Analyse these mood logs and identify 2-3 specific patterns. 
Be concrete, mention specific days/times if present.
Respond ONLY in raw JSON: {"patterns": [{"title": string, "detail": string, "emoji": string}]}
Data: ${JSON.stringify(logs)}`
    
    const result = await askGeminiText(prompt)
    const clean = result.replace(/```json|```/g, '').trim()
    res.json(JSON.parse(clean))
  } catch (err) { next(err) }
})

module.exports = router
