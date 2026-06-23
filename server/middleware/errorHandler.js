function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.path}:`, err.stack || err.message)
  const status = err.status || err.statusCode || 500
  const message = status === 500 && process.env.NODE_ENV !== 'development'
    ? 'Internal server error'
    : err.message || 'Internal server error'

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack, originalMessage: err.message }),
  })
}

module.exports = errorHandler
