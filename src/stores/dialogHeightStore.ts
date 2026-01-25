import { create } from 'zustand'
import { ReactNode } from 'react'

interface dialogHeightState {
  height: number

  setHeight: (newHeight: number) => void
}

export const useDiealogHeightStore = create<dialogHeightState>((set) => ({
  height: 0,

  setHeight: (newHeight) => set({ height: newHeight }),
}))