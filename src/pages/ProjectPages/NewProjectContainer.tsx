import type React from 'react'
import styles from './styles/NewProjectContainer.module.scss'
import { useAuth, useProject, useUser } from '@contexts/'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useHeaderStore } from '@stores/'
import { Breadcrumbs, TextArea } from '@components/'
import { Controller, useForm } from 'react-hook-form'
import { MOCK_MODE, PAGE_ENDPOINTS } from '@constants/'
import { mockApiService } from '../../services/mockApiService'
import { projectsApi } from '@api'

type FormData = {
  name: string
  url: string
  description: string
}

export const NewProjectContainer: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const { user, isLoading, refreshUser } = useUser()
  const { loadProject } = useProject()
  const { setHeaderContent } = useHeaderStore()
  const navigator = useNavigate()
  const [errorMsg, setErrorMsg] = useState('')
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  useEffect(() => {
    setHeaderContent(<Breadcrumbs items={[{ text: 'новый проект' }]} />)
  }, [setHeaderContent])

  if (!isAuthenticated) {
    return <div>Please log in to access projects</div>
  }

  if (isLoading && !user) {
    return <div>Loading user data...</div>
  }

  async function handleCreate(data: FormData) {
    console.log(data)

    let newProject
    try {
      if (MOCK_MODE) {
        newProject = await mockApiService.createProject(data)
      } else {
        newProject = await projectsApi.createProject(data)
      }
      await loadProject(newProject.id)
      await refreshUser()
      navigator(
        `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${newProject.id}`
      )
    } catch (e: any) {
      setErrorMsg('что-то пошло не так - ' + e.message)
    }
  }

  return (
    <>
      {/* <Pipeline /> */}
      <div className={styles.pageContainer}>
        <form className={styles.form} onSubmit={handleSubmit(handleCreate)}>
          <h2>Новый проект</h2>
          <label htmlFor="name">Имя проекта:</label>
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'введите имя',
              validate: () => {
                // проверить что валидное время
                if (false) {
                  return 'Пожалуйста введите правильное имя'
                }
              },
            }}
            render={({ field }) => <input {...field} type="text" />}
          />
          <p className={styles.error}> {errors.name && errors.name.message}</p>

          <label htmlFor="url">URL:</label>
          <Controller
            name="url"
            control={control}
            rules={{
              required: 'введите url',
              validate: () => {
                // проверить что валидный адрес
                if (false) {
                  return 'Пожалуйста введите правильный url'
                }
              },
            }}
            render={({ field }) => <input {...field} type="text" />}
          />
          <p className={styles.error}> {errors.url && errors.url.message}</p>
          <label htmlFor="url">Описание</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                value={field.value}
                onChange={field.onChange}
                className={styles.textArea}
                maxLen={100000}
                // onBlur={(e) => {
                //   if (e) {
                //     e.currentTarget.style.height = '200px'
                //   }
                // }}
                // onFocus={(e) => {
                //   if (e) {
                //     e.currentTarget.style.height = '600px'
                //   }
                // }}
              />
            )}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Создание...' : 'Создать'}
          </button>
          <p className={styles.error}> {errorMsg}</p>
        </form>
      </div>
    </>
  )
}
