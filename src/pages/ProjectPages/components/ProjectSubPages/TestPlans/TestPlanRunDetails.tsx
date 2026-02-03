import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useTestPlan } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { TestPlanRun } from '@interfaces/'
import styles from './TestPlanRunDetails.module.scss'

const TestPlanRunDetails: React.FC = () => {
  const { project } = useProject()
  const { testPlanId, runId } = useParams<{ testPlanId: string, runId: string }>()
  const { 
    testPlanRuns,
    isLoading 
  } = useTestPlan()
  const { setHeaderContent } = useHeaderStore()
  const navigate = useNavigate()
  
  const [runDetails, setRunDetails] = useState<TestPlanRun | null>(null)
  const [expandedErrors, setExpandedErrors] = useState<number[]>([])

  useEffect(() => {
    if (project && testPlanId && runId && testPlanRuns) {
      const run = testPlanRuns.find(r => r.id === parseInt(runId))
      setRunDetails(run || null)
      
      setHeaderContent(
        <div>
          <Link to="/">ЯМП&nbsp;</Link>
          &mdash;&nbsp;{' '}
          <Link
            to={
              window.location.href.split(
                '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN
              )[0]
            }
          >
            {project.name}&nbsp;
          </Link>{' '}
          &mdash;&nbsp;{' '}
          <Link
            to={
              window.location.href.split(
                '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN
              )[0] + '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN
            }
          >
            Тест-планы&nbsp;
          </Link>{' '}
          &mdash;&nbsp;{' '}
          <Link
            to={
              window.location.href.split(
                '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN
              )[0] + '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN + '/' + testPlanId
            }
          >
            Тест-план {testPlanId}&nbsp;
          </Link>{' '}
          &mdash;&nbsp;{' '}
          <Link
            to={
              window.location.href.split(
                '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN
              )[0] + '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN + '/' + testPlanId + '/runs'
            }
          >
            Журнал запусков&nbsp;
          </Link>{' '}
          &mdash;&nbsp; Запуск {runId}
        </div>
      )
    }
  }, [project, testPlanId, runId, testPlanRuns, setHeaderContent])

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
      second: '2-digit'
    })
  }

  const formatTimeOnly = (date: Date) => {
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'успешно': return styles.successStatus
      case 'с_ошибками': return styles.errorStatus
      case 'пропущен': return styles.warningStatus
      case 'запланирован': return styles.plannedStatus
      case 'в_работе': return styles.runningStatus
      case 'отменен': return styles.cancelledStatus
      default: return styles.defaultStatus
    }
  }

  const toggleErrorExpanded = (testCaseId: number) => {
    setExpandedErrors(prev => 
      prev.includes(testCaseId) 
        ? prev.filter(id => id !== testCaseId)
        : [...prev, testCaseId]
    )
  }

  const downloadLogs = () => {
    if (!runDetails) return
    
    const logData = {
      runId: runDetails.id,
      testPlanId: runDetails.testPlanId,
      startedAt: runDetails.startedAt,
      finishedAt: runDetails.finishedAt,
      status: runDetails.status,
      triggeredBy: runDetails.triggeredBy,
      results: runDetails.results
    }
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `test-plan-run-${runDetails.id}-logs.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const calculateTimeline = () => {
    if (!runDetails || !runDetails.results.length) return null
    
    const results = [...runDetails.results].sort((a, b) => 
      new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
    )
    
    const startTime = new Date(results[0].startedAt).getTime()
    const endTime = Math.max(
      ...results.map(r => r.finishedAt ? new Date(r.finishedAt).getTime() : new Date(r.startedAt).getTime())
    )
    
    const totalDuration = endTime - startTime
    
    return {
      results,
      startTime,
      endTime,
      totalDuration
    }
  }

  const timeline = calculateTimeline()

  if (isLoading || !runDetails) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Загрузка деталей запуска...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <div className={styles.headerTop}>
          <button 
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            Назад к журналу
          </button>
          <div className={styles.headerActions}>
            <button 
              className={styles.downloadButton}
              onClick={downloadLogs}
              title="Скачать логи"
            >
              Скачать логи
            </button>
          </div>
        </div>
        
        <div className={styles.runInfo}>
          <h1>Запуск тест-плана #{runDetails.id}</h1>
          
          <div className={styles.runStatus}>
            <span className={`${styles.statusBadge} ${getStatusColor(runDetails.status)}`}>
              {runDetails.status}
            </span>
            <span className={styles.runDuration}>
              {formatDuration(runDetails.duration)}
            </span>
          </div>
        </div>
        
        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>Дата и время запуска</div>
            <div className={styles.metaValue}>
              {formatDateTime(runDetails.startedAt)}
            </div>
          </div>
          
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>Кто запускал</div>
            <div className={styles.metaValue}>
              {runDetails.triggeredBy?.username || 'Неизвестно'}
            </div>
          </div>
          
          {runDetails.finishedAt && (
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Дата и время завершения</div>
              <div className={styles.metaValue}>
                {formatDateTime(runDetails.finishedAt)}
              </div>
            </div>
          )}
          
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>Тест-кейсов выполнено</div>
            <div className={styles.metaValue}>
              {runDetails.results.length} тест-кейсов
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentSections}>
        <div className={styles.resultsSection}>
          <h2>Результаты выполнения тест-кейсов</h2>
          <p className={styles.sectionSubtitle}>
            {runDetails.results.filter(r => r.status === 'успешно').length} успешно, 
            {runDetails.results.filter(r => r.status === 'с_ошибками').length} с ошибками, 
            {runDetails.results.filter(r => r.status === 'пропущен').length} пропущено
          </p>
          
          {runDetails.results.length > 0 ? (
            <div className={styles.resultsTable}>
              <table>
                <thead>
                  <tr>
                    <th>ID тест-кейса</th>
                    <th>Статус</th>
                    <th>Время начала</th>
                    <th>Время завершения</th>
                    <th>Длительность</th>
                    <th>Логи</th>
                  </tr>
                </thead>
                <tbody>
                  {runDetails.results.map((result, index) => (
                    <React.Fragment key={result.testCaseId}>
                      <tr className={styles.resultRow}>
                        <td className={styles.testCaseId}>
                          #{result.testCaseId}
                        </td>
                        <td className={styles.statusCell}>
                          <div className={styles.statusWrapper}>
                            <span className={`${styles.statusText} ${getStatusColor(result.status)}`}>
                              {result.status}
                            </span>
                          </div>
                        </td>
                        <td className={styles.timeCell}>
                          {formatTimeOnly(result.startedAt)}
                        </td>
                        <td className={styles.timeCell}>
                          {result.finishedAt ? formatTimeOnly(result.finishedAt) : '—'}
                        </td>
                        <td className={styles.durationCell}>
                          {formatDuration(result.duration)}
                        </td>
                        <td className={styles.logsCell}>
                          {result.error && (
                            <button
                              className={styles.errorToggleButton}
                              onClick={() => toggleErrorExpanded(result.testCaseId)}
                            >
                              {expandedErrors.includes(result.testCaseId) ? 'Скрыть' : 'Показать'} ошибку
                            </button>
                          )}
                        </td>
                      </tr>
                      {result.error && expandedErrors.includes(result.testCaseId) && (
                        <tr className={styles.errorRow}>
                          <td colSpan={6}>
                            <div className={styles.errorDetails}>
                              <h4>Ошибка выполнения тест-кейса #{result.testCaseId}</h4>
                              <pre className={styles.errorLog}>
                                {result.error}
                              </pre>
                              <div className={styles.errorMeta}>
                                <span>Время: {formatTimeOnly(result.startedAt)}</span>
                                <span>Длительность: {formatDuration(result.duration)}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noResults}>
              <p>Нет данных о выполнении тест-кейсов</p>
            </div>
          )}
        </div>

        {timeline && (
          <div className={styles.timelineSection}>
            <h2>Таймлайн выполнения</h2>
            <div className={styles.timelineContainer}>
              <div className={styles.timelineHeader}>
                <div className={styles.timelineStart}>
                  {formatTimeOnly(new Date(timeline.startTime))}
                </div>
                <div className={styles.timelineEnd}>
                  {formatTimeOnly(new Date(timeline.endTime))}
                </div>
              </div>
              
              <div className={styles.timelineTrack}>
                {timeline.results.map((result, index) => {
                  const startOffset = ((new Date(result.startedAt).getTime() - timeline.startTime) / timeline.totalDuration) * 100
                  const endOffset = result.finishedAt 
                    ? ((new Date(result.finishedAt).getTime() - timeline.startTime) / timeline.totalDuration) * 100
                    : startOffset + 10
                  const width = endOffset - startOffset
                  
                  return (
                    <div
                      key={`${result.testCaseId}-${index}`}
                      className={`${styles.timelineItem} ${getStatusColor(result.status)}`}
                      style={{
                        left: `${startOffset}%`,
                        width: `${width}%`,
                      }}
                      title={`Тест-кейс #${result.testCaseId}: ${result.status} (${formatDuration(result.duration)})`}
                    >
                      <div className={styles.timelineItemContent}>
                        #{result.testCaseId}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className={styles.timelineLegend}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.successStatus}`}></div>
                  <span>Успешно</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.errorStatus}`}></div>
                  <span>С ошибками</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.warningStatus}`}></div>
                  <span>Пропущено</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.summarySection}>
          <h2>Сводка выполнения</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Общее время выполнения</div>
              <div className={styles.summaryValue}>
                {formatDuration(runDetails.duration)}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Всего тест-кейсов</div>
              <div className={styles.summaryValue}>
                {runDetails.results.length}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Успешно выполнено</div>
              <div className={`${styles.summaryValue} ${styles.success}`}>
                {runDetails.results.filter(r => r.status === 'успешно').length}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>С ошибками</div>
              <div className={`${styles.summaryValue} ${styles.error}`}>
                {runDetails.results.filter(r => r.status === 'с_ошибками').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPlanRunDetails