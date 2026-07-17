import { create } from 'zustand'

const useUIStore = create((set) => ({
  notification: {
    message: null,
    type: null,
  },

  setNotification: (notification, duration = 5000) => {
    set({ notification })

    setTimeout(() => {
      set({
        notification: {
          message: null,
          type: null,
        },
      })
    }, duration)
  },
}))

export default useUIStore
