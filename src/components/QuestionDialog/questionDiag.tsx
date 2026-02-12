import { FC, ReactNode } from 'react'
import { Dialog } from '../Dialog'

import styles from './questionDiag.module.scss'

export const QuestionDialog: FC<{
  showQuestion: boolean
  changeShowQuestion: (val: boolean) => void
  children?: ReactNode
  className?: string
  closeOnClick?: boolean
  onYesClick?: (flag?: boolean) => void
  onNoClick?: (flag?: boolean) => void
  YesBtnText?: string
  NoBtnText?: string
}> = ({
  showQuestion,
  children,
  className = '',
  changeShowQuestion,
  closeOnClick = true,
  onYesClick = () => {},
  onNoClick = () => {},
  YesBtnText = "Да",
  NoBtnText = "Нет",
}) => {
  return (
    <Dialog
      show={showQuestion}
      changeShow={changeShowQuestion}
      className={`${styles.questionDiag} ${className}`}
      closeOnClick={closeOnClick}
    >
      <div className={styles.questionDiagDiv}>
        {children}
        <div className={styles.buttonsDiv}>
          <button onClick={() => onYesClick(true)}>{YesBtnText}</button>
          <button onClick={() => onNoClick(false)}>{NoBtnText}</button>
        </div>
      </div>
    </Dialog>
  )
}
