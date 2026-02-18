import { useScript } from '@contexts/'
import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'

export const ScriptOutlet: React.FC = () => {
  const { loadAllScripts, isLoading, error } = useScript()
  const { projectId } = useParams<{ projectId: string }>()

  useEffect(() => {
    if (!projectId) throw new Error('no project id was provided')
    const targetProjectId = parseInt(projectId)
    try {
      loadAllScripts(targetProjectId)
    } catch (error) {
      console.error('Ошибка при загрузке скриптов:', error)
    }
  }, [projectId, loadAllScripts])

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
        <div>Загрузка скриптов</div>
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
        <div>При загрузке скриптов произошла ошибка:</div>
        <div>{error}</div>
      </div>
    )
  }

  return <Outlet />
}
