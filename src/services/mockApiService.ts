import { User } from '@interfaces/'
import { MOCK_CODE } from '@constants/'
import { MOCK_PASSWORD, mockTokens, mockUsers } from '../mock/mockData'
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

    localStorage.setItem('mock_user_id', user.id)

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
      id: Date.now().toString(),
      profileData: {
        ...mockUsers[1].profileData,
        username: data.username,
        email: data.email,
        emailConfirmed: false,
      },
    }

    mockUsers.push(newUser)

    localStorage.setItem('mock_user_id', newUser.id)

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

      const userId = localStorage.getItem('mock_user_id')

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

  async getUserProfile(userId: string) {
    await delay(600)

    const user = mockUsers.find((u) => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  async updateUserProfile(userId: string, profileData: UpdateProfileData) {
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

  async updateUserSettings(userId: string, settingsData: UpdateSettingsData) {
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
}

export const mockApiService = new MockApiService()
