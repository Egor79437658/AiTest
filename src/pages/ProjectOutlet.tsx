import { useProject } from '@contexts/'
import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'

export const ProjectOutlet: React.FC = () => {
  const { loadProject, isInitializing, error } = useProject()
  const { projectId } = useParams<{ projectId: string }>()
  useEffect(() => {
    if (!projectId) throw new Error('no project id was provided')
    const targetProjectId = parseInt(projectId)

    try {
      loadProject(targetProjectId)
    } catch (e: any) {
      console.log(e.message)
    }
  }, [projectId, loadProject])

  if (isInitializing) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Загрузка проекта</div>
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
        <div>При загрузке проекта произошла ошибка:</div>
        <div>{error}</div>
      </div>
    )
  }

  return <Outlet />
}
