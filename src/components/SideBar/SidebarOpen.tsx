import React from 'react'
import { useMenuItems } from './menuItems'
import { useSidebar } from '@contexts/'
import cn from 'classnames'
import styles from './Sidebar.module.scss'

export const SidebarOpen: React.FC = () => {
  const menuItems = useMenuItems()
  const { closeSidebar } = useSidebar()

  return (
    <nav className={cn(styles.sidebarMenu, styles.open)}>
      <button className={styles.closeSidebarMobile} onClick={closeSidebar}>
        ×
      </button>
      <div className={styles.logoCont}>
        <a href="#">
          <img src="#" alt="Полный логотип" />
        </a>
      </div>
      <ul className={styles.menuList}>
        {menuItems.map((item) => (
          <li key={item.link} className={styles.menuItem}>
            <a href={item.link} className={styles.menuLink}>
              <img
                src={item.icon}
                alt={item.title}
                className={styles.menuIcon}
              />
              <span className={styles.menuText}>{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
