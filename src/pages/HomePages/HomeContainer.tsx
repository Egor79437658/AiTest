import type React from 'react'
import { Link } from 'react-router-dom'
import { useProject, useUser } from '@contexts/'
import { useHeaderStore, usePipelineStore } from '@stores/'
import { useEffect } from 'react'
import { PAGE_ENDPOINTS } from '@constants/'
import styles from './styles/ContainerHome.module.scss'

export const HomeContainer: React.FC = () => {
  const { user } = useUser()
  const {projects, clearProject} = useProject()
  const { setHeaderContent } = useHeaderStore()
  const { setPipelineContent } = usePipelineStore()

  useEffect(() => clearProject(), [])
  useEffect(() => {
    setHeaderContent(
      <div>
        <Link to="/home">ЯМП&nbsp;</Link>
        &mdash;&nbsp; {user?.profileData.username} &nbsp;&mdash;&nbsp; проекты
      </div>
    )

    return () => {
      setHeaderContent(null)
    }
  }, [setHeaderContent, user?.profileData.username])

  // useEffect(() => console.log(projects), [projects])

  useEffect(() => {
    setPipelineContent(null)
    return () => {
      setPipelineContent(null)
    }
  }, [setPipelineContent])

  return (
    <>
      {/* <Pipeline /> */}
      <div className={styles.pageContainer}>
        <div className={styles.pageUp}>
          Всего: {user?.projectData.length} проекта
        </div>
        <div className={styles.pageUp}>
          {user && user?.projectData.sort((a, b) => (b.lastUpdated.getTime() - a.lastUpdated.getTime())).map((project) => (
            <Link
              key={project.id}
              to={`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${project.id}`}
              className={styles.block}
            >
              <p>{project.name}</p>
              <p>перейти {'>>'}</p>
            </Link>
          ))}
          {/* <Link to="/project" className={`${styles.block} ${styles.second}`}>
            <p>Проект 2</p>
            <p>перейти {'>>'}</p>
          </Link> */}
          <Link
            to={`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/new`}
            className={`${styles.block} ${styles.new}`}
          >
            <p>Новый проект</p>
            <p>+</p>
          </Link>
        </div>
        <div className={styles.pageDown}>
          <p>
            Добро пожаловать в личный кабинет! Здесь вы можете управлять своими
            проектами.
          </p>
        </div>
      </div>
    </>
  )
}
