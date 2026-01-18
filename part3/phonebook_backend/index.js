const morgan = require('morgan')
const cors = require('cors')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.use(cors())

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})