import { ProjectMinimal } from './project'
import { UpdateProfileData, UpdateSettingsData } from '../api/users'

export interface ProfileData {
  status: 'active' | 'blocked' | 'deleted'
  username: string
  firstName: string
  lastName: string
  fatherName: string | null
  email: string
  phone: string
  phoneConfirmed: boolean
  emailConfirmed: boolean
  country: string
  city: string
  company: string | null
  employeeCount: '<10' | '11-30' | '30-100' | '>100' | null
  jobPosition: string | null
  usePurpose: 'personal' | 'testPersonal' | 'testCompany' | 'testJob'
  teams: { id: number; name: string; role: 0 | 1 | 2 | 3 | 4 | 5 }[]
}

export interface FinanceData {
  balance: number
  subscription: 1 | 2 | 3 | 0
}

export const userRoleMap = {
  1: 'ИТ-Лидер',
  2: 'Администратор проекта',
  3: 'Аналитик',
  4: 'Тестировщик',
  5: 'Автомитизатор',
  0: 'Пользователь',
}

export interface SettingsData {
  theme: 'light' | 'dark'
  name: boolean
  email: boolean
  phone: boolean
  country: boolean
  city: boolean
  company: boolean | null
  jobPosition: boolean | null
  teams: { id: number; flag: boolean }[]
  language: 'ru' | 'en'
}

export interface User {
  id: number
  isAdmin: boolean
  profileData: ProfileData
  financeData: FinanceData
  settingsData: SettingsData
  projectData: ProjectMinimal[]
}

export interface UserContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  updateUserProfile: (profileData: UpdateProfileData) => Promise<void>
  updateUserSettings: (settingsData: UpdateSettingsData) => Promise<void>
  updateUserConfirmation: (type: 'email' | 'phone') => Promise<void>
  clearError: () => void
}
