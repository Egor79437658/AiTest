import { TestPlanRunShort } from './testPlan'

export interface ProjectMinimal {
  id: number
  name: string
  lastUpdated: Date
}

export interface ProjectUser {
  id: number
  firstName: string
  lastName: string
  fatherName: string | null
  email: string
  role: 0 | 1 | 2 | 3 | 4 | 5
  permissions: string
}

export interface testPlan {
  id: number
}
export interface script {
  id: number
}

export interface Project {
  id: number
  name: string
  url: string
  hasDatapool: boolean
  description: string
  users: ProjectUser[]
  testCases: {id: number}[]
  scripts: {id: number}[]
  testPlans: {id: number}[]
  recentTestPlanRuns: TestPlanRunShort[]
  createdAt: Date
  updatedAt: Date
  datapool: DataPoolItem[]
  createdBy: number
}

export interface DataPoolItem {
  id: number;
  key: string;
  value: string;
}

export interface ProjectContextType {
  project: Project | null
  isLoading: boolean
  isInitializing: boolean
  error: string | null
  loadProject: (projectId: number) => Promise<void>
  updateProject: (updates: Partial<Project>) => Promise<void>
  clearProject: () => void
  clearError: () => void
  deleteProject: () => Promise<void>
}

export interface TestCaseHistoryRecord {
  date: Date
  field: string
  oldVal: string
  newVal: string
}