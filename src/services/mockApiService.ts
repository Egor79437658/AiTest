// mockApiService.ts - обновленная версия с методом deleteProject
import {
  ProfileData,
  Project,
  ProjectMinimal,
  ProjectUser,
  TestCase,
  TestPlanRun,
  User,
} from '@interfaces/'
import { MOCK_CODE } from '@constants/'
import {
  MOCK_PASSWORD,
  mockProjects,
  mockTestCases,
  mockTokens,
  mockUsers,
} from '../mock/mockData'
import { UpdateProfileData, UpdateSettingsData } from '../api/users'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

class MockApiService {
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

  async getUserProfile(userId: number) {
    await delay(600)

    const user = mockUsers.find((u) => u.id === userId)

    if (!user) {
      throw new Error('User not found')
    }

    const profileData: Partial<ProfileData> = {
      status: user.profileData.status,
      username: user.profileData.username,
      teams: []
    }

    for(const [key, value] of Object.entries(user.settingsData)) {
      if (["theme", "language", "teams", "name"].includes(key)) continue

      if(value) {
        profileData[key] = user.profileData[key]
      }
    }

    if(user.settingsData.name) {
      profileData.firstName = user.profileData.firstName
      profileData.lastName = user.profileData.lastName
      profileData.fatherName = user.profileData.fatherName
    }

    for (let i = 0; i < user.profileData.teams.length; ++i) {
      const {id, flag} = user.settingsData.teams[i]
      if(flag) {
        profileData.teams?.push(user.profileData.teams.find(el => el.id === id))
      }
    }

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

  async getRecentTestPlanRuns(projectId: number): Promise<TestPlanRun[]> {
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


  async deleteProject(projectId: number): Promise<void> {
    await delay(500)

    const projectIndex = mockProjects.findIndex((p) => p.id === projectId)

    if (projectIndex === -1) {
      throw new Error('Project not found')
    }

  
    mockProjects.splice(projectIndex, 1)

 
    mockUsers.forEach(user => {
      user.projectData = user.projectData.filter(
        project => project.id !== projectId
      )
    })

    
    localStorage.removeItem(`project_${projectId}_datapool`)

    console.log(`Project ${projectId} deleted successfully from mock data`)
  }

  async getTestCases(id: number): Promise<TestCase[]> {
    const project = await this.getProject(id)
    return mockTestCases.filter((el) =>
      project.testCases.some((testCase) => testCase.id === el.id)
    )
  }

  async getTestCase(projectId: number, testCaseId: number): Promise<TestCase> {
    await delay(500)
    return { ...mockTestCases.find((el) => el.id === testCaseId) }
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
}

export const mockApiService = new MockApiService()