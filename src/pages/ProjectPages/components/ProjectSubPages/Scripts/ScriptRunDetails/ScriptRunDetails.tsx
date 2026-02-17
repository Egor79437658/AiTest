import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useScript } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { ScriptRun } from '@interfaces/'
import styles from './ScriptRunDetails.module.scss'
import { Breadcrumbs } from '@components/'

export const ScriptRunDetails: React.FC = () => {
  const { project } = useProject()
  const { scriptId, runId } = useParams<{ scriptId: string; runId: string }>()
  const { runs, scripts, loadScriptRuns, isLoading } = useScript()
  const { setHeaderContent } = useHeaderStore()
  const navigate = useNavigate()

  const [run, setRun] = useState<ScriptRun | null>(null)

  useEffect(() => {
    if (project && scriptId) {
      loadScriptRuns(project.id, parseInt(scriptId))
    }
  }, [project, scriptId, loadScriptRuns])

  useEffect(() => {
    if (runs.length > 0 && runId) {
      const found = runs.find((r) => r.id === parseInt(runId))
      setRun(found || null)
    }
  }, [runs, runId])

  useEffect(() => {
    if (project && scriptId && run) {
      const scriptName =
        scripts.find((s) => s.id === parseInt(scriptId))?.name || ''
      setHeaderContent(
        <Breadcrumbs
          items={[
            {
              text: project.name,
              link: window.location.pathname.split(
                '/' + PAGE_ENDPOINTS.PROJECT_PARTS.SCRIPT
              )[0],
            },
            {
              text: 'Скрипты',
              link: `/app/project/${project.id}/${PAGE_ENDPOINTS.PROJECT_PARTS.SCRIPT}`,
            },
            {
              text: scriptName,
              link: `/app/project/${project.id}/${PAGE_ENDPOINTS.PROJECT_PARTS.SCRIPT}/${scriptId}`,
            },
            {
              text: 'Журнал запусков',
              link: `/app/project/${project.id}/${PAGE_ENDPOINTS.PROJECT_PARTS.SCRIPT}/${scriptId}/runs`,
            },
            { text: `Запуск #${run.id}` },
          ]}
        />
      )
    }
  }, [project, scriptId, run, setHeaderContent, scripts])

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return '—'
    if (duration < 60) return `${duration} сек`
    if (duration < 3600) return `${Math.floor(duration / 60)} мин`
    return `${Math.floor(duration / 3600)} ч ${Math.floor((duration % 3600) / 60)} мин`
  }

  const downloadLogs = () => {
    if (!run) return
    const blob = new Blob([JSON.stringify(run, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `script-run-${run.id}-logs.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading || !run) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <h1>Детали запуска скрипта #{run.id}</h1>
        <button className={styles.downloadButton} onClick={downloadLogs}>
          Скачать логи
        </button>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>ID скрипта:</span>
          <span className={styles.value}>{run.scriptId}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Дата и время запуска:</span>
          <span className={styles.value}>{formatDateTime(run.startedAt)}</span>
        </div>
        {run.finishedAt && (
          <div className={styles.infoItem}>
            <span className={styles.label}>Дата и время завершения:</span>
            <span className={styles.value}>
              {formatDateTime(run.finishedAt)}
            </span>
          </div>
        )}
        <div className={styles.infoItem}>
          <span className={styles.label}>Статус:</span>
          <span className={`${styles.value} ${styles[run.status]}`}>
            {run.status}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Кто запускал:</span>
          <span className={styles.value}>
            {run.triggeredBy?.username || 'Неизвестно'}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Длительность:</span>
          <span className={styles.value}>{formatDuration(run.duration)}</span>
        </div>
      </div>

      {run.error && (
        <div className={styles.errorSection}>
          <h3>Ошибка выполнения</h3>
          <pre className={styles.errorLog}>{run.error}</pre>
        </div>
      )}

      {run.logs && (
        <div className={styles.logsSection}>
          <h3>Логи выполнения</h3>
          <pre className={styles.logs}>{run.logs}</pre>
        </div>
      )}
    </div>
  )
}
