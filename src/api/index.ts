import { apiClient } from './client'
import { authApi } from './auth'
import { ApiError } from '@interfaces/'
import { RequestConfig } from './client/types'

const enhancedApiClient = {
  ...apiClient,

  async requestWithTokenRefresh<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    try {
      return await apiClient.request<T>(endpoint, config)
    } catch (error) {
      if (error instanceof ApiError && error.status === 209) {
        await authApi.handleTokenRefresh()
        return await apiClient.request<T>(endpoint, config)
      }
      throw error
    }
  },

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.requestWithTokenRefresh<T>(endpoint, {
      ...config,
      method: 'GET',
    })
  },

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.requestWithTokenRefresh<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.requestWithTokenRefresh<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.requestWithTokenRefresh<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.requestWithTokenRefresh<T>(endpoint, {
      ...config,
      method: 'DELETE',
    })
  },
}

export { enhancedApiClient as apiClient }
export { authApi } from './auth'
export { usersApi } from './users'
export { projectsApi } from './projects'
export { testCaseApi } from './testCase'
export { testPlanApi } from './testPlan'
export type { LoginCredentials, RegisterData, AuthResponse } from './auth/types'
export { mockApiService as scriptApi } from '../services/mockApiService'
