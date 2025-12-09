import { Link, useLocation } from 'react-router-dom'
import { MenuItem } from './hooks/useSidebarNavigation'
import styles from './Sidebar.module.scss'
import { useSidebar } from '@contexts/'

interface SidebarItemProps {
  item: MenuItem
  level: number
  openDropdowns: Set<string>
  toggleDropdown: (title: string) => void
  handleMenuItemClick: (e: React.MouseEvent, item: MenuItem) => void
  location: ReturnType<typeof useLocation>
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  level,
  openDropdowns,
  toggleDropdown,
  handleMenuItemClick,
  location,
}) => {
  const { isOpen: sidebarIsOpen } = useSidebar()
  const hasChildren = item.children && item.children.length > 0
  const isOpen = openDropdowns.has(item.title)
  const isActive = location.pathname === item.link
  const isChildActive = item.children?.some(
    (child) =>
      location.pathname === child.link ||
      child.children?.some((subChild) => location.pathname === subChild.link)
  )

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren && sidebarIsOpen) {
      e.preventDefault()
      toggleDropdown(item.title)
    } else {
      handleMenuItemClick(e, item)
    }
  }

  const getItemClasses = () => {
    const classes = [styles.menuItem, styles[`level-${level}`]]

    if (hasChildren) classes.push(styles.hasChildren)
    if (isOpen) classes.push(styles.open)
    if (isActive) classes.push(styles.selected)
    if (isChildActive && !isActive) classes.push(styles.childActive)

    return classes.join(' ')
  }

  return (
    <li className={getItemClasses()}>
      <div className={styles.menuItemContainer}>
        <Link
          to={item.link}
          className={`${styles.menuLink} ${level > 0 ? styles.submenuLink : ''}`}
          onClick={handleClick}
        >
          {item.icon && <span className={styles.icon}>{item.icon}</span>}
          <span className={styles.title}>{item.title}</span>
          {hasChildren && sidebarIsOpen && (
            <span className={styles.arrow}>›</span>
          )}
        </Link>
      </div>

      {hasChildren && isOpen && sidebarIsOpen && (
        <ul className={`${styles.submenu} ${styles[`level-${level + 1}`]}`}>
          {item.children?.map((child) => (
            <SidebarItem
              key={`${child.link}-${level + 1}`}
              item={child}
              level={level + 1}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              handleMenuItemClick={handleMenuItemClick}
              location={location}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
