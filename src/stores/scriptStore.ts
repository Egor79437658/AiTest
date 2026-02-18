import { create } from 'zustand'
import { Script, ScriptRun } from '@interfaces/'

interface ScriptStore {
  scripts: Script[]
  script: Script | null
  runs: ScriptRun[]
  isLoading: boolean
  error: string | null
  selectedScriptIds: number[]
  selectionType: 'delete' | 'refactor' | 'edit' | 'default'

  setScripts: (scripts: Script[]) => void
  setScript: (script: Script | null) => void
  setRuns: (runs: ScriptRun[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedScriptIds: (ids: number[] | ((prev: number[]) => number[])) => void
  setSelectionType: (type: 'delete' | 'refactor' | 'edit' | 'default') => void

  updateScriptInList: (id: number, updates: Partial<Script>) => void
  removeScriptsFromList: (ids: number[]) => void
  addScriptsToList: (newScripts: Script[]) => void
  updateMultipleScripts: (ids: number[], updates: Partial<Script>) => void
  toggleScriptSelection: (id: number) => void
  selectAllScripts: (allIds: number[]) => void
  clearScriptSelection: () => void
  clearAll: () => void
}

export const useScriptStore = create<ScriptStore>((set) => ({
  scripts: [],
  script: null,
  runs: [],
  isLoading: false,
  error: null,
  selectedScriptIds: [],
  selectionType: 'default',

  setScripts: (scripts) => set({ scripts }),
  setScript: (script) => set({ script }),
  setRuns: (runs) => set({ runs }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSelectedScriptIds: (ids) =>
    set((state) => ({
      selectedScriptIds:
        typeof ids === 'function' ? ids(state.selectedScriptIds) : ids,
    })),
  setSelectionType: (type) => set({ selectionType: type }),

  updateScriptInList: (id, updates) =>
    set((state) => ({
      scripts: state.scripts.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  removeScriptsFromList: (ids) =>
    set((state) => ({
      scripts: state.scripts.filter((s) => !ids.includes(s.id)),
    })),

  addScriptsToList: (newScripts) =>
    set((state) => ({
      scripts: [...state.scripts, ...newScripts],
    })),

  updateMultipleScripts: (ids, updates) =>
    set((state) => ({
      scripts: state.scripts.map((s) =>
        ids.includes(s.id) ? { ...s, ...updates } : s
      ),
    })),

  toggleScriptSelection: (id) =>
    set((state) => ({
      selectedScriptIds: state.selectedScriptIds.includes(id)
        ? state.selectedScriptIds.filter((x) => x !== id)
        : [...state.selectedScriptIds, id],
    })),

  selectAllScripts: (allIds) => set({ selectedScriptIds: allIds }),

  clearScriptSelection: () => set({ selectedScriptIds: [] }),

  clearAll: () =>
    set({
      scripts: [],
      script: null,
      runs: [],
      error: null,
      selectedScriptIds: [],
      selectionType: 'default',
    }),
}))
