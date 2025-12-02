import React from 'react'
import {
  ConfirmFormData,
  FormDataToRecord,
  PartialFormData,
} from '@interfaces/'
import { AuthForm } from './AuthForm'
import styles from '../AuthModal.module.scss'
interface ConfirmFormProps {
  formData: ConfirmFormData
  error: string
  confirmType: 'phone' | 'email'
  isLoading: boolean
  pendingValue: string
  onChange: (data: Partial<ConfirmFormData>) => void
  onSubmit: (e: React.FormEvent) => void
  onSwitchToLogin: () => void
}

export const ConfirmForm: React.FC<ConfirmFormProps> = ({
  formData,
  error,
  confirmType,
  isLoading,
  pendingValue,
  onChange,
  onSubmit,
  onSwitchToLogin,
}) => {
  const fields = [
    {
      name: 'code',
      // label: `Код из ${confirmType == 'phone' ? 'sms' : 'e-mail'}`,
      type: 'text',
      placeholder: 'Введите 6-значный код',
      required: true,
      maxLength: 6,
      transformValue: (value: string) => value.replace(/\D/g, '').slice(0, 6),
    },
  ]

  const resendCode = () => {
    if (confirmType == 'phone') {
      console.log('Resend sms')
    } else {
      console.log('Reset email')
    }
  }

  const footerContent = (
    <>
      <p>
        Не получили код?{' '}
        <button
          type="button"
          className={styles.authLinkButton}
          onClick={resendCode}
        >
          Отправить повторно
        </button>
      </p>
      {/* <button
        type="button"
        className="authLinkButton"
        onClick={onSwitchToLogin}
      >
        Вернуться к входу
      </button> */}
    </>
  )

  const handleFormChange = (data: PartialFormData<ConfirmFormData>) => {
    onChange(data as Partial<ConfirmFormData>)
  }

  return (
    <>
      <AuthForm
        fields={fields}
        formData={formData as FormDataToRecord<ConfirmFormData>}
        error={error}
        isLoading={isLoading}
        submitText="Подтвердить"
        loadingText="Подтверждение..."
        footerContent={footerContent}
        onChange={handleFormChange}
        onSubmit={onSubmit}
      />

      {pendingValue && (
        <div className={styles.authEmailNotice}>
          Код отправлен на: <strong>{pendingValue}</strong>
          <br />
          <small>
            Для демо используйте код: <strong>123456</strong>
          </small>
        </div>
      )}
    </>
  )
}
