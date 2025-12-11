import React from 'react'
import styles from './ProjectOverview.module.scss'
import { Project } from '@interfaces/'

interface ProjectOverviewProps {
  project: Project
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
}) => {
  return (
    <section className={styles.projectOverview}>
      <h2>Обзор проекта</h2>

      <div className={styles.projectInfo}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Название:</span>
          <span className={styles.value}>{project.name}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>URL:</span>
          <span className={styles.value}>
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              {project.url}
            </a>
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Наличие datapool:</span>
          <span className={styles.value}>
            {project.hasDatapool ? 'Да' : 'Нет'}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Описание:</span>
          <span className={styles.value}>{project.description}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Дата создания:</span>
          <span className={styles.value}>{project.createdAt.toLocaleDateString()}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Последнее обновление:</span>
          <span className={styles.value}>{project.updatedAt.toLocaleString()}</span>
        </div>
      </div>
    </section>
  )
}
