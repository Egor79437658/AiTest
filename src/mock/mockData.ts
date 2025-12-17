import { Project, TestCase, User } from '@interfaces/'

export const mockUsers: User[] = [
  {
    id: 1,
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
      {
        id: 1,
        name: 'Автоматизация тестирования Web приложения',
        lastUpdated: new Date('2023-12-25T10:00:00'),
      },
      {
        id: 2,
        name: 'Мобильное приложение iOS',
        lastUpdated: new Date('2024-12-25T10:00:00'),
      },
    ],
    isAdmin: true,
  },
  {
    id: 2,
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
      {
        id: 3,
        name: 'Личный проект',
        lastUpdated: new Date('2023-12-25T10:00:00'),
      },
      {
        id: 4,
        name: 'Тестовый стенд',
        lastUpdated: new Date('2024-12-25T10:00:00'),
      },
    ],
    isAdmin: false,
  },
]

export const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Автоматизация тестирования Web приложения',
    url: 'https://example-web-app.com',
    hasDatapool: true,
    description:
      'Проект по автоматизации тестирования основного веб-приложения компании',
    users: [
      {
        id: 1,
        firstName: 'Петр',
        lastName: 'Петров',
        fatherName: 'Петрович',
        email: 'ivanov@example.com',
        role: 2,
        permissions: 'Полные',
      },
    ],
    testPlans: [{ id: 4 }],
    testCases: [{ id: 3 }],
    scripts: [{ id: 3 }],
    recentTestPlanRuns: [
      {
        id: 4,
        name: 'Мобильное регрессионное тестирование',
        lastRunDate: new Date('2023-12-26T10:00:00'),
        status: 'успешно',
      },
    ],
    createdAt: new Date('2023-12-25T10:00:00'),
    updatedAt: new Date('2023-12-25T10:00:00'),
    createdBy: 1,
  },
  {
    id: 2,
    name: 'Мобильное приложение iOS',
    url: 'https://example-ios-app.com',
    hasDatapool: false,
    description: 'Тестирование мобильного приложения для iOS платформы',
    users: [
      {
        id: 1,
        firstName: 'Петр',
        lastName: 'Петров',
        fatherName: 'Петрович',
        email: 'ivanov@example.com',
        role: 2,
        permissions: 'Полные',
      },
    ],
    testPlans: [{ id: 3 }],
    testCases: [{ id: 2 }],
    scripts: [{ id: 2 }],
    recentTestPlanRuns: [
      {
        id: 3,
        name: 'UI тестирование',
        lastRunDate: new Date('2023-12-26T10:00:00'),
        status: 'успешно',
      },
    ],
    createdAt: new Date('2023-12-26T10:00:00'),
    updatedAt: new Date('2023-12-26T10:00:00'),
    createdBy: 1,
  },
  {
    id: 3,
    name: 'Личный проект',
    url: 'https://mobile-app.example.com',
    hasDatapool: true,
    description: 'Тестирование мобильного приложения для Android и iOS',
    users: [
      {
        id: 2,
        firstName: 'Петр',
        lastName: 'Петров',
        fatherName: 'Петрович',
        email: 'ivanov@example.com',
        role: 0,
        permissions: 'Полные',
      },
    ],

    testPlans: [{ id: 1 }, { id: 2 }],
    testCases: [{ id: 1 }],
    scripts: [{ id: 1 }],
    recentTestPlanRuns: [
      {
        id: 1,
        name: 'Регрессионное тестирование',
        lastRunDate: new Date('2023-12-26T10:00:00'),
        status: 'успешно',
      },
      {
        id: 2,
        name: 'Smoke тестирование',
        lastRunDate: new Date('2023-12-26T10:00:00'),
        status: 'с ошибками',
      },
    ],
    createdAt: new Date('2023-12-26T10:00:00'),
    updatedAt: new Date('2023-12-26T10:00:00'),
    createdBy: 2,
  },
  {
    id: 4,
    name: 'Тестовый стенд',
    url: 'https://web-portal.example.com',
    hasDatapool: false,
    description: 'Корпоративный веб-портал компании',
    users: [
      {
        id: 2,
        firstName: 'Петр',
        lastName: 'Петров',
        fatherName: 'Петрович',
        email: 'ivanov@example.com',
        role: 0,
        permissions: 'Полные',
      },
    ],
    testPlans: [{ id: 5 }],
    testCases: [{ id: 5 }, { id: 6 }],
    scripts: [{ id: 5 }],
    recentTestPlanRuns: [
      {
        id: 5,
        name: 'Мобильное регрессионное тестирование',
        lastRunDate: new Date('2023-12-26T10:00:00'),
        status: 'с ошибками',
      },
    ],
    createdAt: new Date('2023-12-26T10:00:00'),
    updatedAt: new Date('2023-12-26T10:00:00'),
    createdBy: 2,
  },
]

export const mockTestCases: TestCase[] = [
  {
    id: 1,
    flag: true,
    name: 'тест-кейс 1',
    positive: true,
    version: '000.000.000',
    scriptIds: [{ id: 1, name: 'тест-скрипт 1' }],
    precondition: '{x == 0}',
    testCases: [{ id: 1, name: 'тест-кейс 1' }],
    owner: {
      id: 2,
      username: 'demo',
    },
    creationDate: new Date('2023-12-26T10:00:00'),
    status: 1,
    usedInTestPlans: true,
    testPlans: [
      { id: 1, name: 'тест-план 1', date: new Date('2023-12-26T10:00:00') },
    ],
    steps: [{precondition: "pre  1", action: "act 1", result: "res1"}]
  },
  {
    id: 2,
    flag: true,
    name: 'тест-кейс 2',
    positive: true,
    version: '000.000.000',
    scriptIds: [{ id: 2, name: 'тест-скрипт 2' }],
    precondition: '{x == 0}',
    testCases: [{ id: 2, name: 'тест-кейс 2' }],
    owner: {
      id: 1,
      username: 'testuser',
    },
    creationDate: new Date('2023-12-26T10:00:00'),
    status: 2,
    usedInTestPlans: true,
    testPlans: [
      { id: 3, name: 'тест-план 3', date: new Date('2023-12-26T10:00:00') },
    ],
    steps: [{precondition: "pre  1", action: "act 1", result: "res1"}]
  },
  {
    id: 3,
    flag: true,
    name: 'тест-кейс 3',
    positive: true,
    version: '000.000.000',
    scriptIds: [{ id: 3, name: 'тест-скрипт 3' }],
    precondition: '{x == 0}',
    testCases: [{ id: 3, name: 'тест-кейс 3' }],
    owner: {
      id: 1,
      username: 'testuser',
    },
    creationDate: new Date('2023-12-25T10:00:00'),
    status: 1,
    usedInTestPlans: true,
    testPlans: [
      { id: 4, name: 'тест-план 4', date: new Date('2023-12-26T10:00:00') },
    ],
    steps: [{precondition: "pre  1", action: "act 1", result: "res1"}]
  },
  {
    id: 5,
    flag: true,
    name: 'тест-кейс 5',
    positive: true,
    version: '000.000.000',
    scriptIds: [{ id: 5, name: 'тест-скрипт 5' }],
    precondition: '{x == 0}',
    testCases: [{ id: 6, name: 'тест-кейс 6' }],
    owner: {
      id: 2,
      username: 'demo',
    },
    creationDate: new Date('2023-12-26T10:00:00'),
    status: 2,
    usedInTestPlans: true,
    testPlans: [
      { id: 5, name: 'тест-план 5', date: new Date('2023-12-26T10:00:00') },
    ],
    steps: [{precondition: "pre  1", action: "act 1", result: "res1"}]
  },
  {
    id: 5,
    flag: true,
    name: 'тест-кейс 5',
    positive: true,
    version: '000.000.001',
    scriptIds: [{ id: 5, name: 'тест-скрипт 5' }],
    precondition: '{x == 0}',
    testCases: [{ id: 6, name: 'тест-кейс 6' }],
    owner: {
      id: 2,
      username: 'demo',
    },
    creationDate: new Date('2023-12-27T10:00:00'),
    status: 1,
    usedInTestPlans: true,
    testPlans: [
      { id: 5, name: 'тест-план 5', date: new Date('2023-12-26T10:00:00') },
    ],
    steps: [{precondition: "pre  1", action: "act 1", result: "res1"}]
  },
  {
    id: 6,
    flag: true,
    name: 'тест-кейс 6',
    positive: true,
    version: '000.000.000',
    scriptIds: [{ id: 5, name: 'тест-скрипт 5' }],
    precondition: '{x == 0}',
    testCases: [{ id: 5, name: 'тест-кейс 5' }],
    owner: {
      id: 2,
      username: 'demo',
    },
    creationDate: new Date('2023-12-27T10:00:00'),
    status: 2,
    usedInTestPlans: true,
    testPlans: [
      { id: 5, name: 'тест-план 5', date: new Date('2023-12-26T10:00:00') },
    ],
    steps: [{precondition: "pre  1", action: "act 1", result: "res1"}]
  },
]

export const mockTokens = {
  accessToken: 'mock-access-token-123',
  refreshToken: 'mock-refresh-token-456',
}

export const MOCK_PASSWORD = 'password123'
