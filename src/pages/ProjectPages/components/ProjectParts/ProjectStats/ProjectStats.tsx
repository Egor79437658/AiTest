import React from 'react'
import { Link } from 'react-router-dom'
import styles from './ProjectStats.module.scss'
import { PAGE_ENDPOINTS } from '@constants/'

interface ProjectStatsProps {
  projectId: number
  stats: {
    testCaseCount: number
    scriptCount: number
    testPlanCount: number
    testPlanRunCount: number
  }
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({
  projectId,
  stats,
}) => {
  const statCards = [
    {
      number: stats.testCaseCount,
      label: 'Тест-кейсов',
      link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${projectId}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE}`,
      linkText: 'Перейти к списку ТК',
    },
    {
      number: stats.scriptCount,
      label: 'Скриптов',
      link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${projectId}/${PAGE_ENDPOINTS.PROJECT_PARTS.SCRIPT}`,
      linkText: 'Перейти к списку скриптов',
    },
    {
      number: stats.testPlanCount,
      label: 'Тест-планов',
      link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${projectId}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN}`,
      linkText: 'Перейти к списку прогонов',
    },
    {
      number: stats.testPlanRunCount,
      label: 'Запусков тест-планов',
      link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${projectId}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN_RUNS}`,
      linkText: 'Перейти к журналу запусков',
    },
  ]

  return (
    <section className={styles.statsSection}>
      <h3>Статистика проекта</h3>
      <div className={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statNumber}>{card.number}</div>
            <div className={styles.statLabel}>{card.label}</div>
            <Link to={card.link} className={styles.statLink}>
              {card.linkText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
