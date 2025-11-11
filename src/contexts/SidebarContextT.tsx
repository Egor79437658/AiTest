import { createContext } from 'react'

interface SidebarContextType {
  isOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined,
)
