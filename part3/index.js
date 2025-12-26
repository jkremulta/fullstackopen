const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phonebook = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// returns all the phonebook contacts
app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

// update a contact number
app.put('/api/persons/:id',(request, response) => {
  const id = request.params.id
  const body = request.body

  const personIndex = phonebook.findIndex(contact => contact.id == id)
  const updatedPerson = {...phonebook[personIndex], name: body.name, number: body.number}
  phonebook[personIndex] = updatedPerson

  response.json(updatedPerson)

})

// returns a contact
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = phonebook.find(contact => contact.id === id)

  if (person) {
    return response.json(person)
  } 

  return response.status(404).json({
    "error": "Contact not found"
  })
})

// delete a contact
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(c => c.id !== id)

  response.status(204).end()
})

// generates a random Id for adding a contact in phonebook
const generateRandomId = () => {
  return Math.floor(Math.random() * 100000).toString()
}

// check if name already exists in phonebook
const checkDuplicate = (name) => {
  return phonebook.some(contact => contact.name === name)
}

// adds a contact in phonebook
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number is missing"
    })
  }

  if (checkDuplicate(body.name)) {
    return response.status(400).json({
      error: "Name must be unique"
    })
  }

  const contact = {
    "id": generateRandomId(),
    "name": body.name, 
    "number": body.number
  }

  phonebook = phonebook.concat(contact)
  response.json(contact)
})


// returns how many users are inside the phonebook and shows time
app.get('/info', (request, response) => {
  const numberOfUsers = phonebook.length
  const date = new Date()
  response.send(
    `<div>
      <p>Phonebook has info for ${numberOfUsers} people </p>
      <p>${date}</p>
    </div>`
    
  )
})




const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})