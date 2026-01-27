// src/stores/testCaseStore.ts
import { TestCase, TestCaseUpdateData } from '@interfaces/'
import { create } from 'zustand'

export type SelectionType = 'delete' | 'refactor' | 'edit' | 'default'

interface TestCaseState {
  // Основное состояние
  testCase: TestCase | null
  allTestCases: TestCase[]
  isLoading: boolean
  error: string | null

  // Состояние выделения
  selectedTestCaseIds: number[]
  selectionType: SelectionType
  expandedTestCaseIds: number[]

  // Setters (базовые установщики)
  setTestCase: (data: TestCase) => void
  setAllTestCases: (data: TestCase[]) => void
  setLoading: (data: boolean) => void
  setError: (data: string | null) => void

  // Действия с выделением
  toggleTestCaseSelection: (id: number) => void
  selectAllTestCases: (ids: number[]) => void
  clearTestCaseSelection: () => void
  setSelectionType: (type: SelectionType) => void
  toggleTestCaseExpansion: (id: number) => void

  // Действия с данными
  updateTestCaseInList: (caseId: number, updates: TestCaseUpdateData) => void
  removeTestCasesFromList: (caseIds: number[]) => void
  addTestCasesToList: (testCases: TestCase[]) => void
  updateMultipleTestCases: (
    caseIds: number[],
    updates: TestCaseUpdateData
  ) => void

  // Вспомогательные геттеры
  getSelectedTestCases: () => TestCase[]
  getExpandedTestCases: () => TestCase[]
  getTestCaseById: (id: number) => TestCase | undefined

  // Очистка
  clearTestCase: () => void
  clearAllTestCases: () => void
  clearAll: () => void
}

export const useTestCaseStore = create<TestCaseState>((set, get) => ({
  // Начальное состояние
  testCase: null,
  allTestCases: [],
  isLoading: false,
  error: null,
  selectedTestCaseIds: [],
  selectionType: 'default',
  expandedTestCaseIds: [],

  // === Setters ===
  setTestCase: (testCase) => set({ testCase }),
  setAllTestCases: (allTestCases) => set({ allTestCases }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // === Действия с выделением ===
  toggleTestCaseSelection: (id) =>
    set((state) => ({
      selectedTestCaseIds: state.selectedTestCaseIds.includes(id)
        ? state.selectedTestCaseIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedTestCaseIds, id],
    })),

  selectAllTestCases: (ids) =>
    set((state) => {
      const allIds = ids
      const currentSelected = state.selectedTestCaseIds

      if (allIds.every((id) => currentSelected.includes(id))) {
        return { selectedTestCaseIds: [] }
      }

      return { selectedTestCaseIds: allIds }
    }),

  clearTestCaseSelection: () =>
    set({ selectedTestCaseIds: [], selectionType: 'default' }),

  setSelectionType: (type) => set({ selectionType: type }),

  toggleTestCaseExpansion: (id) =>
    set((state) => ({
      expandedTestCaseIds: state.expandedTestCaseIds.includes(id)
        ? state.expandedTestCaseIds.filter((expandedId) => expandedId !== id)
        : [...state.expandedTestCaseIds, id],
    })),

  // === Действия с данными ===
  updateTestCaseInList: (caseId, updates) =>
    set((state) => ({
      allTestCases: state.allTestCases.map((tc) =>
        tc.id === caseId ? { ...tc, ...updates } : tc
      ),
      testCase:
        state.testCase?.id === caseId
          ? { ...state.testCase, ...updates }
          : state.testCase,
    })),

  removeTestCasesFromList: (caseIds) =>
    set((state) => ({
      allTestCases: state.allTestCases.filter((tc) => !caseIds.includes(tc.id)),
      selectedTestCaseIds: state.selectedTestCaseIds.filter(
        (id) => !caseIds.includes(id)
      ),
      expandedTestCaseIds: state.expandedTestCaseIds.filter(
        (id) => !caseIds.includes(id)
      ),
    })),

  addTestCasesToList: (testCases) =>
    set((state) => ({
      allTestCases: [...state.allTestCases, ...testCases],
    })),

  updateMultipleTestCases: (caseIds, updates) =>
    set((state) => ({
      allTestCases: state.allTestCases.map((tc) =>
        caseIds.includes(tc.id) ? { ...tc, ...updates } : tc
      ),
    })),

  // === Вспомогательные геттеры ===
  getSelectedTestCases: () => {
    const state = get()
    return state.allTestCases.filter((tc) =>
      state.selectedTestCaseIds.includes(tc.id)
    )
  },

  getExpandedTestCases: () => {
    const state = get()
    return state.allTestCases.filter((tc) =>
      state.expandedTestCaseIds.includes(tc.id)
    )
  },

  getTestCaseById: (id) => {
    const state = get()
    return state.allTestCases.find((tc) => tc.id === id)
  },

  // === Очистка ===
  clearTestCase: () => set({ testCase: null }),
  clearAllTestCases: () =>
    set({
      allTestCases: [],
      selectedTestCaseIds: [],
      expandedTestCaseIds: [],
    }),
  clearAll: () =>
    set({
      testCase: null,
      allTestCases: [],
      isLoading: false,
      error: null,
      selectedTestCaseIds: [],
      selectionType: 'default',
      expandedTestCaseIds: [],
    }),
}))
