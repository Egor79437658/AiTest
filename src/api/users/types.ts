import { User } from '@interfaces/'

export interface UpdateProfileData {
  profileData: Partial<User['profileData']>
}

export interface UpdateSettingsData {
  settingsData: Partial<User['settingsData']>
}

export interface UpdateFinancialData {
  financialData: Partial<User['financeData']>
}
