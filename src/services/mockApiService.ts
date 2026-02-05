import {
  ProfileData,
  Project,
  ProjectMinimal,
  ProjectUser,
  TestCase,
  TestPlan,
  TestPlanRun,
  TestPlanUpdateData,
  User,
} from '@interfaces/'
import { MOCK_CODE } from '@constants/'
import {
  MOCK_PASSWORD,
  MOCK_TEST_PLANS,
  MOCK_TEST_PLAN_RUNS,
  mockProjects,
  mockTestCases,
  mockTokens,
  mockUsers,
} from '../mock/mockData'
import { UpdateProfileData, UpdateSettingsData } from '../types/user'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

class MockApiService {
  private testPlanIdCounter = 100

  private findUserByEmail(email: string): User | undefined {
    return mockUsers.find((u) => u.profileData.email === email)
  }

  async login(credentials: { email: string; password: string }) {
    await delay(1000)

    const user = this.findUserByEmail(credentials.email)

    if (!user || credentials.password !== MOCK_PASSWORD) {
      throw new Error('Invalid email or password')
    }

    localStorage.setItem('mock_user_id', `${user.id}`)

    return {
      user,
      accessToken: mockTokens.accessToken,
      refreshToken: mockTokens.refreshToken,
    }
  }

  async register(data: { username: string; email: string; password: string }) {
    await delay(1000)

    if (this.findUserByEmail(data.email)) {
      throw new Error('User already exists')
    }

    const newUser: User = {
      ...mockUsers[1],
      id: Date.now(),
      profileData: {
        ...mockUsers[1].profileData,
        username: data.username,
        email: data.email,
        emailConfirmed: false,
      },
    }

    mockUsers.push(newUser)

    localStorage.setItem('mock_user_id', `${newUser.id}`)

    return {
      user: newUser,
      accessToken: mockTokens.accessToken,
      refreshToken: mockTokens.refreshToken,
    }
  }

  async getCurrentUser() {
    await delay(500)

    const storedAuth = localStorage.getItem('auth-storage')
    if (!storedAuth) {
      throw new Error('Not authenticated')
    }

    try {
      const parsedAuth = JSON.parse(storedAuth)
      const accessToken = parsedAuth.state?.accessToken

      if (!accessToken) {
        throw new Error('No access token')
      }

      const userId = parseInt(localStorage.getItem('mock_user_id') || '', 10)

      console.log('getCurrentUser - userId from localStorage:', userId)
      console.log('getCurrentUser - accessToken:', accessToken)

      if (!userId) {
        throw new Error('Not authenticated - no user id')
      }

      const user = mockUsers.find((u) => u.id === userId)
      console.log('getCurrentUser - found user:', user)

      if (!user) {
        throw new Error('User not found')
      }

      return user
    } catch (error) {
      console.error('Failed to get current user:', error)
      throw new Error('Not authenticated')
    }
  }

  async confirmEmail(data: { email: string; code: string }) {
    await delay(800)

    if (data.code !== MOCK_CODE) {
      throw new Error('Invalid confirmation code')
    }

    const userIndex = mockUsers.findIndex(
      (u) => u.profileData.email === data.email
    )
    if (userIndex === -1) throw new Error('User not found')

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      profileData: {
        ...mockUsers[userIndex].profileData,
        emailConfirmed: true,
      },
    }

    return { success: true }
  }

  async confirmPhone(data: { phone: string; code: string }) {
    await delay(800)

    if (data.code !== MOCK_CODE) {
      throw new Error('Invalid confirmation code')
    }

    const userIndex = mockUsers.findIndex(
      (u) => u.profileData.phone === data.phone
    )
    if (userIndex === -1) throw new Error('User not found')

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      profileData: {
        ...mockUsers[userIndex].profileData,
        phoneConfirmed: true,
      },
    }

    return { success: true }
  }

  async getUserProfile(userId: number): Promise<Partial<ProfileData>> {
    await delay(600)

    const user = mockUsers.find((u) => u.id === userId)

    if (!user) {
      throw new Error('User not found')
    }

    const profileData: Partial<ProfileData> = {
      status: user.profileData.status,
      username: user.profileData.username,
      teams: [],
    }

    if (user.settingsData.email && user.settingsData.email !== null) {
      profileData.email = user.profileData.email
    }

    if (user.settingsData.phone && user.settingsData.phone !== null) {
      profileData.phone = user.profileData.phone
    }

    if (user.settingsData.country && user.settingsData.country !== null) {
      profileData.country = user.profileData.country
    }

    if (user.settingsData.city && user.settingsData.city !== null) {
      profileData.city = user.profileData.city
    }

    if (user.settingsData.company && user.settingsData.company !== null) {
      profileData.company = user.profileData.company
    }

    if (
      user.settingsData.jobPosition &&
      user.settingsData.jobPosition !== null
    ) {
      profileData.jobPosition = user.profileData.jobPosition
    }

    if (user.settingsData.name) {
      profileData.firstName = user.profileData.firstName
      profileData.lastName = user.profileData.lastName
      profileData.fatherName = user.profileData.fatherName
    }

    const teams: { id: number; name: string; role: 0 | 1 | 2 | 3 | 4 | 5 }[] =
      []

    for (let i = 0; i < user.settingsData.teams.length; ++i) {
      const { id, flag } = user.settingsData.teams[i]
      if (flag) {
        const foundTeam = user.profileData.teams.find((el) => el.id === id)
        if (foundTeam) {
          teams.push(foundTeam)
        }
      }
    }

    profileData.teams = teams

    return profileData
  }

  async updateUserProfile(userId: number, profileData: UpdateProfileData) {
    await delay(800)

    const userIndex = mockUsers.findIndex((u) => u.id === userId)
    if (userIndex === -1) throw new Error('User not found')

    const updatedUser = {
      ...mockUsers[userIndex],
      profileData: {
        ...mockUsers[userIndex].profileData,
        ...profileData,
      },
    }

    mockUsers[userIndex] = updatedUser
    return updatedUser
  }

  async updateUserSettings(userId: number, settingsData: UpdateSettingsData) {
    await delay(800)

    const userIndex = mockUsers.findIndex((u) => u.id === userId)
    if (userIndex === -1) throw new Error('User not found')

    const updatedUser = {
      ...mockUsers[userIndex],
      settingsData: {
        ...mockUsers[userIndex].settingsData,
        ...settingsData,
      },
    }

    mockUsers[userIndex] = updatedUser
    return updatedUser
  }

  async logout() {
    localStorage.removeItem('mock_user_id')
  }

  async getShortProjects(): Promise<ProjectMinimal[]> {
    await delay(500)
    const user = await this.getCurrentUser()
    return [...user.projectData]
  }

  async getProject(projectId: number): Promise<Project> {
    await delay(500)

    const project = mockProjects.find((p) => p.id === projectId)

    if (!project) {
      throw new Error('Project not found')
    }

    return structuredClone(project)
  }

  async getProjectUsers(projectId: number): Promise<ProjectUser[]> {
    await delay(300)

    const project = mockProjects.find((p) => p.id === projectId)

    if (!project) {
      throw new Error('Project not found')
    }

    return [...project.users]
  }

  async getRecentTestPlanRuns(projectId: number): Promise<Array<{ id: number; name: string; lastRunDate: Date; status: 'успешно' | 'с ошибками' }>> {
    await delay(300)

    const project = mockProjects.find((p) => p.id === projectId)

    if (!project) {
      throw new Error('Project not found')
    }

    return [...project.recentTestPlanRuns]
  }

  async createProject(data: {
    url: string
    description: string
    name: string
  }): Promise<Project> {
    await delay(500)
    const user = await this.getCurrentUser()
    const newProject: Project = {
      id: 100 + Math.floor(100 * Math.random()),
      name: data.name,
      url: data.url,
      description: data.description,
      hasDatapool: false,
      users: [
        {
          id: user.id,
          email: user.profileData.email,
          firstName: user.profileData.firstName,
          lastName: user.profileData.lastName,
          fatherName: user.profileData.fatherName,
          role: 0,
          permissions: '',
        },
      ],
      scripts: [],
      testCases: [],
      testPlans: [],
      recentTestPlanRuns: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.id,
    }

    mockProjects.push(newProject)
    const index = mockUsers.findIndex((u) => u.id === user.id)
    mockUsers[index].projectData.push({
      id: newProject.id,
      name: newProject.name,
      lastUpdated: newProject.updatedAt,
    })
    return newProject
  }

  async updateProject(
    projectId: number,
    updates: Partial<Project>
  ): Promise<Project> {
    await delay(800)

    const projectIndex = mockProjects.findIndex((p) => p.id === projectId)

    if (projectIndex === -1) {
      throw new Error('Project not found')
    }

    const updatedProject = {
      ...mockProjects[projectIndex],
      ...updates,
      updatedAt: new Date(),
    }

    mockProjects[projectIndex] = updatedProject

    return structuredClone(updatedProject)
  }

  async getTestCases(id: number): Promise<TestCase[]> {
    const project = await this.getProject(id)
    return mockTestCases.filter((el) =>
      project.testCases.some((testCase) => testCase.id === el.id)
    )
  }

  async getTestCase(projectId: number, testCaseId: number): Promise<TestCase> {
    await delay(500)
    const foundTestCase = mockTestCases.find((el) => el.id === testCaseId)
    if (!foundTestCase) {
      throw new Error('Test case not found')
    }
    return { ...foundTestCase }
  }

  async updateTestCase(
    projectId: number,
    testCaseId: number,
    updates: Partial<TestCase>
  ): Promise<TestCase> {
    await delay(500)
    const index = mockTestCases.findIndex((el) => el.id === testCaseId)
    if (index === -1) {
      throw new Error('no test-case found')
    }

    const updated = {
      ...mockTestCases[index],
      ...updates,
    }

    mockTestCases[index] = updated

    return structuredClone(updated)
  }

  async changePassword(data: { oldPassword: string; newPassword: string }) {
    await delay(800)

    const userId = parseInt(localStorage.getItem('mock_user_id') || '', 10)
    
    if (!userId) {
      throw new Error('User not found')
    }

    if (data.oldPassword !== MOCK_PASSWORD) {
      throw new Error('Старый пароль неверен')
    }

    return { success: true }
  }

  async getAllTestPlans(projectId: number): Promise<TestPlan[]> {
    await delay(500)
    return MOCK_TEST_PLANS.filter((plan: TestPlan) => plan.projectId === projectId)
  }

  async getTestPlan(projectId: number, testPlanId: number): Promise<TestPlan> {
    await delay(500)
    const plan = MOCK_TEST_PLANS.find((p: TestPlan) => p.id === testPlanId && p.projectId === projectId)
    if (!plan) throw new Error('Test plan not found')
    return plan
  }

  async createTestPlan(projectId: number, data: Omit<TestPlanUpdateData, 'id'>): Promise<TestPlan> {
    await delay(800)
    this.testPlanIdCounter++
    const newPlan: TestPlan = {
      ...data,
      id: this.testPlanIdCounter,
      projectId,
      testCaseCount: data.testCases?.length || 0,
      owner: { id: mockUsers[0].id, username: mockUsers[0].profileData.username },
      createdAt: new Date(),
      lastRunAt: undefined,
      duration: 0,
      lastRunStatus: 'не_запускался',
      status: data.status || 'active',
      testCases: data.testCases || []
    } as TestPlan
    MOCK_TEST_PLANS.push(newPlan)
    return newPlan
  }

  async updateTestPlan(projectId: number, testPlanId: number, updates: TestPlanUpdateData): Promise<TestPlan> {
    await delay(800)
    const index = MOCK_TEST_PLANS.findIndex((p: TestPlan) => p.id === testPlanId && p.projectId === projectId)
    if (index === -1) throw new Error('Test plan not found')
    
    const updatedPlan = {
      ...MOCK_TEST_PLANS[index],
      ...updates,
      testCaseCount: updates.testCases?.length || MOCK_TEST_PLANS[index].testCaseCount
    }
    
    MOCK_TEST_PLANS[index] = updatedPlan
    return updatedPlan
  }

  async deleteTestPlan(projectId: number, testPlanId: number): Promise<void> {
    await delay(500)
    const index = MOCK_TEST_PLANS.findIndex((p: TestPlan) => p.id === testPlanId && p.projectId === projectId)
    if (index !== -1) {
      MOCK_TEST_PLANS.splice(index, 1)
    }
  }

  async runTestPlan(projectId: number, testPlanId: number): Promise<TestPlanRun> {
    await delay(2000)
    const newRun: TestPlanRun = {
      id: Date.now(),
      testPlanId,
      startedAt: new Date(),
      finishedAt: new Date(Date.now() + 30000),
      status: 'успешно',
      triggeredBy: { id: mockUsers[0].id, username: mockUsers[0].profileData.username },
      duration: 30000,
      results: []
    }
    MOCK_TEST_PLAN_RUNS.push(newRun)
    
    const planIndex = MOCK_TEST_PLANS.findIndex((p: TestPlan) => p.id === testPlanId)
    if (planIndex !== -1) {
      MOCK_TEST_PLANS[planIndex] = {
        ...MOCK_TEST_PLANS[planIndex],
        lastRunAt: new Date(),
        lastRunStatus: 'успешно'
      }
    }
    
    return newRun
  }

  async cloneTestPlan(projectId: number, testPlanId: number): Promise<TestPlan> {
    await delay(800)
    const original = MOCK_TEST_PLANS.find((p: TestPlan) => p.id === testPlanId && p.projectId === projectId)
    if (!original) throw new Error('Test plan not found')
    
    const versionParts = original.version.split('.')
    if (versionParts.length === 3) {
      versionParts[2] = (parseInt(versionParts[2]) + 1).toString()
    }
    const newVersion = versionParts.join('.')
    
    this.testPlanIdCounter++
    
    const clonedPlan: TestPlan = {
      ...original,
      id: this.testPlanIdCounter,
      name: `${original.name} (копия)`,
      version: newVersion,
      createdAt: new Date(),
      lastRunStatus: 'не_запускался',
      lastRunAt: undefined
    }
    
    MOCK_TEST_PLANS.push(clonedPlan)
    return clonedPlan
  }

  async getTestPlanRuns(projectId: number, testPlanId: number): Promise<TestPlanRun[]> {
    await delay(500)
    return MOCK_TEST_PLAN_RUNS.filter((run: TestPlanRun) => run.testPlanId === testPlanId)
  }

  async getRecentTestPlanRunsForPlan(projectId: number, testPlanId: number, limit: number = 3): Promise<TestPlanRun[]> {
    await delay(300)
    const allRuns = MOCK_TEST_PLAN_RUNS.filter((run: TestPlanRun) => run.testPlanId === testPlanId)
    const sorted = allRuns.sort((a: TestPlanRun, b: TestPlanRun) => b.startedAt.getTime() - a.startedAt.getTime())
    return sorted.slice(0, limit)
  }
}

export const mockApiService = new MockApiService()