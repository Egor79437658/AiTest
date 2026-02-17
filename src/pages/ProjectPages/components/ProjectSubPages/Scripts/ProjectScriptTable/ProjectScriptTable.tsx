import React from 'react'
import { Table, TableColumn } from '@components/'
import { Script } from '@interfaces/'
import { Link } from 'react-router-dom'
import styles from './ProjectScriptTable.module.scss'
import eyeIcon from '/icons/eye.svg'

interface Props {
  scripts: Script[]
  onRun: (ids: number[]) => void
  onRefactor: (ids: number[]) => void
  onDelete: (ids: number[]) => void
  onOpenHistory: (id: number) => void
  onEdit: (id: number) => void
  onView: (id: number) => void
  projectBaseUrl: string
}

export const ProjectScriptTable: React.FC<Props> = ({
  scripts,
  onRun,
  onRefactor,
  onDelete,
  onOpenHistory,
  onEdit,
  onView,
  projectBaseUrl,
}) => {
  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return 'Активный'
      case 2:
        return 'Черновик'
      default:
        return 'Архив'
    }
  }

  const columns: TableColumn[] = [
    { key: 'id', header: 'ID', style: { width: '5%' } },
    { key: 'name', header: 'Название', style: { width: '20%' } },
    { key: 'version', header: 'Версия', style: { width: '8%' } },
    {
      key: 'testCaseId',
      header: 'IDT',
      style: { width: '5%' },
      render: (value) =>
        value ? (
          <Link
            to={`${projectBaseUrl}/test-case/${value}`}
            className={styles.link}
          >
            {value}
          </Link>
        ) : (
          '—'
        ),
    },
    {
      key: 'status',
      header: 'Статус',
      style: { width: '8%' },
      render: (value) => getStatusText(value),
    },
    {
      key: 'lastRunStatus',
      header: 'Последний запуск',
      style: { width: '10%' },
      render: (value, row) => (
        <div>
          {value ? (
            <span
              className={value === 'успешно' ? styles.success : styles.error}
            >
              {value}
            </span>
          ) : (
            '—'
          )}
          {row.lastRunAt && (
            <div className={styles.date}>
              {new Date(row.lastRunAt).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'duration',
      header: 'Время выполнения',
      style: { width: '8%' },
      render: (value) => (value ? `${value} мс` : '—'),
    },
    {
      key: 'owner',
      header: 'Владелец',
      style: { width: '10%' },
      render: (value) => value?.username || '—',
    },
    {
      key: 'actions',
      header: 'Действия',
      style: { width: '20%' },
      render: (_, row) => (
        <div className={styles.actions}>
          <button
            onClick={() => onRun([row.id])}
            title="Запустить"
            className={styles.actionBtn}
          >
            ▶
          </button>
          <button
            onClick={() => onView(row.id)}
            title="Просмотр"
            className={styles.actionBtn}
          >
            <img src={eyeIcon} />
          </button>
          <button
            onClick={() => onEdit(row.id)}
            title="Редактировать"
            className={styles.actionBtn}
          >
            ✎
          </button>
          <button
            onClick={() => onOpenHistory(row.id)}
            title="Журнал запусков"
            className={styles.actionBtn}
          >
            📋
          </button>
          <button
            onClick={() => onRefactor([row.id])}
            title="Рефакторинг"
            className={styles.actionBtn}
          >
            🔄
          </button>
          <button
            onClick={() => onDelete([row.id])}
            title="Удалить"
            className={styles.actionBtn}
          >
            🗑
          </button>
        </div>
      ),
    },
  ]

  return <Table columns={columns} data={scripts} className={styles.table} />
}
