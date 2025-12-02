import type React from 'react'
import { useAuth } from '@contexts/'
import styles from './styles/IndexContainer.module.scss'
import { Pipeline } from '@components/'
import { useHeaderStore } from '@stores/'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export const IndexContainer: React.FC = () => {
  const { openAuthModal, isAuthenticated } = useAuth()
  const { setHeaderContent } = useHeaderStore()

  useEffect(
    () =>
      setHeaderContent(
        <div className={styles.longridNavLinks}>
          <Link to="/">Продукы</Link>
          <Link to="/">Инновации</Link>
          <Link to="/">Цены</Link>
          <Link to="/">Документация</Link>
        </div>
      ),
    [setHeaderContent]
  )
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
            • Email: demo@demo.com, Пароль: password123 (неподтвержденный
            аккаунт)
            <br />• Код подтверждения: 123456
          </p>
        </div>
      </div>
    </>
  )
}
