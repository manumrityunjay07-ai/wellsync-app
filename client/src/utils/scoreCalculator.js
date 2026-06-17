/**
 * scoreCalculator.js
 * Client-side utility to compute a rough WellScore from local data
 * when the server is unavailable.
 */

export function computeLocalScore(data) {
  const {
    mood,       // { stress_level: 1-10, mood: string }
    workout,    // { duration_mins, intensity }
    meal,       // { calories, protein_g }
    sleep,      // { duration_hrs, quality_rating }
    vitals,     // { readings: [] }
    habits,     // { completed, total }
  } = data

  const scores = {}
  let total = 0
  let count = 0

  // Mental (0–100)
  if (mood) {
    const stressScore = Math.max(0, 100 - (mood.stress_level || 5) * 9)
    const moodBonus = ['happy', 'calm', 'excited', 'content'].includes(mood.mood?.toLowerCase()) ? 10 : 0
    scores.mental = Math.min(100, stressScore + moodBonus)
    total += scores.mental; count++
  }

  // Fitness (0–100)
  if (workout) {
    const durationScore = Math.min(60, workout.duration_mins || 0) / 60 * 100
    const intensityMultiplier = workout.intensity === 'high' ? 1 : workout.intensity === 'medium' ? 0.8 : 0.6
    scores.fitness = Math.min(100, durationScore * intensityMultiplier)
    total += scores.fitness; count++
  }

  // Nutrition (0–100)  
  if (meal) {
    const calorieTarget = 2000
    const calorieRatio = Math.min(1, (meal.calories || 0) / calorieTarget)
    const proteinScore = Math.min(50, ((meal.protein_g || 0) / 50) * 50)
    scores.nutrition = Math.round(calorieRatio * 50 + proteinScore)
    total += scores.nutrition; count++
  }

  // Sleep (0–100)
  if (sleep) {
    const durationScore = sleep.duration_hrs >= 7 && sleep.duration_hrs <= 9 ? 60 : 
                          sleep.duration_hrs >= 6 ? 40 : 20
    const qualityScore = ((sleep.quality_rating || 3) / 5) * 40
    scores.sleep = Math.round(durationScore + qualityScore)
    total += scores.sleep; count++
  }

  // Vitals (assume stable if no readings)
  scores.vitals = vitals?.readings?.length > 0 ? 75 : 60
  total += scores.vitals; count++

  // Wellness/Habits (0–100)
  if (habits) {
    scores.wellness = habits.total > 0 ? Math.round((habits.completed / habits.total) * 100) : 50
    total += scores.wellness; count++
  }

  const overall = count > 0 ? Math.round(total / count) : 0

  return {
    score: overall,
    pillar_scores: scores,
    status: overall >= 80 ? 'Thriving' :
            overall >= 60 ? 'Doing Well' :
            overall >= 40 ? 'Needs Attention' : 'Take Action'
  }
}

export function getScoreColor(score) {
  if (score >= 80) return '#10B981'
  if (score >= 60) return '#F59E0B'
  if (score >= 40) return '#F97316'
  return '#EF4444'
}

export function getScoreGradient(score) {
  if (score >= 80) return 'linear-gradient(135deg, #10B981, #059669)'
  if (score >= 60) return 'linear-gradient(135deg, #F59E0B, #D97706)'
  if (score >= 40) return 'linear-gradient(135deg, #F97316, #EA580C)'
  return 'linear-gradient(135deg, #EF4444, #DC2626)'
}
