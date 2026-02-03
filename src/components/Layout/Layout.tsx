import type React from 'react'
import { Outlet } from 'react-router-dom'
import { useSidebar, useUser } from '@contexts/'
import styles from './Layout.module.scss'
import { AuthModal, Header, MenuButton, Pipeline, Sidebar } from '@components/'
import { useEffect, useRef } from 'react'
import { useDiealogHeightStore } from '@stores/'
import { SyncLoader } from 'react-spinners'

export const Layout: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar()
  const { initializeUser, isLoading, error } = useUser()
  const pageRef = useRef<HTMLDivElement>(null)
  const { setHeight } = useDiealogHeightStore()

  useEffect(() => {
    if (!pageRef.current) return

    const updateHeight = () => {
      setHeight(pageRef.current?.scrollHeight || 0)
      // setScrollHeight(pageRef.current?.scrollTop || 0);
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(pageRef.current)

    const mutationObserver = new MutationObserver(updateHeight)
    mutationObserver.observe(pageRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
      // attributes: true
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [pageRef.current])

  useEffect(() => {
    // загрузка данных пользователя
    try {
      initializeUser()
    } catch (e: any) {
      console.log(e.message)
    }
  }, [])

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Загрузка пользователя</div>
        <SyncLoader color="#000000" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <div>При загрузке пользователя произошла ошибка:</div>
        <div>{error}</div>
      </div>
    )
  }

  return (
    <div className={styles.bodyLayout} ref={pageRef}>
      <Header />
      <MenuButton
        onClick={toggleSidebar}
        className={`${styles.sidebarButton} ${isOpen ? styles.moved : ''}`}
      />
      <div className={styles.flexDiv}>
        <Sidebar />
        <div
          className={`${styles.nextTosidebarDiv} ${isOpen && styles.shrinked}`}
        >
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
