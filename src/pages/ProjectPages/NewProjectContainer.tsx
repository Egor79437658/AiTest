import type React from 'react'
import styles from './styles/NewProjectContainer.module.scss'
import { useAuth, useUser } from '@contexts/'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useHeaderStore } from '@stores/'
import { TextArea } from '@components/'
import { Controller, useForm } from 'react-hook-form'

type FormData = {
  url: string
  description: string
}

export const NewProjectContainer: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const { user, updateUserSettings, isLoading } = useUser()
  const { setHeaderContent } = useHeaderStore()
  const [description, setDescription] = useState('')
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  useEffect(
    () =>
      setHeaderContent(
        <div>
          <Link to="/">ЯМП&nbsp;</Link>
          &mdash;&nbsp; новый проект
        </div>
      ),
    [setHeaderContent]
  )

  if (!isAuthenticated) {
    return <div>Please log in to access projects</div>
  }

  if (isLoading && !user) {
    return <div>Loading user data...</div>
  }

  function handleCreate(data: FormData) {
    console.log(data)
  }

  return (
    <>
      {/* <Pipeline /> */}
      <div className={styles.pageContainer}>
        <form className={styles.form} onSubmit={handleSubmit(handleCreate)}>
          <h2>Новый проект</h2>
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
        </form>
      </div>
    </>
  )
}
