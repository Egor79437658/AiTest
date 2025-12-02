import type React from 'react'
import { useSidebar, useAuth, useUser } from '@contexts/'
import { MenuButton } from '@components/'
import { useState } from 'react'
import { PAGE_ENDPOINTS } from '@constants/'
import { useNavigate } from 'react-router-dom'
import { useHeaderStore } from '@stores/'
import styles from './Header.module.scss'

interface HeaderProps {
  actionText?: string
  actionLink?: string
}

export const Header: React.FC<HeaderProps> = () => {
  const { toggleSidebar } = useSidebar()
  const {user } = useUser() 
  const { isAuthenticated, logout, openAuthModal } = useAuth()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [timeoutID, setTimeOutId] = useState<number>()
  const {headerContent} = useHeaderStore()
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
        {headerContent}
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
              navigate(`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${PAGE_ENDPOINTS.ACCOUNT.PROFILE}`)
            }
          >
            Профиль
          </button>
          <button
            className={styles.headerAction}
            onClick={() =>
              navigate(`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${PAGE_ENDPOINTS.ACCOUNT.FINANCES}`)
            }
          >
            Финансы
          </button>
          <button
            className={styles.headerAction}
            onClick={() =>
              navigate(`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${PAGE_ENDPOINTS.ACCOUNT.SETTINGS}`)
            }
          >
            Настройки
          </button>
        </div>
      </div>
    </div>
  )
}