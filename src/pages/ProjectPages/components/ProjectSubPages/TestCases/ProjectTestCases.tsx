import React, { useEffect } from 'react'
import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useTestCase } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { Link, useNavigate } from 'react-router-dom'
import { ProjectTestCaseTable } from './ProjectTestCaseTable'
import styles from './ProjectTestCases.module.scss'

export const ProjectTestCases: React.FC = () => {
  const { project } = useProject()
  const {
    allTestCases: testCases,
    loadAllTestCases,
    isLoading,
    error,
  } = useTestCase()
  const { setHeaderContent } = useHeaderStore()
  const navigate = useNavigate()

  const handleRefactor = (ids: number[]) => {
    console.log('Тест-кейсы для рефакторинга:', ids)
    // redirect refactoring with id
    navigate(`${window.location.pathname}/refactor?ids=${ids.join(',')}`)
  }

  const handleDelete = (ids: number[]) => {
    console.log('Тест-кейсы для удаления:', ids)
    // delete logic
    if (
      window.confirm(
        `Вы уверены, что хотите удалить ${ids.length} тест-кейсов?`
      )
    ) {
      // call api for delete
    }
  }

  const handleOpenHistory = (id: number) => {
    console.log('История изменений для:', id)
    navigate(`${window.location.pathname}/${id}/history`)
  }

  const handleEditCase = (id: number) => {
    console.log('Редактировать тест-кейс:', id)
    navigate(`${window.location.pathname}/${id}`)
  }

  useEffect(() => {
    setHeaderContent(
      <div>
        <Link to="/">ЯМП&nbsp;</Link>
        &mdash;&nbsp;{' '}
        <Link
          to={
            window.location.pathname.split(
              '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE
            )[0]
          }
        >
          {project?.name}&nbsp;
        </Link>{' '}
        &mdash;&nbsp; Тест-кейсы
      </div>
    )
  }, [project, setHeaderContent])

  useEffect(() => {
    if (project) {
      try {
        loadAllTestCases(project.id)
      } catch (e: any) {
        console.log('failed to load test-cases:', e)
      }
    }
  }, [project, loadAllTestCases])

  const getProjectBaseUrl = () => {
    const path = window.location.pathname
    const testCasePart = '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE
    const parts = path.split(testCasePart)
    return parts[0] || path
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Произошла ошибка</h3>
        <p>{error}</p>
        <br />
        <Link to="/" className={styles.backLink}>
          Вернуться к списку проектов
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Загрузка тест-кейсов...</p>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <h1>Тест-кейсы проекта</h1>
        <p className={styles.projectInfo}>
          Проект: <strong>{project?.name}</strong> | Всего тест-кейсов:{' '}
          <strong>{project?.testCases.length}</strong>
        </p>
      </div>

      <ProjectTestCaseTable
        testCases={testCases}
        onRefactor={handleRefactor}
        onDelete={handleDelete}
        onOpenHistory={handleOpenHistory}
        onEditCase={handleEditCase}
        projectBaseUrl={getProjectBaseUrl()}
      />
    </div>
  )
}
