import React, { JSX, useEffect, useRef, useState } from 'react'
import { useSidebar } from '@contexts/'
import styles from './Sidebar.module.scss'
import { MenuItem, useSidebarNavigation } from './hooks/useSidebarNavigation'
import { SidebarItem } from './SidebarItem'

export const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar()
  const listRef = useRef<HTMLUListElement>(null)

  const { menuItems, handleMenuItemClick, isAuthenticated } =
    useSidebarNavigation()
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())

  useEffect(() => {
    // if(loading) {
    // return;
    // }
    const className = isOpen ? styles.animateOpen : styles.animateClose
    console.log(className)
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
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <nav className={`${styles.sidebarMenu} ${isOpen ? styles.open : ''}`}>
          <ul ref={listRef} className={styles.menuList}>
            {menuItems.map((item) => (
              <SidebarItem
                item={item}
                level={0}
                isDropdownOpen={isDropdownOpen}
                handleMenuItemClick={handleMenuItemClick}
                toggleDropdown={toggleDropdown}
              />
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
