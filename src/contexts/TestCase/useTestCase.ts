import { useContext } from 'react'
import { TestCaseContext } from './TestCaseContext'

export const useTestCase = () => {
  const context = useContext(TestCaseContext)
  if (context === undefined) {
    throw new Error('useTestCase must be used within a UserProvider')
  }
  return context
}
