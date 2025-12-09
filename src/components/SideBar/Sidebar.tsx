import React, { useEffect, useRef, useState } from 'react'
import { useSidebar } from '@contexts/'
import styles from './Sidebar.module.scss'
import { MenuItem, useSidebarNavigation } from './hooks/useSidebarNavigation'
import { useLocation } from 'react-router-dom'
import { SidebarItem } from './SidebarItem'

export const Sidebar: React.FC = () => {
  const { isOpen, closeSidebar } = useSidebar()
  const location = useLocation()
  const listRef = useRef<HTMLUListElement>(null)

  const { menuItems, handleMenuItemClick } = useSidebarNavigation()
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())

  useEffect(() => {
    const findAndOpenParents = (
      items: MenuItem[],
      path: string,
      parents: Set<string>
    ): Set<string> => {
      const newParents = new Set(parents)

      items.forEach((item) => {
        if (item.children) {
          const childPaths = item.children.map((child) => child.link)
          const isChildActive = childPaths.some(
            (childPath) =>
              path.startsWith(childPath) ||
              (item.children &&
                findAndOpenParents(item.children, path, newParents).has(
                  item.title
                ))
          )

          if (isChildActive) {
            newParents.add(item.title)
          }

          findAndOpenParents(item.children, path, newParents)
        }
      })

      return newParents
    }

    const activeParents = findAndOpenParents(
      menuItems,
      location.pathname,
      new Set<string>()
    )
    setOpenDropdowns(activeParents)
  }, [location.pathname, menuItems])

  useEffect(() => {
    const className = isOpen ? styles.animateOpen : styles.animateClose
    if (listRef.current) {
      listRef.current.classList.add(className)
    }

    const timer = setTimeout(
      () => {
        if (listRef.current) {
          listRef.current.classList.remove(className)
        }
      },
      300 + menuItems.length * 50
    )

    return () => clearTimeout(timer)
  }, [isOpen, menuItems.length])

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

  return (
    <>
      {isOpen && (
        <div
          className={`${styles.sidebarOverlay} ${isOpen ? styles.active : ''}`}
          onClick={closeSidebar}
        />
      )}

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <nav className={`${styles.sidebarMenu} ${isOpen ? styles.open : ''}`}>
          <ul ref={listRef} className={styles.menuList}>
            {menuItems.map((item) => (
              <SidebarItem
                key={item.link}
                item={item}
                level={0}
                openDropdowns={openDropdowns}
                toggleDropdown={toggleDropdown}
                handleMenuItemClick={handleMenuItemClick}
                location={location}
              />
            ))}
          </ul>
        </nav>

        {isOpen && (
          <button
            className={styles.closeSidebarMobile}
            onClick={closeSidebar}
            aria-label="Закрыть меню"
          >
            ×
          </button>
        )}
      </div>
    </>
  )
}
