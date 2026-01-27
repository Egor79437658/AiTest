import React, { useState, KeyboardEvent } from 'react'
import styles from './TagsInput.module.scss'

interface TagsInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
  maxTags?: number
}

export const TagsInput: React.FC<TagsInputProps> = ({
  tags = [],
  onChange,
  placeholder = 'Введите тег и нажмите Enter',
  disabled = false,
  maxTags = 20,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  const handleAddTag = () => {
    const tag = inputValue.trim()

    if (!tag) return

    if (tags.length >= maxTags) {
      setError(`Достигнуто максимальное количество тегов (${maxTags})`)
      return
    }

    if (tags.includes(tag)) {
      setError('Этот тег уже добавлен')
      return
    }

    if (tag.length > 50) {
      setError('Тег не должен превышать 50 символов')
      return
    }

    const newTags = [...tags, tag]
    onChange(newTags)
    setInputValue('')
    setError('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove)
    onChange(newTags)
    setError('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      const lastTag = tags[tags.length - 1]
      handleRemoveTag(lastTag)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const pastedTags = pastedText
      .split(/[,;\n\r\t]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag)

    if (pastedTags.length > 0) {
      const validTags = pastedTags.filter(
        (tag) =>
          tag.length <= 50 &&
          !tags.includes(tag) &&
          tags.length + pastedTags.length <= maxTags
      )

      if (validTags.length > 0) {
        const newTags = [...tags, ...validTags]
        onChange(newTags)
      }

      if (pastedTags.length !== validTags.length) {
        setError(
          'Некоторые теги не были добавлены (дубликаты или превышение лимита)'
        )
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <div className={styles.tagsDisplay}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
              {!disabled && (
                <button
                  type="button"
                  className={styles.removeTag}
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Удалить тег ${tag}`}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>

        {tags.length < maxTags && !disabled && (
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setError('')
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={placeholder}
              className={styles.input}
              disabled={disabled}
              maxLength={50}
            />
            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddTag}
              disabled={!inputValue.trim() || disabled}
            >
              Добавить
            </button>
          </div>
        )}
      </div>

      {(error || tags.length > 0) && (
        <div className={styles.footer}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.stats}>
            <span className={styles.tagCount}>
              Тегов: {tags.length} / {maxTags}
            </span>
            {tags.length > 0 && !disabled && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => onChange([])}
              >
                Очистить все
              </button>
            )}
          </div>
        </div>
      )}

      <div className={styles.hint}>
        <strong>Рекомендации:</strong> Используйте теги для категоризации и
        поиска. Например: тег, обозначающий подсистему или форму.
      </div>
    </div>
  )
}
