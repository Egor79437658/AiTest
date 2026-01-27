import { createContext } from 'react'
import { TestCase } from '@interfaces/'

export type SelectionType = 'delete' | 'refactor' | 'edit' | 'default'

export interface TestCaseContextType {
  // Состояние
  testCase: TestCase | null
  allTestCases: TestCase[]
  isLoading: boolean
  error: string | null

  // Выделение
  selectedTestCaseIds: number[]
  selectionType: SelectionType
  toggleTestCaseSelection: (id: number) => void
  selectAllTestCases: () => void
  clearTestCaseSelection: () => void
  setSelectionType: (type: SelectionType) => void

  // Действия с данными
  loadAllTestCases: (projectId: number) => Promise<TestCase[]>
  updateTestCase: (
    projectId: number,
    caseId: number,
    updates: Partial<TestCase>
  ) => Promise<TestCase>
  deleteTestCases: (projectId: number) => Promise<void>
  createTestCase: (
    projectId: number,
    data: Partial<TestCase>
  ) => Promise<TestCase>
  getTestCaseHistory: (projectId: number, caseId: number) => Promise<TestCase[]>
  bulkUpdateTestCases: (
    projectId: number,
    caseIds: number[],
    updates: Partial<TestCase>
  ) => Promise<void>

  // Вспомогательные функции
  getGroupedTestCases: () => Record<number, TestCase[]>
  getLatestVersions: () => TestCase[]
  getTestCaseById: (id: number) => TestCase | undefined

  // Setters
  clearTestCase: () => void
  setTestCase: (testCase: TestCase) => void
  clearAllTestCases: () => void
  setAllTestCases: (testCases: TestCase[]) => void

  // Статистика
  stats: {
    total: number
    selected: number
    grouped: number
    latestVersions: number
  }
}

export const TestCaseContext = createContext<TestCaseContextType | undefined>(
  undefined
)
