import { MOCK_MODE } from '@constants/'
import { TestPlan, TestPlanUpdateData, TestPlanRun } from '@interfaces/'
import React, { useCallback } from 'react'
import { testPlanApi } from '../../api/' // 
import { mockApiService } from '../../services/mockApiService'
import { useTestPlanStore } from '../../stores/testPlanStore'
import { TestPlanContext } from './TestPlanContext'

export const TestPlanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    testPlan,
    allTestPlans,
    testPlanRuns,
    isLoading,
    error,
    setLoading,
    setError,
    clearTestPlan,
    clearAllTestPlans,
    clearTestPlanRuns,
    setTestPlan,
    setAllTestPlans,
    setTestPlanRuns,
    updateTestPlan,
  } = useTestPlanStore()

  const updatePlan = useCallback(async (projectId: number, testPlanId: number, updates: TestPlanUpdateData) => {
    setLoading(true)
    try {
      let updatedTestPlan: TestPlan

      if (MOCK_MODE) {
        updatedTestPlan = await mockApiService.updateTestPlan(projectId, testPlanId, updates)
      } else {
        updatedTestPlan = await testPlanApi.updateTestPlan(projectId, testPlanId, updates)
      }

      updateTestPlan(updates)
      setAllTestPlans((prev) => 
        prev.map((plan) => plan.id === updatedTestPlan.id ? updatedTestPlan : plan)
      )
      
    } catch (error) {
      console.error('Failed to update test plan:', error)
      setError('Не удалось обновить данные тест-плана')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setAllTestPlans, updateTestPlan])

  const loadAllTestPlans = useCallback(async (projectId: number) => {
    setLoading(true)
    try {
      let plans: TestPlan[]

      if (MOCK_MODE) {
        plans = await mockApiService.getAllTestPlans(projectId)
      } else {
        plans = await testPlanApi.getAllTestPlans(projectId)
      }

      setAllTestPlans(plans)
    } catch (error) {
      console.error('Failed to load test plans:', error)
      setError('Не удалось загрузить данные тест-планов')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setAllTestPlans])

  const loadTestPlan = useCallback(async (projectId: number, testPlanId: number) => {
    setLoading(true)
    try {
      let plan: TestPlan

      if (MOCK_MODE) {
        plan = await mockApiService.getTestPlan(projectId, testPlanId)
      } else {
        plan = await testPlanApi.getTestPlan(projectId, testPlanId)
      }

      setTestPlan(plan)
    } catch (error) {
      console.error('Failed to load test plan:', error)
      setError('Не удалось загрузить данные тест-плана')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setTestPlan])

  const createPlan = useCallback(async (projectId: number, data: Omit<TestPlanUpdateData, 'id'>) => {
    setLoading(true)
    try {
      let newPlan: TestPlan

      if (MOCK_MODE) {
        newPlan = await mockApiService.createTestPlan(projectId, data)
      } else {
        newPlan = await testPlanApi.createTestPlan(projectId, data)
      }

      setAllTestPlans((prev: TestPlan[]) => [...prev, newPlan])
      return newPlan
    } catch (error) {
      console.error('Failed to create test plan:', error)
      setError('Не удалось создать тест-план')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setAllTestPlans])

  const deletePlan = useCallback(async (projectId: number, testPlanId: number) => {
    setLoading(true)
    try {
      if (MOCK_MODE) {
        await mockApiService.deleteTestPlan(projectId, testPlanId)
      } else {
        await testPlanApi.deleteTestPlan(projectId, testPlanId)
      }

      setAllTestPlans((prev: TestPlan[]) => prev.filter((plan: TestPlan) => plan.id !== testPlanId))
      if (testPlan?.id === testPlanId) {
        clearTestPlan()
      }
    } catch (error) {
      console.error('Failed to delete test plan:', error)
      setError('Не удалось удалить тест-план')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setAllTestPlans, clearTestPlan, testPlan])

  const runPlan = useCallback(async (projectId: number, testPlanId: number) => {
    setLoading(true)
    try {
      let run: TestPlanRun

      if (MOCK_MODE) {
        run = await mockApiService.runTestPlan(projectId, testPlanId)
      } else {
        run = await testPlanApi.runTestPlan(projectId, testPlanId)
      }

      return run
    } catch (error) {
      console.error('Failed to run test plan:', error)
      setError('Не удалось запустить тест-план')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  const clonePlan = useCallback(async (projectId: number, testPlanId: number) => {
    setLoading(true)
    try {
      let clonedPlan: TestPlan

      if (MOCK_MODE) {
        clonedPlan = await mockApiService.cloneTestPlan(projectId, testPlanId)
      } else {
        clonedPlan = await testPlanApi.cloneTestPlan(projectId, testPlanId)
      }

      setAllTestPlans((prev: TestPlan[]) => [...prev, clonedPlan])
      return clonedPlan
    } catch (error) {
      console.error('Failed to clone test plan:', error)
      setError('Не удалось клонировать тест-план')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setAllTestPlans])

  const loadPlanRuns = useCallback(async (projectId: number, testPlanId: number) => {
    setLoading(true)
    try {
      let runs: TestPlanRun[]

      if (MOCK_MODE) {
        runs = await mockApiService.getTestPlanRuns(projectId, testPlanId)
      } else {
        runs = await testPlanApi.getTestPlanRuns(projectId, testPlanId)
      }

      setTestPlanRuns(runs)
    } catch (error) {
      console.error('Failed to load test plan runs:', error)
      setError('Не удалось загрузить историю запусков')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setTestPlanRuns])

  const value = {
    testPlan,
    allTestPlans,
    testPlanRuns,
    isLoading,
    error,
    setTestPlan,
    loadAllTestPlans,
    loadTestPlan,
    updateTestPlan: updatePlan,
    createTestPlan: createPlan,
    deleteTestPlan: deletePlan,
    runTestPlan: runPlan,
    cloneTestPlan: clonePlan,
    loadTestPlanRuns: loadPlanRuns,
    clearTestPlan,
    clearAllTestPlans,
  }

  return (
    <TestPlanContext.Provider value={value}>
      {children}
    </TestPlanContext.Provider>
  )
}