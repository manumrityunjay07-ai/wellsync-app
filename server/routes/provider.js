const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const supabase = require('../utils/supabaseAdmin')

// GET /api/provider/patients
// Fetch all patients and their latest well score
router.get('/patients', auth, async (req, res, next) => {
  try {
    // Basic authorization check: Ensure the caller is actually a provider
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single()

    if (userError || currentUser?.role !== 'provider') {
      return res.status(403).json({ error: 'Access denied. Provider role required.' })
    }

    // 1. Fetch users who are NOT providers
    const { data: patients, error: patientError } = await supabase
      .from('users')
      .select('id, name, email, condition_profile, age, gender')
      .neq('role', 'provider')

    if (patientError) throw patientError

    // 2. Fetch the latest well_score for each patient
    const patientIds = patients.map(p => p.id)
    
    // We fetch all scores for these patients and then group by patient
    // Note: in a massive production db, we'd do a complex raw SQL query or lateral join, 
    // but for our scale, fetching recent scores is fine.
    const { data: scores, error: scoresError } = await supabase
      .from('well_scores')
      .select('user_id, score, calculated_at')
      .in('user_id', patientIds)
      .order('calculated_at', { ascending: false })

    if (scoresError) throw scoresError

    // Map the latest score to each patient
    const results = patients.map(patient => {
      const patientScores = scores?.filter(s => s.user_id === patient.id) || []
      const latestScore = patientScores.length > 0 ? patientScores[0].score : null
      
      // Calculate a simple 'needsAttention' flag
      const needsAttention = latestScore !== null && latestScore < 60

      return {
        ...patient,
        latestScore,
        needsAttention
      }
    })

    res.json(results)
  } catch (err) {
    next(err)
  }
})

module.exports = router
