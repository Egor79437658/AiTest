import type React from 'react'
import styles from './styles/ProjectContainer.module.scss'
import { useAuth, useProject, useUser } from '@contexts/'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useHeaderStore } from '@stores/'
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
  const { setHeaderContent } = useHeaderStore()
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
      loadProject(targetProjectId)
    }
  }, [targetProjectId, project?.id, isLoading, loadProject])

  if (!isAuthenticated) {
    return <div>Пожалуйста, войдите в систему для доступа к проектам</div>
  }

  if (isLoading && !project) {
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
      <ProjectStats projectId={project.id} stats={project.stats} />
      <ProjectOverview project={project} />
      <ProjectUsers users={project.users} />
      <RecentTestPlan runs={project.recentTestPlanRuns} />
    </div>
  )
}
