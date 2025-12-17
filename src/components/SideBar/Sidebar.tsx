import React, { JSX, useEffect, useRef, useState } from 'react'
import { useSidebar } from '@contexts/'
import styles from './Sidebar.module.scss'
import { MenuItem, useSidebarNavigation } from './hooks/useSidebarNavigation'
import { SidebarItem } from './SidebarItem'
import { MenuButton } from '../MenuButton'

export const Sidebar: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar()
  const listRef = useRef<HTMLUListElement>(null)

  const { menuItems, handleMenuItemClick } = useSidebarNavigation()
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [sidebarWidth, setSidebarWidth] = useState(0)

  useEffect(() => {
    // if(loading) {
    // return;
    // }
    setTimeout(() => {
      if (sidebarRef.current) {
        setSidebarWidth(sidebarRef.current.clientWidth)
      }
    }, 500)
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
      800 + 100 * menuItems.length
    )
  }, [isOpen])

  useEffect(() => {
    const checkSidebar = () => {
          setTimeout(() => {
      if (sidebarRef.current) {
        setSidebarWidth(sidebarRef.current.clientWidth)
      }
    }, 500)
    }
    window.addEventListener('resize', checkSidebar)

    return () => window.removeEventListener('resize', checkSidebar)
  }, [])

  // useEffect(() => {
  // setLoading(false)
  // }, [])

  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(title)) {
        newSet.delete(title)
      } else {
        newSet.add(title)
      }
      return newSet
    })
  }

  const isDropdownOpen = (title: string): boolean => {
    return openDropdowns.has(title)
  }

  return (
    <>
      {/* {isOpen && (
        <div
        className={`${styles.sidebarOverlay} ${isOpen ? styles.active : ''}`}
        onClick={closeSidebar}
        />
        )} */}
      <div
        ref={sidebarRef}
        className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
      >
        <nav className={`${styles.sidebarMenu} ${isOpen ? styles.open : ''}`}>
          <ul ref={listRef} className={styles.menuList}>
            {menuItems.map((item) => (
              <SidebarItem
                key={item.link}
                item={item}
                level={0}
                isDropdownOpen={isDropdownOpen}
                handleMenuItemClick={handleMenuItemClick}
                toggleDropdown={toggleDropdown}
              />
            ))}
          </ul>
        </nav>
        <MenuButton
          onClick={toggleSidebar}
          className={styles.sidebarButton}
          style={{
            opacity:
              sidebarRef.current && sidebarWidth / window.innerWidth > 0.9
                ? 1
                : 0,
          }}
        />
      </div>
    </>
  )
}
