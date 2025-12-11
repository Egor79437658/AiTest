import type React from 'react'
import styles from './styles/ProjectContainer.module.scss'
import { useAuth, useProject, useUser } from '@contexts/'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useHeaderStore, usePipelineStore } from '@stores/'
import {
  ProjectOverview,
  ProjectStats,
  ProjectUsers,
  RecentTestPlan,
} from './components'

export const ProjectContainer: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const { user } = useUser()
  const { project, loadProject, isLoading } = useProject()
  const [errorMsg, setErrorMsg] = useState('')
  const { setHeaderContent } = useHeaderStore()
  const { setPipelineContent } = usePipelineStore()
  const { projectId } = useParams<{ projectId: string }>()

  const targetProjectId = projectId
    ? parseInt(projectId)
    : user?.projectData[0]?.id
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    const headerContent = (
      <div>
        <Link to="/home">ЯМП&nbsp;</Link>
        &mdash;&nbsp; проект &mdash;&nbsp; {project?.name}
      </div>
    )

    setHeaderContent(headerContent)
    setPipelineContent(null)

    return () => {
      setHeaderContent(null)
    }
  }, [project?.name, setHeaderContent])

  useEffect(() => {
    if (
      targetProjectId &&
      !isLoading &&
      (!hasLoadedRef.current || project?.id !== targetProjectId)
    ) {
      hasLoadedRef.current = true
      try {
        loadProject(targetProjectId)
      } catch(e:any) {
        setErrorMsg(e.message)
      }
    }
  }, [targetProjectId, project?.id, isLoading, loadProject])

  if (!isAuthenticated) {
    return <div>Пожалуйста, войдите в систему для доступа к проектам</div>
  }

  if (errorMsg) {
    return (
      <div>
        Прозошла ошибка: {errorMsg} <br/>
        <Link to="/home">Вернуться к списку проектов</Link>
      </div>
    )
  }

  if (isLoading) {
    return <div>Загрузка данных проекта...</div>
  }

  if (!project) {
    return (
      <div>
        Проект не найден. <Link to="/home">Вернуться к списку проектов</Link>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <ProjectStats
        projectId={project.id}
        stats={{
          testCaseCount: project.testCases.length,
          testPlanCount: project.testPlans.length,
          testPlanRunCount: project.recentTestPlanRuns.length,
          scriptCount: project.scripts.length,
        }}
      />
      <ProjectOverview project={project} />
      <ProjectUsers users={project.users} />
      <RecentTestPlan runs={project.recentTestPlanRuns} />
    </div>
  )
}
