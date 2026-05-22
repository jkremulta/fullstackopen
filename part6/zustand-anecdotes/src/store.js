import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import anecdoteService from './services/anecdotes'

export const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.update(
        id, {...anecdote, votes: anecdote.votes + 1})

      set(state => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? updated : a)
        .sort((a, b) => b.votes - a.votes)
      }))
    },

    add: async (anecdote) => {
      const newAnecdote = await anecdoteService.createNew(anecdote)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
    },

    setFilter: (value) => set({ filter: value }),

    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      anecdotes.sort((a, b) => b.votes - a.votes)
      set(() => ({ anecdotes }))
    },

    remove: async (id) => {
      await anecdoteService.remove(id)

      set(state => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    }

  },
}))


export const useAnecdotes = () => useAnecdoteStore(
  useShallow((state) => {
    if (!state.filter) return state.anecdotes
    return state.anecdotes.filter(a =>
      a.content.toLowerCase().includes(state.filter.toLowerCase())
    )
  })
)

export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)