import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AnecdoteContextProvider } from './contexts/AnecdoteContext.jsx'

createRoot(document.getElementById('root')).render(<App />)
