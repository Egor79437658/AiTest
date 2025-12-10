import React, { useCallback, useEffect, useState } from 'react'
import { MOCK_MODE } from '@constants/'
import { ProjectContext } from './ProjectContext'
import { mockApiService } from '../../services/mockApiService'
import { Project } from '@interfaces/'
import { useProjectStore } from '../../stores/projectStore'

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    project,
    projects,
    setProject,
    setProjects,
    setLoading,
    setError,
    clearProject,
  } = useProjectStore()

  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  const loadProject = useCallback(
    async (projectId: number): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        let projectData: Project

        if (MOCK_MODE) {
          projectData = await mockApiService.getProject(projectId)
        } else {
          throw new Error('Not implemented')
        }

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

  const loadProjects = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      let projectsData

      if (MOCK_MODE) {
        projectsData = await mockApiService.getProjects()
      } else {
        throw new Error('Not implemented')
      }

      setProjects(projectsData)
    } catch (error) {
      console.error('Failed to load projects:', error)
      setError('Не удалось загрузить список проектов')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setProjects])

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        await loadProjects()
      } catch (error) {
        console.error('Failed to load initial project data:', error)
        setError('Не удалось загрузить данные проектов')
      } finally {
        setLoading(false)
        setInitialLoadComplete(true)
      }
    }

    loadInitialData()
  }, [loadProjects, setError, setLoading])

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
          throw new Error('Not implemented')
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
    projects: projects,
    isLoading: useProjectStore.getState().isLoading,
    error: useProjectStore.getState().error,
    loadProject,
    loadProjects,
    updateProject: updateProjectData,
    clearProject: clearCurrentProject,
    clearError: clearErrorState,
  }

  if (!initialLoadComplete) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Загрузка проектов...</div>
      </div>
    )
  }

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  )
}
