export const PAGE_ENDPOINTS = {
  INDEX: '/',
  OUTLET: '/app',
  HOME: 'home',
  PROJECT: 'project',
  PROJECT_ID: ':projectId',
  PROJECT_PARTS: {
    TEST_CASE: 'test-cases',
    TEST_PLAN: 'test-plan',
    TEST_PLAN_RUNS: 'test-plan-runs',
    SCRIPT: 'scripts',
    AUTO_TEST: 'auto-testing',
    REPORTS: 'reports',
    SETTINGS: 'settings',
  },
  PROJECT_NEW: 'new',
  ACCOUNT: {
    INDEX: 'account',
    SETTINGS: 'settings',
    PROFILE: 'profile',
    FINANCES: 'finances',
  },
  ADMIN: 'admin',
} as const
