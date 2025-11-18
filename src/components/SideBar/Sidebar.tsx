import React, { useEffect, useRef, useState } from 'react'
import { useSidebar } from '@contexts/'
import { useMenuItems } from './menuItems'
import cn from 'classnames'
import styles from './Sidebar.module.scss'

export const Sidebar: React.FC = () => {
  const { isOpen, closeSidebar } = useSidebar()
  // const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLUListElement>(null)
  const menuItems = useMenuItems()

  useEffect(() => {
    // if(loading) {
    // return;
    // }
    const className = isOpen ? styles.animateOpen : styles.animateClose
    if (listRef.current) {
      listRef.current.classList.add(className)
    }
    const timer = setTimeout(
      () => {
        if (listRef.current) {
          listRef.current.classList.remove(className)
        }
        return () => clearTimeout(timer)
      },
      510 + 100 * menuItems.length
    )
  }, [isOpen])

  // useEffect(() => {
  // setLoading(false)
  // }, [])

  return (
    <>
      {isOpen && (
        <div
          className={cn(styles.sidebarOverlay, { [styles.active]: isOpen })}
          onClick={closeSidebar}
        />
      )}
      <div className={cn(styles.sidebar, { [styles.open]: isOpen })}>
        <nav className={cn(styles.sidebarMenu, { [styles.open]: isOpen })}>
          {isOpen && (
            <button
              className={styles.closeSidebarMobile}
              onClick={closeSidebar}
            >
              ×
            </button>
          )}
          <div className={styles.logoCont}>
            <a href="/" className={cn({ [styles.miniLogo]: !isOpen })}>
              <img src="#" alt="логотип" />
            </a>
          </div>
          <ul
            ref={listRef}
            className={cn({
              [styles.menuList]: isOpen,
              [styles.sidebarIcons]: !isOpen,
            })}
          >
            {menuItems.map((item) => (
              <li key={item.link} className={styles.menuItem}>
                <a
                  href={item.link}
                  className={cn({
                    [styles.menuLink]: isOpen,
                    [styles.iconLink]: !isOpen,
                  })}
                  title={!isOpen ? item.title : undefined}
                >
                  <img
                    src={item.icon}
                    alt={item.title}
                    className={cn({
                      [styles.menuIcon]: isOpen,
                      [styles.iconImg]: !isOpen,
                    })}
                  />
                  {isOpen && (
                    <span className={styles.menuText}>{item.title}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
