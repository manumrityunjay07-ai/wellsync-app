const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const supabase = require('../utils/supabaseAdmin')

// GET /api/friends
router.get('/', auth, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select(`*, friend:friend_id(id, name, email)`)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (err) { next(err) }
})

// POST /api/friends/add
router.post('/add', auth, async (req, res, next) => {
  try {
    const { email } = req.body
    
    const { data: targetUser, error: findError } = await supabase
      .from('users').select('id, name, email').eq('email', email.toLowerCase()).single()
    
    if (findError || !targetUser) {
      return res.status(404).json({ error: 'No user found with that email address.' })
    }
    
    if (targetUser.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot add yourself as a friend.' })
    }
    
    const { data, error } = await supabase.from('friends').insert({
      user_id: req.user.id,
      friend_id: targetUser.id,
      status: 'pending',
    }).select().single()
    
    if (error) throw error
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// GET /api/friends/pending
router.get('/pending', auth, async (req, res, next) => {
  try {
    const { data } = await supabase
      .from('friends')
      .select(`*, requester:user_id(id, name, email)`)
      .eq('friend_id', req.user.id)
      .eq('status', 'pending')
    res.json(data || [])
  } catch (err) { next(err) }
})

// PATCH /api/friends/:id/accept
router.patch('/:id/accept', auth, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('id', req.params.id)
      .eq('friend_id', req.user.id)
      .select().single()
    if (error) throw error
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/friends/leaderboard
router.get('/leaderboard', auth, async (req, res, next) => {
  try {
    const { data: friends } = await supabase
      .from('friends').select('friend_id')
      .eq('user_id', req.user.id)
      .eq('status', 'accepted')
    
    const friendIds = [req.user.id, ...(friends || []).map(f => f.friend_id)]
    
    // Get latest WellScore for each friend
    const leaderboard = []
    for (const uid of friendIds) {
      const { data: score } = await supabase
        .from('well_scores').select('score')
        .eq('user_id', uid)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single()
      
      const { data: user } = await supabase
        .from('users').select('name, email').eq('id', uid).single()
      
      leaderboard.push({
        user_id: uid,
        name: user?.name || user?.email,
        score: score?.score || 0,
        is_me: uid === req.user.id,
      })
    }
    
    leaderboard.sort((a, b) => b.score - a.score)
    res.json(leaderboard)
  } catch (err) { next(err) }
})

module.exports = router
