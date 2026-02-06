import { TestPlan, TestPlanUpdateData, TestPlanRun } from '@interfaces/'
import { create } from 'zustand'

interface TestPlanState {
  testPlan: TestPlan | null
  allTestPlans: TestPlan[]
  testPlanRuns: TestPlanRun[]
  isLoading: boolean
  error: string | null
 
  setTestPlan: (data: TestPlan | ((prev: TestPlan | null) => TestPlan | null)) => void
  setAllTestPlans: (data: TestPlan[] | ((prev: TestPlan[]) => TestPlan[])) => void
  setTestPlanRuns: (data: TestPlanRun[] | ((prev: TestPlanRun[]) => TestPlanRun[])) => void
  updateTestPlan: (data: TestPlanUpdateData) => void
  setLoading: (data: boolean) => void
  setError: (data: string | null) => void
  clearTestPlan: () => void
  clearAllTestPlans: () => void
  clearTestPlanRuns: () => void
}

export const useTestPlanStore = create<TestPlanState>((set) => ({
  testPlan: null,
  allTestPlans: [],
  testPlanRuns: [],
  isLoading: false,
  error: null,

  setTestPlan: (data) => 
    set((state) => ({
      testPlan: typeof data === 'function' ? data(state.testPlan) : data
    })),
  
  setAllTestPlans: (data) => 
    set((state) => ({
      allTestPlans: typeof data === 'function' ? data(state.allTestPlans) : data
    })),
  
  setTestPlanRuns: (data) => 
    set((state) => ({
      testPlanRuns: typeof data === 'function' ? data(state.testPlanRuns) : data
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  updateTestPlan: (updates) =>
    set((state) => ({
      testPlan: state.testPlan ? { ...state.testPlan, ...updates } : null,
    })),

  clearTestPlan: () => set({ testPlan: null }),
  clearAllTestPlans: () => set({ allTestPlans: [] }),
  clearTestPlanRuns: () => set({ testPlanRuns: [] }),
}))