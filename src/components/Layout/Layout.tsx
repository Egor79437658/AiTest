import type React from 'react'
import { Outlet } from 'react-router-dom'
import { useSidebar } from '@contexts/'
import styles from './Layout.module.scss'
import { AuthModal, Header, MenuButton, Pipeline, Sidebar } from '@components/'
import { useEffect, useRef } from 'react'
import { useDiealogHeightStore } from '@stores/'

export const Layout: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar()
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

  return (
    <div className={styles.bodyLayout} ref={pageRef}>
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
