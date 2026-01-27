// src/components/ProjectTestCases/hooks/useTestCaseActions.ts
import { useCallback } from 'react'
import { TestCase, TestCaseUpdateData, TestCaseFormData } from '@interfaces/'
import { MOCK_MODE } from '@constants/'
import { mockApiService } from '../../../../../../services/mockApiService'
import { testCaseApi } from '@api'

export const useTestCaseActions = () => {
  const updateTestCase = useCallback(
    async (
      projectId: number,
      caseId: number,
      updates: TestCaseUpdateData
    ): Promise<TestCase> => {
      try {
        let updatedTestCase: TestCase

        if (MOCK_MODE) {
          updatedTestCase = await mockApiService.updateTestCase(
            projectId,
            caseId,
            updates
          )
        } else {
          updatedTestCase = await testCaseApi.updateTestCase(
            projectId,
            caseId,
            updates
          )
        }

        return updatedTestCase
      } catch (error) {
        console.error('Failed to update test case:', error)
        throw new Error('Не удалось обновить данные тест-кейса')
      }
    },
    []
  )

  const loadTestCases = useCallback(
    async (projectId: number): Promise<TestCase[]> => {
      try {
        let cases: TestCase[]

        if (MOCK_MODE) {
          cases = await mockApiService.getTestCases(projectId)
        } else {
          cases = await testCaseApi.getTestCases(projectId)
        }

        return cases
      } catch (error) {
        console.error('Failed to load test cases:', error)
        throw new Error('Не удалось загрузить данные тест-кейсов')
      }
    },
    []
  )

  const deleteTestCases = useCallback(
    async (projectId: number, caseIds: number[]): Promise<void> => {
      try {
        if (MOCK_MODE) {
          await mockApiService.deleteTestCases(projectId, caseIds)
        } else {
          await testCaseApi.deleteTestCases(projectId, caseIds)
        }
      } catch (error) {
        console.error('Failed to delete test cases:', error)
        throw new Error('Не удалось удалить тест-кейсы')
      }
    },
    []
  )

  const createTestCase = useCallback(
    async (projectId: number, data: TestCaseFormData): Promise<TestCase> => {
      try {
        let newTestCase: TestCase

        if (MOCK_MODE) {
          newTestCase = await mockApiService.createTestCase(projectId, data)
        } else {
          newTestCase = await testCaseApi.createTestCase(projectId, data)
        }

        return newTestCase
      } catch (error) {
        console.error('Failed to create test case:', error)
        throw new Error('Не удалось создать тест-кейс')
      }
    },
    []
  )

  const getTestCaseHistory = useCallback(
    async (projectId: number, caseId: number): Promise<TestCase[]> => {
      try {
        let history: TestCase[]

        if (MOCK_MODE) {
          history = await mockApiService.getTestCaseHistory(projectId, caseId)
        } else {
          history = await testCaseApi.getTestCaseHistory(projectId, caseId)
        }

        return history
      } catch (error) {
        console.error('Failed to load test case history:', error)
        throw new Error('Не удалось загрузить историю изменений')
      }
    },
    []
  )

  return {
    updateTestCase,
    loadTestCases,
    deleteTestCases,
    createTestCase,
    getTestCaseHistory,
  }
}
