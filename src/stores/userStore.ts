import { create } from 'zustand'
import { User } from '@interfaces/'

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null

  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, error: null }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearUser: () => set({ user: null, error: null }),
}))
