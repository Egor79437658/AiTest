import { createContext } from 'react'
import { TestCase, TestCaseHistoryRecord } from '@interfaces/'

export type SelectionType = 'delete' | 'refactor' | 'edit' | 'default'

export interface TestCaseContextType {
  // Состояние
  testCase: TestCase | null
  allTestCases: TestCase[]
  isLoading: boolean
  error: string | null
  history: TestCaseHistoryRecord[]

  // Выделение
  selectedTestCaseIds: number[]
  selectionType: SelectionType
  toggleTestCaseSelection: (id: number) => void
  selectAllTestCases: () => void
  clearTestCaseSelection: () => void
  setSelectionType: (type: SelectionType) => void

  // Действия с данными
  loadHistory: (projectId: number, testCaseId: number) => Promise<void>
  loadAllTestCases: (projectId: number) => Promise<TestCase[]>
  updateTestCase: (
    projectId: number,
    caseId: number,
    updates: Partial<TestCase>
  ) => Promise<TestCase>
  deleteTestCases: (projectId: number) => Promise<void>
  createTestCase: (
    projectId: number,
    data: TestCase
  ) => Promise<TestCase>
  bulkUpdateTestCases: (
    projectId: number,
    caseIds: number[],
    updates: Partial<TestCase>
  ) => Promise<void>
  sendExcelFile: (
      file: File,
      fileName: string,
      columnMap: { [key: string]: string },
      projectId: number,
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
