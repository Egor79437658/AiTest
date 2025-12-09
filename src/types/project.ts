export interface ProjectMinimal {
  id: number
  name: string
}

export interface ProjectUser {
  id: number
  name: string
  email: string
  role: string
  permissions: string
}

export interface TestPlanRun {
  id: number
  name: string
  lastRunDate: string
  status: 'успешно' | 'с ошибками'
}

export interface ProjectStats {
  testCaseCount: number
  scriptCount: number
  testPlanCount: number
  testPlanRunCount: number
}

export interface Project {
  id: number
  name: string
  url: string
  hasDatapool: boolean
  description: string
  stats: ProjectStats
  users: ProjectUser[]
  recentTestPlanRuns: TestPlanRun[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface ProjectContextType {
  project: Project | null
  projects: ProjectMinimal[]
  isLoading: boolean
  error: string | null
  loadProject: (projectId: number) => Promise<void>
  loadProjects: () => Promise<void>
  updateProject: (updates: Partial<Project>) => Promise<void>
  clearProject: () => void
  clearError: () => void
}

export interface MockProject {
  id: number
  name: string
  url: string
  hasDatapool: boolean
  description: string
  stats: {
    testCaseCount: number
    scriptCount: number
    testPlanCount: number
    testPlanRunCount: number
  }
  users: Array<{
    id: number
    name: string
    email: string
    role: string
    permissions: string
  }>
  recentTestPlanRuns: Array<{
    id: number
    name: string
    lastRunDate: string
    status: 'успешно' | 'с ошибками'
  }>
  createdAt: string
  updatedAt: string
  createdBy: string
}
