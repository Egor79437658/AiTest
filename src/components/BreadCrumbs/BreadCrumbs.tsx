import React, { useState } from 'react'
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
  maxVisibleItems = 3,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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

  const totalItems = items.length
  const showEllipsis = totalItems > maxVisibleItems

  let visibleItems: (BreadcrumbItem | { text: string; link?: undefined })[] =
    items
  let hiddenItems: BreadcrumbItem[] = []

  if (showEllipsis) {
    const firstItem = items[0]
    const lastItemsCount = Math.max(0, maxVisibleItems - 2)
    const lastItems = items.slice(-lastItemsCount)
    hiddenItems = items.slice(1, totalItems - lastItemsCount)
    visibleItems = [firstItem, { text: '...', link: undefined }, ...lastItems]
  }

  return (
    <div className={styles.breadcrumbs}>
      {renderBreadcrumb({ text: homeText, link: homeLink }, -1)}

      <span className={styles.separator}>▶</span>

      {visibleItems.map((item, index) => {
        if (item.text === '...' && !item.link) {
          return (
            <React.Fragment key={index}>
              <div
                className={`${styles.breadcrumbItem} ${styles.collapsible} ${styles.ellipsisContainer}`}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <span className={styles.breadcrumbText}>...</span>
                {isDropdownOpen && hiddenItems.length > 0 && (
                  <div className={styles.dropdown}>
                    {hiddenItems.map((hiddenItem, idx) => (
                      <div key={idx} className={styles.dropdownItem}>
                        {hiddenItem.link ? (
                          <Link
                            to={hiddenItem.link}
                            className={styles.dropdownLink}
                          >
                            {hiddenItem.text}
                          </Link>
                        ) : (
                          <span className={styles.dropdownText}>
                            {hiddenItem.text}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {index < visibleItems.length - 1 && (
                <span className={styles.separator}>▶</span>
              )}
            </React.Fragment>
          )
        }

        return (
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
        )
      })}
    </div>
  )
}
