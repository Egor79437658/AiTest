export const testCaseStatusMap = {
  1: 'Активный',
  2: 'Черновик',
  0: 'Архив',
} as const

export type TestCaseStatus = 0 | 1 | 2

export interface TestCaseStep {
  precondition: string
  action: string
  result: string
}

export interface TestCase {
  id: number
  flag: boolean
  name: string
  positive: boolean
  version: string
  scriptIds: { id: number; name: string }[]
  precondition: string
  testCases: { id: number; name: string }[]
  owner: { id: number; username: string }
  creationDate: Date
  status: TestCaseStatus
  usedInTestPlans: boolean
  testPlans: { id: number; name: string; date: Date }[]
  steps: TestCaseStep[]
}

export interface TestCaseUpdateData {
  id?: number
  flag?: boolean
  name?: string
  positive?: boolean
  version?: string
  scriptIds?: { id: number; name: string }[]
  precondition?: string
  testCases?: { id: number; name: string }[]
  owner?: { id: number; username: string }
  creationDate?: Date
  status?: TestCaseStatus
  usedInTestPlans?: boolean
  testPlans?: { id: number; name: string; date: Date }[]
  steps?: TestCaseStep[]
}

export interface TestCaseContextType {
  testCase: TestCase | null
  allTestCases: TestCase[]
  isLoading: boolean
  error: string | null
  setTestCase: (data: TestCase) => void
  loadAllTestCases: (projectId: number) => void
  updateTestCase: (
    projectId: number,
    caseId: number,
    updates: TestCaseUpdateData
  ) => Promise<void>
  clearTestCase: () => void
  clearAllTestCases: () => void
}
