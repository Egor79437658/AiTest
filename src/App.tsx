import { Layout, ProtectedRoute } from '@components/'
import {
  AuthProvider,
  UserProvider,
  SidebarProvider,
  ProjectProvider,
  TestCaseProvider,
} from '@contexts/'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { PAGE_ENDPOINTS } from '@constants/'
import {
  FinanceTab,
  HomeContainer,
  NewProjectContainer,
  IndexPage,
  PersonalAccountLayout,
  ProfileTab,
  ProjectContainer,
  SettingsTab,
  ViewProfileTab,
  ProjectOutlet,
} from './pages'

import './index.css'
import {
  CreateTestCase,
  ProjectAutoTesting,
  ProjectReports,
  ProjectScripts,
  ProjectSettings,
  ProjectTestCases,
  ProjectTestPlan,
  ProjectTestPlanRuns,
  RedactTestCase,
  ViewTestCase,
  HistoryTestCase,
  TestCasesOutlet,
} from './pages/ProjectPages/components/ProjectSubPages'
import { Toaster } from 'sonner'

const router = createBrowserRouter([
  {
    path: PAGE_ENDPOINTS.INDEX,
    element: <IndexPage />,
  },
  {
    path: PAGE_ENDPOINTS.OUTLET,
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: PAGE_ENDPOINTS.HOME,
        element: <HomeContainer />,
      },
      {
        path: PAGE_ENDPOINTS.PROJECT,
        children: [
          {
            path: 'new',
            element: <NewProjectContainer />,
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}`,
            element: <ProjectOutlet />,
            children: [
              {
                index: true,
                element: <ProjectContainer />,
              },
              {
                path: `${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE}`,
                element: <TestCasesOutlet />,
                children: [
                  {
                    index: true,
                    element: <ProjectTestCases />,
                  },
                  {
                    path: 'new',
                    element: <CreateTestCase />,
                  },
                  {
                    path: `${PAGE_ENDPOINTS.TEST_CASE_ID}`,
                    element: <RedactTestCase />,
                  },
                  {
                    path: `${PAGE_ENDPOINTS.TEST_CASE_ID}/view`,
                    element: <ViewTestCase />,
                  },
                  {
                    path: `${PAGE_ENDPOINTS.TEST_CASE_ID}/${PAGE_ENDPOINTS.HISTORY}`,
                    element: <HistoryTestCase />,
                  },
                ],
              },
              {
                path: `${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN}`,
                element: <ProjectTestPlan />,
              },
              {
                path: `${PAGE_ENDPOINTS.PROJECT_PARTS.SCRIPT}`,
                element: <ProjectScripts />,
              },
              {
                path: `${PAGE_ENDPOINTS.PROJECT_PARTS.AUTO_TEST}`,
                element: <ProjectAutoTesting />,
              },
              {
                path: `${PAGE_ENDPOINTS.PROJECT_PARTS.REPORTS}`,
                element: <ProjectReports />,
              },
              {
                path: `${PAGE_ENDPOINTS.PROJECT_PARTS.SETTINGS}`,
                element: <ProjectSettings />,
              },
              {
                path: `${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN_RUNS}`,
                element: <ProjectTestPlanRuns />,
              },
            ],
          },
        ],
      },
      {
        path: PAGE_ENDPOINTS.ACCOUNT.INDEX,
        element: <PersonalAccountLayout />,
        children: [
          {
            path: PAGE_ENDPOINTS.ACCOUNT.PROFILE,
            element: <ProfileTab />,
          },
          {
            path: PAGE_ENDPOINTS.ACCOUNT.FINANCES,
            element: <FinanceTab />,
          },
          {
            path: PAGE_ENDPOINTS.ACCOUNT.SETTINGS,
            element: <SettingsTab />,
          },
        ],
      },
      {
        path: `${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${PAGE_ENDPOINTS.ACCOUNT.VIEW_ACCOUNT}`,
        element: <ViewProfileTab />,
      },
      {
        path: '*',
        element: <Navigate to={PAGE_ENDPOINTS.INDEX} replace />,
      },
    ],
  },
])

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ProjectProvider>
          <SidebarProvider>
            <TestCaseProvider>
              <RouterProvider router={router} />
              <Toaster />
            </TestCaseProvider>
          </SidebarProvider>
        </ProjectProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
