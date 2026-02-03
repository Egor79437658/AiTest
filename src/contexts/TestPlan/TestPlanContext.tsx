import { createContext } from 'react'
import { TestPlanContextType } from '@interfaces/'

export const TestPlanContext = createContext<TestPlanContextType | undefined>(undefined)