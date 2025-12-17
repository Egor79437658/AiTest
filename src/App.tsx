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
} from './pages'

import './index.css'
import {
  ProjectAutoTesting,
  ProjectReports,
  ProjectScripts,
  ProjectSettings,
  ProjectTestCases,
  ProjectTestPlan,
  ProjectTestPlanRuns,
} from './pages/ProjectPages/components/ProjectSubPages'

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
        element: (
            <HomeContainer />
        ),
      },
      {
        path: PAGE_ENDPOINTS.PROJECT,
        children: [
          {
            path: 'new',
            element: (
                <NewProjectContainer />
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}`,
            element: (
                <ProjectContainer />
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE}`,
            element: (
                <ProjectTestCases />
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN}`,
            element: (
                <ProjectTestPlan />
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.SCRIPT}`,
            element: (
                <ProjectScripts />
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.AUTO_TEST}`,
            element: (
                <ProjectAutoTesting />
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.REPORTS}`,
            element: (
                <ProjectReports />
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.SETTINGS}`,
            element: (
                <ProjectSettings />
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN_RUNS}`,
            element: (
                <ProjectTestPlanRuns />
            ),
          },
        ],
      },
      {
        path: PAGE_ENDPOINTS.ACCOUNT.INDEX,
        element: (
            <PersonalAccountLayout />
        ),
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
            </TestCaseProvider>
          </SidebarProvider>
        </ProjectProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
