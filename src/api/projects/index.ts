import { Project, ProjectMinimal, TestPlanRun, User } from '@interfaces/'
import { apiClient } from '@api'

import { API_URL } from '@constants/'

class ProjectsApi {
  async getShortProjects(): Promise<ProjectMinimal[]> {
    const response = await apiClient.get<ProjectMinimal[]>(
      `${API_URL.PROJECTS}/me/`
    )
    return response
  }

  async getProject(projectId: number): Promise<Project> {
    const response = await apiClient.get<Project>(
      `${API_URL.PROJECTS}/${projectId}/`
    )
    return response
  }

  async getRecentTestPlanRuns(projectId: number): Promise<TestPlanRun[]> {
    const response = await apiClient.get<TestPlanRun[]>(
      `${API_URL.PROJECTS}/${projectId}/plan-runs`
    )
    return response
  }

  async createProject(data: {
    url: string
    description: string
    name: string
  }): Promise<Project> {
    // переписать получаемый тип
    const response = await apiClient.post<Project>(
      `${API_URL.PROJECTS}/new/`,
      data
    )
    return response
  }

  async updateProject(
    projectId: number,
    updates: Partial<Project>
  ): Promise<Project> {
    const response = await apiClient.patch<Project>(
      `${API_URL.PROJECTS}/${projectId}/`,
      updates
    )
    return response
  }
}

export const projectsApi = new ProjectsApi()
