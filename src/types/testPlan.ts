export const testPlanLastRunStatusMap = {
  успешно: 'Успешно',
  с_ошибками: 'С ошибками',
  не_запускался: 'Не запускался',
} as const

export const testPlanStatusMap = {
  active: 'Активный',
  draft: 'Черновик',
  archived: 'Архив',
} as const

export const testPlanRunStatusMap = {
  запланирован: 'Запланирован',
  в_работе: 'В работе',
  успешно: 'Успешно',
  с_ошибками: 'С ошибками',
  отменен: 'Отменен',
} as const

export type TestPlanStatus = 'active' | 'draft' | 'archived'
export type TestPlanLastRunStatus = 'успешно' | 'с_ошибками' | 'не_запускался'
export type TestPlanRunStatus = 'запланирован' | 'в_работе' | 'успешно' | 'с_ошибками' | 'отменен'

export interface TestCaseInTestPlan {
  id: number
  testPlanId: number
  order: number
  testCase: {
    id: number
    name: string
    version: string
  }
}

export interface TestPlanRun {
  id: number
  testPlanId: number
  name: string
  startedAt: Date
  finishedAt?: Date
  status: TestPlanRunStatus
  triggeredBy: { id: number; username: string }
  duration?: number
  results: TestCaseRunResult[]
}

export interface TestPlanRunShort {
  id: number
  name: string
  startedAt: Date
  status: TestPlanRunStatus
  duration?: number
}

export interface TestCaseRunResult {
  testCaseId: number
  status: 'успешно' | 'с_ошибками' | 'пропущен'
  startedAt: Date
  finishedAt?: Date
  duration?: number
  error?: string
}

export interface TestPlan {
  id: number
  name: string
  version: string
  projectId: number
  testCaseCount: number
  owner: { id: number; username: string }
  createdAt: Date
  lastRunAt?: Date
  duration: number
  lastRunStatus: TestPlanLastRunStatus
  status: TestPlanStatus
  description?: string
  testCases: TestCaseInTestPlan[]
}

export interface TestPlanUpdateData {
  id?: number
  name?: string
  version?: string
  description?: string
  status?: TestPlanStatus
  testCases?: TestCaseInTestPlan[]
}

export interface TestPlanContextType {
  testPlan: TestPlan | null
  allTestPlans: TestPlan[]
  testPlanRuns: TestPlanRun[]
  isLoading: boolean
  error: string | null
  setTestPlan: (data: TestPlan) => void
  loadAllTestPlans: (projectId: number) => void
  loadTestPlan: (projectId: number, testPlanId: number) => void
  createTestPlan: (projectId: number, data: Omit<TestPlanUpdateData, 'id'>) => Promise<TestPlan>
  updateTestPlan: (projectId: number, testPlanId: number, updates: TestPlanUpdateData) => Promise<void>
  deleteTestPlan: (projectId: number, testPlanId: number) => Promise<void>
  runTestPlan: (projectId: number, testPlanId: number) => Promise<TestPlanRun>
  cloneTestPlan: (projectId: number, testPlanId: number) => Promise<TestPlan>
  loadTestPlanRuns: (projectId: number, testPlanId: number) => void
  clearTestPlan: () => void
  clearAllTestPlans: () => void
}