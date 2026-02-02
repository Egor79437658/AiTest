// src/components/ProjectTestCases/hooks/useTestCaseHandlers.ts
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PAGE_ENDPOINTS } from '@constants/'

export type BulkActionType =
  | 'changeStatus'
  | 'changePriority'
  | 'assignTo'
  | 'addTags'
export type ExportFormat = 'csv' | 'excel' | 'pdf'

export interface BulkActionData {
  status?: number
  priority?: number
  assignTo?: number
  tags?: string[]
}

export interface UseTestCaseHandlersProps {
  projectId?: number
  projectBaseUrl?: string
  onSuccess?: (action: string, data?: unknown) => void
  onError?: (action: string, error: Error) => void
}

export function useTestCaseHandlers({
  projectId,
  projectBaseUrl = '',
  onSuccess,
  onError,
}: UseTestCaseHandlersProps = {}) {
  const navigate = useNavigate()

  const handleCreate = useCallback(() => {
    try {
      const url = `${window.location.pathname}/new`
      navigate(url)
      onSuccess?.('create')
    } catch (error) {
      onError?.('create', error as Error)
    }
  }, [navigate, onSuccess, onError])

  const handleEdit = useCallback(
    (caseId: number) => {
      try {
        const url = `${window.location.pathname}/${caseId}`
        navigate(url)
        onSuccess?.('edit', { caseId })
      } catch (error) {
        onError?.('edit', error as Error)
      }
    },
    [navigate, onSuccess, onError]
  )

  const handleViewHistory = useCallback(
    (caseId: number) => {
      try {
        const url = `${window.location.pathname}/${caseId}/history`
        navigate(url)
        onSuccess?.('viewHistory', { caseId })
      } catch (error) {
        onError?.('viewHistory', error as Error)
      }
    },
    [navigate, onSuccess, onError]
  )

  const handleRefactor = useCallback(
    (caseIds: number[]) => {
      try {
        const idsParam = caseIds.join(',')
        const url = `${window.location.pathname}/refactor?ids=${idsParam}`
        navigate(url)
        onSuccess?.('refactor', { caseIds })
      } catch (error) {
        onError?.('refactor', error as Error)
      }
    },
    [navigate, onSuccess, onError]
  )

  const handleTestPlanClick = useCallback(
    (testPlanId: number) => {
      try {
        if (!projectBaseUrl) {
          throw new Error('Project base URL is required')
        }
        const url = `${projectBaseUrl}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN}/${testPlanId}`
        navigate(url)
        onSuccess?.('viewTestPlan', { testPlanId })
      } catch (error) {
        onError?.('viewTestPlan', error as Error)
      }
    },
    [navigate, projectBaseUrl, onSuccess, onError]
  )

  const handleUserClick = useCallback(
    (userId: number) => {
      try {
        const url = `${window.location.origin}${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${userId}`
        window.open(url, '_blank')
        onSuccess?.('viewUser', { userId })
      } catch (error) {
        onError?.('viewUser', error as Error)
      }
    },
    [onSuccess, onError]
  )

  const handleExport = useCallback(
    (caseIds: number[], format: ExportFormat = 'excel') => {
      try {
        console.log(
          `Exporting ${caseIds.length} test cases in ${format} format`
        )
        onSuccess?.('export', { caseIds, format })
      } catch (error) {
        onError?.('export', error as Error)
      }
    },
    [onSuccess, onError]
  )

  const handleClone = useCallback(
    (caseId: number) => {
      try {
        const url = `${window.location.pathname}/clone/${caseId}`
        navigate(url)
        onSuccess?.('clone', { caseId })
      } catch (error) {
        onError?.('clone', error as Error)
      }
    },
    [navigate, onSuccess, onError]
  )

  const handleBulkAction = useCallback(
    (caseIds: number[], action: BulkActionType, data: BulkActionData) => {
      try {
        console.log(`Bulk ${action} for ${caseIds.length} cases:`, data)
        onSuccess?.(`bulk${action.charAt(0).toUpperCase() + action.slice(1)}`, {
          caseIds,
          data,
        })
      } catch (error) {
        onError?.(
          `bulk${action.charAt(0).toUpperCase() + action.slice(1)}`,
          error as Error
        )
      }
    },
    [onSuccess, onError]
  )

  return {
    // Основные обработчики
    handleCreate,
    handleEdit,
    handleViewHistory,
    handleRefactor,
    handleTestPlanClick,
    handleUserClick,

    // Дополнительные обработчики
    handleExport,
    handleClone,
    handleBulkAction,

    // Вспомогательные функции
    getTestCaseUrl: (caseId: number) => `${window.location.pathname}/${caseId}`,
    getHistoryUrl: (caseId: number) =>
      `${window.location.pathname}/${caseId}/history`,
    getRefactorUrl: (caseIds: number[]) =>
      `${window.location.pathname}/refactor?ids=${caseIds.join(',')}`,
  }
}
