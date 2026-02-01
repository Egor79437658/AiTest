import React, { useCallback, useEffect, useState } from 'react'
import { MOCK_MODE } from '@constants/'
import { ProjectContext } from './ProjectContext'
import { mockApiService } from '../../services/mockApiService'
import { Project } from '@interfaces/'
import { useProjectStore } from '../../stores/'
import { projectsApi } from '@api'

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    project,
    setProject,
    updateProject,
    setLoading,
    setError,
    clearProject,
  } = useProjectStore()


  const loadProject = useCallback(
    async (projectId: number): Promise<void> => {
      if(isNaN(projectId) || !isFinite(projectId)) {
        setError("некорректное значение id проекта")
        console.error(`некорректное значение id проекта ${projectId}`)
        throw new Error(`некорректное значение id проекта ${projectId}`)
      }
      try {
        setLoading(true)
        setError(null)

        let projectData: Project

        if (MOCK_MODE) {
          projectData = await mockApiService.getProject(projectId)
        } else {
          projectData = await projectsApi.getProject(projectId)
        }

        const date =  new Date()
        projectData.updatedAt = date
        updateProject({updatedAt: date})
        
        setProject(projectData)
      } catch (error) {
        console.error('Failed to load project:', error)
        setError('Не удалось загрузить данные проекта')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setProject]
  )

  const updateProjectData = useCallback(
    async (updates: Partial<Project>): Promise<void> => {
      if (!project) {
        throw new Error('No project loaded')
      }

      try {
        setLoading(true)

        let updatedProject: Project

        if (MOCK_MODE) {
          updatedProject = await mockApiService.updateProject(
            project.id,
            updates
          )
        } else {
          updatedProject = await projectsApi.updateProject(
            project.id,
            updates
          )
        }

        setProject(updatedProject)
      } catch (error) {
        console.error('Failed to update project:', error)
        setError('Не удалось обновить данные проекта')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [project, setLoading, setError, setProject]
  )

  const clearCurrentProject = useCallback((): void => {
    clearProject()
  }, [clearProject])

  const clearErrorState = useCallback((): void => {
    setError(null)
  }, [setError])

  const value = {
    project: project,
    isLoading: useProjectStore.getState().isLoading,
    error: useProjectStore.getState().error,
    loadProject,
    updateProject: updateProjectData,
    clearProject: clearCurrentProject,
    clearError: clearErrorState,
  }

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  )
}
