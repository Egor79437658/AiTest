import React from 'react'
import { TestCaseStep } from '@interfaces/'
import styles from './StepsEditor.module.scss'

interface EnhancedStepsEditorProps {
  steps: TestCaseStep[]
  onChange: (steps: TestCaseStep[]) => void
  disabled?: boolean
}

export const EnhancedStepsEditor: React.FC<EnhancedStepsEditorProps> = ({
  steps = [],
  onChange,
  disabled = false,
}) => {
  const handleAdd = () => {
    const newStep: TestCaseStep = {
      precondition: '',
      action: '',
      result: '',
    }
    const newSteps = [...steps, newStep]
    onChange(newSteps)
  }

  const handleRemove = (index: number) => {
    if (steps.length <= 1) {
      alert('Тест-кейс должен содержать хотя бы один шаг')
      return
    }

    if (window.confirm('Вы уверены, что хотите удалить этот шаг?')) {
      const newSteps = steps.filter((_, i) => i !== index)
      onChange(newSteps)
    }
  }

  const handleUpdate = (
    index: number,
    field: keyof TestCaseStep,
    value: string
  ) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    onChange(newSteps)
  }

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= steps.length) return

    const newSteps = [...steps]
    const [movedStep] = newSteps.splice(fromIndex, 1)
    newSteps.splice(toIndex, 0, movedStep)
    onChange(newSteps)
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
  }

  const renderStep = (step: TestCaseStep, index: number) => {
    const stepNumber = index + 1

    return (
      <div key={index} className={styles.stepCard}>
        <div className={styles.stepHeader}>
          <div className={styles.stepNumber}>
            Шаг {stepNumber}
            {steps.length > 1 && (
              <span className={styles.stepControls}>
                <button
                  type="button"
                  className={styles.moveButton}
                  onClick={() => handleMove(index, index - 1)}
                  disabled={disabled || index === 0}
                  title="Переместить вверх"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={styles.moveButton}
                  onClick={() => handleMove(index, index + 1)}
                  disabled={disabled || index === steps.length - 1}
                  title="Переместить вниз"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={styles.insertButton}
                  onClick={() => handleInsertAfter(index)}
                  disabled={disabled}
                  title="Добавить шаг после этого"
                >
                  + Добавить после
                </button>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  title="Удалить шаг"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>

        <div className={styles.stepFields}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Предусловие шага
              <span className={styles.fieldHint}>(необязательно)</span>
            </label>
            <textarea
              value={step.precondition || ''}
              onChange={(e) =>
                handleUpdate(index, 'precondition', e.target.value)
              }
              placeholder="Введите предусловие для этого шага, если необходимо"
              className={styles.textarea}
              rows={2}
              disabled={disabled}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Действие *
              <span className={styles.fieldHint}>
                (атомарное, неделимое действие)
              </span>
            </label>
            <textarea
              value={step.action}
              onChange={(e) => handleUpdate(index, 'action', e.target.value)}
              placeholder="Опишите четкое, атомарное действие пользователя или системы"
              className={styles.textarea}
              rows={3}
              required
              disabled={disabled}
            />
            {step.action.length > 0 && step.action.length < 10 && (
              <div className={styles.warning}>
                Действие слишком короткое. Убедитесь, что оно содержит
                достаточную информацию.
              </div>
            )}
          </div>

          <div className={styles.uiDetails}>
            <div className={styles.uiField}>
              <label className={styles.fieldLabel}>
                Наименование элемента UI
                <span className={styles.fieldHint}>(если применимо)</span>
              </label>
              <input
                type="text"
                value={step.elementName || ''}
                onChange={(e) =>
                  handleUpdate(index, 'elementName', e.target.value)
                }
                placeholder="Например: 'Кнопка Сохранить', 'Поле ввода Email'"
                className={styles.input}
                disabled={disabled}
              />
            </div>

            <div className={styles.uiField}>
              <label className={styles.fieldLabel}>
                Наименование формы/окна
                <span className={styles.fieldHint}>(если применимо)</span>
              </label>
              <input
                type="text"
                value={step.formName || ''}
                onChange={(e) =>
                  handleUpdate(index, 'formName', e.target.value)
                }
                placeholder="Например: 'Форма авторизации', 'Окно настроек'"
                className={styles.input}
                disabled={disabled}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Ожидаемый результат *
              <span className={styles.fieldHint}>
                (лаконично, без наречий 'успешно', 'корректно')
              </span>
            </label>
            <textarea
              value={step.result}
              onChange={(e) => handleUpdate(index, 'result', e.target.value)}
              placeholder="Опишите конкретный, измеримый ожидаемый результат"
              className={styles.textarea}
              rows={3}
              required
              disabled={disabled}
            />
            <div className={styles.resultGuidelines}>
              <strong>Рекомендации:</strong> Результат должен быть конкретным,
              измеримым и не содержать действий. Пример: "Открывается окно
              редактирования профиля" вместо "Успешно открывается".
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Тестовые данные для шага
              <span className={styles.fieldHint}>
                (если отличаются от общих СПД)
              </span>
            </label>
            <textarea
              value={step.testData || ''}
              onChange={(e) => handleUpdate(index, 'testData', e.target.value)}
              placeholder="Введите специфичные тестовые данные для этого шага"
              className={styles.textarea}
              rows={2}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>Шаги тест-кейса</h4>
        <div className={styles.stats}>
          <span className={styles.stepCount}>Шагов: {steps.length} / 20</span>
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAdd}
            disabled={disabled || steps.length >= 20}
            title={steps.length >= 20 ? 'Максимум 20 шагов' : 'Добавить шаг'}
          >
            + Добавить шаг
          </button>
        </div>
      </div>

      {steps.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Нет шагов. Добавьте первый шаг для описания тест-кейса.</p>
          <button
            type="button"
            className={styles.addFirstButton}
            onClick={handleAdd}
            disabled={disabled}
          >
            + Добавить первый шаг
          </button>
        </div>
      ) : (
        <div className={styles.stepsList}>
          {steps.map((step, index) => renderStep(step, index))}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.guidelines}>
          <h5>Рекомендации по шагам:</h5>
          <ul>
            <li>
              Шаг должен быть <strong>атомарным</strong> - содержать одно
              неделимое действие
            </li>
            <li>Избегайте логических ветвлений в одном шаге</li>
            <li>
              Рекомендуемый объем: <strong>10-20 шагов</strong> на тест-кейс
            </li>
            <li>
              Для элементов UI указывайте конкретные наименования или
              расположение
            </li>
            <li>
              Ожидаемый результат должен быть{' '}
              <strong>конкретным и измеримым</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
