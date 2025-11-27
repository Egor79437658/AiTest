import type React from 'react'
import styles from './styles/ContainerHome.module.scss'
import { Pipeline } from '@components/'

export const HomeContainer: React.FC = () => {
  return (
    <>
      <Pipeline />
      <div className={styles.pageContainer}>
        <div className={styles.pageUp}>
          <a href="/project" className={`${styles.block} ${styles.first}`}>
            <p>Проект 1</p>
            <p>перейти {'>>'}</p>
          </a>
          <a href="#" className={`${styles.block} ${styles.second}`}>
            <p>Проект 2</p>
            <p>перейти {'>>'}</p>
          </a>
          <a href="#" className={`${styles.block} ${styles.third}`}>
            <p>Новый проект</p>
            <p>+</p>
          </a>
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
