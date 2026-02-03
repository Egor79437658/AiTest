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

export enum UserRole {
  IT_LEADER = 0,
  PROJECT_ADMIN = 1,
  ANALYST = 2,
  TESTER = 3,
  AUTOMATOR = 4,
  USER = 5
}

export const userRoleMap: Record<UserRole, string> = {
  [UserRole.IT_LEADER]: 'ИТ-Лидер',
  [UserRole.PROJECT_ADMIN]: 'Администратор проекта',
  [UserRole.ANALYST]: 'Аналитик',
  [UserRole.TESTER]: 'Тестировщик',
  [UserRole.AUTOMATOR]: 'Автоматизатор',
  [UserRole.USER]: 'Пользователь',
}

export interface RoleConfig {
  label: string;
  permissions: string[];
  description: string;
}

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  [UserRole.IT_LEADER]: {
    label: 'ИТ-лидер',
    permissions: [
      'Создание тест-кейсов',
      'Редактирование тест-кейсов',
      'Просмотр тест-кейсов',
      'Создание скриптов',
      'Создание прогонов',
      'Запуск скриптов',
      'Управление проектом',
      'Управление командой'
    ],
    description: 'Лидер проекта и главный куратор'
  },
  [UserRole.PROJECT_ADMIN]: {
    label: 'Администратор проекта',
    permissions: [
      'Создание тест-кейсов',
      'Редактирование тест-кейсов',
      'Просмотр тест-кейсов',
      'Создание скриптов',
      'Создание прогонов',
      'Запуск скриптов',
      'Управление проектом'
    ],
    description: 'Полный доступ, включая управление проектом'
  },
  [UserRole.ANALYST]: {
    label: 'Аналитик',
    permissions: [
      'Создание тест-кейсов',
      'Редактирование тест-кейсов',
      'Просмотр тест-кейсов'
    ],
    description: 'Работа с тест-кейсами'
  },
  [UserRole.TESTER]: {
    label: 'Тестировщик',
    permissions: [
      'Создание тест-кейсов',
      'Просмотр тест-кейсов',
      'Запуск скриптов'
    ],
    description: 'Создание ТК и запуск автоматических тестов'
  },
  [UserRole.AUTOMATOR]: {
    label: 'Автоматизатор',
    permissions: [
      'Создание скриптов',
      'Запуск скриптов'
    ],
    description: 'Работа с автоматизированными тестами'
  },
  [UserRole.USER]: {
    label: 'Пользователь',
    permissions: [
      'Просмотр тест-кейсов'
    ],
    description: 'Только просмотр информации'
  }
};

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
  clearError: () => void,
  clearUser: () => void
  getUserProfile: (id: number) => Promise<Partial<ProfileData>>
  deleteMyAccount: () => Promise<{status: number, message?: string}> //подумать что тут должно быть
  initializeUser: () => Promise<void>
}

export const statusMap = {
  active: 'Активен',
  blocked: 'Заблокирован',
  deleted: 'Удалён',
  unknown: 'неизвестно',
}