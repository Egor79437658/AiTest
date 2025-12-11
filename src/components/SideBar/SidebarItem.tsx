import { Link, useLocation } from 'react-router-dom'
import { MenuItem } from './hooks/useSidebarNavigation'
import styles from './Sidebar.module.scss'

interface SidebarItemProps {
  item: MenuItem
  level: number
  isDropdownOpen: (title: string) => boolean
  toggleDropdown: (title: string) => void
  handleMenuItemClick: (
    e: React.MouseEvent<Element, MouseEvent>,
    item: MenuItem
  ) => void
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  level = 0,
  isDropdownOpen,
  toggleDropdown,
  handleMenuItemClick,
}) => {
  const hasChildren = item.children && item.children.length > 0
  const isOpen = isDropdownOpen(item.title)
  const location = useLocation()

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
          {item.children.map((child: MenuItem) => (
            <SidebarItem
              item={child}
              level={level + 1}
              isDropdownOpen={isDropdownOpen}
              toggleDropdown={toggleDropdown}
              handleMenuItemClick={handleMenuItemClick}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
