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
app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(contacts => {
    response.json(contacts)
  })
})

// update a contact number
app.put('/api/persons/:id',(request, response) => {
  const { name, number } = request.body

  Phonebook
    .findByIdAndUpdate(
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
  })

// returns a contact
app.get('/api/persons/:id', (request, response) => {
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
})

// delete a contact
app.delete('/api/persons/:id', (request, response) => {
  Phonebook
    .findByIdAndDelete(request.params.id)
    .then(contact => {
      if (!contact) {
        return response.status(404).end()
      } else {
        return response.status(204).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

// adds a contact in phonebook
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number is missing"
    })
  }

  // check for duplicate
  Phonebook
    .exists({ name: body.name })
    .then(exists => {
      if (exists) {
        return response.status(400).json({ error: 'Name must be unique' })
      }

      const contact = new Phonebook({
        name: body.name,
        number: body.number,
      })

      contact.save().then(c => response.json(c))
    })
})


// returns how many users are inside the phonebook and shows time
app.get('/info', (request, response) => {
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
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})