import {
  FinanceData,
  ProfileData,
  ProjectMinimal,
  SettingsData,
  User,
} from '@interfaces/'
import {
  UpdateFinancialData,
  UpdateProfileData,
  UpdateSettingsData,
} from './types'
import { apiClient } from '@api'
import { API_URL } from '@constants/'

class UsersApi {
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(`${API_URL.USER}/me/`)
    return response
  }

  async getMyProfile(): Promise<ProfileData> {
    const response = await apiClient.get<ProfileData>('/profile/me/')
    return response
  }

  async updateMyProfile(data: UpdateProfileData): Promise<UpdateProfileData> {
    const response = await apiClient.patch<UpdateProfileData>(
      '/profile/me/',
      data
    )
    return response
  }

  async getMyFinancial(): Promise<FinanceData> {
    const response = await apiClient.get<FinanceData>('/financial/me/')
    return response
  }

  async updateMyFinancial(
    data: UpdateFinancialData
  ): Promise<UpdateFinancialData> {
    const response = await apiClient.patch<UpdateFinancialData>(
      '/financial/me/',
      data
    )
    return response
  }

  async getMySettings(): Promise<SettingsData> {
    const response = await apiClient.get<SettingsData>('/settings/me/')
    return response
  }

  async updateMySettings(
    data: UpdateSettingsData
  ): Promise<UpdateSettingsData> {
    const response = await apiClient.patch<UpdateSettingsData>(
      '/settings/me/',
      data
    )
    return response
  }

  async deleteMyAccount(): Promise<{status: number, message?: string}> {
    return await apiClient.delete<{status: number, message?: string}>(`${API_URL.USER}/me/`)
  }

  async getUserProfile(userId: number): Promise<Partial<ProfileData>> {
    const response = await apiClient.get<Partial<ProfileData>>(
      `${API_URL.USER}/${userId}/`
    )
    return response
  }

}

export const usersApi = new UsersApi()
export * from './types'
