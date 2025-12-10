import { Layout, ProtectedRoute } from '@components/'
import {
  AuthProvider,
  UserProvider,
  SidebarProvider,
  ProjectProvider,
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
    element: <Layout />,
    children: [
      {
        path: PAGE_ENDPOINTS.HOME,
        element: (
          <ProtectedRoute>
            <HomeContainer />
          </ProtectedRoute>
        ),
      },
      {
        path: PAGE_ENDPOINTS.PROJECT,
        children: [
          {
            path: 'new',
            element: (
              <ProtectedRoute>
                <NewProjectContainer />
              </ProtectedRoute>
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}`,
            element: (
              <ProtectedRoute>
                <ProjectContainer />
              </ProtectedRoute>
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE}`,
            element: (
              <ProtectedRoute>
                <ProjectTestCases />
              </ProtectedRoute>
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN}`,
            element: (
              <ProtectedRoute>
                <ProjectTestPlan />
              </ProtectedRoute>
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.SCRIPT}`,
            element: (
              <ProtectedRoute>
                <ProjectScripts />
              </ProtectedRoute>
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.AUTO_TEST}`,
            element: (
              <ProtectedRoute>
                <ProjectAutoTesting />
              </ProtectedRoute>
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.REPORTS}`,
            element: (
              <ProtectedRoute>
                <ProjectReports />
              </ProtectedRoute>
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.SETTINGS}`,
            element: (
              <ProtectedRoute>
                <ProjectSettings />
              </ProtectedRoute>
            ),
          },
          {
            path: `${PAGE_ENDPOINTS.PROJECT_ID}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN_RUNS}`,
            element: (
              <ProtectedRoute>
                <ProjectTestPlanRuns />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: PAGE_ENDPOINTS.ACCOUNT.INDEX,
        element: (
          <ProtectedRoute>
            <PersonalAccountLayout />
          </ProtectedRoute>
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
            <RouterProvider router={router} />
          </SidebarProvider>
        </ProjectProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
