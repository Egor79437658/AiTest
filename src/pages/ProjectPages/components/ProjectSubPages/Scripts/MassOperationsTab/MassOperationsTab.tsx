import React, { useState } from 'react'
import styles from './MassOperationsTab.module.scss'

interface Props {
  totalActiveScripts: number
  totalTCWithoutScript: number
  onGenerateAll: (includeNegative: boolean) => void
  onGenerateNew: (includeNegative: boolean) => void
  onRefactorAll: () => void
}

export const MassScriptOperationsTab: React.FC<Props> = ({
  totalActiveScripts,
  totalTCWithoutScript,
  onGenerateAll,
  onGenerateNew,
  onRefactorAll,
}) => {
  const [includeNegative, setIncludeNegative] = useState(false)

  return (
    <div className={styles.container}>
      <h2>Массовые операции со скриптами</h2>

      <div className={styles.card}>
        <h3>Генерация скриптов</h3>
        <p>
          Активных ТК без скриптов: <strong>{totalTCWithoutScript}</strong>
        </p>
        <div className={styles.actions}>
          <button
            onClick={() => onGenerateAll(includeNegative)}
            className={styles.primary}
          >
            Сгенерировать скрипты для всех ТК
          </button>
          <button
            onClick={() => onGenerateNew(includeNegative)}
            className={styles.secondary}
          >
            Сгенерировать скрипты для новых ТК
          </button>
        </div>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={includeNegative}
            onChange={(e) => setIncludeNegative(e.target.checked)}
          />
          Включая негативные тест-кейсы
        </label>
      </div>

      <div className={styles.card}>
        <h3>Рефакторинг скриптов</h3>
        <p>
          Активных скриптов: <strong>{totalActiveScripts}</strong>
        </p>
        <button onClick={onRefactorAll} className={styles.warning}>
          Рефакторинг всех активных скриптов
        </button>
        <p className={styles.note}>
          Будет создана новая версия для каждого скрипта. Старые версии перейдут
          в архив.
        </p>
      </div>
    </div>
  )
}
