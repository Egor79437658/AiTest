import React, { JSX, useEffect, useRef, useState } from 'react'
import { useSidebar } from '@contexts/'
import styles from './Sidebar.module.scss'
import { MenuItem, useSidebarNavigation } from './hooks/useSidebarNavigation'
import { Link, useLocation } from 'react-router-dom'
import { MenuButton } from '../MenuButton'

export const Sidebar: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar()
  const location = useLocation()
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

  const renderMenuItem = (item: MenuItem, level: number = 0): JSX.Element => {
    const hasChildren = item.children && item.children.length > 0
    const isOpen = isDropdownOpen(item.title)

    return (
      <li
        key={`${item.link}-${level}`}
        className={`${styles.menuItem}
           ${location.pathname === item.link ? styles.selected : ''}
           ${isOpen || item.children?.some((child) => location.pathname === child.link) ? styles.liOpen : ''}
           `}
      >
        <div
          className={styles.menuItemContainer}
          onClick={(e) => {
            if (!item.children) return
            if (e.currentTarget === e.target) {
              toggleDropdown(item.title)
            }
          }}
        >
          <Link
            to={item.link}
            className={`${styles.menuLink} ${level > 0 ? styles.submenuLink : ''}`}
            title={!isOpen && level === 0 ? item.title : undefined}
            onClick={(e: React.MouseEvent) => {
              handleMenuItemClick(e, item)
            }}
          >
            <span>{item.title}</span>
          </Link>
        </div>

        {hasChildren && isOpen && item.children && (
          <ul className={`${styles.submenu} ${styles.menuList}`}>
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
      {/* {isOpen && (
        <div
        className={`${styles.sidebarOverlay} ${isOpen ? styles.active : ''}`}
        onClick={closeSidebar}
        />
        )} */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <nav className={`${styles.sidebarMenu} ${isOpen ? styles.open : ''}`}>
          <ul ref={listRef} className={styles.menuList}>
            {menuItems.map((item) => renderMenuItem(item))}
          </ul>
        </nav>
      </div>
    </>
  )
}
