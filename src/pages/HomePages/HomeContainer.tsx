import type React from 'react'
import styles from './styles/ContainerHome.module.scss'
import { Pipeline } from '@components/'
import { Link } from 'react-router-dom'
import { useUser } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { useEffect } from 'react'
import { PAGE_ENDPOINTS } from '@constants/'

export const HomeContainer: React.FC = () => {

  const { user } = useUser()
  const {setHeaderContent} = useHeaderStore()
  
  useEffect(() => setHeaderContent(
    <div >
      <Link to="/">
        ЯМП&nbsp;
      </Link>
       &mdash;&nbsp; {user?.profileData.username} &nbsp;&mdash;&nbsp; проекты
    </div>
  ), [setHeaderContent])

  return (
    <>
      <Pipeline />
      <div className={styles.pageContainer}>
        <div className={styles.pageUp}>
          {user?.projectData.map(project => (
          <Link key={project.id} to={`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}`} className={styles.block}>
            <p>{project.name}</p>
            <p>перейти {'>>'}</p>
          </Link>
          ))}
          {/* <Link to="/project" className={`${styles.block} ${styles.second}`}>
            <p>Проект 2</p>
            <p>перейти {'>>'}</p>
          </Link> */}
          <Link to={`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/new`} className={`${styles.block} ${styles.new}`}>
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