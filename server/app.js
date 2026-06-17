require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const app = express()

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost:') || origin === process.env.CLIENT_URL) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(helmet())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '1mb' }))

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
})
app.use(generalLimiter)

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: 'AI request limit reached. Please try again later.' },
  keyGenerator: (req) => req.user?.id || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip',
})

// Routes
app.use('/api/mood', require('./routes/mood'))
app.use('/api/fitness', require('./routes/fitness'))
app.use('/api/nutrition', require('./routes/nutrition'))
app.use('/api/sleep', require('./routes/sleep'))
app.use('/api/vitals', require('./routes/vitals'))
app.use('/api/wellness', require('./routes/wellness'))
app.use('/api/friends', require('./routes/friends'))
app.use('/api/ai', aiLimiter, require('./routes/ai'))

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'WellSync API' }))

// Error handler
app.use(require('./middleware/errorHandler'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ WellSync server running on port ${PORT}`)
})

module.exports = app
