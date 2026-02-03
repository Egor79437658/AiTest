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
import { PAGE_ENDPOINTS } from '@constants/'

export const ProjectContainer: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const { project } = useProject()
  const { setHeaderContent } = useHeaderStore()
  const { setPipelineContent } = usePipelineStore()


  useEffect(() => {
    const headerContent = (
      <div>
        <Link to="/">ЯМП&nbsp;</Link>
        &mdash;&nbsp; <Link to={`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.HOME}`}>Проект &nbsp;</Link> &mdash;&nbsp; {project?.name}
      </div>
    )

    setHeaderContent(headerContent)
    setPipelineContent(null)

    return () => {
      setHeaderContent(null)
    }
  }, [project?.name, setHeaderContent])

  if (!isAuthenticated) {
    return <div>Пожалуйста, войдите в систему для доступа к проектам</div>
  }

  if (!project) {
    return (
      <div>
        Проект не найден. <Link to="/">Вернуться к списку проектов</Link>
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
