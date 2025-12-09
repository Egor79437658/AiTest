import React from 'react'
import { Link } from 'react-router-dom'
import styles from './ProjectStats.module.scss'

interface ProjectStatsProps {
  stats: {
    testCaseCount: number
    scriptCount: number
    testPlanCount: number
    testPlanRunCount: number
  }
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ stats }) => {
  const statCards = [
    {
      number: stats.testCaseCount,
      label: 'Тест-кейсов',
      link: '/test-cases',
      linkText: 'Перейти к списку ТК',
    },
    {
      number: stats.scriptCount,
      label: 'Скриптов',
      link: '/scripts',
      linkText: 'Перейти к списку скриптов',
    },
    {
      number: stats.testPlanCount,
      label: 'Тест-планов',
      link: '/test-plans',
      linkText: 'Перейти к списку прогонов',
    },
    {
      number: stats.testPlanRunCount,
      label: 'Запусков тест-планов',
      link: '/test-plan-runs',
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
