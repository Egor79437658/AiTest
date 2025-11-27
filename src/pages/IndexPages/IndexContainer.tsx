import type React from 'react'
import { useAuth } from '@contexts/'
import styles from './styles/IndexContainer.module.scss'
import { Pipeline } from '@components/'

export const IndexContainer: React.FC = () => {
  const { openAuthModal, isAuthenticated } = useAuth()

  return (
    <>
      <Pipeline />
      <div className={styles.pageContainer}>
        <div className={styles.pageUp}>
          <p>Регистрация</p>
          {!isAuthenticated && (
            <button
              onClick={() => openAuthModal('register')}
              className={styles.registerButton}
            >
              Зарегистрироваться
            </button>
          )}
        </div>
        <div className={styles.pageDown}>
          <p>
            Для тестирования используйте:
            <br />
            • Email: test@test.com, Пароль: password123 (подтвержденный аккаунт)
            <br />
            • Email: demo@demo.com, Пароль: demo123 (неподтвержденный аккаунт)
            <br />• Код подтверждения: 123456
          </p>
        </div>
      </div>
    </>
  )
}
