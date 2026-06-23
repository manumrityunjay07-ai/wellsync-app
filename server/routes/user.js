const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const supabase = require('../utils/supabaseAdmin')

router.post('/toggle-role', auth, async (req, res, next) => {
  try {
    const userId = req.user.id
    
    // Fetch current profile
    const { data: profile, error: fetchError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()
      
    if (fetchError) throw fetchError
    
    const newRole = profile.role === 'provider' ? 'patient' : 'provider'
    
    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
      .single()
      
    if (updateError) throw updateError
    
    res.json(updated)
  } catch (err) { next(err) }
})

module.exports = router
