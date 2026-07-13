import { useState, useEffect } from 'react'
import anecdotesService from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    data: {
      type, 
      value,
      onChange,
    },
    reset
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdotesService.getAll().then((data) => setAnecdotes(data))
  }, [])

  const addAnecdote = (object) => {
    anecdotesService.createNew(object).then((data) => {
      setAnecdotes(prev => prev.concat(data))
    })
  }

  const deleteAnecdote = (id) => {
    anecdotesService.remove(id).then(() => {
      setAnecdotes(prev => prev.filter(a => a.id !== id))
    })
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote
  }
}
