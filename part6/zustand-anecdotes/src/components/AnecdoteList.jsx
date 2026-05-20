import { useAnecdotes } from '../store'
import { useAnecdoteActions } from '../store'
import { useFilter } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes().toSorted((a, b) => b.votes - a.votes)
  const { vote, remove } = useAnecdoteActions()
  const filter = useFilter()
  const { setNotification } = useNotificationActions()

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
              <button onClick={() => {
                vote(anecdote.id)
                setNotification(`you voted '${anecdote.content}'`)
              }}>
                vote
              </button>
              {anecdote.votes === 0 && (
                <button onClick={() => remove(anecdote.id)}>
                  delete
                </button>
              )}
            </div>
          </div>
        ))}
    </>
  )
}

export default AnecdoteList