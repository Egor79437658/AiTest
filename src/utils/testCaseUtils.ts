import { TestCase, TestCaseStatus, TestCasePriority } from '@interfaces/'

export const groupTestCasesById = (
  testCases: TestCase[]
): Record<number, TestCase[]> => {
  return testCases.reduce(
    (acc, testCase) => {
      if (!acc[testCase.id]) {
        acc[testCase.id] = []
      }
      acc[testCase.id].push(testCase)
      return acc
    },
    {} as Record<number, TestCase[]>
  )
}

export const sortVersionsNewToOld = (versions: TestCase[]): TestCase[] => {
  return [...versions].sort(
    (a, b) =>
      new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
  )
}

export const getLatestVersions = (testCases: TestCase[]): TestCase[] => {
  const grouped = groupTestCasesById(testCases)
  return Object.values(grouped)
    .map((versions) => sortVersionsNewToOld(versions)[0])
    .filter((tc): tc is TestCase => tc !== undefined)
}

export const filterTestCasesByStatus = (
  testCases: TestCase[],
  status: TestCaseStatus[]
): TestCase[] => {
  return testCases.filter((tc) => status.includes(tc.status))
}

export const filterTestCasesByPriority = (
  testCases: TestCase[],
  priority: TestCasePriority[]
): TestCase[] => {
  return testCases.filter((tc) => priority.includes(tc.priority))
}

export const searchTestCases = (
  testCases: TestCase[],
  searchText: string
): TestCase[] => {
  const text = searchText.toLowerCase()

  return testCases.filter((tc) => {
    return (
      tc.name.toLowerCase().includes(text) ||
      tc.description?.toLowerCase().includes(text) ||
      tc.tags?.some((tag) => tag.toLowerCase().includes(text)) ||
      tc.owner.username.toLowerCase().includes(text)
    )
  })
}

export interface TestCaseStats {
  total: number
  unique: number
  byStatus: Record<TestCaseStatus, number>
  byPriority: Record<TestCasePriority, number>
  positive: number
  autoTests: number
  loadTests: number
}

export const calculateTestCaseStats = (
  testCases: TestCase[]
): TestCaseStats => {
  const total = testCases.length
  const grouped = groupTestCasesById(testCases)
  const unique = Object.keys(grouped).length

  const byStatus = testCases.reduce(
    (acc, tc) => {
      acc[tc.status] = (acc[tc.status] || 0) + 1
      return acc
    },
    {} as Record<TestCaseStatus, number>
  )

  const byPriority = testCases.reduce(
    (acc, tc) => {
      acc[tc.priority] = (acc[tc.priority] || 0) + 1
      return acc
    },
    {} as Record<TestCasePriority, number>
  )

  const positive = testCases.filter((tc) => tc.positive).length
  const autoTests = testCases.filter((tc) => tc.isAutoTest).length
  const loadTests = testCases.filter((tc) => tc.isLoadTest).length

  return {
    total,
    unique,
    byStatus,
    byPriority,
    positive,
    autoTests,
    loadTests,
  }
}

export const exportTestCasesToCSV = (testCases: TestCase[]): string => {
  const headers = [
    'ID',
    'Название',
    'Статус',
    'Приоритет',
    'Версия',
    'Позитивный',
    'Авто-тест',
    'НТ',
    'Дата создания',
    'Владелец',
  ]

  const rows = testCases.map((tc) => [
    tc.id,
    `"${tc.name}"`,
    tc.status,
    tc.priority,
    tc.version,
    tc.positive ? 'Да' : 'Нет',
    tc.isAutoTest ? 'Да' : 'Нет',
    tc.isLoadTest ? 'Да' : 'Нет',
    new Date(tc.creationDate).toLocaleDateString('ru-RU'),
    tc.owner.username,
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')

  return csvContent
}
