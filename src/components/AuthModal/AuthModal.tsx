import { useAuth } from '@contexts/'
import { ConfirmFormData, LoginFormData, RegisterFormData } from '@types/'
import React, { useState } from 'react'
import { ConfirmForm, LoginForm, RegisterForm } from './Forms/'

import styles from './AuthModal.module.scss'

export const AuthModal: React.FC = () => {
  const {
    authModal,
    closeAuthModal,
    login,
    register,
    confirmPending,
    pendingEmail,
    pendingPhone,
    openAuthModal,
  } = useAuth()

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
  })

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [confirmData, setConfirmData] = useState<ConfirmFormData>({
    code: '',
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const resetForms = () => {
    setLoginData({ email: '', password: '' })
    setRegisterData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
    setConfirmData({ code: '' })
    setError('')
  }

  const handleClose = () => {
    resetForms()
    closeAuthModal(authModal)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const switchToLogin = () => {
    resetForms()
    openAuthModal('login')
  }

  const switchToRegister = () => {
    resetForms()
    openAuthModal('register')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(loginData.email, loginData.password)
      if (!success) {
        setError('Неверный email или пароль')
      }
    } catch {
      setError('Ошибка при входе')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (registerData.password !== registerData.confirmPassword) {
      setError('Пароли не совпадают')
      setIsLoading(false)
      return
    }

    if (registerData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      setIsLoading(false)
      return
    }

    try {
      const success = await register(
        registerData.username,
        registerData.email,
        registerData.password
      )
      if (!success) {
        setError('Пользователь с таким email уже существует')
      }
    } catch {
      setError('Ошибка при регистрации')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (confirmData.code.length !== 6) {
      setError('Код должен содержать 6 символов')
      setIsLoading(false)
      return
    }

    try {
      const success = await confirmPending(
        confirmData.code,
        authModal === 'confirmPhone' ? 'phone' : 'email'
      )
      if (!success) {
        setError('Неверный код подтверждения')
      }
    } catch {
      setError('Ошибка при подтверждении')
    } finally {
      setIsLoading(false)
    }
  }

  const getModalTitle = () => {
    switch (authModal) {
      case 'login':
        return 'Вход'
      case 'register':
        return 'Регистрация'
      case 'confirmEmail':
        return 'Подтверждение e-mail'
      case 'confirmPhone':
        return 'Подтверждение номера'
      default:
        return ''
    }
  }

  return (
    <div
      className={`${styles.authModalOverlay} ${authModal ? styles.active : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={styles.authModalContent}>
        <div className={styles.authModalHeader}>
          <h2>{getModalTitle()}</h2>
          <button className={styles.authCloseButton} onClick={handleClose}>
            ×
          </button>
        </div>

        {authModal === 'login' && (
          <LoginForm
            formData={loginData}
            error={error}
            isLoading={isLoading}
            onChange={(data) => setLoginData((prev) => ({ ...prev, ...data }))}
            onSubmit={handleLogin}
            onSwitchToRegister={switchToRegister}
          />
        )}

        {authModal === 'register' && (
          <RegisterForm
            formData={registerData}
            error={error}
            isLoading={isLoading}
            onChange={(data) =>
              setRegisterData((prev) => ({ ...prev, ...data }))
            }
            onSubmit={handleRegister}
            onSwitchToLogin={switchToLogin}
          />
        )}

        {(authModal === 'confirmEmail' || authModal === 'confirmPhone') && (
          <ConfirmForm
            confirmType={authModal === 'confirmPhone' ? 'phone' : 'email'}
            formData={confirmData}
            error={error}
            isLoading={isLoading}
            pendingValue={
              authModal === 'confirmPhone' ? pendingPhone : pendingEmail
            }
            onChange={(data) =>
              setConfirmData((prev) => ({ ...prev, ...data }))
            }
            onSubmit={handleConfirm}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </div>
    </div>
  )
}
