import React, { useEffect } from 'react'
import { useAuthStore } from '@stores/'
import { useUserStore } from '@stores/'
import { authApi } from '@api'
import { AuthContext } from './AuthContext'
import { AuthModalType, AuthContextType } from '@interfaces/'
import { MOCK_MODE } from '@constants/'
import { mockApiService } from '../../services/mockApiService'
import { useNavigate } from 'react-router-dom'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    accessToken,
    authModal,
    pendingEmail,
    pendingPhone,
    isLoading,
    setTokens,
    setAuthModal,
    setPendingEmail,
    setPendingPhone,
    setLoading,
    logout: storeLogout,
  } = useAuthStore()

  const { setUser, clearUser } = useUserStore()
  const { onConfirmAction, setOnConfirmAction } = useAuthStore()

  useEffect(() => {
    if (accessToken) {
      // in prod check token expires
      const timer = setTimeout(() => {
        // in prod there will be auto-logout
      }, 3600000)

      return () => clearTimeout(timer)
    }
  }, [accessToken, storeLogout, clearUser])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)

      let result
      if (MOCK_MODE) {
        result = await mockApiService.login({ email, password })
      } else {
        result = await authApi.login({ email, password })
      }

      const { user: userData, accessToken, refreshToken } = result

      if (!userData.profileData.emailConfirmed) {
        setOnConfirmAction((type) => {
          setTokens(accessToken, refreshToken)
          setUser(userData)
        })
        openAuthModal('confirmEmail', userData.profileData.email)
      } else {
        setTokens(accessToken, refreshToken)
        setUser(userData)
        closeAuthModal('login')
      }

      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setLoading(true)

      let result
      if (MOCK_MODE) {
        result = await mockApiService.register({ username, email, password })
      } else {
        result = await authApi.register({ username, email, password })
      }

      const { user: userData, accessToken, refreshToken } = result

      setOnConfirmAction((type) => {
        setTokens(accessToken, refreshToken)
        setUser(userData)
      })
      openAuthModal('confirmEmail', email)
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const confirmPending = async (
    code: string,
    type: 'phone' | 'email'
  ): Promise<boolean> => {
    try {
      setLoading(true)

      let result
      if (MOCK_MODE) {
        if (type === 'email') {
          result = await mockApiService.confirmEmail({
            email: pendingEmail,
            code,
          })
        } else {
          result = await mockApiService.confirmPhone({
            phone: pendingPhone,
            code,
          })
        }
      } else {
        if (type === 'email') {
          result = await authApi.confirmEmail({
            email: pendingEmail,
            code,
          })
        } else {
          result = await authApi.confirmPhone({
            phone: pendingPhone,
            code,
          })
        }
      }

      if (result.success) {
        onConfirmAction(type)

        return true
      }

      return false
    } catch (error) {
      console.error('Confirmation failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = (): void => {
    if (MOCK_MODE) {
      mockApiService.logout()
    }
    storeLogout()
    clearUser()
  }

  const openAuthModal = (type: AuthModalType, value: string = ''): void => {
    setAuthModal(type)
    if (type === 'confirmEmail') {
      setPendingEmail(value)
    } else if (type === 'confirmPhone') {
      setPendingPhone(value)
    }
  }

  const closeAuthModal = (type: AuthModalType): void => {
    setAuthModal(null)
    if (type === 'confirmEmail') {
      setPendingEmail('')
    } else if (type === 'confirmPhone') {
      setPendingPhone('')
    }
  }

  const value: AuthContextType = {
    isAuthenticated: !!accessToken,
    authModal,
    pendingEmail,
    pendingPhone,
    isLoading,
    login,
    register,
    confirmPending,
    logout,
    openAuthModal,
    closeAuthModal,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
