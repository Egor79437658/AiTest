import { MOCK_MODE } from '@constants/'
import { TestCase, TestCaseContextType } from '@interfaces/'
import React, { useCallback, useEffect } from 'react'
import { testCaseApi } from '../../api/'
import { mockApiService } from '../../services/mockApiService'
import { useTestCaseStore } from '../../stores/'
import { TestCaseContext } from './TestCaseContext'

export const TestCaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    testCase,
    allTestCases,
    isLoading,
    error,
    setLoading,
    setError,
    clearTestCase,
    clearAllTestCases,
    setTestCase,
    setAllTestCases
  } = useTestCaseStore()

  const updateCase = useCallback(async (projectId: number, caseId: number,  updates: Partial<TestCase>) => {
    if (!testCase) {
      throw new Error('No project loaded')
    }
    setLoading(true)
    try {

      let updatedTestCase: TestCase

      if (MOCK_MODE) {
        updatedTestCase = await mockApiService.updateTestCase(projectId, caseId, updates)
      } else {
        updatedTestCase = await testCaseApi.updateTestCase(projectId, caseId, updates)
      }

      setTestCase(updatedTestCase)
    } catch (error) {
      console.error('Failed to update project:', error)
      setError('Не удалось обновить данные тест-кейса')
      throw error
    } finally {
      setLoading(false)
    }
  }, [testCase, setTestCase, setError, setLoading])

  const loadAllTestCases = useCallback(async (projectId: number) => {
    setLoading(true)
    try {

      let cases: TestCase[]

      if (MOCK_MODE) {
        cases = await mockApiService.getTestCases(projectId)
      } else {
        cases = await testCaseApi.getTestCases(projectId)
      }

      setAllTestCases(cases)
    } catch (error) {
      console.error('Failed to update project:', error)
      setError('Не удалось загрзить данные тест-кейсов')
      throw error
    } finally {
      setLoading(false)
    }
  }, [testCase, setAllTestCases, setError, setLoading])


  const value: TestCaseContextType = {
    testCase: testCase,
    allTestCases: allTestCases,
    isLoading: isLoading,
    error: error,
    updateTestCase: updateCase,
    clearTestCase: clearTestCase,
    setTestCase: setTestCase,
    clearAllTestCases: clearAllTestCases,
    loadAllTestCases: loadAllTestCases
  }

  return (
    <TestCaseContext.Provider value={value}>
      {children}
    </TestCaseContext.Provider>
  )
}
