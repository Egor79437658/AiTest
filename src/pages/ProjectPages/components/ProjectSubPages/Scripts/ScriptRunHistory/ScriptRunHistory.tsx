import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useScript } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { ScriptRun } from '@interfaces/'
import styles from './ScriptRunHistory.module.scss'
import { Breadcrumbs } from '@components/'

export const ScriptRunHistory: React.FC = () => {
  const { project } = useProject()
  const { scriptId } = useParams<{ scriptId: string }>()
  const { runs, loadScriptRuns, scripts, isLoading } = useScript()
  const { setHeaderContent } = useHeaderStore()
  const navigate = useNavigate()

  const [filteredRuns, setFilteredRuns] = useState<ScriptRun[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('все')
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'status'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10

  useEffect(() => {
    if (project && scriptId) {
      loadScriptRuns(project.id, parseInt(scriptId))
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
            { text: 'Журнал запусков' },
          ]}
        />
      )
    }
  }, [project, scriptId, setHeaderContent, loadScriptRuns, scripts])

  useEffect(() => {
    if (runs) {
      let filtered = [...runs]
      if (statusFilter !== 'все') {
        filtered = filtered.filter((run) => run.status === statusFilter)
      }
      if (searchTerm) {
        filtered = filtered.filter(
          (run) =>
            run.id.toString().includes(searchTerm) ||
            run.triggeredBy?.username
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            run.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      filtered.sort((a, b) => {
        let aVal: Date | number | string, bVal: Date | number | string
        switch (sortBy) {
          case 'date':
            aVal = new Date(a.startedAt).getTime()
            bVal = new Date(b.startedAt).getTime()
            break
          case 'duration':
            aVal = a.duration || 0
            bVal = b.duration || 0
            break
          case 'status':
            aVal = a.status
            bVal = b.status
            break
        }
        if (sortOrder === 'asc') return aVal > bVal ? 1 : -1
        return aVal < bVal ? 1 : -1
      })
      setFilteredRuns(filtered)
    }
  }, [runs, statusFilter, sortBy, sortOrder, searchTerm])

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
      case 'запланирован':
        return styles.plannedStatus
      case 'в_работе':
        return styles.runningStatus
      case 'отменен':
        return styles.cancelledStatus
      default:
        return styles.defaultStatus
    }
  }

  const totalPages = Math.ceil(filteredRuns.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentRuns = filteredRuns.slice(startIndex, startIndex + itemsPerPage)

  if (isLoading && !runs.length) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <h1>Журнал запусков скрипта</h1>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Поиск по ID, пользователю, статусу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="все">Все статусы</option>
          <option value="успешно">Успешно</option>
          <option value="с_ошибками">С ошибками</option>
          <option value="запланирован">Запланирован</option>
          <option value="в_работе">В работе</option>
          <option value="отменен">Отменен</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value as React.SetStateAction<
                'date' | 'duration' | 'status'
              >
            )
          }
        >
          <option value="date">По дате</option>
          <option value="duration">По длительности</option>
          <option value="status">По статусу</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {filteredRuns.length > 0 ? (
        <>
          <table className={styles.runsTable}>
            <thead>
              <tr>
                <th>ID запуска</th>
                <th>Дата и время запуска</th>
                <th>Статус</th>
                <th>Кто запускал</th>
                <th>Время выполнения</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {currentRuns.map((run) => (
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
                  <td>{run.triggeredBy?.username || '—'}</td>
                  <td>{formatDuration(run.duration)}</td>
                  <td>
                    <button onClick={() => navigate(`${run.id}`)}>
                      Подробнее
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Назад
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={currentPage === page ? styles.activePage : ''}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Вперед
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Нет запусков</p>
      )}
    </div>
  )
}
