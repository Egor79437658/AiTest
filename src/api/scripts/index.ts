import { apiClient } from '@api'
import { API_URL } from '@constants/'
import { Script, ScriptRun, ScriptUpdateData } from '@interfaces/'

class ScriptApi {
  async getScripts(projectId: number): Promise<Script[]> {
    const response = await apiClient.get<Script[]>(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}`
    )
    return response
  }

  async getScript(projectId: number, scriptId: number): Promise<Script> {
    const response = await apiClient.get<Script>(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}/${scriptId}`
    )
    return response
  }

  async createScript(
    projectId: number,
    data: ScriptUpdateData
  ): Promise<Script> {
    const response = await apiClient.post<Script>(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}`,
      data
    )
    return response
  }

  async updateScript(
    projectId: number,
    scriptId: number,
    data: ScriptUpdateData
  ): Promise<Script> {
    const response = await apiClient.patch<Script>(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}/${scriptId}`,
      data
    )
    return response
  }

  async deleteScript(projectId: number, scriptId: number): Promise<void> {
    await apiClient.delete(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}/${scriptId}`
    )
  }

  async runScript(projectId: number, scriptId: number): Promise<ScriptRun> {
    const response = await apiClient.post<ScriptRun>(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}/${scriptId}/run`
    )
    return response
  }

  async refactorScripts(
    projectId: number,
    scriptIds: number[],
    includeNegative?: boolean
  ): Promise<void> {
    await apiClient.post(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}/refactor`,
      {
        scriptIds,
        includeNegative,
      }
    )
  }

  async getScriptRuns(
    projectId: number,
    scriptId: number
  ): Promise<ScriptRun[]> {
    const response = await apiClient.get<ScriptRun[]>(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}/${scriptId}/runs`
    )
    return response
  }

  async getScriptRun(
    projectId: number,
    scriptId: number,
    runId: number
  ): Promise<ScriptRun> {
    const response = await apiClient.get<ScriptRun>(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}/${scriptId}/runs/${runId}`
    )
    return response
  }

  async generateAllScripts(
    projectId: number,
    includeNegative?: boolean
  ): Promise<void> {
    await apiClient.post(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}/generate-all`,
      { includeNegative }
    )
  }

  async generateNewScripts(
    projectId: number,
    includeNegative?: boolean
  ): Promise<void> {
    await apiClient.post(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}/generate-new`,
      { includeNegative }
    )
  }

  async refactorAllScripts(projectId: number): Promise<void> {
    await apiClient.post(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}/refactor-all`
    )
  }

  async archiveScripts(projectId: number, scriptIds: number[]): Promise<void> {
    await apiClient.patch(
      `${API_URL.PROJECTS}/${projectId}${API_URL.SCRIPTS}/bulk`,
      {
        ids: scriptIds,
        status: 0,
      }
    )
  }
}

export const scriptApi = new ScriptApi()
