import type React from 'react'
import { useSidebar, useAuth } from '@contexts/'
import { MenuButton } from '@components/'
import styles from './Header.module.scss'
import { useState } from 'react'
import { PAGE_ENDPOINTS } from '@constants/'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  actionText?: string
  actionLink?: string
}

export const Header: React.FC<HeaderProps> = () => {
  const { toggleSidebar } = useSidebar()
  const { user, isAuthenticated, logout, openAuthModal } = useAuth()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [timeoutID, setTimeOutId] = useState<number>()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <MenuButton onClick={toggleSidebar} />
      </div>
      <div className={styles.headerMid}>
        <div className={styles.inputUrl}>
          <label htmlFor="url">URL:</label>
          <input id="url" type="text" className={styles.url} />
        </div>
        <div className={styles.inputsLow}>
          <div className={styles.inputLow}>
            <label htmlFor="login">Login:</label>
            <input id="login" type="text" className={styles.login} />
          </div>
          <div className={styles.inputLow}>
            <label htmlFor="password">Password: </label>
            <input id="password" type="text" className={styles.password} />
          </div>
        </div>
      </div>
      <div className={styles.headerRight}>
        {isAuthenticated && (
          <>
            <span className={styles.userGreeting}>
              Привет, {user?.profileData?.username || 'Пользователь'}{' '}
            </span>
            <button onClick={handleLogout} className={styles.headerAction}>
              Выйти
            </button>
          </>
        )}
        <button
          className={`${styles.headerAction} ${isAuthenticated ? styles.openDropdownBtn : ''}`}
          onClick={() => {
            if (isAuthenticated) {
              setOpenDropdown(!openDropdown)
            } else {
              openAuthModal('login')
            }
          }}
          onMouseEnter={() => {
            clearTimeout(timeoutID)
          }}
          onMouseLeave={() => {
            setTimeOutId(
              setTimeout(() => {
                setOpenDropdown(false)
              }, 250)
            )
          }}
        >
          {isAuthenticated
            ? `Личный кабинет ${openDropdown ? '▼' : '▶'}`
            : 'Войти'}
        </button>
        <div
          className={`${styles.dropdownDiv} ${openDropdown ? '' : styles.hidden}`}
          onMouseEnter={() => {
            clearTimeout(timeoutID)
          }}
          onMouseLeave={() => {
            setTimeOutId(
              setTimeout(() => {
                setOpenDropdown(false)
              }, 250)
            )
          }}
        >
          <button
            className={styles.headerAction}
            onClick={() =>
              navigate(`${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${PAGE_ENDPOINTS.ACCOUNT.PROFILE}`)
            }
          >
            Профиль
          </button>
          <button
            className={styles.headerAction}
            onClick={() =>
              navigate(`${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${PAGE_ENDPOINTS.ACCOUNT.FINANCES}`)
            }
          >
            Финансы
          </button>
          <button
            className={styles.headerAction}
            onClick={() =>
              navigate(`${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${PAGE_ENDPOINTS.ACCOUNT.SETTINGS}`)
            }
          >
            Настройки
          </button>
        </div>
      </div>
    </div>
  )
}