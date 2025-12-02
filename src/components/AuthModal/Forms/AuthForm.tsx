import React from 'react'
import { FormDataToRecord } from '@interfaces/'
import styles from '../AuthModal.module.scss'
interface FormField {
  name: string
  label?: string
  type: string
  placeholder?: string
  required?: boolean
  maxLength?: number
  transformValue?: (value: string) => string
}

interface AuthFormProps<T> {
  fields: FormField[]
  formData: FormDataToRecord<T>
  error: string
  isLoading: boolean
  submitText: string
  loadingText: string
  footerContent: React.ReactNode
  onChange: (data: Partial<FormDataToRecord<T>>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function AuthForm<T extends Record<string, unknown>>({
  fields,
  formData,
  error,
  isLoading,
  submitText,
  loadingText,
  footerContent,
  onChange,
  onSubmit,
}: AuthFormProps<T>): React.ReactElement {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const fieldConfig = fields.find((field) => field.name === name)

    const transformedValue = fieldConfig?.transformValue
      ? fieldConfig.transformValue(value)
      : value

    onChange({ [name]: transformedValue } as Partial<FormDataToRecord<T>>)
  }

  return (
    <>
      <form onSubmit={onSubmit} className={styles.authForm}>
        {fields.map((field) => (
          <div key={field.name} className={styles.authFormGroup}>
            {field.label && (
              <label htmlFor={field.name} className={styles.label}>
                {field.label}
              </label>
            )}
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name as keyof FormDataToRecord<T>] || ''}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isLoading}
              maxLength={field.maxLength}
            />
          </div>
        ))}

        {error && <div className={styles.authErrorMessage}>{error}</div>}

        <div style={{textAlign: "center"}}>
          <button
            type="submit"
            className={styles.authSubmitButton}
            disabled={isLoading}
          >
            {isLoading ? loadingText : submitText}
          </button>
        </div>
      </form>

      <div className={styles.authModalFooter}>{footerContent}</div>
    </>
  )
}
