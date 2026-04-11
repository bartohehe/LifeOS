import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      setAuth: (user, token, refreshToken) => {
        localStorage.setItem('access_token', token)
        localStorage.setItem('refresh_token', refreshToken)
        set({ user, token, refreshToken })
      },
      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, token: null, refreshToken: null })
      },
    }),
    {
      name: 'lifeos-auth',
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken }),
    },
  ),
)

export default useAuthStore
