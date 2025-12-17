import { apiClient } from '@api'
import { API_URL } from '@constants/'
import { TestCase } from '@interfaces/'

class TestCaseApi {
  async getTestCases(id: number): Promise<TestCase[]> {
    const response = await apiClient.get<TestCase[]>(
      `${API_URL.PROJECTS}/${id}/${API_URL.TEST_CASES}`
    )
    return response
  }

  async getTestCase(projectId: number, testCaseId: number): Promise<TestCase> {
    const response = await apiClient.get<TestCase>(
      `${API_URL.PROJECTS}/${projectId}/${API_URL.TEST_CASES}/${testCaseId}`
    )
    return response
  }

  async updateTestCase(
    projectId: number,
    testCaseId: number,
    updates: Partial<TestCase>
  ): Promise<TestCase> {
    const response = await apiClient.patch<TestCase>(
      `${API_URL.PROJECTS}/${projectId}/${API_URL.TEST_CASES}/${testCaseId}`,
      updates
    )
    return response
  }
}

export const testCaseApi = new TestCaseApi()