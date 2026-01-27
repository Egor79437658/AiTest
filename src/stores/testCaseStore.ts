import { TestCase, TestCaseHistoryRecord, TestCaseUpdateData } from '@interfaces/'
import { create } from 'zustand'

interface TestCaseState {
  testCase: TestCase | null
  allTestCases: TestCase[]
  isLoading: boolean
  history: TestCaseHistoryRecord[]
  error: string | null
  setTestCase: (data: TestCase) => void
  setTestHistory: (data: TestCaseHistoryRecord[]) => void
  setAllTestCases: (data: TestCase[]) => void
  updateTestCase: (data: TestCaseUpdateData) => void
  setLoading: (data: boolean) => void
  setError: (data: string | null) => void
  clearTestCase: () => void
  clearAllTestCases: () => void
}

export const useTestCaseStore = create<TestCaseState>((set) => ({
  testCase: null,
  allTestCases: [],
  isLoading: false,
  error: null,
  history: [],

  setTestCase: (testCase) => set({ testCase }),
  setTestHistory: (history) => set({ history }),
  setLoading: (isLoading) => set({ isLoading }),
  setAllTestCases: (allTestCases) => set({ allTestCases }),
  setError: (error) => set({ error }),

  updateTestCase: (updates) =>
    set((state) => ({
      testCase: state.testCase ? { ...state.testCase, ...updates } : null,
    })),

  clearTestCase: () => set({ testCase: null }),
  clearAllTestCases: () => set({ allTestCases: [] }),
}))
