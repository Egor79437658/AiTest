import { User } from '@interfaces/'

export const mockUsers: User[] = [
  {
    id: '1',
    uuid: 'mock_uuid',
    profileData: {
      status: 'active' as const,
      username: 'testuser',
      firstName: 'Иван',
      lastName: 'Иванов',
      fatherName: 'Иванович',
      email: 'test@test.com',
      phone: '+79217990312',
      phoneConfirmed: true,
      emailConfirmed: true,
      country: 'Россия',
      city: 'Москва',
      company: 'ТехноКорп',
      employeeCount: '11-30' as const,
      jobPosition: 'Тестировщик',
      usePurpose: 'testCompany' as const,
      teams: [{ name: 'QA Team', role: 'Senior QA' }],
    },
    financeData: {
      balance: 12300,
      subscription: 1,
    },
    settingsData: {
      theme: 'light' as const,
      name: true,
      email: false,
      phone: false,
      country: true,
      city: true,
      company: true,
      jobPosition: false,
      teams: [true, false],
      language: 'ru' as const,
    },
    projectData: {
      projects: [
        { name: 'Мобильное приложение' },
        { name: 'Веб-портал' },
        { name: 'API система' },
      ],
    },
    isAdmin: true,
  },
  {
    id: '2',
    uuid: 'mock_uuid2',
    profileData: {
      status: 'active' as const,
      username: 'demo',
      firstName: 'Петр',
      lastName: 'Петров',
      fatherName: 'Петрович',
      email: 'demo@demo.com',
      phone: '+79151234567',
      phoneConfirmed: false,
      emailConfirmed: false,
      country: 'Россия',
      city: 'Санкт-Петербург',
      company: null,
      employeeCount: null,
      jobPosition: null,
      usePurpose: 'personal' as const,
      teams: [{ name: 'Dev Team', role: 'Developer' }],
    },
    financeData: {
      balance: 4560,
      subscription: 0,
    },
    settingsData: {
      theme: 'dark' as const,
      name: true,
      email: false,
      phone: false,
      country: true,
      city: true,
      company: null,
      jobPosition: null,
      teams: [true, false],
      language: 'ru' as const,
    },
    projectData: {
      projects: [{ name: 'Личный проект' }, { name: 'Тестовый стенд' }],
    },
    isAdmin: false,
  },
]

export const mockTokens = {
  accessToken: 'mock-access-token-123',
  refreshToken: 'mock-refresh-token-456',
}

export const MOCK_PASSWORD = 'password123'
