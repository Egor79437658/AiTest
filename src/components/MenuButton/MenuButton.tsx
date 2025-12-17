import React, { CSSProperties } from 'react'
import styles from './MenuButton.module.scss'

export const MenuButton: React.FC<{
  onClick: () => void
  isActive?: boolean
  className?: string
  style?: CSSProperties
}> = ({ onClick, isActive, className, style }) => {
  return (
    <div
      className={`${styles.menuToggle} ${isActive ? styles.open : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      <div className={styles.bar} />
      <div className={styles.bar} />
      <div className={styles.bar} />
    </div>
  )
}
