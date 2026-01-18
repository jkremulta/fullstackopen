const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body   ', request.body)
  logger.info('---')
  next()
}

// error when user calls a route that does not exist
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// middleware for error handling
const errorHandler = (error, request, response, next) => {
  console.log('Error caught:', error)

  if (error.name === 'CastError') {
    return response.status(400).json({ 'error': 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ 'error': error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
