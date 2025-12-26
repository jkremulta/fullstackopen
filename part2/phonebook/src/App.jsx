import { useEffect, useState } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'
import phonebookServices from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const personsObject = {
      name: newName,
      number: newNumber,
    }

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      phonebookServices
        .update(existingPerson.id, personsObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id === existingPerson.id ? returnedPerson : person))
          setNotification({
          message: `Updated ${newName}'s number`,
          type: 'success'
          })
          setTimeout(() => setNotification({ message: null, type: null }), 5000)
        })
        .catch(() => {
          setNotification({
            message: `Information of ${newName} has already been removed from server`,
            type: 'error'
          })
          setTimeout(() => setNotification({ message: null, type: null }), 5000)
          setPersons(persons.filter(person => person.name !== newName))
        })
        setNewName('')
        setNewNumber('')
      }
      return 
    }

    phonebookServices
      .create(personsObject)
      .then(returnedPhonebook => {
        setPersons(persons.concat(returnedPhonebook))
      })
    
    setNotification({
      message: `Added ${newName} to the phonebook`,
      type: 'success'
      })
    setTimeout(() => setNotification({ message: null, type: null }), 5000)
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    phonebookServices
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilter = (event) => {
    setNameFilter(event.target.value)
  }

  const contactsShown = persons.filter(person => 
    person.name.toLowerCase().includes(nameFilter.toLowerCase())
  )


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message ={notification.message} type={notification.type}/>
      <Filter value={nameFilter} onChange={handleNameFilter}/>
      <h2>add a new</h2>
      <Form 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons contactsShown={contactsShown} onClick={deletePerson}/>
      
    </div>
  )
}

export default App