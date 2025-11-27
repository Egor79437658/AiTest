import type React from "react";

import styles from "./Pipeline.module.scss";

interface PipelineProps {
  children?: React.ReactNode
}

export const Pipeline: React.FC<PipelineProps> = ({children}) => {
  const text = "Pipeline";

  return (
    <div className={styles.pipeline}>
      {children || (<p>{text}</p>)}
    </div>
  );
};
