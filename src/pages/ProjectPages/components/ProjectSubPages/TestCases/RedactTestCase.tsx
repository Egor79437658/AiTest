import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useTestCase } from '@contexts/'
import { TestCase, TestCaseUpdateData, testCaseStatusMap } from '@interfaces/'
import { useHeaderStore } from '@stores/'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from './RedactTestCases.module.scss'
import { Controller, useForm, useFieldArray } from 'react-hook-form'

interface TestCaseForm {
  name: string
  positive: boolean
  version: string
  scriptIds: { id: number; name: string }[]
  owner: { id: number; username: string }
  testCases: { id: number; name: string }[]
  status: 0 | 1 | 2
  steps: { precondition: string; action: string; result: string }[]
  precondition: string
}

export const RedactTestCase: React.FC = () => {
  const { project } = useProject()
  const { allTestCases: testCases, updateTestCase } = useTestCase()
  const { setHeaderContent } = useHeaderStore()
  const { testCaseId } = useParams<{ testCaseId: string }>()
  const [testCase, setTestCase] = useState<TestCase | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [newStepAdded, setNewStepAdded] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm<TestCaseForm>()

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
    insert: insertStep,
    move: moveStep,
  } = useFieldArray({
    control,
    name: 'steps',
  })

  const steps = watch('steps') || []
  const navigate = useNavigate()

  useEffect(() => {
    const parsedTestCaseId = parseInt(testCaseId || '-1')
    const data = testCases.find((el) => el.id === parsedTestCaseId)
    if (data) {
      setTestCase(data)
      reset({
        name: data.name,
        positive: data.positive,
        version: data.version,
        scriptIds: data.scriptIds,
        owner: data.owner,
        testCases: data.testCases,
        status: data.status,
        steps: data.steps || [],
        precondition: data.precondition,
      })

      if (data.steps && data.steps.length > 0) {
        setActiveStep(0)
      } else {
        setActiveStep(-1)
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
  }, [testCaseId, testCases, project, setHeaderContent, reset])

  useEffect(() => {
    if (newStepAdded) {
      setNewStepAdded(false)
    }
  }, [newStepAdded])

  const handleSave = async (data: TestCaseForm) => {
    if (!testCase || !project) return

    try {
      const updateData: TestCaseUpdateData = {
        name: data.name,
        positive: data.positive,
        version: data.version,
        status: data.status,
        steps: data.steps || [],
        id: testCase.id,
        flag: testCase.flag,
        scriptIds: testCase.scriptIds,
        owner: testCase.owner,
        testCases: testCase.testCases,
        precondition: testCase.precondition,
        usedInTestPlans: testCase.usedInTestPlans,
        testPlans: testCase.testPlans,
        creationDate: testCase.creationDate,
      }

      await updateTestCase(project.id, testCase.id, updateData)
      alert('Тест-кейс успешно сохранен!')
      navigate(-1) // return back after save
    } catch (error) {
      console.error('Ошибка при сохранении тест-кейса:', error)
      alert('Произошла ошибка при сохранении тест-кейса')
    }
  }

  const addStep = () => {
    const newStep = { precondition: '', action: '', result: '' }
    appendStep(newStep)
    const newIndex = steps.length
    setActiveStep(newIndex)
    setNewStepAdded(true)
  }

  const deleteStep = (index: number) => {
    if (steps.length <= 1) {
      alert('Тест-кейс должен содержать хотя бы один шаг')
      return
    }

    if (window.confirm('Вы уверены, что хотите удалить этот шаг?')) {
      removeStep(index)

      if (index === activeStep) {
        const newActiveStep = index > 0 ? index - 1 : 0
        setActiveStep(newActiveStep)
      } else if (index < activeStep) {
        setActiveStep(activeStep - 1)
      }
    }
  }

  const moveStepUp = (index: number) => {
    if (index === 0) return
    moveStep(index, index - 1)
    if (index === activeStep) {
      setActiveStep(index - 1)
    } else if (index - 1 === activeStep) {
      setActiveStep(index)
    }
  }

  const moveStepDown = (index: number) => {
    if (index === steps.length - 1) return
    moveStep(index, index + 1)
    if (index === activeStep) {
      setActiveStep(index + 1)
    } else if (index + 1 === activeStep) {
      setActiveStep(index)
    }
  }

  const addStepAfter = (index: number) => {
    const newStep = { precondition: '', action: '', result: '' }
    insertStep(index + 1, newStep)
    setActiveStep(index + 1)
    setNewStepAdded(true)
  }

  const saveAsNewVersion = async () => {
    if (!testCase || !project) return

    const confirm = window.confirm(
      'Сохранить как новую версию тест-кейса? Старая версия будет переведена в архив.'
    )
    if (!confirm) return

    try {
      const formData = getValues()
      const newVersionData: TestCaseUpdateData = {
        ...formData,
        version: `${testCase.version} (новая версия)`,
        id: testCase.id,
        flag: testCase.flag,
        scriptIds: testCase.scriptIds,
        owner: testCase.owner,
        testCases: testCase.testCases,
        precondition: testCase.precondition,
        usedInTestPlans: testCase.usedInTestPlans,
        testPlans: testCase.testPlans,
        creationDate: new Date(),
      }

      alert('in progress')
    } catch (error) {
      console.error('Ошибка при создании новой версии:', error)
      alert('Произошла ошибка при создании новой версии')
    }
  }

  if (!testCase) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Загрузка тест-кейса...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <form className={styles.form} onSubmit={handleSubmit(handleSave)}>
        <div className={styles.formHeader}>
          <h2>Тест-кейс IDT: {testCase.id}</h2>
          <div className={styles.formActionsTop}>
            <button
              type="submit"
              className={`${styles.actionButton} ${styles.primaryButton}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.secondaryButton}`}
              onClick={saveAsNewVersion}
            >
              Сохранить как новую версию
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.cancelButton}`}
              onClick={() => navigate(-1)}
            >
              Отмена
            </button>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Имя *</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Введите имя тест-кейса' }}
              render={({ field }) => (
                <input
                  {...field}
                  className={styles.input}
                  type="text"
                  placeholder="Введите имя тест-кейса"
                />
              )}
            />
            {errors.name && (
              <span className={styles.error}>{errors.name.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="version">Версия *</label>
            <Controller
              name="version"
              control={control}
              rules={{
                required: 'Введите версию',
                pattern: {
                  value: /^\d{3}\.\d{3}\.\d{3}$/,
                  message: 'Версия должна выглядеть как 000.000.000',
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  className={styles.input}
                  type="text"
                  placeholder="000.000.000"
                />
              )}
            />
            {errors.version && (
              <span className={styles.error}>{errors.version.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Статус</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select {...field} className={styles.select}>
                  {Object.entries(testCaseStatusMap).map(([key, value]) => (
                    <option key={key} value={parseInt(key)}>
                      {value}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
            <Controller
              name="positive"
              control={control}
              render={({ field }) => (
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  <span>Позитивный тест-кейс</span>
                </label>
              )}
            />
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Владелец:</span>
            <span className={styles.infoValue}>{testCase.owner.username}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Дата создания:</span>
            <span className={styles.infoValue}>
              {testCase.creationDate.toLocaleDateString()}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Скрипты:</span>
            <span className={styles.infoValue}>
              {testCase.scriptIds.length > 0
                ? testCase.scriptIds.map((val) => val.name).join(', ')
                : 'Нет'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Предусловие:</span>
            <span className={styles.infoValue}>
              {testCase.precondition || 'Нет'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>
              Используется в тест-кейсах:
            </span>
            <span className={styles.infoValue}>
              {testCase.testCases.length > 0
                ? testCase.testCases.map((val) => val.name).join(', ')
                : 'Нет'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Входит в тест-планы:</span>
            <span className={styles.infoValue}>
              {testCase.usedInTestPlans ? 'Да' : 'Нет'}
            </span>
          </div>
        </div>

        <div className={styles.stepsSection}>
          <div className={styles.sectionHeader}>
            <h3>Шаги тест-кейса</h3>
            <div className={styles.sectionActions}>
              <button
                type="button"
                className={styles.addButton}
                onClick={addStep}
              >
                + Добавить шаг
              </button>
            </div>
          </div>

          {steps.length === 0 ? (
            <div className={styles.noSteps}>
              <p>Нет шагов. Добавьте первый шаг.</p>
            </div>
          ) : (
            <>
              <div className={styles.stepsTabs}>
                {steps.map((_, index) => (
                  <button
                    key={stepFields[index]?.id || index}
                    type="button"
                    className={`${styles.stepTab} ${
                      activeStep === index ? styles.active : ''
                    } ${newStepAdded && index === steps.length - 1 ? styles.newStep : ''}`}
                    onClick={() => setActiveStep(index)}
                  >
                    Шаг {index + 1}
                  </button>
                ))}
              </div>

              {activeStep >= 0 && activeStep < steps.length && (
                <div className={styles.stepContent}>
                  <div className={styles.stepHeader}>
                    <h4>Шаг {activeStep + 1}</h4>
                    <div className={styles.stepActions}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => moveStepUp(activeStep)}
                        disabled={activeStep === 0}
                        title="Переместить вверх"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => moveStepDown(activeStep)}
                        disabled={activeStep === steps.length - 1}
                        title="Переместить вниз"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.deleteButton}`}
                        onClick={() => deleteStep(activeStep)}
                        disabled={steps.length <= 1}
                        title="Удалить шаг"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className={styles.stepFields}>
                    <div className={styles.fieldGroup}>
                      <label>Предусловие:</label>
                      <Controller
                        name={`steps.${activeStep}.precondition`}
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            className={styles.textarea}
                            placeholder="Введите предусловие для этого шага"
                            rows={3}
                          />
                        )}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Действие:</label>
                      <Controller
                        name={`steps.${activeStep}.action`}
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            className={styles.textarea}
                            placeholder="Опишите действие, которое нужно выполнить"
                            rows={3}
                          />
                        )}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Ожидаемый результат:</label>
                      <Controller
                        name={`steps.${activeStep}.result`}
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            className={styles.textarea}
                            placeholder="Опишите ожидаемый результат"
                            rows={3}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </form>
    </div>
  )
}
