import { Table, TableColumn } from '@components/'
import { useProject, useTestCase } from '@contexts/'
import { TestCaseHistoryRecord } from '@interfaces/'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import styles from './HistoryTestCases.module.scss'

export const TestCasesHistory: React.FC = () => {
  const { project } = useProject()
  const { history, loadHistory, isLoading, error } = useTestCase()
  const { testCaseId } = useParams<{ testCaseId: string }>()

  useEffect(() => {
    loadHistory(project?.id || -1, parseInt(testCaseId || ''))
  }, [project, testCaseId])


  const columns: TableColumn[] = [
    {
      key: 'date',
      style: { width: '15%' },
      header: 'дата изменения',
      render: (value, _row, _rowIndex, onUpdate) => (
        <div>{value.toDateString()}</div>
      ),
    },
    {
      key: 'field',
      style: { width: '15%' },
      header: 'поле',
      render: (value, _row, _rowIndex, onUpdate) => <div>{value}</div>,
    },
    {
      key: 'oldVal',
      style: { width: '30%' },
      header: 'старое значение',
      render: (value, _row, _rowIndex, onUpdate) => <div>{value}</div>,
    },
    {
      key: 'newVal',
      style: { width: '30%' },
      header: 'новое значение',
      render: (value, _row, _rowIndex, onUpdate) => <div>{value}</div>,
    },
  ]

  if (isLoading) return <div className={styles.loadingDiv}>Загрузка...</div>
  if (error) return <div className={styles.errorDiv}>{error}</div>

  return (
    <div>
      <Table<TestCaseHistoryRecord>
        className={styles.table}
        columns={columns}
        data={history}
        showFilters={false}
      />
    </div>
  )
}
