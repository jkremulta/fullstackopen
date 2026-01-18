const phonebookRouter = require('express').Router()
const Phonebook = require('../models/phonebook')
// returns all the phonebook contacts

phonebookRouter.get('/', (request, response, next) => {
  Phonebook.find({})
    .then(contacts => {
      response.json(contacts)
    })
    .catch(error => next(error))
})

// update a contact number
phonebookRouter.put('/:id',(request, response, next) => {
  const { name, number } = request.body

  Phonebook.findByIdAndUpdate(
    request.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query'
    })
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
phonebookRouter.get('/:id', (request, response, next) => {
  Phonebook
    .findById(request.params.id)
    .then(contact => {
      if (contact) {
        return response.json(contact)
      } else {
        return response.status(404).json({ 'error': 'Contact not found' })
      }
    })
    .catch(error => next(error))
})

// delete a contact
phonebookRouter.delete('/:id', (request, response, next) => {
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
phonebookRouter.post('/', (request, response, next) => {
  const { name, number } = request.body

  const newPerson = new Phonebook ({ name, number })
  newPerson.save()
    .then(savedPerson => response.status(201).json(savedPerson))
    .catch(error => next(error))
})

// returns how many users are inside the phonebook and shows time
phonebookRouter.get('/info', (request, response, next) => {
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

module.exports = phonebookRouter