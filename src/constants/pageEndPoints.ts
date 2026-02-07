export const PAGE_ENDPOINTS = {
  INDEX: '/',
  OUTLET: '/app',
  HOME: 'home',
  PROJECT: 'project',
  PROJECT_ID: ':projectId',
  TEST_CASE_ID: ':testCaseId',
  TEST_PLAN_ID: ':testPlanId',
  RUN_ID: ':runId',
  HISTORY: 'history',
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
    VIEW_ACCOUNT: ":userId"
  },
  ADMIN: 'admin',
} as const
