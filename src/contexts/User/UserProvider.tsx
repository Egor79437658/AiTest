import React, { useEffect, useState } from 'react'
import { useUserStore, useAuthStore } from '@stores/'
import { authApi, usersApi } from '@api'
import { UserContext } from './UserContext'
import { MOCK_MODE } from '@constants/'
import { UserContextType } from '@interfaces/'
import { mockApiService } from '../../services/mockApiService'
import { UpdateProfileData, UpdateSettingsData } from '../../api/users'

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, setUser, updateUser, setLoading, setError, clearUser } =
    useUserStore()
  const { accessToken } = useAuthStore()
  const [isInitializing, setIsInitializing] = useState(false)

  const initializeUser = async () => {
      if (accessToken) {
        try {
          setIsInitializing(true)
          let userData

          if (MOCK_MODE) {
            userData = await mockApiService.getCurrentUser()
          } else {
            userData = await usersApi.getCurrentUser()
          }

          setUser(userData)
        } catch (error) {
          console.error('Failed to load user data:', error)
          setError('Не удалось загрузить данные пользователя')
        } finally {
          setIsInitializing(false)
        }
      } else {
        if (user) {
          clearUser()
        }
      }
    }

  // if (accessToken && useUserStore.getState().isLoading && !user) {
  //   return (
  //     <div
  //       style={{
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         height: '100vh',
  //       }}
  //     >
  //       <div>Загрузка данных пользователя...</div>
  //     </div>
  //   )
  // }

  const refreshUser = async (): Promise<void> => {
    if (!user) return

    try {
      setLoading(true)
      let userData

      if (MOCK_MODE) {
        userData = await mockApiService.getCurrentUser()
      } else {
        userData = await usersApi.getCurrentUser()
      }

      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user data:', error)
      setError('Не удалось обновить данные пользователя')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getUserProfile = async (userId: number) => {
    try {
      setLoading(true)
      let profile

      if (MOCK_MODE) {
        profile = await mockApiService.getUserProfile(userId)
      } else {
        profile = await usersApi.getUserProfile(userId)
      }

      return profile
    } catch (error) {
      console.error('Failed to refresh user data:', error)
      setError('Не удалось получить данные профиля пользователя')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (
    profileData: UpdateProfileData
  ): Promise<void> => {
    if (!user) return
    try {
      setLoading(true)
      let updatedUser

      if (MOCK_MODE) {
        updatedUser = await mockApiService.updateUserProfile(
          user.id,
          profileData
        )
      } else {
        updatedUser = await usersApi.updateMyProfile(profileData)
      }

      setUser(
        {...user, 
          profileData: {
            ...user.profileData, 
            ...updatedUser.profileData
          },
        })
    } catch (error) {
      console.error('Failed to update user profile:', error)
      setError('Не удалось обновить профиль')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUserSettings = async (
    settingsData: UpdateSettingsData
  ): Promise<void> => {
    if (!user) return

    try {
      setLoading(true)
      let updatedUser

      if (MOCK_MODE) {
        updatedUser = await mockApiService.updateUserSettings(
          user.id,
          settingsData
        )
      } else {
        updatedUser = await usersApi.updateMySettings(settingsData)
      }

      setUser(
        {...user, 
          settingsData: {
            ...user.settingsData, 
            ...updatedUser.settingsData
          },
        })
    } catch (error) {
      console.error('Failed to update user settings:', error)
      setError('Не удалось обновить настройки')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUserConfirmation = async (
    type: 'email' | 'phone'
  ): Promise<void> => {
    if (!user) return

    try {
      updateUser({
        profileData: {
          ...user.profileData,
          [`${type}Confirmed`]: true,
        },
      })
    } catch (error) {
      console.error('Failed to update user confirmation:', error)
      setError('Не удалось обновить подтверждение')
      throw error
    }
  }

  const deleteMyAccount = async () => {
    let response;
      if (MOCK_MODE) {
        response = await mockApiService.deleteMyAccount()
      } else {
        response = await usersApi.deleteMyAccount()
      }
      return response
  }

  const clearError = (): void => {
    setError(null)
  }

  const value: UserContextType = {
    user: user,
    isLoading: useUserStore.getState().isLoading,
    error: useUserStore.getState().error,
    isInitializing,
    refreshUser,
    updateUserProfile,
    updateUserSettings,
    updateUserConfirmation,
    clearError,
    clearUser,
    getUserProfile: getUserProfile,
    deleteMyAccount,
    initializeUser
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
