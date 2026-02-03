import { useTestCase } from '@contexts/'
import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'

export const TestCasesOutlet: React.FC = () => {
  const { loadAllTestCases, isLoading, error } = useTestCase()
  const { projectId } = useParams<{ projectId: string }>()

  useEffect(() => {
    if (!projectId) throw new Error('no project id was provided')
    const targetProjectId = parseInt(projectId)
    try {
      loadAllTestCases(targetProjectId)
    } catch (error) {
      console.error('Ошибка при загрузке тест-кейсов:', error)
    }
  }, [projectId, loadAllTestCases])

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
        <div>Загрузка тест-кейсов</div>
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
        <div>При загрузке тест-кейсов произошла ошибка:</div>
        <div>{error}</div>
      </div>
    )
  }

  return <Outlet />
}
