import { MockProject, ProjectMinimal, User } from '@interfaces/'

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
      teams: [{ id: 3, name: 'QA Team', role: 2 }],
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
      teams: [{ id: 3, flag: true }],
      language: 'ru' as const,
    },
    projectData: [
      { id: 1, name: 'Автоматизация тестирования Web приложения' },
      { id: 2, name: 'Мобильное приложение iOS' },
    ],
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
      teams: [{ id: 1, name: 'Dev Team', role: 0 }],
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
      teams: [{ id: 1, flag: true }],
      language: 'ru' as const,
    },
    projectData: [
      { id: 1, name: 'Личный проект' },
      { id: 2, name: 'Тестовый стенд' },
    ],
    isAdmin: false,
  },
]

export const mockProjects: MockProject[] = [
  {
    id: 1,
    name: 'Web приложения',
    url: 'https://example-web-app.com',
    hasDatapool: true,
    description:
      'Проект по автоматизации тестирования основного веб-приложения компании',
    stats: {
      testCaseCount: 156,
      scriptCount: 42,
      testPlanCount: 8,
      testPlanRunCount: 127,
    },
    users: [
      {
        id: 1,
        name: 'Иванов Иван Иванович',
        email: 'ivanov@example.com',
        role: 'Администратор',
        permissions: 'Полные',
      },
      {
        id: 2,
        name: 'Петрова Мария Сергеевна',
        email: 'petrova@example.com',
        role: 'Тестировщик',
        permissions: 'Чтение/Запись',
      },
      {
        id: 3,
        name: 'Сидоров Алексей Петрович',
        email: 'sidorov@example.com',
        role: 'Разработчик',
        permissions: 'Чтение',
      },
      {
        id: 4,
        name: 'Кузнецова Елена Викторовна',
        email: 'kuznetsova@example.com',
        role: 'Тестировщик',
        permissions: 'Чтение/Запись',
      },
    ],
    recentTestPlanRuns: [
      {
        id: 1,
        name: 'Регрессионное тестирование',
        lastRunDate: '2024-01-15',
        status: 'успешно',
      },
      {
        id: 2,
        name: 'Smoke тестирование',
        lastRunDate: '2024-01-14',
        status: 'с ошибками',
      },
      {
        id: 3,
        name: 'Интеграционное тестирование',
        lastRunDate: '2024-01-12',
        status: 'успешно',
      },
    ],
    createdAt: '2023-11-01',
    updatedAt: '2024-01-15',
    createdBy: 'user1',
  },
  {
    id: 2,
    name: 'Мобильное приложение iOS',
    url: 'https://example-ios-app.com',
    hasDatapool: false,
    description: 'Тестирование мобильного приложения для iOS платформы',
    stats: {
      testCaseCount: 89,
      scriptCount: 23,
      testPlanCount: 5,
      testPlanRunCount: 64,
    },
    users: [
      {
        id: 1,
        name: 'Иванов Иван Иванович',
        email: 'ivanov@example.com',
        role: 'Администратор',
        permissions: 'Полные',
      },
      {
        id: 5,
        name: 'Смирнов Дмитрий Александрович',
        email: 'smirnov@example.com',
        role: 'Тестировщик',
        permissions: 'Чтение/Запись',
      },
    ],
    recentTestPlanRuns: [
      {
        id: 4,
        name: 'UI тестирование',
        lastRunDate: '2024-01-10',
        status: 'успешно',
      },
    ],
    createdAt: '2023-12-01',
    updatedAt: '2024-01-10',
    createdBy: 'user1',
  },
  {
    id: 3,
    name: 'Мобильное приложение',
    url: 'https://mobile-app.example.com',
    hasDatapool: true,
    description: 'Тестирование мобильного приложения для Android и iOS',
    stats: {
      testCaseCount: 215,
      scriptCount: 67,
      testPlanCount: 12,
      testPlanRunCount: 189,
    },
    users: [
      {
        id: 1,
        name: 'Иванов Иван Иванович',
        email: 'ivanov@example.com',
        role: 'Администратор',
        permissions: 'Полные',
      },
      {
        id: 6,
        name: 'Васильев Василий Васильевич',
        email: 'vasilyev@example.com',
        role: 'Разработчик',
        permissions: 'Чтение',
      },
    ],
    recentTestPlanRuns: [
      {
        id: 5,
        name: 'Мобильное регрессионное тестирование',
        lastRunDate: '2024-01-16',
        status: 'успешно',
      },
    ],
    createdAt: '2023-10-15',
    updatedAt: '2024-01-16',
    createdBy: 'user1',
  },
  {
    id: 4,
    name: 'Веб-портал',
    url: 'https://web-portal.example.com',
    hasDatapool: false,
    description: 'Корпоративный веб-портал компании',
    stats: {
      testCaseCount: 178,
      scriptCount: 45,
      testPlanCount: 9,
      testPlanRunCount: 143,
    },
    users: [
      {
        id: 1,
        name: 'Иванов Иван Иванович',
        email: 'ivanov@example.com',
        role: 'Администратор',
        permissions: 'Полные',
      },
      {
        id: 2,
        name: 'Петрова Мария Сергеевна',
        email: 'petrova@example.com',
        role: 'Тестировщик',
        permissions: 'Чтение/Запись',
      },
    ],
    recentTestPlanRuns: [
      {
        id: 6,
        name: 'Веб-регрессионное тестирование',
        lastRunDate: '2024-01-13',
        status: 'с ошибками',
      },
    ],
    createdAt: '2023-11-10',
    updatedAt: '2024-01-13',
    createdBy: 'user1',
  },
  {
    id: 5,
    name: 'API система',
    url: 'https://api.example.com',
    hasDatapool: true,
    description: 'REST API для интеграции с внешними системами',
    stats: {
      testCaseCount: 92,
      scriptCount: 38,
      testPlanCount: 6,
      testPlanRunCount: 75,
    },
    users: [
      {
        id: 1,
        name: 'Иванов Иван Иванович',
        email: 'ivanov@example.com',
        role: 'Администратор',
        permissions: 'Полные',
      },
      {
        id: 3,
        name: 'Сидоров Алексей Петрович',
        email: 'sidorov@example.com',
        role: 'Разработчик',
        permissions: 'Чтение',
      },
    ],
    recentTestPlanRuns: [
      {
        id: 7,
        name: 'API нагрузочное тестирование',
        lastRunDate: '2024-01-11',
        status: 'успешно',
      },
    ],
    createdAt: '2023-12-05',
    updatedAt: '2024-01-11',
    createdBy: 'user1',
  },
]

export const mockProjectsMinimal: ProjectMinimal[] = mockProjects.map(
  (project) => ({
    id: project.id,
    name: project.name,
  })
)

export const mockTokens = {
  accessToken: 'mock-access-token-123',
  refreshToken: 'mock-refresh-token-456',
}

export const MOCK_PASSWORD = 'password123'
