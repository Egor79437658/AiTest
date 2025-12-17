import { createContext } from 'react'
import { TestCaseContextType } from '@interfaces/'

export const TestCaseContext = createContext<TestCaseContextType | undefined>(undefined)
