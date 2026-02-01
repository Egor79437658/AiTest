import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useProject, useTestCase } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { PAGE_ENDPOINTS } from '@constants/'
import { TestCase, TestCaseStep } from '@interfaces/'
import styles from './ViewTestCase.module.scss'

interface StepGroup {
  steps: TestCaseStep[]
  isExpanded: boolean
}

export const ViewTestCase: React.FC = () => {
  const { project } = useProject()
  const { allTestCases: testCases, isLoading: isLoadingTestCases } =
    useTestCase()
  const { setHeaderContent } = useHeaderStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { testCaseId } = useParams<{ testCaseId: string }>()

  const [testCase, setTestCase] = useState<TestCase | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [versionParam, setVersionParam] = useState<string>('')
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const version = searchParams.get('version') || ''
    setVersionParam(version)
  }, [location])

  useEffect(() => {
    const findTestCase = () => {
      try {
        setIsLoading(true)
        const parsedTestCaseId = parseInt(testCaseId || '-1')

        if (isNaN(parsedTestCaseId) || parsedTestCaseId <= 0) {
          setTestCase(null)
          setIsLoading(false)
          return
        }

        let data: TestCase | undefined

        if (versionParam) {
          // Ищем конкретную версию
          data = testCases.find(
            (el) => el.id === parsedTestCaseId && el.version === versionParam
          )
        } else {
          // Ищем любую версию (последнюю)
          const versions = testCases.filter((el) => el.id === parsedTestCaseId)
          if (versions.length > 0) {
            data = versions.sort(
              (a, b) =>
                new Date(b.creationDate).getTime() -
                new Date(a.creationDate).getTime()
            )[0]
          }
        }

        setTestCase(data || null)
        // Автоматически разворачиваем все шаги
        if (data?.steps) {
          setExpandedSteps(data.steps.map((_, index) => index))
        }
      } catch (error) {
        console.error('Ошибка при поиске тест-кейса:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoadingTestCases) {
      const timer = setTimeout(findTestCase, 100)
      return () => clearTimeout(timer)
    } else {
      findTestCase()
    }
  }, [testCaseId, testCases, versionParam, isLoadingTestCases])

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

  const toggleStep = (index: number) => {
    setExpandedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const toggleAllSteps = () => {
    if (testCase?.steps) {
      if (expandedSteps.length === testCase.steps.length) {
        setExpandedSteps([])
      } else {
        setExpandedSteps(testCase.steps.map((_, index) => index))
      }
    }
  }

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
    const parts = path.split(`/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE}/`)
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

        {/* Шаги тест-кейса в таблице */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Шаги тест-кейса</h3>
            <div className={styles.stepsActions}>
              <button
                type="button"
                className={styles.expandAllButton}
                onClick={toggleAllSteps}
              >
                {testCase.steps &&
                expandedSteps.length === testCase.steps.length
                  ? 'Свернуть все'
                  : 'Развернуть все'}
              </button>
              <div className={styles.stepsCounter}>
                Шагов: {testCase.steps?.length || 0}
              </div>
            </div>
          </div>

          {testCase.steps && testCase.steps.length > 0 ? (
            <div className={styles.stepsTableContainer}>
              <table className={styles.stepsTable}>
                <thead>
                  <tr>
                    <th className={styles.expandCol}></th>
                    <th className={styles.stepNumberCol}>№</th>
                    <th className={styles.actionCol}>Действие</th>
                    <th className={styles.resultCol}>Ожидаемый результат</th>
                    <th className={styles.dataCol}>Тестовые данные</th>
                  </tr>
                </thead>
                <tbody>
                  {testCase.steps.map((step, index) => {
                    const isExpanded = expandedSteps.includes(index)
                    return (
                      <React.Fragment key={index}>
                        {/* Основная строка шага */}
                        <tr
                          className={`${styles.stepRow} ${isExpanded ? styles.expanded : ''}`}
                          onClick={() => toggleStep(index)}
                        >
                          <td className={styles.expandCol}>
                            <button
                              type="button"
                              className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleStep(index)
                              }}
                            >
                              <span className={styles.expandIcon}>
                                {isExpanded ? '▼' : '▶'}
                              </span>
                            </button>
                          </td>
                          <td className={styles.stepNumberCol}>
                            <span className={styles.stepNumber}>
                              {index + 1}
                            </span>
                          </td>
                          <td className={styles.actionCol}>
                            <div className={styles.stepAction}>
                              {step.action || <em>Не указано</em>}
                            </div>
                          </td>
                          <td className={styles.resultCol}>
                            <div className={styles.stepResult}>
                              {step.result || <em>Не указано</em>}
                            </div>
                          </td>
                          <td className={styles.dataCol}>
                            <div className={styles.stepData}>
                              {step.testData.length ? (
                                step.testData.map((el, index) => (
                                  <Fragment key={el.id || index}>
                                    <div>{el.name} </div>
                                    <div>{el.fileUrl} </div>
                                    <div>{el.value} </div>
                                  </Fragment>
                                ))
                              ) : (
                                <em>Нет</em>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Детали шага (раскрываемая строка) */}
                        {isExpanded && (
                          <tr className={styles.stepDetailsRow}>
                            <td colSpan={5}>
                              <div className={styles.stepDetails}>
                                <div className={styles.stepDetailsGrid}>
                                  {step.precondition && (
                                    <div className={styles.detailItem}>
                                      <label>Предусловие шага:</label>
                                      <div className={styles.detailValue}>
                                        {step.precondition}
                                      </div>
                                    </div>
                                  )}
                                  {step.elementName && (
                                    <div className={styles.detailItem}>
                                      <label>Элемент:</label>
                                      <div className={styles.detailValue}>
                                        {step.elementName}
                                      </div>
                                    </div>
                                  )}
                                  {step.elementLocation && (
                                    <div className={styles.detailItem}>
                                      <label>Локатор элемента:</label>
                                      <div className={styles.detailValue}>
                                        {step.elementLocation}
                                      </div>
                                    </div>
                                  )}
                                  {step.formName && (
                                    <div className={styles.detailItem}>
                                      <label>Форма:</label>
                                      <div className={styles.detailValue}>
                                        {step.formName}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
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
              <table className={styles.testDataTable}>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Значение</th>
                    <th>Тип</th>
                    {testCase.testData.some((data) => data.fileUrl) && (
                      <th>Файл</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {testCase.testData.map((data, index) => (
                    <tr key={index} className={styles.testDataRow}>
                      <td className={styles.dataName}>{data.name}</td>
                      <td className={styles.dataValue}>{data.value}</td>
                      <td className={styles.dataType}>{data.type}</td>
                      {testCase.testData.some((data) => data.fileUrl) && (
                        <td className={styles.dataFile}>
                          {data.fileUrl ? (
                            <a
                              href={data.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.fileLink}
                            >
                              Скачать
                            </a>
                          ) : (
                            <span className={styles.noFile}>—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <table className={styles.attachmentsTable}>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Тип</th>
                    <th>Размер</th>
                    <th>Дата загрузки</th>
                  </tr>
                </thead>
                <tbody>
                  {testCase.attachments.map((attachment, index) => (
                    <tr key={index} className={styles.attachmentRow}>
                      <td className={styles.attachmentName}>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.attachmentLink}
                        >
                          {attachment.name}
                        </a>
                      </td>
                      <td className={styles.attachmentType}>
                        <span className={styles.typeBadge}>
                          {attachment.type}
                        </span>
                      </td>
                      <td className={styles.attachmentSize}>
                        {attachment.size ? (
                          <span>{(attachment.size / 1024).toFixed(2)} KB</span>
                        ) : (
                          <span className={styles.unknownSize}>—</span>
                        )}
                      </td>
                      <td className={styles.attachmentDate}>
                        {attachment.uploadedAt ? (
                          new Date(attachment.uploadedAt).toLocaleDateString(
                            'ru-RU'
                          )
                        ) : (
                          <span className={styles.unknownDate}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
