import React from 'react'
import {
  RegisterFormData,
  FormDataToRecord,
  PartialFormData,
} from '@interfaces/'
import { AuthForm } from './AuthForm'
import styles from '../AuthModal.module.scss'
interface RegisterFormProps {
  formData: RegisterFormData
  error: string
  isLoading: boolean
  onChange: (data: Partial<RegisterFormData>) => void
  onSubmit: (e: React.FormEvent) => void
  onSwitchToLogin: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  error,
  isLoading,
  onChange,
  onSubmit,
  onSwitchToLogin,
}) => {
  const fields = [
    {
      name: 'username',
      // label: 'User name',
      placeholder: "username",
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      placeholder: 'E-mail',
      type: 'email',
      required: true,
    },
    {
      name: 'password',
      placeholder: 'Пароль',
      type: 'password',
      required: true,
    },
    {
      name: 'confirmPassword',
      placeholder: 'Подтверждение пароля',
      type: 'password',
      required: true,
    },
  ]

  const footerContent = (
    <p>
      Уже есть аккаунт?{' '}
      <button
        type="button"
        className={styles.authLinkButton}
        onClick={onSwitchToLogin}
      >
        Войти
      </button>
    </p>
  )

  const handleFormChange = (data: PartialFormData<RegisterFormData>) => {
    onChange(data as Partial<RegisterFormData>)
  }

  return (
    <AuthForm
      fields={fields}
      formData={formData as FormDataToRecord<RegisterFormData>}
      error={error}
      isLoading={isLoading}
      submitText="Зарегистрироваться"
      loadingText="Регистрация..."
      footerContent={footerContent}
      onChange={handleFormChange}
      onSubmit={onSubmit}
    />
  )
}
