const supabase = require('../utils/supabaseAdmin')

/**
 * Middleware to verify Supabase JWT and attach user to request
 */
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided' })
  }

  const token = authHeader.slice(7)
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token verification failed' })
  }
}

module.exports = authMiddleware
