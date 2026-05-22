import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act, render, screen } from '@testing-library/react'
import AnecdoteList from './AnecdoteList'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import anecdoteService from '../services/anecdotes'
import { useAnecdoteStore, useAnecdotes, useAnecdoteActions } from '../store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteService', () => {
  it('verifies the state is initialized', async () => {
    const mockAnecdote = [{ content: 'test', id: 1, votes: 0 }]
    anecdoteService.getAll.mockResolvedValue(mockAnecdote)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdote)
  })

  it('verifies the component displaying anecdotes is received from the store sorted by votes', async () => {
    const mockAnecdote = [
      {
        content: "If it hurts, do it more often",
        id: "47145",
        votes: 1
      },
      {
        content: "Adding manpower to a late software project makes it later!",
        id: "21149",
        votes: 3
      },
      {
        content: "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
        id: "69581",
        votes: 2
      },
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdote)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    expect(anecdotesResult.current[0]).toEqual({
      content: 'Adding manpower to a late software project makes it later!',
      id: '21149',
      votes: 3,
    })

  })

  it('verifies component received properly filtered list of anecdotes', async () => {
     const mockAnecdote = [
      {
        content: "If it hurts, do it more often",
        id: "47145",
        votes: 1
      },
      {
        content: "Adding manpower to a late software project makes it later!",
        id: "21149",
        votes: 3
      }
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdote)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.initialize()
    })

    act(() => {
      result.current.setFilter('manpower')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    expect(anecdotesResult.current).toHaveLength(1)
    expect(anecdotesResult.current[0]).toEqual({
      content: 'Adding manpower to a late software project makes it later!',
      id: '21149',
      votes: 3,
    })
  })

  it('verifies that voting increases the number of votes for an anecdote', async () => {
    const mockAnecdote = [
      {
        content: "If it hurts, do it more often",
        id: "47145",
        votes: 1
      }
    ]

    const updatedAnecdote = { ...mockAnecdote[0], votes: 2 }

    anecdoteService.getAll.mockResolvedValue(mockAnecdote)
    anecdoteService.update.mockResolvedValue(updatedAnecdote)

    const { result  } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.initialize()
      await result.current.vote("47145")
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toEqual(2)
  })

})