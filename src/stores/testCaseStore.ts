import { TestCase } from '@interfaces/'
import { create } from 'zustand'

interface TestCaseState {
  testCase: TestCase | null
  allTestCases: TestCase[] | []
  isLoading: boolean
  error: string | null
  setTestCase: (data: TestCase) =>void
  setAllTestCases: (data: TestCase[]) =>void
  updateTestCase: (data: Partial<TestCase>) =>void
  setLoading:(data: boolean) => void
  setError: (data: string | null) => void
  clearTestCase: () => void
  clearAllTestCases: () => void
}

export const useTestCaseStore = create<TestCaseState>((set) => ({
  testCase: null,
  allTestCases: [],
  isLoading: false,
  error: null,

  setTestCase: (testCase) => set({ testCase }),
  setLoading: (isLoading) => set({isLoading}),
  setAllTestCases: (allTestCases) => set({ allTestCases }),
  setError: (error) => set({error}),


  updateTestCase: (updates) =>
    set((state) => ({
      testCase: state.testCase ? { ...state.testCase, ...updates } : null,
    })),

  clearTestCase: () => set({ testCase: null }),

  clearAllTestCases: () => set({ allTestCases: [] }),
}))
