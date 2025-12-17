import { MySwiper } from '@components/'
import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useTestCase } from '@contexts/'
import { TestCase, testCaseStatusMap } from '@interfaces/'
import { useHeaderStore } from '@stores/'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SwiperSlide } from 'swiper/react'
import styles from './RedactTestCases.module.scss'
import { Controller, useForm } from 'react-hook-form'

interface TestCaseForm {
  name: string
  positive: boolean
  version: string
  scriptIds: { id: number; name: string }[]
  owner: { id: number; username: string }
  testCases: { id: number; name: string }[]
  status: 0 | 1 | 2
  steps: { precondition: string; action: string; result: string }[]
}

export const RedactTestCase: React.FC = () => {
  const { project } = useProject()
  const { allTestCases: testCases, isLoading, error } = useTestCase()
  const { setHeaderContent } = useHeaderStore()
  const { testCaseId } = useParams<{ testCaseId: string }>()
  const [testCase, setTestCase] = useState<TestCase>(null)
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TestCaseForm>()

  useEffect(() => {
    const parsedTestCaseId = parseInt(testCaseId || '-1')
    console.log()
    const data = testCases.find((el) => el.id === parsedTestCaseId)
    if (data) {
      setTestCase(data)
      for (const [key, value] of Object.entries(data as TestCaseForm)) {
        setValue(key, value)
      }
      setHeaderContent(
        <div>
          <Link to="/">ЯМП&nbsp;</Link>
          &mdash;&nbsp;{' '}
          <Link
            to={
              window.location.href.split(
                '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE
              )[0]
            }
          >
            {project?.name}&nbsp;
          </Link>{' '}
          &mdash;&nbsp;{' '}
          <Link
            to={
              window.location.href.split(
                '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE
              )[0] +
              '/' +
              PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE
            }
          >
            Тест-кейсы&nbsp;
          </Link>{' '}
          &mdash;&nbsp; {data?.name}
        </div>
      )
    }
  }, [testCaseId])

  if (!testCase) {
    return <div>Загрузка тест-кейса</div>
  }

  const handleSave = async (data: TestCaseForm) => {
    console.log(data)
  }

  return (
    <div className={styles.pageContainer}>
      <form className={styles.form} onSubmit={handleSubmit(handleSave)}>
        <h2>Тест-кейс IDT: {testCase.id}</h2>

        <div>
          <label htmlFor="id">Имя: </label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'введите имя тест-кейса' }}
            render={({ field }) => (
              <input {...field} className={styles.input} type="text" />
            )}
          />
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="positive">Позитвный: </label>
          <Controller
            name="positive"
            control={control}
            render={({ field }) => (
              <input
                id="positivve"
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className={styles.checkbox}
              />
            )}
          />
        </div>

        <div>
          <label htmlFor="version">Версия: </label>
          <Controller
            name="version"
            control={control}
            rules={{
              required: 'введите версию',
              pattern: {
                value: /^\d{3}\.\d{3}\.\d{3}$/,
                message: 'Версия должана выглядеть как 000.000.000',
              },
            }}
            render={({ field }) => (
              <input {...field} className={styles.input} type="text" />
            )}
          />
          {errors.version && (
            <span className={styles.error}>{errors.version.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="scriptIds">Скрипты: </label>
          <span>{testCase.scriptIds.map((val) => val.name).join(' ')}</span>
        </div>

        <div>
          <label htmlFor="username">Владелец: </label>
          <span>{testCase.owner.username}</span>
        </div>

        <div>
          <label htmlFor="creationDate">Дата создания: </label>
          <span>{testCase.creationDate.toLocaleDateString()}</span>
        </div>

        <div>
          <label htmlFor="testCases">Предусловие: </label>
          <span>{testCase.testCases.map((val) => val.name).join(' ')}</span>
        </div>


        <div>
          <label htmlFor="status">Статус: </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select {...field} className={styles.select}>
                {Object.entries(testCaseStatusMap).map(([key, value]) => (
                  <option value={key}>{value}</option>
                ))}
              </select>
            )}
          />
        </div>

        <h3>Шаги</h3>
        {testCase.steps.map(el => <div>{JSON.stringify(el)}</div>)}

      </form>
    </div>
  )
}
