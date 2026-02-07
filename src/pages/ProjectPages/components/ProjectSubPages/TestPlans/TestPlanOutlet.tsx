import { useTestPlan } from '@contexts/'
import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'

export const TestPlanOutlet: React.FC = () => {
  const { loadAllTestPlans, isLoading, error } = useTestPlan()
  const { projectId } = useParams<{ projectId: string }>()

  useEffect(() => {
    if (!projectId) throw new Error('no project id was provided')
    const targetProjectId = parseInt(projectId)
    try {
      loadAllTestPlans(targetProjectId)
    } catch (error) {
      console.error('Ошибка при загрузке тест-планов:', error)
    }
  }, [projectId, loadAllTestPlans])

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Загрузка тест-планов</div>
        <SyncLoader color="#000000" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <div>При загрузке тест-планов произошла ошибка:</div>
        <div>{error}</div>
      </div>
    )
  }

  return <Outlet />
}
