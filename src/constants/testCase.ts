export const TEST_CASE_CONSTANTS = {
  // Максимальное количество шагов
  MAX_STEPS: 20,
  MIN_STEPS: 1,

  // Паттерны для валидации
  VERSION_PATTERN: /^\d{3}\.\d{3}\.\d{3}$/,
  IDT_PATTERN: /^TC-\d{3,}$/,

  // Статусы
  STATUS: {
    ACTIVE: 1,
    DRAFT: 2,
    ARCHIVE: 0,
  },

  // Приоритеты
  PRIORITY: {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
  },

  // Рекомендации по атомарности шагов
  STEP_GUIDELINES: {
    MAX_ACTION_LENGTH: 500,
    MAX_RESULT_LENGTH: 300,
    MIN_ACTION_LENGTH: 10,
  },

  // Шаблоны именования
  NAME_TEMPLATES: {
    COMMON_STEP: 'ОШ',
    POSITIVE: 'Позитивная проверка',
    NEGATIVE: 'Негативная проверка',
  },
} as const

export const TEST_DATA_TYPES = {
  PARAMETER: 'parameter',
  FILE: 'file',
  LINK: 'link',
  NOT_SET: 'not_set',
  ANY: 'any',
} as const
