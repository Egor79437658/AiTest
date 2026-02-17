import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useScript, useTestCase } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { Script, ScriptUpdateData, ScriptStatus } from '@interfaces/'
import styles from './RedactScript.module.scss'
import { Breadcrumbs, QuestionDialog } from '@components/'
import { SyncLoader } from 'react-spinners'
import { toast } from 'sonner'

interface ScriptFormData {
  name: string
  version: string
  status: ScriptStatus
  testCaseId: number | null
  precondition: string
  code: string
}

export const RedactScript: React.FC = () => {
  const { project } = useProject()
  const { scripts, createScript, updateScript, isLoading } = useScript()
  const { allTestCases, loadAllTestCases } = useTestCase()
  const { setHeaderContent } = useHeaderStore()
  const navigate = useNavigate()
  const { scriptId } = useParams<{ scriptId: string }>()

  const [script, setScript] = useState<Script | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showCancelDiag, setShowCancelDiag] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<ScriptFormData>({
    defaultValues: {
      name: '',
      version: '001.000.000',
      status: 2, // черновик
      testCaseId: null,
      precondition: '',
      code: '',
    },
  })

  const testCaseId = watch('testCaseId')

  // Автозаполнение названия от ТК
  useEffect(() => {
    if (testCaseId && allTestCases.length > 0) {
      const tc = allTestCases.find((t) => t.id === testCaseId)
      if (tc) {
        setValue('name', `АТ_${tc.name}`)
      }
    }
  }, [testCaseId, allTestCases, setValue])

  useEffect(() => {
    if (project) {
      loadAllTestCases(project.id)
    }
  }, [project, loadAllTestCases])

  useEffect(() => {
    const parsedId = parseInt(scriptId || '-1')
    if (parsedId === -1) {
      setIsCreating(true)
      reset({
        name: '',
        version: '001.000.000',
        status: 2,
        testCaseId: null,
        precondition: '',
        code: '',
      })
    } else {
      setIsCreating(false)
      const existing = scripts.find((s) => s.id === parsedId)
      if (existing) {
        setScript(existing)
        reset({
          name: existing.name,
          version: existing.version,
          status: existing.status,
          testCaseId: existing.testCaseId || null,
          precondition: existing.precondition || '',
          code: existing.code || '',
        })
      }
    }
  }, [scriptId, scripts, reset])

  useEffect(() => {
    if (project) {
      setHeaderContent(
        <Breadcrumbs
          items={[
            {
              text: 'Проекты',
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.HOME}`,
            },
            {
              text: project.name,
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${project.id}`,
            },
            {
              text: 'Скрипты',
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${project.id}/${PAGE_ENDPOINTS.PROJECT_PARTS.SCRIPT}`,
            },
            {
              text: isCreating ? 'Создание скрипта' : 'Редактирование скрипта',
            },
          ]}
        />
      )
    }
  }, [project, setHeaderContent, isCreating])

  const validateVersion = (value: string) => {
    const pattern = /^\d{3}\.\d{3}\.\d{3}$/
    if (!pattern.test(value)) {
      return 'Версия должна быть в формате 000.000.000'
    }
    return true
  }

  const handleSave = async (data: ScriptFormData) => {
    if (!project) return

    const updateData: ScriptUpdateData = {
      name: data.name,
      version: data.version,
      status: data.status,
      testCaseId: data.testCaseId || undefined,
      precondition: data.precondition,
      code: data.code,
    }

    try {
      if (isCreating) {
        await createScript(project.id, updateData)
        toast.success('Скрипт успешно создан!')
      } else if (script) {
        await updateScript(project.id, script.id, updateData)
        toast.success('Скрипт успешно обновлён!')
      }
      navigate(`/app/project/${project.id}/script`)
    } catch (error) {
      console.error('Ошибка при сохранении скрипта:', error)
      toast.error('Произошла ошибка при сохранении')
    }
  }

  const saveAsNewVersion = async () => {
    if (!project || !script) return
    // Увеличиваем версию (патч)
    const versionParts = script.version.split('.')
    const newVersion = `${versionParts[0]}.${versionParts[1]}.${(parseInt(versionParts[2]) + 1).toString().padStart(3, '0')}`
    const formData = getValues()
    const newData: ScriptUpdateData = {
      ...formData,
      version: newVersion,
      status: 1, // активный
    }
    try {
      await createScript(project.id, newData) // создаём как новый скрипт
      toast.success('Новая версия создана!')
      navigate(`/app/project/${project.id}/script`)
    } catch (error) {
      toast.error('Ошибка при создании новой версии')
    }
  }

  if (isLoading || (scriptId && !script && !isCreating)) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>
          <p>Загрузка...</p>
          <SyncLoader color="#000000" />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <form className={styles.form} onSubmit={handleSubmit(handleSave)}>
        <div className={styles.formHeader}>
          <h2>
            {isCreating
              ? 'Создание скрипта'
              : `Редактирование скрипта ID: ${script?.id}`}
          </h2>
          <div className={styles.formActionsTop}>
            <button
              type="submit"
              className={`${styles.actionButton} ${styles.primaryButton}`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Сохранение...'
                : isCreating
                  ? 'Создать'
                  : 'Сохранить'}
            </button>
            {!isCreating && (
              <button
                type="button"
                className={`${styles.actionButton} ${styles.secondaryButton}`}
                onClick={saveAsNewVersion}
              >
                Сохранить как новую версию
              </button>
            )}
            <button
              type="button"
              className={`${styles.actionButton} ${styles.cancelButton}`}
              onClick={() => setShowCancelDiag(true)}
            >
              Отмена
            </button>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Название скрипта *</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Введите название' }}
              render={({ field }) => (
                <input
                  {...field}
                  className={styles.input}
                  type="text"
                  placeholder="АТ_..."
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
              rules={{ required: 'Введите версию', validate: validateVersion }}
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
            <label htmlFor="status">Статус *</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select {...field} className={styles.select}>
                  <option value={2}>Черновик</option>
                  <option value={1}>Активный</option>
                  <option value={0}>Архив</option>
                </select>
              )}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="testCaseId">Привязка к тест-кейсу (IDT)</label>
            <Controller
              name="testCaseId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={styles.select}
                  value={field.value || ''}
                >
                  <option value="">Не привязывать</option>
                  {allTestCases.map((tc) => (
                    <option key={tc.id} value={tc.id}>
                      {tc.id}: {tc.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="precondition">Предусловие</label>
          <Controller
            name="precondition"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className={styles.textarea}
                rows={4}
                placeholder="Опишите предусловия..."
              />
            )}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="code">Код скрипта</label>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className={styles.codeEditor}
                rows={15}
                placeholder="// Введите код скрипта..."
              />
            )}
          />
        </div>

        <div className={styles.formActionsBottom}>
          <button
            type="submit"
            className={`${styles.actionButton} ${styles.primaryButton}`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Сохранение...'
              : isCreating
                ? 'Создать'
                : 'Сохранить'}
          </button>
          {!isCreating && (
            <button
              type="button"
              className={`${styles.actionButton} ${styles.secondaryButton}`}
              onClick={saveAsNewVersion}
            >
              Сохранить как новую версию
            </button>
          )}
          <button
            type="button"
            className={`${styles.actionButton} ${styles.cancelButton}`}
            onClick={() => setShowCancelDiag(true)}
          >
            Отмена
          </button>
        </div>
      </form>

      <QuestionDialog
        showQuestion={showCancelDiag}
        changeShowQuestion={setShowCancelDiag}
        onYesClick={() => navigate(-1)}
      >
        Отменить {isCreating ? 'создание' : 'редактирование'}? <br />
        Все несохранённые данные будут потеряны.
      </QuestionDialog>
    </div>
  )
}
