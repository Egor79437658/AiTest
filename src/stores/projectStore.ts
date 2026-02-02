import { Project, ProjectMinimal } from '@interfaces/'
import { create } from 'zustand'

interface ProjectState {
  project: Project | null
  isLoading: boolean
  error: string | null

  setProject: (project: Project | null) => void
  updateProject: (updates: Partial<Project>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearProject: () => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  isLoading: false,
  error: null,

  setProject: (project) => set({ project, error: null }),


  updateProject: (updates) =>
    set((state) => ({
      project: state.project ? { ...state.project, ...updates } : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearProject: () => set({ project: null }),

}))
