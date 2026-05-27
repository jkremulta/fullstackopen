import { useAnecdote } from '../hooks/useAnecdotes'
import useNotify from '../hooks/useNotify'

const AnecdoteList = () => {
  const { anecdotes, voteAnecdote } = useAnecdote()
  const { notify } = useNotify()

  const handleVote = (anecdote) => {
    voteAnecdote(anecdote)

    notify(`anecdote ${anecdote.content} voted`)
  }

  return (
    <>
      {anecdotes.map((anecdote) => (
            <div key={anecdote.id}>
              <div>{anecdote.content}</div>
              <div>
                has {anecdote.votes}
                <button onClick={() => handleVote(anecdote)}>vote</button>
              </div>
            </div>
          ))}
    </>
  )
}

export default AnecdoteList