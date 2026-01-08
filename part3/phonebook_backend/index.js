const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

require('dotenv').config()
const Phonebook = require('./models/phonebook')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


// returns all the phonebook contacts
app.get('/api/persons', (request, response, next) => {
  Phonebook.find({})
    .then(contacts => {
      response.json(contacts)
    })
    .catch(error => next(error))
})

// update a contact number
app.put('/api/persons/:id',(request, response, next) => {
  const { name, number } = request.body

  Phonebook.findByIdAndUpdate(
    request.params.id, 
    { name, number},
    { new: true })
    .then(updatedContact => {
      if (updatedContact) {
        response.json(updatedContact)
      } else {
        response.status(404).end()
      }
    }) 
    .catch(error => next(error))
})

// returns a contact
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Phonebook
    .findById(request.params.id)
    .then(contact => {
      if (contact) {
        return response.json(contact)
      } else {
        return response.status(404).json({ "error": "Contact not found" })
      }
    })
    .catch(error => next(error))
})

// delete a contact
app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook
    .findByIdAndDelete(request.params.id)
    .then(contact => {
      if (!contact) {
        return response.status(404).end()
      } else {
        return response.status(204).end()
      }
    })
    .catch(error => next(error))
})

// adds a contact in phonebook
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({
      error: "Name or number is missing"
    })
  }

  // update database if same name exists
  Phonebook.findOne( { name })
    .then(existingPerson => {
      if (existingPerson) {
        existingPerson.number = number
        return existingPerson.save()
      }

      // if person does not exist
      const newPerson = new Phonebook({ name, number })
      return newPerson.save()
    })
    .then(savedPerson => {
      return response.json(savedPerson)
    })
    .catch(error => next(error))
})


// returns how many users are inside the phonebook and shows time
app.get('/info', (request, response, next) => {
  Phonebook
    .countDocuments({})
    .then(count => {
      const date = new Date()
      response.send(
        `<div>
          <p>Phonebook has info for ${count} people </p>
          <p>${date}</p>
        </div>`
      )
    })
    .catch(error => next(error))
})

// error when user calls a route that does not exist
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// middleware for error handling
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ 'error': 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})