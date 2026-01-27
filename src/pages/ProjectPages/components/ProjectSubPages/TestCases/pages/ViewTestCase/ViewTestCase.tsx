import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useProject, useTestCase } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { PAGE_ENDPOINTS } from '@constants/'
import { TestCase } from '@interfaces/'
import styles from './ViewTestCase.module.scss'

export const ViewTestCase: React.FC = () => {
  const { project } = useProject()
  const { allTestCases: testCases } = useTestCase()
  const { setHeaderContent } = useHeaderStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { testCaseId } = useParams<{ testCaseId: string }>()

  const [testCase, setTestCase] = useState<TestCase | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [versionParam, setVersionParam] = useState<string>('')

  useEffect(() => {
    // Извлекаем версию из query параметров
    const searchParams = new URLSearchParams(location.search)
    const version = searchParams.get('version') || ''
    setVersionParam(version)
  }, [location])

  useEffect(() => {
    const loadTestCase = () => {
      try {
        setIsLoading(true)
        const parsedTestCaseId = parseInt(testCaseId || '-1')

        if (isNaN(parsedTestCaseId) || parsedTestCaseId <= 0) {
          setTestCase(null)
          return
        }

        let data: TestCase | undefined

        if (versionParam) {
          // Ищем конкретную версию
          data = testCases.find(
            (el) => el.id === parsedTestCaseId && el.version === versionParam
          )
        } else {
          // Ищем последнюю версию
          data = testCases.find((el) => el.id === parsedTestCaseId)
        }

        setTestCase(data || null)
      } catch (error) {
        console.error('Ошибка при загрузке тест-кейса:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTestCase()
  }, [testCaseId, testCases, versionParam])

  useEffect(() => {
    const pageTitle = 'Просмотр тест-кейса'
    const versionInfo = versionParam ? ` (версия ${versionParam})` : ''

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
        &mdash;&nbsp; {pageTitle}
        {versionInfo}
      </div>
    )
  }, [testCase, project, setHeaderContent, versionParam])

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Загрузка тест-кейса...</p>
        </div>
      </div>
    )
  }

  if (!testCase) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <h3>Тест-кейс не найден</h3>
          <p>Запрошенный тест-кейс или версия не существует.</p>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            Вернуться назад
          </button>
        </div>
      </div>
    )
  }

  const getProjectBaseUrl = () => {
    const path = window.location.pathname
    const testCasePart = '/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE
    const parts = path.split(testCasePart)
    return parts[0] || path
  }

  const isOldVersion = versionParam && versionParam !== testCase.version

  return (
    <div className={styles.pageContainer}>
      <div className={styles.form}>
        {/* Заголовок с действиями */}
        <div className={styles.formHeader}>
          <div className={styles.headerLeft}>
            <h2>
              Просмотр тест-кейса
              {isOldVersion && (
                <span className={styles.oldVersionBadge}>
                  Устаревшая версия
                </span>
              )}
            </h2>
            <div className={styles.testCaseInfo}>
              <span className={styles.infoItem}>
                <strong>ID:</strong> {testCase.id}
              </span>
              <span className={styles.infoItem}>
                <strong>Версия:</strong> {testCase.version}
              </span>
              {testCase.idt && (
                <span className={styles.infoItem}>
                  <strong>IDT:</strong> {testCase.idt}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formActionsTop}>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.editButton}`}
              onClick={() =>
                navigate(
                  `${getProjectBaseUrl()}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE}/${testCase.id}`
                )
              }
            >
              Перейти к редактированию
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.backButton}`}
              onClick={() => navigate(-1)}
            >
              Назад
            </button>
          </div>
        </div>

        {/* Основная информация */}
        <div className={styles.section}>
          <h3>Основная информация</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Название ТК</label>
              <div className={styles.readonlyField}>{testCase.name}</div>
            </div>

            <div className={styles.formGroup}>
              <label>Версия</label>
              <div className={styles.readonlyField}>{testCase.version}</div>
            </div>

            <div className={styles.formGroup}>
              <label>Статус</label>
              <div className={styles.readonlyField}>{testCase.status}</div>
            </div>

            <div className={styles.formGroup}>
              <label>Приоритет</label>
              <div className={styles.readonlyField}>{testCase.priority}</div>
            </div>

            <div className={styles.formGroup}>
              <label>Проект</label>
              <div className={styles.readonlyField}>
                {project?.name || testCase.project}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Описание</label>
              <div className={styles.readonlyField}>
                {testCase.description || <em>Не указано</em>}
              </div>
            </div>
          </div>
        </div>

        {/* Флаги и теги */}
        <div className={styles.section}>
          <h3>Дополнительные параметры</h3>
          <div className={styles.formGrid}>
            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={testCase.positive}
                  readOnly
                  disabled
                />
                <span className={styles.checkboxText}>
                  Позитивный тест-кейс
                </span>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={testCase.isAutoTest}
                  readOnly
                  disabled
                />
                <span className={styles.checkboxText}>Авто-тест</span>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={testCase.isLoadTest}
                  readOnly
                  disabled
                />
                <span className={styles.checkboxText}>
                  Нагрузочное тестирование (НТ)
                </span>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Теги</label>
            <div className={styles.tagsContainer}>
              {testCase.tags && testCase.tags.length > 0 ? (
                testCase.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))
              ) : (
                <em>Теги не указаны</em>
              )}
            </div>
          </div>
        </div>

        {/* Предусловия */}
        <div className={styles.section}>
          <h3>Предусловия</h3>
          <div className={styles.formGroup}>
            <div className={styles.readonlyField}>
              {testCase.precondition || <em>Не указаны</em>}
            </div>
          </div>
        </div>

        {/* Шаги тест-кейса */}
        <div className={styles.section}>
          <h3>Шаги тест-кейса</h3>
          {testCase.steps && testCase.steps.length > 0 ? (
            <div className={styles.stepsContainer}>
              {testCase.steps.map((step, index) => (
                <div key={index} className={styles.stepCard}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepNumber}>Шаг {index + 1}</span>
                  </div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepField}>
                      <label>Действие:</label>
                      <div className={styles.stepValue}>
                        {step.action || <em>Не указано</em>}
                      </div>
                    </div>
                    <div className={styles.stepField}>
                      <label>Ожидаемый результат:</label>
                      <div className={styles.stepValue}>
                        {step.result || <em>Не указано</em>}
                      </div>
                    </div>
                    {step.precondition && (
                      <div className={styles.stepField}>
                        <label>Предусловие шага:</label>
                        <div className={styles.stepValue}>
                          {step.precondition}
                        </div>
                      </div>
                    )}
                    {step.testData && (
                      <div className={styles.stepField}>
                        <label>Тестовые данные:</label>
                        <div className={styles.stepValue}>{step.testData}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noData}>
              <p>Шаги не добавлены</p>
            </div>
          )}
        </div>

        {/* Тестовые данные */}
        <div className={styles.section}>
          <h3>Тестовые данные (СПД)</h3>
          {testCase.testData && testCase.testData.length > 0 ? (
            <div className={styles.testDataContainer}>
              {testCase.testData.map((data, index) => (
                <div key={index} className={styles.testDataItem}>
                  <div className={styles.dataName}>{data.name}:</div>
                  <div className={styles.dataValue}>{data.value}</div>
                  <div className={styles.dataType}>({data.type})</div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noData}>
              <p>Тестовые данные не добавлены</p>
            </div>
          )}
        </div>

        {/* Вложения */}
        <div className={styles.section}>
          <h3>Вложения</h3>
          {testCase.attachments && testCase.attachments.length > 0 ? (
            <div className={styles.attachmentsContainer}>
              {testCase.attachments.map((attachment, index) => (
                <div key={index} className={styles.attachmentItem}>
                  <div className={styles.attachmentName}>{attachment.name}</div>
                  <div className={styles.attachmentType}>{attachment.type}</div>
                  {attachment.size && (
                    <div className={styles.attachmentSize}>
                      {(attachment.size / 1024).toFixed(2)} KB
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noData}>
              <p>Вложения отсутствуют</p>
            </div>
          )}
        </div>

        {/* Системная информация */}
        <div className={styles.section}>
          <h3>Системная информация</h3>
          <div className={styles.systemInfo}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Владелец:</label>
                <div>{testCase.owner.username}</div>
              </div>
              <div className={styles.infoItem}>
                <label>Дата создания:</label>
                <div>
                  {new Date(testCase.creationDate).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div className={styles.infoItem}>
                <label>Последнее изменение:</label>
                <div>
                  {new Date(testCase.lastModified).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div className={styles.infoItem}>
                <label>Скрипты:</label>
                <div>
                  {testCase.scriptIds.length > 0
                    ? testCase.scriptIds.map((s) => s.name).join(', ')
                    : 'Нет'}
                </div>
              </div>
              <div className={styles.infoItem}>
                <label>Используется в тест-кейсах:</label>
                <div>
                  {testCase.relatedTestCases.length > 0
                    ? testCase.relatedTestCases.map((tc) => tc.name).join(', ')
                    : 'Нет'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки внизу */}
        <div className={styles.formActionsBottom}>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.editButton}`}
            onClick={() =>
              navigate(
                `${getProjectBaseUrl()}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE}/${testCase.id}`
              )
            }
          >
            Перейти к редактированию
          </button>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.backButton}`}
            onClick={() => navigate(-1)}
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}
