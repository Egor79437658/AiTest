import { FC, ReactNode } from "react";
import { Dialog } from "../Dialog";

import styles from "./questionDiag.module.scss";

export const QuestionDialog:FC<{
  showQuestion: boolean;
  changeShowQuestion: (val: boolean) => void;
  children?: ReactNode;
  className?: string;
  closeOnCLick?: boolean;
  onYesClick?: (flag?: boolean) => void,
  onNoClick?: (flag?: boolean) => void,
}> = ({ showQuestion, children, className = "", changeShowQuestion, closeOnCLick = true, onYesClick = () => {}, onNoClick = () => {} }) => {
    return (
        <Dialog
        show={showQuestion}
        changeShow={changeShowQuestion}
        className={`${styles.questionDiag} ${className}`}
        closeOnCLick={closeOnCLick}
        >
        <div className={styles.questionDiagDiv}>
            {children}
          <div className={styles.buttonsDiv}>
            <button onClick={() => onYesClick(true)}>Да</button>
            <button onClick={() => onNoClick(false)}>Нет</button>
          </div>
        </div>
        </Dialog>
    )
}