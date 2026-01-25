import { User } from '@interfaces/'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface ConfirmData {
  email: string
  code: string
}

export interface PhoneConfirmData {
  phone: string
  code: string
}

export interface TokensResponse {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface ConfirmResponse {
  success: boolean
}

export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}