import type React from 'react'
import { useAuth, useUser } from '@contexts/'
import { useState } from 'react'
import { PAGE_ENDPOINTS } from '@constants/'
import { useNavigate, useLocation } from 'react-router-dom'
import { useHeaderStore } from '@stores/'
import styles from './Header.module.scss'

interface HeaderProps {
  actionText?: string
  actionLink?: string
}

export const Header: React.FC<HeaderProps> = () => {
  const { user } = useUser()
  const { isAuthenticated, logout, openAuthModal } = useAuth()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [timeoutID, setTimeOutId] = useState<number>()
  const { headerContent } = useHeaderStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <img
          src="/images/logo_light.png"
          alt="YAMP logo"
          onClick={() => navigate('/')}
        ></img>
      </div>
      <div className={styles.headerMid}>{headerContent}</div>
      {isAuthenticated && (
        <>
          <span className={styles.userGreeting}>
            Привет, {user?.profileData?.username || 'Пользователь'}{' '}
          </span>
        </>
      )}
      <div className={styles.headerRight}>
        <button
          className={`${styles.headerAction} ${styles.openDropdownBtn}`}
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
          Личный кабинет &nbsp;&nbsp;&nbsp;{' '}
          <span className={openDropdown ? styles.rotated : ''}>▶</span>
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
          {[
            {
              text: 'Профиль',
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${PAGE_ENDPOINTS.ACCOUNT.PROFILE}`,
            },
            {
              text: 'Финансы',
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${PAGE_ENDPOINTS.ACCOUNT.FINANCES}`,
            },
            {
              text: 'Настройки',
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${PAGE_ENDPOINTS.ACCOUNT.SETTINGS}`,
            },
          ].map((el) => (
            <button
              className={`${styles.headerAction} ${location.pathname === el.link ? styles.selected : ""}`}
              onClick={() => navigate(el.link)}
            >
              {el.text}
            </button>
          ))}
          <button onClick={handleLogout} className={styles.headerAction}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
}
