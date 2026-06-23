const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const supabase = require('../utils/supabaseAdmin')

// GET /api/wellness/score
router.get('/score', auth, async (req, res, next) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { data } = await supabase
      .from('well_scores').select('*')
      .eq('user_id', req.user.id)
      .gte('calculated_at', today.toISOString())
      .order('calculated_at', { ascending: false })
      .limit(1)
      .single()
    res.json(data || null)
  } catch (err) { res.json(null) }
})

// GET /api/wellness/history?days=30
router.get('/history', auth, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30
    const since = new Date(Date.now() - days * 86400000).toISOString()
    const { data, error } = await supabase
      .from('well_scores').select('*')
      .eq('user_id', req.user.id)
      .gte('calculated_at', since)
      .order('calculated_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/wellness/weekly-report
router.get('/weekly-report', auth, async (req, res, next) => {
  try {
    const { data } = await supabase
      .from('well_scores').select('*')
      .eq('user_id', req.user.id)
      .gte('calculated_at', new Date(Date.now() - 7 * 86400000).toISOString())
      .order('calculated_at', { ascending: false })
    
    if (!data?.length) return res.json(null)
    
    const avgScore = Math.round(data.reduce((a, s) => a + s.score, 0) / data.length)
    const latest = data[0]
    
    res.json({
      avg_score: avgScore,
      went_well: latest?.top_win || 'You tracked your health this week — that\'s already a win!',
      to_improve: latest?.top_concern || 'Keep consistent across all 6 pillars.',
      recommendations: [
        'Log all 6 pillars daily to get a more accurate WellScore.',
        'Try to sleep at least 7 hours tonight.',
        'Log your meals to track nutrition patterns.',
      ],
    })
  } catch (err) { next(err) }
})

// GET /api/wellness/habits
router.get('/habits', auth, async (req, res, next) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { data: habits, error } = await supabase
      .from('habits').select(`*, habit_logs(completed_at)`)
      .eq('user_id', req.user.id)
    if (error) throw error
    
    const result = (habits || []).map(h => ({
      ...h,
      completed_today: h.habit_logs?.some(l => new Date(l.completed_at) >= today) || false,
    }))
    res.json(result)
  } catch (err) { next(err) }
})

// POST /api/wellness/habits
router.post('/habits', auth, async (req, res, next) => {
  try {
    const { habit_name, target_per_week } = req.body
    const { data, error } = await supabase.from('habits').insert({
      user_id: req.user.id, habit_name, target_per_week: target_per_week || 7,
    }).select().single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// POST /api/wellness/habit-log
router.post('/habit-log', auth, async (req, res, next) => {
  try {
    const { habit_id } = req.body
    const { data, error } = await supabase.from('habit_logs').insert({
      habit_id, user_id: req.user.id,
    }).select().single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// DELETE /api/wellness/habit-log/:habit_id
router.delete('/habit-log/:habit_id', auth, async (req, res, next) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', req.params.habit_id)
      .eq('user_id', req.user.id)
      .gte('completed_at', today.toISOString())
    if (error) throw error
    res.json({ success: true })
  } catch (err) { next(err) }
})

// GET /api/wellness/badges
router.get('/badges', auth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const earned = []

    const [moodLogs, workoutLogs, sleepLogs, vitalLogs, scores] = await Promise.all([
      supabase.from('mood_logs').select('logged_at').eq('user_id', userId),
      supabase.from('workout_logs').select('logged_at').eq('user_id', userId),
      supabase.from('sleep_logs').select('logged_at').eq('user_id', userId),
      supabase.from('vital_logs').select('logged_at').eq('user_id', userId),
      supabase.from('well_scores').select('score').eq('user_id', userId),
    ])

    // first_log
    if ((moodLogs.data?.length || 0) + (workoutLogs.data?.length || 0) > 0) earned.push('first_log')

    // streak_7
    if ((workoutLogs.data?.length || 0) >= 7) earned.push('streak_7')

    // wellscore_80
    if (scores.data?.some(s => s.score >= 80)) earned.push('wellscore_80')

    // sleep_7
    if ((sleepLogs.data?.length || 0) >= 7) earned.push('sleep_7')

    // mood_7
    if ((moodLogs.data?.length || 0) >= 7) earned.push('mood_7')

    // vitals_14
    if ((vitalLogs.data?.length || 0) >= 14) earned.push('vitals_14')

    res.json(earned)
  } catch (err) { next(err) }
})

// GET /api/wellness/export
router.get('/export', auth, async (req, res, next) => {
  try {
    const { data: moods } = await supabase.from('mood_logs').select('*').eq('user_id', req.user.id)
    const { data: workouts } = await supabase.from('workout_logs').select('*').eq('user_id', req.user.id)
    const { data: meals } = await supabase.from('meal_logs').select('*').eq('user_id', req.user.id)
    const { data: sleeps } = await supabase.from('sleep_logs').select('*').eq('user_id', req.user.id)
    const { data: vitals } = await supabase.from('vital_logs').select('*').eq('user_id', req.user.id)
    const { data: scores } = await supabase.from('well_scores').select('*').eq('user_id', req.user.id)
    
    // Flatten to simple export format
    const exportData = [
      ...( moods || []).map(r => ({ type: 'mood', ...r })),
      ...(workouts || []).map(r => ({ type: 'workout', ...r })),
      ...(meals || []).map(r => ({ type: 'meal', ...r })),
      ...(sleeps || []).map(r => ({ type: 'sleep', ...r })),
      ...(vitals || []).map(r => ({ type: 'vital', ...r })),
      ...(scores || []).map(r => ({ type: 'wellscore', ...r })),
    ].sort((a, b) => new Date(b.logged_at || b.calculated_at) - new Date(a.logged_at || a.calculated_at))
    
    res.json(exportData)
  } catch (err) { next(err) }
})

// GET /api/wellness/streaks
// Returns consecutive day streaks for all 6 pillars
router.get('/streaks', auth, async (req, res, next) => {
  try {
    const uid = req.user.id

    const [moodRes, workoutRes, mealRes, sleepRes, vitalRes, habitRes] = await Promise.all([
      supabase.from('mood_logs').select('logged_at').eq('user_id', uid).order('logged_at', { ascending: false }),
      supabase.from('workout_logs').select('logged_at').eq('user_id', uid).order('logged_at', { ascending: false }),
      supabase.from('meal_logs').select('logged_at').eq('user_id', uid).order('logged_at', { ascending: false }),
      supabase.from('sleep_logs').select('logged_at').eq('user_id', uid).order('logged_at', { ascending: false }),
      supabase.from('vital_logs').select('logged_at').eq('user_id', uid).order('logged_at', { ascending: false }),
      supabase.from('habit_logs').select('completed_at').eq('user_id', uid).order('completed_at', { ascending: false }),
    ])

    function calcStreak(rows, field = 'logged_at') {
      if (!rows?.length) return 0
      const days = [...new Set(rows.map(r => new Date(r[field]).toDateString()))]
      let streak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      for (let i = 0; i < days.length; i++) {
        const d = new Date(days[i])
        const diff = Math.round((today - d) / 86400000)
        if (diff === i || (i === 0 && diff === 1)) streak++
        else break
      }
      return streak
    }

    res.json({
      mental:    calcStreak(moodRes.data),
      fitness:   calcStreak(workoutRes.data),
      nutrition: calcStreak(mealRes.data),
      sleep:     calcStreak(sleepRes.data),
      vitals:    calcStreak(vitalRes.data),
      wellness:  calcStreak(habitRes.data, 'completed_at'),
    })
  } catch (err) { next(err) }
})

module.exports = router
