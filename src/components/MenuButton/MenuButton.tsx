import React from 'react'
import './MenuButton.scss'

export const MenuButton: React.FC<{
  onClick: () => void
  isActive?: boolean
}> = ({ onClick, isActive }) => {
  return (
    <div className={`menuToggle ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
    </div>
  )
}
