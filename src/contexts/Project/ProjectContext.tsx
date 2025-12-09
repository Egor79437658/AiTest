import { ProjectContextType } from '@interfaces/'
import { createContext } from 'react'

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
)
