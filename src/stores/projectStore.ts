import { Project, ProjectMinimal } from '@interfaces/'
import { create } from 'zustand'

interface ProjectState {
  project: Project | null
  projects: ProjectMinimal[]
  isLoading: boolean
  error: string | null

  setProject: (project: Project | null) => void
  setProjects: (projects: ProjectMinimal[]) => void
  updateProject: (updates: Partial<Project>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearProject: () => void
  clearProjects: () => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  projects: [],
  isLoading: false,
  error: null,

  setProject: (project) => set({ project, error: null }),

  setProjects: (projects) => set({ projects, error: null }),

  updateProject: (updates) =>
    set((state) => ({
      project: state.project ? { ...state.project, ...updates } : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearProject: () => set({ project: null }),

  clearProjects: () => set({ projects: [] }),
}))
