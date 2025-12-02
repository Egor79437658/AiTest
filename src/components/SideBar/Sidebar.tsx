import React, { JSX, useEffect, useRef, useState } from 'react'
import { useSidebar } from '@contexts/'
import styles from './Sidebar.module.scss'
import { MenuItem, useSidebarNavigation } from './hooks/useSidebarNavigation'
import { Link } from 'react-router-dom'

export const Sidebar: React.FC = () => {
  const { isOpen, closeSidebar } = useSidebar()
  // const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLUListElement>(null)

  const { menuItems, handleMenuItemClick, isAuthenticated } =
    useSidebarNavigation()
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())

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

  const renderMenuItem = (item: MenuItem, level: number = 0): JSX.Element => {
    const hasChildren = item.children && item.children.length > 0
    const isOpen = isDropdownOpen(item.title)

    return (
      <li key={`${item.link}-${level}`} className={styles.menuItem}>
        <div className={styles.menuItemContainer}>
          <Link
            to={item.link}
            className={`${isOpen ? styles.menuLink : styles.iconLink} ${
              item.requireAuth && !isAuthenticated ? styles.requireAuth : ''
            } ${level > 0 ? styles.submenuLink : ''}`}
            title={!isOpen && level === 0 ? item.title : undefined}
            onClick={(e: React.MouseEvent) => {
              if (hasChildren && isOpen) {
                e.preventDefault()
                toggleDropdown(item.title)
              } else if (hasChildren && !isOpen) {
                e.preventDefault()
                toggleDropdown(item.title)
              } else {
                handleMenuItemClick(e, item)
              }
            }}
          >
            <img
              src={item.icon}
              alt={item.title}
              className={`${isOpen ? styles.menuIcon : styles.iconImg}`}
            />
            {isOpen && (
              <span className={styles.menuText}>
                {item.title}
                {item.requireAuth && !isAuthenticated && (
                  <span className={styles.authRequired}>*</span>
                )}
                {hasChildren && (
                  <span
                    className={`${styles.dropdownArrow} ${
                      isOpen ? styles.dropdownArrowOpen : ''
                    }`}
                  >
                    ▼
                  </span>
                )}
              </span>
            )}
          </Link>
        </div>

        {hasChildren && isOpen && item.children && (
          <ul
            className={`${styles.submenu} ${level > 0 ? styles.nestedSubmenu : ''}`}
          >
            {item.children.map((child: MenuItem) =>
              renderMenuItem(child, level + 1)
            )}
          </ul>
        )}
      </li>
    )
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
          {isOpen && (
            <button
              className={styles.closeSidebarMobile}
              onClick={closeSidebar}
            >
              ×
            </button>
          )}
          <div className={styles.logoCont}>
            <Link to="/" className={`${!isOpen ? styles.miniLogo : ''}`}>
              <img src="#" alt="логотип" />
            </Link>
          </div>
          <ul
            ref={listRef}
            className={`${isOpen ? styles.menuList : styles.sidebarIcons}`}
          >
            {menuItems.map((item) => renderMenuItem(item))}
          </ul>
        </nav>
      </div>
    </>
  )
}
