import React, { useEffect } from 'react'
import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useTestPlan } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { Link, useNavigate } from 'react-router-dom'
import { ProjectTestPlanTable } from '../../components/'
import styles from './ProjectTestPlans.module.scss'
import { Breadcrumbs } from '@components/'

export const ProjectTestPlans: React.FC = () => {
  const { project } = useProject()
  const {
    allTestPlans: testPlans,
    loadAllTestPlans,
    deleteTestPlan,
    cloneTestPlan,
    isLoading,
    error,
  } = useTestPlan()
  const { setHeaderContent } = useHeaderStore()
  const navigate = useNavigate()

  const handleRunTestPlan = (ids: number[]) => {
    console.log('Запуск тест-планов:', ids)
    if (ids.length === 1) {
      if (window.confirm(`Запустить тест-план ID ${ids[0]}?`)) {
      }
    } else {
      if (window.confirm(`Запустить ${ids.length} тест-планов?`)) {
      }
    }
  }




  // useEffect(() => {
  //   if (project) {
  //     try {
  //       loadAllTestPlans(project.id)
  //     } catch (e: any) {
  //       console.log('failed to load test-plans:', e)
  //     }
  //   }
  // }, [project, loadAllTestPlans])

  const handleDelete = async (ids: number[]) => {
    console.log('Тест-планы для удаления:', ids)
    
    if (!project) {
      alert('Ошибка: проект не найден')
      return
    }
    
    if (ids.length === 0) {
      alert('Не выбраны тест-планы для удаления')
      return
    }
    
    const confirmDelete = window.confirm(
      `Вы уверены, что хотите удалить ${ids.length} тест-планов?`
    )
    
    if (!confirmDelete) return
    
    try {
      await Promise.all(
        ids.map(id => deleteTestPlan(project.id, id))
      )
      
      await loadAllTestPlans(project.id)
      
      alert(`Успешно удалено ${ids.length} тест-планов`)
    } catch (error) {
      console.error('Ошибка при удалении тест-планов:', error)
      alert('Произошла ошибка при удалении тест-планов')
    }
  }

  const handleClone = async (ids: number[]) => {
    console.log('Клонирование тест-планов:', ids)
    
    if (!project) {
      alert('Ошибка: проект не найден')
      return
    }
    
    if (ids.length === 0) {
      alert('Не выбраны тест-планы для клонирования')
      return
    }
    
    if (ids.length > 1) {
      alert('Можно клонировать только один тест-план за раз')
      return
    }
    
    const testPlanId = ids[0]
    const confirmClone = window.confirm(
      `Вы уверены, что хотите клонировать тест-план ID ${testPlanId}?`
    )
    
    if (!confirmClone) return
    
    try {
      await cloneTestPlan(project.id, testPlanId)
      
      await loadAllTestPlans(project.id)
      
      alert('Тест-план успешно клонирован!')
    } catch (error) {
      console.error('Ошибка при клонировании тест-плана:', error)
      alert('Произошла ошибка при клонировании тест-плана')
    }
  }

  const handleOpenHistory = (id: number) => {
    console.log('Журнал запусков для:', id)
    navigate(`${window.location.pathname}/${id}/runs`)
  }

  const handleEditPlan = (id: number) => {
    console.log('Редактировать тест-план:', id)
    navigate(`${window.location.pathname}/${id}/edit`)
  }

  const handleViewDetails = (id: number) => {
    console.log('Детали тест-плана:', id)
    navigate(`${window.location.pathname}/${id}`)
  }

  useEffect(() => {
    setHeaderContent(
      <Breadcrumbs
        items={[
          {
            text: project?.name || '',
            link: window.location.pathname.split(
              '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN
            )[0],
          },
          { text: 'Тест-планы' },
        ]}
      />
    )
  }, [project, setHeaderContent])

  const getProjectBaseUrl = () => {
    const path = window.location.pathname
    const testPlanPart = '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN
    const parts = path.split(testPlanPart)
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
        <p>Загрузка тест-планов...</p>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <h1>Тест-планы проекта</h1>
        <p className={styles.projectInfo}>
          Проект: <strong>{project?.name}</strong> | Всего тест-планов:{' '}
          <strong>{testPlans.length}</strong>
        </p>
      </div>

      <ProjectTestPlanTable
        testPlans={testPlans}
        onRunTestPlan={handleRunTestPlan}
        onDelete={handleDelete}
        onClone={handleClone}
        onOpenHistory={handleOpenHistory}
        onEditPlan={handleEditPlan}
        onViewDetails={handleViewDetails}
        projectBaseUrl={getProjectBaseUrl()}
      />
    </div>
  )
}