// src/contexts/TestCaseProvider.tsx
import {
  TestCase,
  TestCaseFormData,
  TestCaseUpdateData,
} from '@interfaces/'
import { useTestCaseStore } from '@stores/'
import React, { useCallback } from 'react'
import { useTestCaseActions } from '../../pages/ProjectPages/components/ProjectSubPages/TestCases/hooks/useTestCaseActions'
import { TestCaseContext, TestCaseContextType } from './TestCaseContext'

interface TestCaseProviderProps {
  children: React.ReactNode
  onSuccess?: (action: string, data?: unknown) => void
  onError?: (action: string, error: Error) => void
}

export const TestCaseProvider: React.FC<TestCaseProviderProps> = ({
  children,
  onSuccess,
  onError,
}) => {
  const {
    testCase,
    allTestCases,
    isLoading,
    error,
    history,
    setTestHistory,
    setLoading,
    setError,
    clearTestCase,
    clearAllTestCases,
    setTestCase,
    setAllTestCases,
    updateTestCaseInList,
    removeTestCasesFromList,
    addTestCasesToList,
    updateMultipleTestCases,
    clearTestCaseSelection,
    selectedTestCaseIds,
    selectionType,
    toggleTestCaseSelection,
    selectAllTestCases,
    setSelectionType,
  } = useTestCaseStore()

  const {
    updateTestCase,
    loadTestCases,
    deleteTestCases,
    createTestCase,
    getTestCaseHistory,
  } = useTestCaseActions()

  const loadAllTestCases = useCallback(
    async (projectId: number): Promise<TestCase[]> => {
      if (isNaN(projectId) || !isFinite(projectId)) {
        setError('некорректное значение id проекта')
        console.error(`некорректное значение id проекта ${projectId}`)
        throw new Error(`некорректное значение id проекта ${projectId}`)
      }
      setLoading(true)
      setError(null)

      try {
        const cases = await loadTestCases(projectId)
        setAllTestCases(cases)
        onSuccess?.('loadAllTestCases', { projectId, count: cases.length })
        return cases
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить тест-кейсы'
        setError(message)
        onError?.('loadAllTestCases', error as Error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setAllTestCases, loadTestCases, onSuccess, onError]
  )

  const updateTestCaseHandler = useCallback(
    async (
      projectId: number,
      caseId: number,
      updates: TestCaseUpdateData
    ): Promise<TestCase> => {
      if (isNaN(projectId) || !isFinite(projectId)) {
        setError('некорректное значение id проекта')
        console.error(`некорректное значение id проекта ${projectId}`)
        throw new Error(`некорректное значение id проекта ${projectId}`)
      }

      if (isNaN(caseId) || !isFinite(caseId)) {
        setError('некорректное значение id тест-кейса')
        console.error(`некорректное значение id тест-кейса ${caseId}`)
        throw new Error(`некорректное значение id тест-кейса ${caseId}`)
      }
      setLoading(true)
      setError(null)

      try {
        const updatedCase = await updateTestCase(projectId, caseId, updates)

        updateTestCaseInList(caseId, updates)

        if (testCase?.id === caseId) {
          setTestCase(updatedCase)
        }

        onSuccess?.('updateTestCase', { caseId, updates })
        return updatedCase
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Не удалось обновить тест-кейс'
        setError(message)
        onError?.('updateTestCase', error as Error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [
      setLoading,
      setError,
      updateTestCase,
      updateTestCaseInList,
      testCase,
      setTestCase,
      onSuccess,
      onError,
    ]
  )

  const deleteSelectedTestCases = useCallback(
    async (projectId: number): Promise<void> => {
      if (selectedTestCaseIds.length === 0) {
        throw new Error('Нет выбранных тест-кейсов для удаления')
      }

      if (isNaN(projectId) || !isFinite(projectId)) {
        setError('некорректное значение id проекта')
        console.error(`некорректное значение id проекта ${projectId}`)
        throw new Error(`некорректное значение id проекта ${projectId}`)
      }

      setLoading(true)
      setError(null)

      try {
        await deleteTestCases(projectId, selectedTestCaseIds)

        removeTestCasesFromList(selectedTestCaseIds)

        clearTestCaseSelection()

        onSuccess?.('deleteTestCases', {
          count: selectedTestCaseIds.length,
          caseIds: selectedTestCaseIds,
        })
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Не удалось удалить тест-кейсы'
        setError(message)
        onError?.('deleteTestCases', error as Error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [
      selectedTestCaseIds,
      setLoading,
      setError,
      deleteTestCases,
      removeTestCasesFromList,
      clearTestCaseSelection,
      onSuccess,
      onError,
    ]
  )

  const createNewTestCase = useCallback(
    async (projectId: number, data: TestCaseFormData): Promise<TestCase> => {
      if (isNaN(projectId) || !isFinite(projectId)) {
        setError('некорректное значение id проекта')
        console.error(`некорректное значение id проекта ${projectId}`)
        throw new Error(`некорректное значение id проекта ${projectId}`)
      }
      setLoading(true)
      setError(null)

      try {
        const newCase = await createTestCase(projectId, data)

        addTestCasesToList([newCase])

        onSuccess?.('createTestCase', { caseId: newCase.id, data })
        return newCase
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Не удалось создать тест-кейс'
        setError(message)
        onError?.('createTestCase', error as Error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [
      setLoading,
      setError,
      createTestCase,
      addTestCasesToList,
      onSuccess,
      onError,
    ]
  )

  const bulkUpdateTestCases = useCallback(
    async (
      projectId: number,
      caseIds: number[],
      updates: TestCaseUpdateData
    ): Promise<void> => {
      if (isNaN(projectId) || !isFinite(projectId)) {
        setError('некорректное значение id проекта')
        console.error(`некорректное значение id проекта ${projectId}`)
        throw new Error(`некорректное значение id проекта ${projectId}`)
      }
      setLoading(true)
      setError(null)

      try {
        const updatePromises = caseIds.map((caseId) =>
          updateTestCase(projectId, caseId, updates)
        )

        await Promise.all(updatePromises)

        updateMultipleTestCases(caseIds, updates)

        onSuccess?.('bulkUpdateTestCases', { count: caseIds.length, updates })
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Не удалось обновить тест-кейсы'
        setError(message)
        onError?.('bulkUpdateTestCases', error as Error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [
      setLoading,
      setError,
      updateTestCase,
      updateMultipleTestCases,
      onSuccess,
      onError,
    ]
  )

  const getGroupedTestCases = useCallback(() => {
    const grouped = allTestCases.reduce(
      (acc, testCase) => {
        if (!acc[testCase.id]) {
          acc[testCase.id] = []
        }
        acc[testCase.id].push(testCase)
        acc[testCase.id].sort(
          (a, b) =>
            new Date(b.creationDate).getTime() -
            new Date(a.creationDate).getTime()
        )
        return acc
      },
      {} as Record<number, TestCase[]>
    )
    return grouped
  }, [allTestCases])

  const getLatestVersions = useCallback(() => {
    const grouped = getGroupedTestCases()
    return Object.values(grouped).map((versions) => versions[0])
  }, [getGroupedTestCases])

  const loadTestCaseHistory = useCallback(
    async (projectId: number, testCaseId: number) => {
      if (isNaN(projectId) || !isFinite(projectId)) {
        setError('некорректное значение id проекта')
        console.error(`некорректное значение id проекта ${projectId}`)
        throw new Error(`некорректное значение id проекта ${projectId}`)
      }
      
      if (isNaN(testCaseId) || !isFinite(testCaseId)) {
        setError('некорректное значение id тест-кейса')
        console.error(`некорректное значение id тест-кейса ${testCaseId}`)
        throw new Error(`некорректное значение id тест-кейса ${testCaseId}`)
      }
      setLoading(true)
      setError(null)
      try {
        const records = await getTestCaseHistory(projectId, testCaseId)
        setTestHistory(records)
      } catch (error) {
        console.error('Failed to load history:', error)
        setError('Не удалось загрзить историю изменения тест-кейса')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setTestHistory, setError, setLoading, getTestCaseHistory]
  )
  const value: TestCaseContextType = {
    // Состояние
    testCase,
    allTestCases,
    isLoading,
    error,
    history: history,

    // Выделение
    selectedTestCaseIds,
    selectionType,
    toggleTestCaseSelection,
    selectAllTestCases: () =>
      selectAllTestCases(allTestCases.map((tc) => tc.id)),
    clearTestCaseSelection,
    setSelectionType,

    // Действия с данными
    loadHistory: loadTestCaseHistory,
    loadAllTestCases,
    updateTestCase: updateTestCaseHandler,
    deleteTestCases: deleteSelectedTestCases,
    createTestCase: createNewTestCase,
    bulkUpdateTestCases,

    // Вспомогательные функции
    getGroupedTestCases,
    getLatestVersions,
    getTestCaseById: (id: number) => allTestCases.find((tc) => tc.id === id),

    // Setters
    clearTestCase,
    setTestCase,
    clearAllTestCases,
    setAllTestCases,

    // Статистика
    stats: {
      total: allTestCases.length,
      selected: selectedTestCaseIds.length,
      grouped: Object.keys(getGroupedTestCases()).length,
      latestVersions: getLatestVersions().length,
    },
  }

  return (
    <TestCaseContext.Provider value={value}>
      {children}
    </TestCaseContext.Provider>
  )
}
