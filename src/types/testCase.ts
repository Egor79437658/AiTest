import { TestCaseHistoryRecord } from "./project"

export const testCaseStatusMap = {
  1: 'Активный',
  2: 'Черновик',
  0: 'Архив',
} as const

export const testCasePriorityMap = {
  0: 'Низкий',
  1: 'Нормальный',
  2: 'Высокий',
} as const

export type TestCaseStatus = 0 | 1 | 2
export type TestCasePriority = 0 | 1 | 2 // 0: low, 1: med, 2: high

export interface TestCaseStep {
  id?: number
  precondition: string
  action: string
  result: string
  testData?: string
  elementName?: string
  elementLocation?: string
  formName?: string
  screenshot?: string
}

export interface TestData {
  id?: number
  name: string
  value: string
  type: 'parameter' | 'file' | 'link' | 'not_set' | 'any'
  fileUrl?: string
}

export interface Attachment {
  id?: number
  name: string
  url: string
  type: string
  size?: number
  uploadedAt?: Date
}

export interface Comment {
  id?: number
  author: { id: number; username: string }
  text: string
  createdAt: Date
}

export interface TestCase {
  // identifiers
  id: number
  idt?: string // уникальный идентификатор ТК (IDT)
  flag: boolean

  // info
  name: string
  description: string
  positive: boolean
  version: string

  // status and prior
  status: TestCaseStatus
  priority: TestCasePriority

  // flags
  isAutoTest: boolean
  isLoadTest: boolean // НТ (Нагрузочное Тестирование)

  // connection
  owner: { id: number; username: string; fullName?: string }
  project?: string // name
  scriptIds: { id: number; name: string }[]
  precondition: string // for whole tc

  // tags
  tags: string[]

  // struct
  steps: TestCaseStep[]
  testData: TestData[] // СПД (Специально Подготовленные Данные)

  //additional
  attachments: Attachment[]
  comments: Comment[]

  // connection with others
  relatedTestCases: { id: number; name: string }[]
  usedInTestPlans: boolean
  testPlans: { id: number; name: string; date: Date }[]

  // metadata
  creationDate: Date
  lastModified: Date
  versionHistory?: TestCaseVersion[]
}

export interface TestCaseVersion {
  version: string
  modifiedBy: { id: number; username: string }
  modifiedAt: Date
  changes: string
}

export interface TestCaseUpdateData {
  id?: number
  idt?: string
  flag?: boolean
  name?: string
  description?: string
  positive?: boolean
  version?: string
  status?: TestCaseStatus
  priority?: TestCasePriority
  isAutoTest?: boolean
  isLoadTest?: boolean
  project?: string
  precondition?: string
  tags?: string[]
  steps?: TestCaseStep[]
  testData?: TestData[]
  attachments?: Attachment[]
  relatedTestCases?: { id: number; name: string }[]

  // не уверен?
  scriptIds?: { id: number; name: string }[]
  owner?: { id: number; username: string }
  creationDate?: Date
  usedInTestPlans?: boolean
  testPlans?: { id: number; name: string; date: Date }[]
}

export interface TestCaseFormData {
  name: string
  description: string
  positive: boolean
  version: string
  status: TestCaseStatus
  priority: TestCasePriority
  isAutoTest: boolean
  isLoadTest: boolean
  project?: string
  precondition: string
  tags: string[]
  steps: TestCaseStep[]
  testData: TestData[]
  attachments: Attachment[]
}

export interface TestCaseContextType {
  testCase: TestCase | null
  allTestCases: TestCase[]
  isLoading: boolean
  error: string | null
  history: TestCaseHistoryRecord[]
  loadHistory: (projectId: number, testCaseId: number) => Promise<void>
  setTestCase: (data: TestCase) => void
  loadAllTestCases: (projectId: number) => void
  updateTestCase: (
    projectId: number,
    caseId: number,
    updates: TestCaseUpdateData
  ) => Promise<void>
  createTestCase: (
    projectId: number,
    data: TestCaseFormData
  ) => Promise<TestCase>
  deleteTestCase: (projectId: number, caseId: number) => Promise<void>
  clearTestCase: () => void
  clearAllTestCases: () => void
}
