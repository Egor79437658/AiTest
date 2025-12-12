import { ProjectMinimal, User } from '@interfaces/'
import {
  UpdateFinancialData,
  UpdateProfileData,
  UpdateSettingsData,
} from './types'
import { apiClient } from '@api'
import { API_URL } from '@constants/'

class UsersApi {
  async getMyProfile(): Promise<User> {
    const response = await apiClient.get<User>(`${API_URL.USER}/me/`)
    return response
  }

  async updateMyProfile(data: UpdateProfileData): Promise<User> {
    const response = await apiClient.patch<User>(`${API_URL.USER}/me/`, data)
    return response
  }

  async getMyProjects(): Promise<ProjectMinimal[]> {
    const response = await apiClient.get<ProjectMinimal[]>('/projects/me/')
    return response
  }

  async getMyFinancial(): Promise<User> {
    const response = await apiClient.get<User>('/financial/me/')
    return response
  }

  async updateMyFinancial(data: UpdateFinancialData): Promise<User> {
    const response = await apiClient.patch<User>('/financial/me/', data)
    return response
  }

  async getMySettings(): Promise<User> {
    const response = await apiClient.get<User>('/settings/me/')
    return response
  }

  async updateMySettings(data: UpdateSettingsData): Promise<User> {
    const response = await apiClient.patch<User>('/settings/me/', data)
    return response
  }

  async deleteMyAccount(): Promise<void> {
    await apiClient.delete(`${API_URL.USER}/me/`)
  }

  async getUserProfile(userId: number): Promise<User> {
    const response = await apiClient.get<User>(`${API_URL.USER}/${userId}/`)
    return response
  }

  async deleteUser(userId: number): Promise<void> {
    await apiClient.delete(`/user/${userId}/`)
  }
}

export const usersApi = new UsersApi()
export * from './types'
