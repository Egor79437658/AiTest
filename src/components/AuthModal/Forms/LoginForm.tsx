import React from 'react'
import { LoginFormData, FormDataToRecord, PartialFormData } from '@interfaces/'
import { AuthForm } from './AuthForm'
import styles from '../AuthModal.module.scss'
interface LoginFormProps {
  formData: LoginFormData
  error: string
  isLoading: boolean
  onChange: (data: Partial<LoginFormData>) => void
  onSubmit: (e: React.FormEvent) => void
  onSwitchToRegister: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  error,
  isLoading,
  onChange,
  onSubmit,
  onSwitchToRegister,
}) => {
  const fields = [
    {
      name: 'email',
      // label: 'E-mail',
      type: 'email',
      placeholder: 'E-mail',
      required: true,
    },
    {
      name: 'password',
      // label: 'Пароль',
      type: 'password',
      placeholder: 'Пароль',
      required: true,
    },
  ]

  const footerContent = (
    <p>
      Нет аккаунта?{' '}
      <button
        type="button"
        className={styles.authLinkButton}
        onClick={onSwitchToRegister}
      >
        Зарегистрироваться
      </button>
    </p>
  )

  const handleFormChange = (data: PartialFormData<LoginFormData>) => {
    onChange(data as Partial<LoginFormData>)
  }

  return (
    <AuthForm
      fields={fields}
      formData={formData as FormDataToRecord<LoginFormData>}
      error={error}
      isLoading={isLoading}
      submitText="Вход"
      loadingText="Вход..."
      footerContent={footerContent}
      onChange={handleFormChange}
      onSubmit={onSubmit}
    />
  )
}
