import React, { useState, useRef, useEffect } from 'react'
import { TestCaseStep } from '@interfaces/'
import { StepsTableView } from './StepsTableView/StepsTableView'
import styles from './StepsEditor.module.scss'
import { QuestionDialog } from '@components/'

interface EnhancedStepsEditorProps {
  steps: TestCaseStep[]
  onChange: (steps: TestCaseStep[]) => void
  disabled?: boolean
  defaultExpanded?: boolean
  showTableView?: boolean
}

export const EnhancedStepsEditor: React.FC<EnhancedStepsEditorProps> = ({
  steps = [],
  onChange,
  disabled = false,
  defaultExpanded = true,
  showTableView = true,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [isAddingStep, setIsAddingStep] = useState(false)
  const [tableViewVisible, setTableViewVisible] = useState(true)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [showDiag, setShowDiag] = useState(false)
  const [stepToDelete, setStepToDelete] = useState(-1)

  useEffect(() => {
    if (isAddingStep && steps.length > 0) {
      setActiveStep(steps.length - 1)
      setIsAddingStep(false)

      setTimeout(() => {
        const activeTab = document.querySelector(
          `.${styles.stepTab}.${styles.active}`
        )
        if (activeTab && tabsContainerRef.current) {
          activeTab.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
          })
        }
      }, 100)
    }
  }, [steps, isAddingStep])

  const handleAddStep = () => {
    const newStep: TestCaseStep = {
      precondition: '',
      action: '',
      result: '',
    }
    const newSteps = [...steps, newStep]
    onChange(newSteps)
    setIsAddingStep(true)
  }

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) {
      alert('Тест-кейс должен содержать хотя бы один шаг')
      return
    }

    const newSteps = steps.filter((_, i) => i !== index)
    onChange(newSteps)

    if (index === activeStep) {
      const newActiveStep = index > 0 ? index - 1 : 0
      setActiveStep(newActiveStep)
    } else if (index < activeStep) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleStepChange = (
    index: number,
    field: keyof TestCaseStep,
    value: string
  ) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    onChange(newSteps)
  }

  const handleMoveStep = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= steps.length) return

    const newSteps = [...steps]
    const [movedStep] = newSteps.splice(fromIndex, 1)
    newSteps.splice(toIndex, 0, movedStep)
    onChange(newSteps)

    if (fromIndex === activeStep) {
      setActiveStep(toIndex)
    } else if (fromIndex < activeStep && toIndex >= activeStep) {
      setActiveStep(activeStep - 1)
    } else if (fromIndex > activeStep && toIndex <= activeStep) {
      setActiveStep(activeStep + 1)
    }
  }

  const handleInsertAfter = (index: number) => {
    const newStep: TestCaseStep = {
      precondition: '',
      action: '',
      result: '',
    }
    const newSteps = [...steps]
    newSteps.splice(index + 1, 0, newStep)
    onChange(newSteps)
    setActiveStep(index + 1)
  }

  const handleDuplicateStep = (index: number) => {
    const stepToDuplicate = { ...steps[index] }
    const newSteps = [...steps]
    newSteps.splice(index + 1, 0, stepToDuplicate)
    onChange(newSteps)
    setActiveStep(index + 1)
  }

  const handleStepClick = (index: number) => {
    setActiveStep(index)

    setTimeout(() => {
      const activeTab = document.querySelector(
        `.${styles.stepTab}.${styles.active}`
      )
      if (activeTab && tabsContainerRef.current) {
        activeTab.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        })
      }
    }, 100)
  }

  const getStepStats = () => {
    const total = steps.length
    const filled = steps.filter(
      (step) => step.action.trim().length > 0 && step.result.trim().length > 0
    ).length
    const incomplete = total - filled

    return { total, filled, incomplete }
  }

  const renderCollapsedHeader = () => {
    const stats = getStepStats()

    return (
      <div className={styles.collapsedHeader}>
        <div className={styles.collapsedHeaderContent}>
          <div className={styles.collapsedTitle}>
            <span className={styles.collapsedIcon}>📝</span>
            <h4>Шаги тест-кейса</h4>
          </div>

          <div className={styles.collapsedStats}>
            <span className={styles.statItem}>
              <span className={styles.statNumber}>{stats.total}</span>
              <span className={styles.statLabel}>шагов</span>
            </span>
            {stats.filled > 0 && (
              <span className={`${styles.statItem} ${styles.statFilled}`}>
                <span className={styles.statNumber}>{stats.filled}</span>
                <span className={styles.statLabel}>заполнено</span>
              </span>
            )}
            {stats.incomplete > 0 && (
              <span className={`${styles.statItem} ${styles.statIncomplete}`}>
                <span className={styles.statNumber}>{stats.incomplete}</span>
                <span className={styles.statLabel}>требуют заполнения</span>
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className={styles.expandButton}
          onClick={() => setIsExpanded(true)}
          title="Развернуть шаги"
          disabled={disabled}
        >
          <span className={styles.expandIcon}>▼</span>
          <span className={styles.expandText}>Развернуть</span>
        </button>
      </div>
    )
  }

  const renderExpandedHeader = () => {
    const stats = getStepStats()

    return (
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h4>Шаги тест-кейса</h4>
          <button
            type="button"
            className={styles.collapseButton}
            onClick={() => setIsExpanded(false)}
            title="Свернуть шаги"
            disabled={disabled}
          >
            <span className={styles.collapseIcon}>▲</span>
            <span className={styles.collapseText}>Свернуть</span>
          </button>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.stepsCounter}>
            <span className={styles.counterValue}>{stats.total}</span>
            <span className={styles.counterLabel}>шагов</span>
            <span className={styles.counterMax}>/20 макс.</span>
          </div>

          {showTableView && (
            <div className={styles.viewToggle}>
              <button
                type="button"
                className={`${styles.toggleButton} ${tableViewVisible ? styles.active : ''}`}
                onClick={() => setTableViewVisible(!tableViewVisible)}
                title={
                  tableViewVisible
                    ? 'Скрыть таблицу просмотра'
                    : 'Показать таблицу просмотра'
                }
                disabled={disabled}
              >
                {tableViewVisible ? '📊 Скрыть таблицу' : '📊 Показать таблицу'}
              </button>
            </div>
          )}

          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddStep}
            disabled={disabled || steps.length >= 20}
            title={
              steps.length >= 20
                ? 'Достигнуто максимальное количество шагов'
                : 'Добавить шаг'
            }
          >
            <span className={styles.plusIcon}>+</span>
            Добавить шаг
          </button>
        </div>
      </div>
    )
  }

  const renderActiveStepContent = () => {
    if (steps.length === 0) return null

    const step = steps[activeStep]
    const stepNumber = activeStep + 1

    return (
      <div className={styles.stepContent}>
        <div className={styles.stepHeader}>
          <h4>
            Шаг {stepNumber}
            <span className={styles.stepStatus}>
              {step.action.trim().length > 0 && step.result.trim().length > 0
                ? '✓ Заполнен'
                : '⚠️ Требует заполнения'}
            </span>
          </h4>

          <div className={styles.stepActions}>
            <div className={styles.moveActions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => handleMoveStep(activeStep, activeStep - 1)}
                disabled={disabled || activeStep === 0}
                title="Переместить вверх"
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => handleMoveStep(activeStep, activeStep + 1)}
                disabled={disabled || activeStep === steps.length - 1}
                title="Переместить вниз"
              >
                ↓
              </button>
            </div>

            <div className={styles.editActions}>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.duplicateButton}`}
                onClick={() => handleDuplicateStep(activeStep)}
                disabled={disabled || steps.length >= 20}
                title="Дублировать шаг"
              >
                ⎘
              </button>
              <button
                type="button"
                className={styles.textButton}
                onClick={() => handleInsertAfter(activeStep)}
                disabled={disabled || steps.length >= 20}
              >
                + Вставить после
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.deleteButton}`}
                onClick={() => {setStepToDelete(activeStep); setShowDiag(true)}}
                disabled={disabled || steps.length <= 1}
                title="Удалить шаг"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className={styles.stepFields}>
          <div className={styles.fieldGroup}>
            <label>
              <span className={styles.fieldLabel}>Предусловие шага</span>
              <span className={styles.fieldHint}>(если необходимо)</span>
            </label>
            <textarea
              value={step.precondition || ''}
              onChange={(e) =>
                handleStepChange(activeStep, 'precondition', e.target.value)
              }
              placeholder="Опишите условия, которые должны быть выполнены перед этим шагом"
              className={styles.textarea}
              rows={2}
              disabled={disabled}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>
              <span className={styles.fieldLabel}>Действие *</span>
              <span className={styles.fieldHint}>
                (атомарное, конкретное действие)
              </span>
            </label>
            <textarea
              value={step.action}
              onChange={(e) =>
                handleStepChange(activeStep, 'action', e.target.value)
              }
              placeholder="Опишите одно конкретное действие, которое нужно выполнить"
              className={styles.textarea}
              rows={3}
              required
              disabled={disabled}
            />
            <div className={styles.fieldCounter}>
              Символов: {step.action.length}{' '}
              {step.action.length < 10 && '(слишком коротко)'}
            </div>
          </div>

          <div className={styles.uiSection}>
            <h5>Детали UI (если применимо)</h5>
            <div className={styles.uiFields}>
              <div className={styles.uiField}>
                <label>
                  Наименование элемента
                  <span className={styles.fieldHint}>
                    (обязательно при работе с UI)
                  </span>
                </label>
                <input
                  type="text"
                  value={step.elementName || ''}
                  onChange={(e) =>
                    handleStepChange(activeStep, 'elementName', e.target.value)
                  }
                  placeholder="Например: 'Кнопка Сохранить', 'Поле Email'"
                  className={styles.input}
                  disabled={disabled}
                />
              </div>

              <div className={styles.uiField}>
                <label>
                  Наименование формы/окна
                  <span className={styles.fieldHint}>
                    (обязательно при работе с UI)
                  </span>
                </label>
                <input
                  type="text"
                  value={step.formName || ''}
                  onChange={(e) =>
                    handleStepChange(activeStep, 'formName', e.target.value)
                  }
                  placeholder="Например: 'Форма авторизации', 'Окно настроек'"
                  className={styles.input}
                  disabled={disabled}
                />
              </div>

              <div className={styles.uiField}>
                <label>
                  Расположение элемента
                  <span className={styles.fieldHint}>
                    (если нет наименования)
                  </span>
                </label>
                <input
                  type="text"
                  value={step.elementLocation || ''}
                  onChange={(e) =>
                    handleStepChange(
                      activeStep,
                      'elementLocation',
                      e.target.value
                    )
                  }
                  placeholder="Например: 'Верхняя панель', 'Левое меню, второй пункт'"
                  className={styles.input}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>
              <span className={styles.fieldLabel}>Ожидаемый результат *</span>
              <span className={styles.fieldHint}>
                (конкретный, измеримый, без "успешно", "корректно")
              </span>
            </label>
            <textarea
              value={step.result}
              onChange={(e) =>
                handleStepChange(activeStep, 'result', e.target.value)
              }
              placeholder="Опишите конкретный ожидаемый результат выполнения действия"
              className={styles.textarea}
              rows={3}
              required
              disabled={disabled}
            />
            <div className={styles.resultExamples}>
              <strong>Примеры корректных результатов:</strong>
              <ul>
                <li>
                  "Отображается окно подтверждения с текстом 'Операция завершена
                  успешно'"
                </li>
                <li>"Данные сохраняются в базу и отображаются в таблице"</li>
                <li>"Пользователь перенаправляется на страницу профиля"</li>
              </ul>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>
              <span className={styles.fieldLabel}>
                Тестовые данные для шага
              </span>
              <span className={styles.fieldHint}>
                (если отличаются от общих СПД)
              </span>
            </label>
            <textarea
              value={step.testData || ''}
              onChange={(e) =>
                handleStepChange(activeStep, 'testData', e.target.value)
              }
              placeholder="Введите специфичные данные для этого шага"
              className={styles.textarea}
              rows={2}
              disabled={disabled}
            />
          </div>
        </div>

        <div className={styles.stepNavigation}>
          <button
            type="button"
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={disabled || activeStep === 0}
          >
            ← Предыдущий шаг
          </button>

          <div className={styles.stepPosition}>
            Шаг {stepNumber} из {steps.length}
          </div>

          <button
            type="button"
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={() =>
              setActiveStep(Math.min(steps.length - 1, activeStep + 1))
            }
            disabled={disabled || activeStep === steps.length - 1}
          >
            Следующий шаг →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Условный рендер заголовка */}
      {isExpanded ? renderExpandedHeader() : renderCollapsedHeader()}

      {/* Контент показываем только когда развернут */}
      {isExpanded && (
        <>
          {steps.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <h5>Нет ни одного шага</h5>
              <p>
                Добавьте первый шаг, чтобы описать последовательность действий
                тест-кейса
              </p>
              <button
                type="button"
                className={styles.addFirstButton}
                onClick={handleAddStep}
                disabled={disabled}
              >
                + Создать первый шаг
              </button>
            </div>
          ) : (
            <>
              {/* Таблица просмотра всех шагов */}
              {tableViewVisible && showTableView && (
                <div className={styles.tableViewSection}>
                  <StepsTableView
                    steps={steps}
                    activeStep={activeStep}
                    onStepClick={setActiveStep}
                    disabled={disabled}
                  />
                </div>
              )}

              {/* Табы для навигации по шагам */}
              <div className={styles.stepsTabsWrapper} ref={tabsContainerRef}>
                <div className={styles.stepsTabs}>
                  {steps.map((step, index) => {
                    const stepNumber = index + 1
                    const isActive = activeStep === index

                    const isFilled =
                      step.action.trim().length > 0 &&
                      step.result.trim().length > 0
                    const hasPrecondition =
                      step.precondition && step.precondition.trim().length > 0
                    const hasTestData =
                      step.testData && step.testData.trim().length > 0

                    return (
                      <button
                        key={index}
                        type="button"
                        className={`${styles.stepTab} ${isActive ? styles.active : ''} ${
                          isFilled ? styles.filled : styles.empty
                        }`}
                        onClick={() => setActiveStep(index)}
                        title={`Шаг ${stepNumber}: ${step.action.substring(0, 30)}${step.action.length > 30 ? '...' : ''}`}
                        disabled={disabled}
                      >
                        <span className={styles.tabNumber}>{stepNumber}</span>
                        <div className={styles.tabIndicators}>
                          {hasPrecondition && (
                            <span
                              className={styles.indicator}
                              title="Есть предусловие"
                            >
                              ⚙️
                            </span>
                          )}
                          {hasTestData && (
                            <span
                              className={styles.indicator}
                              title="Есть тестовые данные"
                            >
                              📊
                            </span>
                          )}
                          {!isFilled && (
                            <span className={styles.warningIndicator}>⚠️</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div className={styles.tabsScrollHint}>
                  {steps.length > 6 &&
                    '← Прокрутите для просмотра всех шагов →'}
                </div>
              </div>

              {/* Редактор активного шага */}
              <div className={styles.stepContentWrapper}>
                {renderActiveStepContent()}
              </div>

              <div className={styles.footer}>
                <div className={styles.guidelines}>
                  <h5>Рекомендации по заполнению шагов:</h5>
                  <div className={styles.guidelinesGrid}>
                    <div className={styles.guidelineItem}>
                      <div className={styles.guidelineIcon}>⚡</div>
                      <div className={styles.guidelineContent}>
                        <strong>Атомарность:</strong> Каждый шаг должен
                        содержать одно неделимое действие
                      </div>
                    </div>
                    <div className={styles.guidelineItem}>
                      <div className={styles.guidelineIcon}>🚫</div>
                      <div className={styles.guidelineContent}>
                        <strong>Без ветвлений:</strong> Избегайте логических
                        ветвлений в одном шаге
                      </div>
                    </div>
                    <div className={styles.guidelineItem}>
                      <div className={styles.guidelineIcon}>📏</div>
                      <div className={styles.guidelineContent}>
                        <strong>Объем:</strong> Оптимально 10-20 шагов на
                        тест-кейс
                      </div>
                    </div>
                    <div className={styles.guidelineItem}>
                      <div className={styles.guidelineIcon}>🎯</div>
                      <div className={styles.guidelineContent}>
                        <strong>Конкретность:</strong> Ожидаемый результат
                        должен быть измеримым
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      <QuestionDialog
        showQuestion={showDiag}
        changeShowQuestion={setShowDiag}
        onYesClick={() => handleRemoveStep(stepToDelete)}
      >
        Вы уверены, что хотите удалить этот шаг?
      </QuestionDialog>
    </div>
  )
}
