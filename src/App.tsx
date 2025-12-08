import { Layout, MockInfo, ProtectedRoute } from '@components/'
import { AuthProvider, UserProvider, SidebarProvider } from '@contexts/'
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
import { useEffect } from 'react'

const router = createBrowserRouter([
  {
    path: PAGE_ENDPOINTS.INDEX,
    element: <IndexPage/>,
  },
  {
    // path: '/',
    path: PAGE_ENDPOINTS.OUTLET,
    element: <Layout />,
    children: [
      // {
      //   path: PAGE_ENDPOINTS.INDEX,
      //   element: (
      //     <ProtectedRoute requireAuth={false}>
      //       <IndexContainer />
      //     </ProtectedRoute>
      //   ),
      // },
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
        path: PAGE_ENDPOINTS.PROJECT+'/new',
        element: (
          <ProtectedRoute>
            <NewProjectContainer />
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
  useEffect(() => {
    console.log('Токен в localStorage:', localStorage.getItem('auth-storage'))
    console.log(
      'ID пользователя в localStorage:',
      localStorage.getItem('mock_user_id')
    )
  }, [])
  return (
    <AuthProvider>
      <UserProvider>
        <SidebarProvider>
          {/* <MockInfo /> */}
          <RouterProvider router={router} />
        </SidebarProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
