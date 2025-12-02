import { create } from 'zustand'
import { ReactNode } from 'react'

interface HeaderState {
  headerContent: ReactNode | null

  setHeaderContent: (content: ReactNode) => void
}

export const useHeaderStore = create<HeaderState>((set) => ({
  headerContent: null,

  setHeaderContent: (content) => set({ headerContent: content }),
}))
