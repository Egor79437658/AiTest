import React, { useState, useEffect } from 'react'
import { User, AuthModalType, AuthContextType } from '@types/'
import { AuthContext } from './AuthContext'

interface mockUser extends User {
  password: string
}

const mockUsers: mockUser[] = [
  {
    id: '1',
    profileData: {
      status: 'active',
      username: 'testuser',
      firstName: 'name',
      lastName: 'lastName',
      fatherName: 'fatherName',
      email: 'test@test.com',
      phone: '+79217990312',
      phoneConfirmed: true,
      emailConfirmed: true,
      country: 'Country1',
      city: 'City1',
      company: 'company1',
      employeeCount: '11-30',
      jobPosition: 'job1',
      usePurpose: 'testCompany',
      teams: [{ name: 'team1', role: 'role1' }],
    },
    financeData: {
      balance: 123,
      subscription: 1,
    },
    settingsData: {
      language: "ru",
      theme: "light",
      name: true,
      email: false,
      phone: false,
      country: true,
      city: true,
      company: true,
      jobPosition: false,
      teams: [true, false]
    },
    projectData: {
      projects: [{ name: 'project1' }, { name: 'project1' }],
    },
    isAdmin: true,
    password: 'password123',
  },
  {
    id: '2',
    profileData: {
      status: 'active',
      username: 'demo',
      firstName: 'demo',
      lastName: 'lastName',
      fatherName: 'fatherName',
      email: 'demo@demo.com',
      phone: '+79217990312',
      phoneConfirmed: false,
      emailConfirmed: false,
      country: 'Country1',
      city: 'City1',
      company: null,
      employeeCount: null,
      jobPosition: null,
      usePurpose: 'personal',
      teams: [{ name: 'team1', role: 'role1' }],
    },
    financeData: {
      balance: 456,
      subscription: 0,
    },
    settingsData: {
      language: "ru",
      theme: "light",
      name: true,
      email: false,
      phone: false,
      country: true,
      city: true,
      company: null,
      jobPosition: null,
      teams: [true, false]
    },
    projectData: {
      projects: [{ name: 'project4' }, { name: 'project3' }],
    },
    isAdmin: false,
    password: 'demo123',
  },
]

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [authModal, setAuthModal] = useState<AuthModalType>(null)
  const [pendingEmail, setPendingEmail] = useState('')
  const [pendingPhone, setPendingPhone] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const updateUser = (user: User) => {
    setUser(user)
    // console.log(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(
      (u) => u.profileData.email === email && u.password === password
    )

    if (foundUser) {
      const userData: User = { ...foundUser }

      setUser(userData)
      localStorage.setItem('currentUser', JSON.stringify(userData))

      if (!foundUser.profileData.emailConfirmed) {
        openAuthModal('confirmEmail', foundUser.profileData.email)
      } else {
        closeAuthModal('login')
      }
      return true
    }

    return false
  }

  const register = async (
    username: string,
    email: string
  ): Promise<boolean> => {
    const userExists = mockUsers.some((u) => u.profileData.email === email)
    if (userExists) {
      return false
    }

    openAuthModal('confirmEmail', email)
    return true
  }

  const confirmPending = async (
    code: string,
    type: 'phone' | 'email'
  ): Promise<boolean> => {
    if (type === 'phone') {
      if (code === '123456') {
        if (user) {
          const updatedUser: User = { ...user}
          user.profileData.phoneConfirmed = true
          setUser(updatedUser)
          localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        }
        closeAuthModal('confirmPhone')
        return true
      }

      return false
    } else {
      if (code === '123456') {
        if (user) {
          const updatedUser: User = { ...user}
          updatedUser.profileData.emailConfirmed = true
          setUser(updatedUser)
          localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        }
        closeAuthModal('confirmEmail')
        return true
      }

      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const openAuthModal = (type: AuthModalType, value: string = '') => {
    setAuthModal(type)
    if (type == 'confirmEmail') {
      setPendingEmail(value)
    } else if (type == 'confirmPhone') {
      setPendingPhone(value)
    }
  }

  const closeAuthModal = (type: AuthModalType) => {
    setAuthModal(null)
    if (type == 'confirmEmail') {
      setPendingEmail('')
    } else if (type == 'confirmPhone') {
      setPendingPhone('')
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
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
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
