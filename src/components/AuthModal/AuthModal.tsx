import { useAuth, useProject } from '@contexts/'
import { ConfirmFormData, LoginFormData, RegisterFormData, ChangePasswordFormData } from '@interfaces/'
import React, { useState } from 'react'
import { ConfirmForm, LoginForm, RegisterForm, ChangePasswordForm } from './Forms/'

import styles from './AuthModal.module.scss'
import { useNavigate } from 'react-router-dom'
import { PAGE_ENDPOINTS } from '@constants/'

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
    changePassword,
  } = useAuth()
  const { loadShortProjects } = useProject()
  const navigate = useNavigate()

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

  const [changePasswordData, setChangePasswordData] = useState<ChangePasswordFormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
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
    setChangePasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
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
      else {
        loadShortProjects()
        navigate(`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.HOME}`)
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
      else {
        closeAuthModal(authModal)
        if(window.location.pathname === PAGE_ENDPOINTS.INDEX) {
          loadShortProjects()
          navigate(`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.HOME}`)
        }
      }
    } catch {
      setError('Ошибка при подтверждении')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const nativeEvent = e.nativeEvent as Event;
    if (nativeEvent) {
      nativeEvent.preventDefault();
      nativeEvent.stopPropagation();
      if (nativeEvent.stopImmediatePropagation) {
        nativeEvent.stopImmediatePropagation();
      }
    }
    
    setIsLoading(true);
    setError('');

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setError('Новый пароль и подтверждение не совпадают');
      setIsLoading(false);
      return false;
    }

    if (changePasswordData.newPassword.length < 6) {
      setError('Новый пароль должен содержать минимум 6 символов');
      setIsLoading(false);
      return false;
    }

    if (!changePasswordData.oldPassword.trim()) {
      setError('Введите старый пароль');
      setIsLoading(false);
      return false;
    }

    if (!changePasswordData.newPassword.trim()) {
      setError('Введите новый пароль');
      setIsLoading(false);
      return false;
    }

    try {
      const success = await changePassword(
        changePasswordData.oldPassword,
        changePasswordData.newPassword
      );
      
      if (!success) {
        setError('Старый пароль неверен');
      } else {
        setError('Пароль успешно изменен!');
        
        setTimeout(() => {
          closeAuthModal(authModal);
          setChangePasswordData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          setError('');
        }, 1500);
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка при смене пароля');
    } finally {
      setIsLoading(false);
    }
    
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && authModal === 'changePassword') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

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
      case 'changePassword':
        return 'Смена пароля'
      default:
        return ''
    }
  }

  return (
    <div
      className={`${styles.authModalOverlay} ${authModal ? styles.active : ''}`}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.authModalContent}>
        <div className={styles.authModalHeader}>
          <h2>{getModalTitle()}</h2>
          {/* <button className={styles.authCloseButton} onClick={handleClose}>
            ×
          </button> */}
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

        {authModal === 'changePassword' && (
          <div onKeyDown={handleKeyDown} style={{marginBottom: "auto"}}>
            <ChangePasswordForm
              formData={changePasswordData}
              error={error}
              isLoading={isLoading}
              onChange={(data) => setChangePasswordData((prev) => ({ ...prev, ...data }))}
              onSubmit={handleChangePassword}
            />
          </div>
        )}
      </div>
    </div>
  )
}