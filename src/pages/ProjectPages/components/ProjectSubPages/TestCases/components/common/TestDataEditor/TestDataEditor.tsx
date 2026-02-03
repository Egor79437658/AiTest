import React, { useEffect, useState } from 'react'
import { TestData } from '@interfaces/'
import { TEST_DATA_TYPES } from '@constants/'
import styles from './TestDataEditor.module.scss'

interface TestDataEditorProps {
  testData: TestData[]
  onChange: (testData: TestData[]) => void
  disabled?: boolean
}

export const TestDataEditor: React.FC<TestDataEditorProps> = ({
  testData = [],
  onChange,
  disabled = false,
}) => {
  const [localData, setLocalData] = useState<TestData[]>(testData)

  useEffect(() => setLocalData(testData), [testData])

  const handleAdd = () => {
    const newData: TestData[] = [
      ...localData,
      {
        name: '',
        value: '',
        type: TEST_DATA_TYPES.PARAMETER,
      },
    ]
    setLocalData(newData)
    onChange(newData)
  }

  const handleRemove = (index: number) => {
    const newData = localData.filter((_, i) => i !== index)
    setLocalData(newData)
    onChange(newData)
  }

  const handleUpdate = (
    index: number,
    field: keyof TestData,
    value: string
  ) => {
    const newData = [...localData]
    newData[index] = { ...newData[index], [field]: value }
    setLocalData(newData)
    onChange(newData)
  }

  const handleTypeChange = (index: number, type: TestData['type']) => {
    const newData = [...localData]
    newData[index] = { ...newData[index], type }

    // Сброс fileUrl при смене типа
    if (type !== TEST_DATA_TYPES.FILE && type !== TEST_DATA_TYPES.LINK) {
      delete newData[index].fileUrl
    }

    setLocalData(newData)
    onChange(newData)
  }

  const renderTypeOptions = () => {
    return Object.entries({
      [TEST_DATA_TYPES.PARAMETER]: 'Параметр',
      [TEST_DATA_TYPES.FILE]: 'Файл',
      [TEST_DATA_TYPES.LINK]: 'Ссылка',
      [TEST_DATA_TYPES.NOT_SET]: 'Не заполняется',
      [TEST_DATA_TYPES.ANY]: 'Любое значение',
    }).map(([value, label]) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>Специально подготовленные данные (СПД)</h4>
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAdd}
          disabled={disabled || localData.length >= 10}
          title={
            localData.length >= 10 ? 'Максимум 10 строк СПД' : 'Добавить строку'
          }
        >
          + Добавить
        </button>
      </div>

      {localData.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Нет тестовых данных. Добавьте параметры для тестирования.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Название параметра</th>
                <th style={{ width: '25%' }}>Тип данных</th>
                <th style={{ width: '35%' }}>Значение / Ссылка</th>
                <th style={{ width: '10%' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {localData.map((item, index) => (
                <tr key={index} className={styles.row}>
                  <td>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleUpdate(index, 'name', e.target.value)
                      }
                      placeholder="Введите название параметра"
                      className={styles.input}
                      disabled={disabled}
                    />
                  </td>
                  <td>
                    <select
                      value={item.type}
                      onChange={(e) =>
                        handleTypeChange(
                          index,
                          e.target.value as TestData['type']
                        )
                      }
                      className={styles.select}
                      disabled={disabled}
                    >
                      {renderTypeOptions()}
                    </select>
                  </td>
                  <td>
                    {item.type === TEST_DATA_TYPES.FILE ||
                    item.type === TEST_DATA_TYPES.LINK ? (
                      <input
                        type="text"
                        value={item.fileUrl || ''}
                        onChange={(e) =>
                          handleUpdate(index, 'fileUrl', e.target.value)
                        }
                        placeholder={
                          item.type === TEST_DATA_TYPES.FILE
                            ? 'Имя файла или путь'
                            : 'Введите URL ссылки'
                        }
                        className={styles.input}
                        disabled={disabled}
                      />
                    ) : item.type === TEST_DATA_TYPES.NOT_SET ||
                      item.type === TEST_DATA_TYPES.ANY ? (
                      <span className={styles.placeholder}>
                        {item.type === TEST_DATA_TYPES.NOT_SET
                          ? 'Не заполняется'
                          : 'Любое значение'}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) =>
                          handleUpdate(index, 'value', e.target.value)
                        }
                        placeholder="Введите значение"
                        className={styles.input}
                        disabled={disabled}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemove(index)}
                      disabled={disabled}
                      title="Удалить"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.footer}>
        <p className={styles.hint}>
          {localData.length >= 10 ? (
            <span className={styles.warning}>
              Достигнуто максимальное количество строк СПД (10). Для большого
              объема данных рекомендуется прикладывать файл во вкладке
              "Вложения".
            </span>
          ) : (
            <>
              <strong>Рекомендации:</strong> Указывайте конкретные значения. Для
              больших объемов данных используйте вложения.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
