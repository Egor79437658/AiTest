export interface AuthContextType {
  isAuthenticated: boolean
  authModal: AuthModalType
  pendingEmail: string
  pendingPhone: string
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>
  confirmPending: (code: string, type: 'phone' | 'email') => Promise<boolean>
  logout: () => void
  openAuthModal: (type: AuthModalType, value?: string) => void
  closeAuthModal: (type: AuthModalType) => void
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface ConfirmFormData {
  code: string
}

export type FormDataToRecord<T> = {
  [K in keyof T]: string
}

export type PartialFormData<T> = Partial<FormDataToRecord<T>>

export type AuthModalType =
  | 'login'
  | 'register'
  | 'confirmEmail'
  | 'confirmPhone'
  | null
