import type React from 'react'
import styles from './styles/ContainerHome.module.scss'
import { Pipeline } from '@components/'
import { Link } from 'react-router-dom'

export const HomeContainer: React.FC = () => {
  return (
    <>
      <Pipeline />
      <div className={styles.pageContainer}>
        <div className={styles.pageUp}>
          <Link to="/project" className={`${styles.block} ${styles.first}`}>
            <p>Проект 1</p>
            <p>перейти {'>>'}</p>
          </Link>
          <Link to="#" className={`${styles.block} ${styles.second}`}>
            <p>Проект 2</p>
            <p>перейти {'>>'}</p>
          </Link>
          <Link to="#" className={`${styles.block} ${styles.third}`}>
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