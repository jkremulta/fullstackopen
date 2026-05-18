import { create } from 'zustand'

export const useCounterStatistics = create(set => ({
  stats: {
    good: 0,
    neutral: 0,
    bad: 0
  },

  actions: {
    setGood: () => 
      set(state => ({
        stats: {
          ...state.stats,
          good: state.stats.good + 1
        }
      })),

    setNeutral: () => 
      set(state => ({
        stats: {
          ...state.stats,
          neutral: state.stats.neutral + 1
        }
      })),

    setBad: () =>
      set(state => ({
        stats: {
          ...state.stats,
          bad: state.stats.bad + 1
        }
      }))
  }
}))

export const useCounter = () => useCounterStatistics(state => state.stats)
export const useCounterControls = () => useCounterStatistics(state => state.actions)
