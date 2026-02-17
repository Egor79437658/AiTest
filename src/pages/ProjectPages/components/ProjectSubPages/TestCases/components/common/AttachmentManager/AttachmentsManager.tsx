import React, { useRef } from 'react'
import { Attachment } from '@interfaces/'
import styles from './AttachmentsManager.module.scss'
import { toast } from 'sonner'
import imageIcon from '/icons/image.svg'
import documentIcon from '/icons/document.svg'
import statsIcon from '/icons/stats.svg'
import attachmentIcon from '/icons/attachment.png'
import eyeIcon from '/icons/eye.svg'
import downloadIcon from '/icons/arrowDown.svg'

interface AttachmentsManagerProps {
  attachments: Attachment[]
  onChange: (attachments: Attachment[]) => void
  disabled?: boolean
  maxFileSize?: number // в байтах
}

export const AttachmentsManager: React.FC<AttachmentsManagerProps> = ({
  attachments = [],
  onChange,
  disabled = false,
  maxFileSize = 10 * 1024 * 1024, // 10MB
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newAttachments: Attachment[] = []
    const errors: string[] = []

    Array.from(files).forEach((file, index) => {
      if (file.size > maxFileSize) {
        errors.push(
          `Файл "${file.name}" превышает максимальный размер (${maxFileSize / 1024 / 1024}MB)`
        )
        return
      }

      const newAttachment: Attachment = {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
      }

      newAttachments.push(newAttachment)
    })

    if (errors.length > 0) {
      toast.error(errors.join('\n'), {
        position: 'top-center',
      })
    }

    if (newAttachments.length > 0) {
      const updatedAttachments = [...attachments, ...newAttachments]
      onChange(updatedAttachments)
    }

    // Сброс input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index)
    onChange(newAttachments)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getFileIcon = (type: string): string => {
    if (type.startsWith('image/')) return imageIcon
    if (
      type.includes('pdf') ||
      type.includes('word') ||
      type.includes('document') ||
      type.includes('text')
    )
      return documentIcon
    if (type.includes('spreadsheet') || type.includes('excel')) return statsIcon
    return attachmentIcon
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>Вложения</h4>
        <div className={styles.actions}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className={styles.fileInput}
            id="attachments-upload"
            disabled={disabled}
          />
          <label
            htmlFor="attachments-upload"
            className={styles.uploadButton}
            title="Загрузить файлы"
          >
            Загрузить файлы
          </label>
          <div className={styles.hint}>
            Макс. размер: {formatFileSize(maxFileSize)}
          </div>
        </div>
      </div>

      {attachments.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            Нет прикрепленных файлов. Добавьте файлы, необходимые для
            прохождения тест-кейса.
          </p>
        </div>
      ) : (
        <div className={styles.attachmentsList}>
          {attachments.map((attachment, index) => (
            <div key={index} className={styles.attachmentItem}>
              <div className={styles.attachmentInfo}>
                <img
                  src={getFileIcon(attachment.type)}
                  className={styles.fileIcon}
                />
                <div className={styles.fileDetails}>
                  <div className={styles.fileName}>
                    {attachment.name}
                    {attachment.size && (
                      <span className={styles.fileSize}>
                        {formatFileSize(attachment.size)}
                      </span>
                    )}
                  </div>
                  {attachment.uploadedAt && (
                    <div className={styles.fileDate}>
                      Загружено: {formatDate(attachment.uploadedAt)}
                    </div>
                  )}
                  <div className={styles.fileType}>{attachment.type}</div>
                </div>
              </div>
              <div className={styles.attachmentActions}>
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewButton}
                  title="Просмотреть"
                >
                  <img className={styles.viewIcon} src={eyeIcon} alt="" />
                </a>
                <a
                  href={attachment.url}
                  download={attachment.name}
                  className={styles.downloadButton}
                  title="Скачать"
                >
                  <img className={styles.viewIcon} src={downloadIcon} alt="" />
                </a>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  title="Удалить"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <p className={styles.hint}>
          <strong>Рекомендации:</strong> Прикрепляйте файлы со специально
          подготовленными данными, скриншоты, документы и другие материалы,
          необходимые для выполнения тест-кейса.
        </p>
      </div>
    </div>
  )
}
