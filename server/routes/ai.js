const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const planLimits = require('../middleware/planLimits')
const supabase = require('../utils/supabaseAdmin')
const { askGemini, askGeminiText } = require('../utils/geminiClient')

// POST /api/ai/well-score — Full WellScore calculation
router.post('/well-score', auth, planLimits, async (req, res, next) => {
  try {
    const userId = req.user.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const since = today.toISOString()
    
    // Gather today's data from all pillars
    const [moodRes, workoutRes, mealRes, sleepRes, vitalRes, habitRes, userRes] = await Promise.all([
      supabase.from('mood_logs').select('*').eq('user_id', userId).gte('logged_at', since),
      supabase.from('workout_logs').select('*').eq('user_id', userId).gte('logged_at', since),
      supabase.from('meal_logs').select('*').eq('user_id', userId).gte('logged_at', since),
      supabase.from('sleep_logs').select('*').eq('user_id', userId).order('logged_at', { ascending: false }).limit(1),
      supabase.from('vital_logs').select('*').eq('user_id', userId).gte('logged_at', since),
      supabase.from('habit_logs').select('*').eq('user_id', userId).gte('completed_at', since),
      supabase.from('users').select('*').eq('id', userId).single(),
    ])
    
    const allPillarData = {
      mood: moodRes.data,
      workouts: workoutRes.data,
      meals: mealRes.data,
      sleep: sleepRes.data,
      vitals: vitalRes.data,
      habits: habitRes.data,
    }
    
    const user = userRes.data
    
    const prompt = `You are a health analyst AI. Analyse the following health data for today and return a WellScore.
The score must reflect balance across all pillars, not perfection in one.
If the user has a condition profile, weight that pillar higher.
Respond ONLY in raw JSON, no markdown, no explanation outside JSON:
{
  "score": number between 0 and 100,
  "pillar_breakdown": {
    "mental": number, "fitness": number, "nutrition": number,
    "sleep": number, "vitals": number, "wellness": number
  },
  "ai_briefing": "2-3 sentence plain English summary of the day",
  "top_win": "one specific thing the user did well today",
  "top_concern": "one specific thing that needs attention",
  "status": "Thriving" | "Doing Well" | "Needs Attention" | "Take Action"
}
User condition profile: ${JSON.stringify(user?.condition_profile)}
Today's data: ${JSON.stringify(allPillarData)}`
    
    const aiResult = await askGemini(prompt)
    
    // Save to DB
    const { data, error } = await supabase.from('well_scores').insert({
      user_id: userId,
      score: aiResult.score,
      pillar_breakdown: aiResult.pillar_breakdown,
      ai_briefing: aiResult.ai_briefing,
      top_win: aiResult.top_win,
      top_concern: aiResult.top_concern,
      cross_insight: aiResult.status,
    }).select().single()
    
    if (error) throw error
    res.json({ ...data, status: aiResult.status })
  } catch (err) {
    // Return a fallback score on AI failure
    const fallback = {
      score: 65,
      pillar_breakdown: { mental: 65, fitness: 65, nutrition: 65, sleep: 65, vitals: 65, wellness: 65 },
      ai_briefing: 'Unable to generate AI briefing right now. Log more data and try again.',
      top_win: 'You opened WellSync today!',
      top_concern: 'Log data across all 6 pillars for a real score.',
      status: 'Doing Well',
    }
    res.json(fallback)
  }
})

// POST /api/ai/workout-plan
router.post('/workout-plan', auth, planLimits, async (req, res, next) => {
  try {
    const { data: recentWorkouts } = await supabase
      .from('workout_logs').select('*')
      .eq('user_id', req.user.id)
      .order('logged_at', { ascending: false })
      .limit(5)
    
    const { data: user } = await supabase
      .from('users').select('health_goals').eq('id', req.user.id).single()
    
    const recentSoreness = recentWorkouts?.map(w => w.energy_after || 5)?.join(', ') || 'unknown'
    
    const prompt = `You are a fitness coach AI. Generate a 7-day workout plan personalised to this user.
If the user is sore (soreness rating above 3), schedule rest or light days.
Keep workouts realistic for someone without a gym if no equipment is listed.
Respond ONLY in raw JSON, no markdown:
{
  "week_plan": [
    {
      "day": "Monday",
      "type": "workout" | "rest" | "active recovery",
      "workout_name": string,
      "exercises": [{ "name": string, "sets": number, "reps": string, "rest_secs": number }],
      "duration_mins": number,
      "intensity": "low" | "medium" | "high",
      "reason": "why this day is scheduled this way"
    }
  ]
}
User goal: ${user?.health_goals?.fitness || 'stay active'}
Recent soreness (energy_after): ${recentSoreness}
Last 5 workouts: ${JSON.stringify(recentWorkouts)}
Available equipment: ${user?.health_goals?.equipment || 'none'}`
    
    const result = await askGemini(prompt)
    res.json(result)
  } catch (err) { next(err) }
})

// POST /api/ai/cross-insights
router.post('/cross-insights', auth, planLimits, async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 7 * 86400000).toISOString()
    const [moodRes, workoutRes, mealRes, sleepRes] = await Promise.all([
      supabase.from('mood_logs').select('*').eq('user_id', req.user.id).gte('logged_at', since),
      supabase.from('workout_logs').select('*').eq('user_id', req.user.id).gte('logged_at', since),
      supabase.from('meal_logs').select('*').eq('user_id', req.user.id).gte('logged_at', since),
      supabase.from('sleep_logs').select('*').eq('user_id', req.user.id).gte('logged_at', since),
    ])
    
    const weeklyData = {
      mood: moodRes.data, workouts: workoutRes.data,
      meals: mealRes.data, sleep: sleepRes.data,
    }
    
    const prompt = `You are a holistic health coach AI. Analyse the user's last 7 days of data across all health pillars.
Find 3 specific, non-obvious connections between different pillars.
Be specific — use actual values from the data, not generic advice.
Respond ONLY in raw JSON, no markdown:
{
  "insights": [
    {
      "title": "short insight title",
      "detail": "specific explanation using the user's actual data",
      "action": "one concrete thing to do this week",
      "pillars_involved": ["pillar1", "pillar2"]
    }
  ]
}
Last 7 days of data: ${JSON.stringify(weeklyData)}`
    
    const result = await askGemini(prompt)
    res.json(result)
  } catch (err) { next(err) }
})

// POST /api/ai/chat — WellBot
router.post('/chat', auth, planLimits, async (req, res, next) => {
  try {
    const { message } = req.body
    
    const { data: scoreData } = await supabase
      .from('well_scores').select('*')
      .eq('user_id', req.user.id)
      .order('calculated_at', { ascending: false })
      .limit(1)
      .single()
    
    const prompt = `You are WellBot, a friendly personal health assistant inside the WellSync app.
Answer the user's question using their personal health data for context.
Keep responses under 150 words. Be specific, warm, and practical.
Never diagnose. If something sounds serious, always say "consult your doctor."
User's latest WellScore data: ${JSON.stringify(scoreData)}
User's question: "${message}"
Respond as plain text, not JSON.`
    
    const response = await askGeminiText(prompt)
    res.json({ response })
  } catch (err) { next(err) }
})

// POST /api/ai/meal-macro
router.post('/meal-macro', auth, planLimits, async (req, res, next) => {
  try {
    const { description } = req.body
    if (!description) return res.status(400).json({ error: 'Description is required' })

    const prompt = `You are a nutrition AI. Estimate the calories and macros for this Indian meal description.
Account for typical Indian serving sizes and cooking methods.
Respond ONLY in raw JSON, no markdown:
{
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fats_g": number,
  "confidence": "high" | "medium" | "low",
  "note": "optional short note if confidence is low"
}
Meal: "${description}"`

    const result = await askGemini(prompt)
    res.json(result)
  } catch (err) { next(err) }
})

// POST /api/ai/mood-tone
router.post('/mood-tone', auth, planLimits, async (req, res, next) => {
  try {
    const { journalNote } = req.body
    if (!journalNote) return res.json({ tone: 'neutral' })

    const prompt = `Analyse this journal note and return only the emotional tone as a single word.
Choose from: positive, negative, anxious, calm, sad, excited, frustrated, neutral
Journal: "${journalNote}"
Respond with ONLY the single word tone, nothing else.`

    const result = await askGeminiText(prompt)
    res.json({ tone: result.toLowerCase() })
  } catch (err) {
    res.json({ tone: 'neutral' })
  }
})

module.exports = router
