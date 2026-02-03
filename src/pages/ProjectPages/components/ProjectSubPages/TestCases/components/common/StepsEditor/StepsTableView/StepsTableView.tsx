import React from 'react'
import { TestCaseStep } from '@interfaces/'
import styles from './StepsTableView.module.scss'

interface StepsTableViewProps {
  steps: TestCaseStep[]
  activeStep: number
  onStepClick: (index: number) => void
  disabled?: boolean
}

export const StepsTableView: React.FC<StepsTableViewProps> = ({
  steps,
  activeStep,
  onStepClick,
  disabled = false,
}) => {
  const formatText = (
    text: string | undefined,
    maxLength: number = 60
  ): string => {
    if (!text) return '—'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getRowStatusClass = (step: TestCaseStep, index: number): string => {
    if (index === activeStep) return styles.activeRow
    if (step.action.trim().length === 0 || step.result.trim().length === 0) {
      return styles.incompleteRow
    }
    return styles.completeRow
  }

  const isStepActive = (index: number): boolean => index === activeStep

  const isStepComplete = (step: TestCaseStep): boolean => {
    return step.action.trim().length > 0 && step.result.trim().length > 0
  }

  const getUIIcon = (step: TestCaseStep): string => {
    if (step.elementName) return '🎯'
    if (step.elementLocation) return '📍'
    if (step.formName) return '📋'
    return ''
  }

  const getDataIcon = (step: TestCaseStep): string => {
    if (step.testData.length) return '📊'
    if (step.precondition) return '⚙️'
    return ''
  }

  if (steps.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📋</div>
        <p>Нет шагов для отображения</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h5>Просмотр всех шагов ({steps.length})</h5>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            <span className={styles.statComplete}>✓</span>
            Заполнено: {steps.filter((s) => isStepComplete(s)).length}
          </span>
          <span className={styles.statItem}>
            <span className={styles.statIncomplete}>⚠️</span>
            Незаполнено: {steps.filter((s) => !isStepComplete(s)).length}
          </span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colNumber}>№</th>
              <th className={styles.colPrecondition}>Предусловие</th>
              <th className={styles.colAction}>Действие</th>
              <th className={styles.colResult}>Ожидаемый результат</th>
              <th className={styles.colUI}>UI элементы</th>
              <th className={styles.colData}>Данные</th>
              <th className={styles.colStatus}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step, index) => (
              <tr
                key={index}
                className={`${styles.row} ${getRowStatusClass(step, index)}`}
                onClick={() => !disabled && onStepClick(index)}
                data-active={isStepActive(index)}
                data-complete={isStepComplete(step)}
              >
                <td className={styles.colNumber}>
                  <div className={styles.stepNumber}>
                    <span className={styles.number}>{index + 1}</span>
                    {isStepActive(index) && (
                      <span className={styles.activeIndicator}>▶</span>
                    )}
                  </div>
                </td>
                <td
                  className={styles.colPrecondition}
                  title={step.precondition || ''}
                >
                  <div className={styles.cellContent}>
                    {formatText(step.precondition, 40)}
                  </div>
                </td>
                <td className={styles.colAction} title={step.action}>
                  <div className={styles.cellContent}>
                    <div className={styles.actionText}>
                      {formatText(step.action, 80)}
                    </div>
                    {step.elementName && (
                      <div className={styles.uiHint}>
                        <small>
                          Элемент: {formatText(step.elementName, 30)}
                        </small>
                      </div>
                    )}
                  </div>
                </td>
                <td className={styles.colResult} title={step.result}>
                  <div className={styles.cellContent}>
                    {formatText(step.result, 80)}
                  </div>
                </td>
                <td className={styles.colUI}>
                  <div className={styles.uiIcons}>
                    {getUIIcon(step) && (
                      <span
                        className={styles.uiIcon}
                        title={`UI: ${step.elementName || step.elementLocation || step.formName}`}
                      >
                        {getUIIcon(step)}
                      </span>
                    )}
                    {step.formName && (
                      <span
                        className={styles.formIcon}
                        title={`Форма: ${step.formName}`}
                      >
                        📋
                      </span>
                    )}
                  </div>
                </td>
                <td className={styles.colData}>
                  <div className={styles.dataIcons}>
                    {getDataIcon(step) && (
                      <span
                        className={styles.dataIcon}
                        title="Этот объект содержит тестовые данные"
                      >
                        {getDataIcon(step)}
                      </span>
                    )}
                  </div>
                </td>
                <td className={styles.colStatus}>
                  <div className={styles.statusCell}>
                    {isStepComplete(step) ? (
                      <span
                        className={styles.statusComplete}
                        title="Шаг полностью заполнен"
                      >
                        ✓
                      </span>
                    ) : (
                      <span
                        className={styles.statusIncomplete}
                        title="Шаг требует заполнения"
                      >
                        ⚠️
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div
              className={`${styles.legendColor} ${styles.legendActive}`}
            ></div>
            <span>Текущий шаг</span>
          </div>
          <div className={styles.legendItem}>
            <div
              className={`${styles.legendColor} ${styles.legendComplete}`}
            ></div>
            <span>Заполненный шаг</span>
          </div>
          <div className={styles.legendItem}>
            <div
              className={`${styles.legendColor} ${styles.legendIncomplete}`}
            ></div>
            <span>Незаполненный шаг</span>
          </div>
        </div>
        <div className={styles.hint}>
          <strong>Подсказка:</strong> Кликните на строку, чтобы перейти к
          редактированию шага
        </div>
      </div>
    </div>
  )
}
