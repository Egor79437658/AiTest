import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useScript } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { Link } from 'react-router-dom'
import { Script, ScriptRun } from '@interfaces/'
import styles from './ViewScript.module.scss'
import { Breadcrumbs } from '@components/'
import { SyncLoader } from 'react-spinners'

export const ViewScript: React.FC = () => {
  const { project } = useProject()
  const { script, runs, loadScript, loadScriptRuns, runScript, isLoading } =
    useScript()
  const { setHeaderContent } = useHeaderStore()
  const navigate = useNavigate()
  const { scriptId } = useParams<{ scriptId: string }>()

  const [localScript, setLocalScript] = useState<Script | null>(null)
  const [recentRuns, setRecentRuns] = useState<ScriptRun[]>([])

  useEffect(() => {
    if (project && scriptId) {
      const id = parseInt(scriptId)
      loadScript(project.id, id)
      loadScriptRuns(project.id, id)
    }
  }, [project, scriptId, loadScript, loadScriptRuns])

  useEffect(() => {
    if (script) {
      setLocalScript(script)
    }
  }, [script])

  useEffect(() => {
    if (runs && runs.length > 0) {
      const sorted = [...runs].sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )
      setRecentRuns(sorted.slice(0, 5))
    }
  }, [runs])

  useEffect(() => {
    if (project && localScript) {
      setHeaderContent(
        <Breadcrumbs
          items={[
            {
              text: 'Проекты',
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.HOME}`,
            },
            {
              text: project.name,
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${project.id}`,
            },
            {
              text: 'Скрипты',
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${project.id}/${PAGE_ENDPOINTS.PROJECT_PARTS.SCRIPT}`,
            },
            { text: localScript.name },
          ]}
        />
      )
    }
  }, [project, localScript, setHeaderContent])

  const handleRun = async () => {
    if (!project || !localScript) return
    if (window.confirm(`Запустить скрипт "${localScript.name}"?`)) {
      await runScript(project.id, localScript.id)
      loadScriptRuns(project.id, localScript.id)
    }
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return '—'
    if (duration < 60) return `${duration} сек`
    if (duration < 3600) return `${Math.floor(duration / 60)} мин`
    return `${Math.floor(duration / 3600)} ч ${Math.floor((duration % 3600) / 60)} мин`
  }

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'успешно':
        return styles.successStatus
      case 'с_ошибками':
        return styles.errorStatus
      default:
        return styles.defaultStatus
    }
  }

  if (isLoading || !localScript) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>
          <p>Загрузка скрипта</p>
          <SyncLoader color="#000000" />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <div className={styles.headerTop}>
          <h1>{localScript.name}</h1>
          <div className={styles.headerActions}>
            <button
              className={`${styles.actionButton} ${styles.runButton}`}
              onClick={handleRun}
            >
              ▶ Запустить
            </button>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>ID:</span>
            <span className={styles.infoValue}>{localScript.id}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Версия:</span>
            <span className={styles.infoValue}>{localScript.version}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Статус:</span>
            <span className={`${styles.infoValue} ${styles.statusBadge}`}>
              {localScript.status === 1
                ? 'Активный'
                : localScript.status === 2
                  ? 'Черновик'
                  : 'Архив'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Владелец:</span>
            <span className={styles.infoValue}>
              {localScript.owner?.username || 'Неизвестно'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Дата создания:</span>
            <span className={styles.infoValue}>
              {new Date(localScript.createdAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Последний запуск:</span>
            <span className={styles.infoValue}>
              {localScript.lastRunAt
                ? new Date(localScript.lastRunAt).toLocaleDateString('ru-RU')
                : 'Не запускался'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Тест-кейс (IDT):</span>
            <span className={styles.infoValue}>
              {localScript.testCaseId ? (
                <Link
                  to={`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${project?.id}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE}/${localScript.testCaseId}`}
                >
                  {localScript.testCaseId}
                </Link>
              ) : (
                'Не привязан'
              )}
            </span>
          </div>
        </div>

        {localScript.precondition && (
          <div className={styles.preconditionSection}>
            <h3>Предусловие</h3>
            <p>{localScript.precondition}</p>
          </div>
        )}
      </div>

      <div className={styles.codeSection}>
        <h3>Код скрипта</h3>
        <pre className={styles.codeBlock}>
          {localScript.code || '// Код не загружен'}
        </pre>
      </div>

      <div className={styles.runsSection}>
        <div className={styles.sectionHeader}>
          <h3>Последние запуски</h3>
          <button
            className={styles.viewAllButton}
            onClick={() => navigate('runs')}
          >
            Все запуски →
          </button>
        </div>

        {recentRuns.length > 0 ? (
          <table className={styles.runsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата и время</th>
                <th>Статус</th>
                <th>Длительность</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {recentRuns.map((run) => (
                <tr key={run.id}>
                  <td>#{run.id}</td>
                  <td>{formatDateTime(run.startedAt)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusColor(run.status)}`}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td>{formatDuration(run.duration)}</td>
                  <td>
                    <button
                      className={styles.detailsButton}
                      onClick={() => navigate(`runs/${run.id}`)}
                    >
                      Подробнее
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Нет запусков</p>
        )}
      </div>

      <div className={styles.formActions}>
        <button
          className={`${styles.actionButton} ${styles.backButton}`}
          onClick={() => navigate(-1)}
        >
          Назад
        </button>
      </div>
    </div>
  )
}
