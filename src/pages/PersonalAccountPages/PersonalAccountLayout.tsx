import { Pipeline, Tabs } from '@components/'
import type React from 'react'
import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import styles from './styles/Account.module.scss'
import { PAGE_ENDPOINTS } from '@constants/'

export const PersonalAccountLayout: React.FC = () => {
  const tabs = [
    { id: 'profile', label: 'Профиль' },
    { id: 'finances', label: 'Финансы' },
    { id: 'settings', label: 'Настройки' },
  ]

  const navigate = useNavigate()
  const location = useLocation()
  
  const [activeTab, setActiveTab] = useState(
    location.pathname.split('/')[2]
  )

  return (
    <>
      <Pipeline>
        <Tabs
          tabs={tabs}
          currentTab={activeTab}
          onChange={(tabId: string) => {
            setActiveTab(tabId)
            navigate(`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${tabId}`)
          }}
          className={styles.tabs}
        />
      </Pipeline>
      <Outlet />
    </>
  )
}