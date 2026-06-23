const supabase = require('../utils/supabaseAdmin')

const planLimits = async (req, res, next) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { data: profile, error } = await supabase
      .from('users')
      .select('plan, ai_calls_today, ai_calls_reset_at')
      .eq('id', userId)
      .single()

    // If user profile not found or columns don't exist yet, just bypass gracefully
    if (error && error.code === 'PGRST204') {
        // user not found
        return res.status(404).json({ error: 'User not found' })
    }
    if (error) {
        // likely column doesn't exist yet
        return next()
    }

    const plan = profile.plan || 'free'
    let callsToday = profile.ai_calls_today || 0
    let resetAt = profile.ai_calls_reset_at ? new Date(profile.ai_calls_reset_at) : new Date(0)

    const now = new Date()

    if (now > resetAt) {
      callsToday = 0
      const nextReset = new Date(now)
      nextReset.setHours(24, 0, 0, 0)
      resetAt = nextReset

      await supabase.from('users').update({
        ai_calls_today: 0,
        ai_calls_reset_at: resetAt.toISOString()
      }).eq('id', userId)
    }

    const FREE_LIMIT = 5
    if (plan === 'free' && callsToday >= FREE_LIMIT) {
      return res.status(429).json({ 
        error: 'Daily AI limit reached', 
        requiresUpgrade: true,
        message: `You have reached your limit of ${FREE_LIMIT} AI calls on the free plan.`
      })
    }

    await supabase.from('users').update({
      ai_calls_today: callsToday + 1
    }).eq('id', userId)

    req.planLimits = {
      plan,
      callsRemaining: plan === 'free' ? FREE_LIMIT - (callsToday + 1) : 'unlimited'
    }

    next()
  } catch (err) {
    console.error('Plan limits error:', err)
    next(err) // Let it pass if there's an issue with the db
  }
}

module.exports = planLimits
