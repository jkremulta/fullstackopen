import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import AnecdoteList from './components/AnecdoteList'
import { useAnecdote } from './hooks/useAnecdotes'

const App = () => {
  const { isPending } =  useAnecdote()

  if (isPending) {
    return (
      <div>anecdote service not available due to problems in server</div>
    )
  }

  return (
      <div>
        <h3>Anecdote app</h3>
        <Notification />
        <AnecdoteForm />
        <AnecdoteList />
      </div>
  )
}

export default App