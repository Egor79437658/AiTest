import type React from 'react'
import styles from './styles/ProjectContainer.module.scss'

export const ProjectContainer: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageUp}>
        <a href="#" className={styles.block}>
          <p>Тест-кейсы</p>
        </a>
        <a href="#" className={styles.block}>
          <p>Тест-план</p>
        </a>
        <a href="#" className={styles.block}>
          <p>Скрипты</p>
        </a>
        <a href="#" className={styles.block}>
          <p>Автотестинг</p>
        </a>
        <a href="#" className={styles.block}>
          <p>Отчеты</p>
        </a>
      </div>
      <div className={styles.pageDown}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quis vel
          facere sunt. Soluta libero quibusdam voluptatem veniam necessitatibus
          excepturi reprehenderit? Voluptatibus, tempora similique? Earum
          molestias debitis facilis nostrum quo.
        </p>
      </div>
    </div>
  )
}
