import React from 'react'
import styles from './MenuButton.module.scss'

export const MenuButton: React.FC<{
  onClick: () => void
  isActive?: boolean
  className?: string
}> = ({ onClick, isActive, className }) => {
  return (
    <div
      className={`${styles.menuToggle} ${isActive ? styles.open : ''} ${className}`}
      onClick={onClick}
    >
      <div className={styles.bar} />
      <div className={styles.bar} />
      <div className={styles.bar} />
    </div>
  )
}
