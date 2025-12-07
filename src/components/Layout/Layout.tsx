import type React from 'react'
import { Outlet } from 'react-router-dom'
import { useSidebar } from '@contexts/'
import styles from './Layout.module.scss'
import { AuthModal, Header, MenuButton, Pipeline, Sidebar } from '@components/'

export const Layout: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar()

  return (
    <div className={styles.bodyLayout}>
      <Header />
      <MenuButton
        onClick={toggleSidebar}
        className={`${styles.sidebarButton} ${isOpen ? styles.moved : ''}`}
      />
      <div className={styles.flexDiv}>
        <Sidebar />
        <div>
          <Pipeline />
          <div className={styles.contentLayout}>
            <div className={styles.mainContent}>
              <Outlet />
            </div>

            <AuthModal />
          </div>
        </div>
      </div>
    </div>
  )
}
