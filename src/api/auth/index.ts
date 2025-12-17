import { apiClient } from '@api'
import {
  LoginCredentials,
  RegisterData,
  ConfirmData,
  PhoneConfirmData,
  AuthResponse,
  ConfirmResponse,
  TokensResponse,
} from './types'
import { useAuthStore } from '@stores/'
import { API_URL } from '@constants/'
import { ApiError } from '@interfaces/'
import { User } from '@interfaces/'

class AuthApi {
  private isRefreshing = false
  private refreshSubscribers: ((token: string) => void)[] = []

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${API_URL.AUTH}/login`,
      credentials
    )
    return response
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${API_URL.AUTH}/register`,
      data
    )
    return response
  }

  async confirmEmail(data: ConfirmData): Promise<ConfirmResponse> {
    const response = await apiClient.post<ConfirmResponse>(
      `${API_URL.AUTH}/confirm-email`,
      data
    )
    return response
  }

  async confirmPhone(data: PhoneConfirmData): Promise<ConfirmResponse> {
    const response = await apiClient.post<ConfirmResponse>(
      `${API_URL.AUTH}/confirm-phone`,
      data
    )
    return response
  }

  async refreshTokens(refreshToken: string): Promise<TokensResponse> {
    const response = await apiClient.post<TokensResponse>(
      `${API_URL.AUTH}/refresh`,
      { refreshToken }
    )
    return response
  }

  //нужно ли, если есть getUserProfile(user.id)
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(`${API_URL.AUTH}/me`)
    return response
  }

  async handleTokenRefresh(): Promise<void> {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push(() => resolve())
      })
    }

    this.isRefreshing = true
    const { refreshToken, setTokens } = useAuthStore.getState()

    if (!refreshToken) {
      throw new ApiError('No refresh token available', 401, 'NO_REFRESH_TOKEN')
    }

    try {
      const newTokens = await this.refreshTokens(refreshToken)
      setTokens(newTokens.accessToken, newTokens.refreshToken)

      this.refreshSubscribers.forEach((callback) =>
        callback(newTokens.accessToken)
      )
    } catch (error) {
      await this.handleTokenRefreshFailed()
      throw error
    } finally {
      this.isRefreshing = false
      this.refreshSubscribers = []
    }
  }

  private async handleTokenRefreshFailed(): Promise<void> {
    const { logout } = useAuthStore.getState()
    logout()
  }

  subscribeToTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback)
  }
}

export const authApi = new AuthApi()
export * from './types'
