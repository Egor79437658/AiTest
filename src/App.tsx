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
            path: ':projectId',
            element: (
              <ProtectedRoute>
                <ProjectContainer />
              </ProtectedRoute>
            ),
          },
          {
            path: ':projectId/test-cases',
            element: (
              <ProtectedRoute>
                <ProjectTestCases />
              </ProtectedRoute>
            ),
          },
          {
            path: ':projectId/test-plan',
            element: (
              <ProtectedRoute>
                <ProjectTestPlan />
              </ProtectedRoute>
            ),
          },
          {
            path: ':projectId/scripts',
            element: (
              <ProtectedRoute>
                <ProjectScripts />
              </ProtectedRoute>
            ),
          },
          {
            path: ':projectId/auto-testing',
            element: (
              <ProtectedRoute>
                <ProjectAutoTesting />
              </ProtectedRoute>
            ),
          },
          {
            path: ':projectId/reports',
            element: (
              <ProtectedRoute>
                <ProjectReports />
              </ProtectedRoute>
            ),
          },
          {
            path: ':projectId/settings',
            element: (
              <ProtectedRoute>
                <ProjectSettings />
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
