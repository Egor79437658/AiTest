import { Pipeline, Tabs } from '@components/'
import type React from 'react'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import styles from './styles/Account.module.scss'
import { PAGE_ENDPOINTS } from '@constants/'
import { usePipelineStore } from '@stores/'

export const PersonalAccountLayout: React.FC = () => {
  const tabs = [
    { id: 'profile', label: 'Профиль' },
    { id: 'finances', label: 'Финансы' },
    { id: 'settings', label: 'Настройки' },
  ]

  const navigate = useNavigate()
  const location = useLocation()
  const { setPipelineContent } = usePipelineStore()

  const [activeTab, setActiveTab] = useState(location.pathname.split('/')[3])
  useEffect(() => {
    setActiveTab(location.pathname.split('/')[3])
    console.log(location)
    console.log(location.pathname.split('/')[3])
  }, [location])

  useEffect(
    () =>
      setPipelineContent(
        <Tabs
          tabs={tabs}
          currentTab={activeTab}
          onChange={(tabId: string) => {
            setActiveTab(tabId)
            navigate(
              `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${tabId}`
            )
          }}
          className={styles.tabs}
        />
      ),
    [setPipelineContent, activeTab]
  )

  return <Outlet />
}
