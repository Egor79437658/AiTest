import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useTestPlan } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { TestPlanRun } from '@interfaces/'
import styles from './TestPlanRunHistory.module.scss'

const TestPlanRunHistory: React.FC = () => {
  const { project } = useProject()
  const { testPlanId } = useParams<{ testPlanId: string }>()
  const { 
    testPlanRuns, 
    loadTestPlanRuns,
    isLoading 
  } = useTestPlan()
  const { setHeaderContent } = useHeaderStore()
  const navigate = useNavigate()
  
  const [filteredRuns, setFilteredRuns] = useState<TestPlanRun[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('все')
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'status'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10

  useEffect(() => {
    if (project && testPlanId) {
      const projectId = project.id
      const testPlanIdNum = parseInt(testPlanId)
      loadTestPlanRuns(projectId, testPlanIdNum)
      
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
          &mdash;&nbsp; Журнал запусков
        </div>
      )
    }
  }, [project, testPlanId, setHeaderContent, loadTestPlanRuns])

  useEffect(() => {
    if (testPlanRuns) {
      let filtered = [...testPlanRuns]
      
      if (statusFilter !== 'все') {
        filtered = filtered.filter(run => run.status === statusFilter)
      }
      
      if (searchTerm) {
        filtered = filtered.filter(run => 
          run.triggeredBy?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          run.id.toString().includes(searchTerm) ||
          run.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      filtered.sort((a, b) => {
        let valueA, valueB
        
        switch (sortBy) {
          case 'date':
            valueA = new Date(a.startedAt).getTime()
            valueB = new Date(b.startedAt).getTime()
            break
          case 'duration':
            valueA = a.duration || 0
            valueB = b.duration || 0
            break
          case 'status':
            valueA = a.status
            valueB = b.status
            break
        }
        
        if (sortOrder === 'asc') {
          return valueA > valueB ? 1 : -1
        } else {
          return valueA < valueB ? 1 : -1
        }
      })
      
      setFilteredRuns(filtered)
    }
  }, [testPlanRuns, statusFilter, sortBy, sortOrder, searchTerm])

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
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'успешно': return styles.successStatus
      case 'с_ошибками': return styles.errorStatus
      case 'запланирован': return styles.plannedStatus
      case 'в_работе': return styles.runningStatus
      case 'отменен': return styles.cancelledStatus
      default: return styles.defaultStatus
    }
  }

  const calculateStatistics = () => {
    if (!testPlanRuns) return { total: 0, successful: 0, failed: 0, inProgress: 0 }
    
    const total = testPlanRuns.length
    const successful = testPlanRuns.filter(r => r.status === 'успешно').length
    const failed = testPlanRuns.filter(r => r.status === 'с_ошибками').length
    const inProgress = testPlanRuns.filter(r => r.status === 'в_работе').length
    
    return { total, successful, failed, inProgress }
  }

  const stats = calculateStatistics()
  
  const totalPages = Math.ceil(filteredRuns.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRuns = filteredRuns.slice(startIndex, endIndex)

  const handleRefresh = () => {
    if (project && testPlanId) {
      const projectId = project.id
      const testPlanIdNum = parseInt(testPlanId)
      loadTestPlanRuns(projectId, testPlanIdNum)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Загрузка журнала запусков...</p>
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
            Назад к тест-плану
          </button>
          <button 
            className={styles.refreshButton}
            onClick={handleRefresh}
            title="Обновить"
          >
            ↻ Обновить
          </button>
        </div>
        
        <h1>Журнал запусков тест-плана</h1>
        <p className={styles.subtitle}>История всех запусков тест-плана с детальной информацией</p>
        
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Всего запусков</div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statValue} ${styles.success}`}>{stats.successful}</div>
            <div className={styles.statLabel}>Успешных</div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statValue} ${styles.error}`}>{stats.failed}</div>
            <div className={styles.statLabel}>С ошибками</div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statValue} ${styles.running}`}>{stats.inProgress}</div>
            <div className={styles.statLabel}>В работе</div>
          </div>
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.filtersSection}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Поиск по ID, пользователю, статусу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterControls}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                Фильтр по статусу:
              </label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="все">Все статусы</option>
                <option value="успешно">Успешно</option>
                <option value="с_ошибками">С ошибками</option>
                <option value="запланирован">Запланирован</option>
                <option value="в_работе">В работе</option>
                <option value="отменен">Отменен</option>
              </select>
            </div>
            
            <div className={styles.sortGroup}>
              <label className={styles.filterLabel}>
                Сортировка:
              </label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'date' | 'duration' | 'status')}
                className={styles.filterSelect}
              >
                <option value="date">По дате</option>
                <option value="duration">По длительности</option>
                <option value="status">По статусу</option>
              </select>
              <button 
                className={styles.sortOrderButton}
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
              </button>
            </div>
          </div>
        </div>

        {filteredRuns.length > 0 ? (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.runsTable}>
                <thead>
                  <tr>
                    <th>ID запуска</th>
                    <th>Дата и время запуска</th>
                    <th>Статус выполнения</th>
                    <th>Кто запускал</th>
                    <th>Время выполнения</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRuns.map((run) => (
                    <tr key={run.id}>
                      <td className={styles.idCell}>#{run.id}</td>
                      <td className={styles.dateCell}>{formatDateTime(run.startedAt)}</td>
                      <td className={styles.statusCell}>
                        <span className={`${styles.statusBadge} ${getStatusColor(run.status)}`}>
                          {run.status}
                        </span>
                      </td>
                      <td className={styles.userCell}>
                        {run.triggeredBy?.username || 'Неизвестно'}
                      </td>
                      <td className={styles.durationCell}>
                        {formatDuration(run.duration)}
                      </td>
                      <td className={styles.actionsCell}>
                        <button
                          className={styles.detailsButton}
                          onClick={() => navigate(`${run.id}`)}
                          title="Просмотреть детали"
                        >
                          👁 Подробнее
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.paginationButton}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Назад
                </button>
                
                <div className={styles.pageNumbers}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`${styles.pageButton} ${currentPage === pageNum ? styles.activePage : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  className={styles.paginationButton}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Вперед
                </button>
                
                <div className={styles.pageInfo}>
                  Показано {startIndex + 1}-{Math.min(endIndex, filteredRuns.length)} из {filteredRuns.length}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.noRuns}>
            <p>Нет запусков тест-плана</p>
            {statusFilter !== 'все' && (
              <button 
                className={styles.clearFilterButton}
                onClick={() => setStatusFilter('все')}
              >
                Очистить фильтр
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TestPlanRunHistory