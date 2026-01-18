import React from 'react'
import { ChangePasswordFormData } from '@interfaces/'
import styles from '../AuthModal.module.scss'

interface ChangePasswordFormProps {
  formData: ChangePasswordFormData
  error: string
  isLoading: boolean
  onChange: (data: Partial<ChangePasswordFormData>) => void
  onSubmit: (e: React.FormEvent) => void
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  formData,
  error,
  isLoading,
  onChange,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const nativeEvent = e.nativeEvent as Event
    if (nativeEvent) {
      nativeEvent.preventDefault()
      nativeEvent.stopPropagation()
      if (nativeEvent.stopImmediatePropagation) {
        nativeEvent.stopImmediatePropagation()
      }
    }
    
    const form = e.currentTarget.closest('form')
    if (form) {
      (form as HTMLFormElement).submit = () => false
    }
    
    onSubmit(e)
    
    return false
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      handleSubmit(e as any)
    }
  }

  return (
    <div className={styles.authForm} onKeyDown={handleKeyDown}>
      <div className={styles.authFormGroup}>
        <input
          type="password"
          placeholder="Старый пароль"
          value={formData.oldPassword}
          onChange={(e) => onChange({ oldPassword: e.target.value })}
          onKeyDown={handleKeyDown}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className={styles.authFormGroup}>
        <input
          type="password"
          placeholder="Новый пароль (минимум 6 символов)"
          value={formData.newPassword}
          onChange={(e) => onChange({ newPassword: e.target.value })}
          onKeyDown={handleKeyDown}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className={styles.authFormGroup}>
        <input
          type="password"
          placeholder="Подтвердите новый пароль"
          value={formData.confirmPassword}
          onChange={(e) => onChange({ confirmPassword: e.target.value })}
          onKeyDown={handleKeyDown}
          required
          disabled={isLoading}
        />
      </div>
      
      {error && (
        <div className={
          error.includes('успешно') || error === 'Пароль успешно изменен!' 
            ? styles.success 
            : styles.authErrorMessage
        }>
          {error}
        </div>
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: '25px'
      }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={styles.authSubmitButton}
          style={{
            minWidth: '200px',
            padding: '12px 24px',
            margin: '0 auto'
          }}
        >
          {isLoading ? 'Смена пароля...' : 'Сменить пароль'}
        </button>
      </div>
    </div>
  )
}