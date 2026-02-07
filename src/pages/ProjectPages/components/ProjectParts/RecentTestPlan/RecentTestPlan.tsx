import React from 'react'
import styles from './RecentTestPlan.module.scss'
import { TestPlanRun, TestPlanRunShort } from '@interfaces/'

interface RecentTestPlanProps {
  runs: TestPlanRunShort[]
}

export const RecentTestPlan: React.FC<RecentTestPlanProps> = ({ runs }) => {
  if (!runs || runs.length === 0) {
    return (
      <section className={styles.projectSection}>
        <h3>Последние запуски тест-планов</h3>
        <div className={styles.noRuns}>Нет данных о запусках тест-планов</div>
      </section>
    )
  }

  return (
    <section className={styles.projectSection}>
      <h3>Последние запуски тест-планов</h3>
      <div className={styles.tableContainer}>
        <table className={styles.runsTable}>
          <thead>
            <tr>
              <th>Название тест-плана</th>
              <th>Дата последнего запуска</th>
              <th>Статус прохождения</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id}>
                <td>{run.name}</td>
                <td>{run.startedAt.toISOString()}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      run.status === 'успешно' ? styles.success : styles.error
                    }`}
                  >
                    {run.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
