export const testCaseStatusMap = {
  1: 'Активный',
  2: 'Черновик',
  0: 'Архив',
}

export interface TestCase {
  flag: boolean
  id: number
  name: string
  positive: boolean
  version: string
  scriptIds: { id: number; name: string }[]
  precondition: string
  testCases: { id: number; name: string }[]
  owner: { id: number; username: string }
  creationDate: Date
  status: 0 | 1 | 2
  usedInTestPlans: boolean
  testPlans: { id: number; name: string; date: Date }[]
  steps: {precondition: string, action: string, result: string}[]
}

export interface TestCaseContextType {
  testCase: TestCase | null
  allTestCases: TestCase[] | [],
  isLoading: boolean,
  error: string | null
  setTestCase: (data: TestCase) => void
  loadAllTestCases: (projectId: number) => void
  updateTestCase: (projectId: number, caseId: number, profileData: TestCase) => Promise<void>
  clearTestCase: () => void
  clearAllTestCases: () => void
}
