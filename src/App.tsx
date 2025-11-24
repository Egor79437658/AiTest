import { Layout, ProtectedRoute } from '@components/'
import { AuthProvider, SidebarProvider } from '@contexts/'
import { HelmetProvider } from 'react-helmet-async'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { PAGE_ENDPOINTS } from './constants'
import {
  FinanceTab,
  HomeContainer,
  IndexContainer,
  PersonalAccountLayout,
  ProfileTab,
  ProjectContainer,
  SettingsTab,
} from './pages'

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: PAGE_ENDPOINTS.INDEX,
        element: (
          <ProtectedRoute requireAuth={false}>
            <IndexContainer />
          </ProtectedRoute>
        ),
      },
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
        element: (
          <ProtectedRoute>
            <ProjectContainer />
          </ProtectedRoute>
        ),
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
            element: <ProfileTab/>
          },
          {
            path: PAGE_ENDPOINTS.ACCOUNT.FINANCES,
            element: <FinanceTab/>
          },
          {
            path: PAGE_ENDPOINTS.ACCOUNT.SETTINGS,
            element: <SettingsTab/>
          }
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
    <HelmetProvider>
      <AuthProvider>
        <SidebarProvider>
          <RouterProvider router={router} />
        </SidebarProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
