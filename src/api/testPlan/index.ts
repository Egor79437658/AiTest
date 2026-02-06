import { TestPlan, TestPlanRun, TestPlanUpdateData } from '@interfaces/'
import { apiClient } from '../client'
import { API_URL } from '@constants/'

class TestPlanApi {
  async getAllTestPlans(projectId: number): Promise<TestPlan[]> {
    const response = await apiClient.get<TestPlan[]>(
      `${API_URL.PROJECTS}/${projectId}/test-plans`
    )
    return response
  }

  async getTestPlan(projectId: number, testPlanId: number): Promise<TestPlan> {
    const response = await apiClient.get<TestPlan>(
      `${API_URL.PROJECTS}/${projectId}/test-plans/${testPlanId}`
    )
    return response
  }

  async createTestPlan(projectId: number, data: Omit<TestPlanUpdateData, 'id'>): Promise<TestPlan> {
    const response = await apiClient.post<TestPlan>(
      `${API_URL.PROJECTS}/${projectId}/test-plans`,
      data
    )
    return response
  }

  async updateTestPlan(projectId: number, testPlanId: number, updates: TestPlanUpdateData): Promise<TestPlan> {
    const response = await apiClient.patch<TestPlan>(
      `${API_URL.PROJECTS}/${projectId}/test-plans/${testPlanId}`,
      updates
    )
    return response
  }

  async deleteTestPlan(projectId: number, testPlanId: number): Promise<void> {
    await apiClient.delete(
      `${API_URL.PROJECTS}/${projectId}/test-plans/${testPlanId}`
    )
  }

  async runTestPlan(projectId: number, testPlanId: number): Promise<TestPlanRun> {
    const response = await apiClient.post<TestPlanRun>(
      `${API_URL.PROJECTS}/${projectId}/test-plans/${testPlanId}/run`
    )
    return response
  }

  async cloneTestPlan(projectId: number, testPlanId: number): Promise<TestPlan> {
    const response = await apiClient.post<TestPlan>(
      `${API_URL.PROJECTS}/${projectId}/test-plans/${testPlanId}/clone`
    )
    return response
  }

  async getTestPlanRuns(projectId: number, testPlanId: number): Promise<TestPlanRun[]> {
    const response = await apiClient.get<TestPlanRun[]>(
      `${API_URL.PROJECTS}/${projectId}/test-plans/${testPlanId}/runs`
    )
    return response
  }

  async getRecentTestPlanRuns(projectId: number, testPlanId: number, limit: number = 3): Promise<TestPlanRun[]> {
    const response = await apiClient.get<TestPlanRun[]>(
      `${API_URL.PROJECTS}/${projectId}/test-plans/${testPlanId}/recent-runs?limit=${limit}`
    )
    return response
  }
}

export const testPlanApi = new TestPlanApi()