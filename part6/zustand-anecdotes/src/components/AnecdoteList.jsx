import { useAnecdotes } from '../store'
import { useAnecdoteActions } from '../store'
import { useFilter } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes().toSorted((a, b) => b.votes - a.votes)
  const { vote } = useAnecdoteActions()
  const filter = useFilter()

  // filter by keywords
  const filteredAnecdotes = anecdotes.filter((anecdote) => (
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  ))

  return (
    <>
      {filteredAnecdotes.map(anecdote => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </>
  )
}

export default AnecdoteList