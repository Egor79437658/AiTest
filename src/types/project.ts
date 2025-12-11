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

export interface TestPlanRun {
  id: number
  name: string
  lastRunDate: Date
  status: 'успешно' | 'с ошибками'
}

export interface testCase {
  id: number
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
  testCases: testCase[]
  scripts: script[]
  testPlans: testPlan[]
  recentTestPlanRuns: TestPlanRun[]
  createdAt: Date
  updatedAt: Date
  createdBy: number
}

export interface ProjectContextType {
  project: Project | null
  projects: ProjectMinimal[]
  isLoading: boolean
  error: string | null
  loadProject: (projectId: number) => Promise<void>
  loadShortProjects: () => Promise<void>
  updateProject: (updates: Partial<Project>) => Promise<void>
  clearProject: () => void
  clearError: () => void
}
