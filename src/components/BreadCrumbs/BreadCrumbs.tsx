import React from 'react'
import { Link } from 'react-router-dom'
import styles from './BreadCrumbs.module.scss'

export interface BreadcrumbItem {
  text: string
  link?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  homeText?: string
  homeLink?: string
  maxVisibleItems?: number
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  homeText = 'ЯМП',
  homeLink = '/',
  maxVisibleItems = 2,
}) => {
  const renderBreadcrumb = (
    item: BreadcrumbItem,
    index: number,
    isCollapsible = false
  ) => {
    const content = item.link ? (
      <Link to={item.link} className={styles.breadcrumbLink}>
        <span className={styles.breadcrumbText} title={item.text}>
          {item.text}
        </span>
      </Link>
    ) : (
      <span className={styles.breadcrumbText} title={item.text}>
        {item.text}
      </span>
    )

    return (
      <div
        key={index}
        className={`${styles.breadcrumbItem} ${isCollapsible ? styles.collapsible : ''}`}
      >
        {content}
      </div>
    )
  }

  const getVisibleItems = () => {
    if (items.length <= maxVisibleItems) {
      return items
    }

    const firstItem = items[0]
    const lastTwoItems = items.slice(-1)

    return [firstItem, { text: '...', link: undefined }, ...lastTwoItems]
  }

  const visibleItems = getVisibleItems()

  return (
    <div className={styles.breadcrumbs}>
      {renderBreadcrumb({ text: homeText, link: homeLink }, -1)}

      <span className={styles.separator}>▶</span>

      {visibleItems.map((item, index) => (
        <React.Fragment key={index}>
          {renderBreadcrumb(
            item,
            index,
            index === 0 || index === visibleItems.length - 1
          )}
          {index < visibleItems.length - 1 && (
            <span className={styles.separator}>▶</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
