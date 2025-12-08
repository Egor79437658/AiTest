import type React from 'react'

import styles from './Pipeline.module.scss'
import { usePipelineStore } from '@stores/'

interface PipelineProps {
  children?: React.ReactNode
}

export const Pipeline: React.FC<PipelineProps> = ({ children }) => {
  const { pipelineContent } = usePipelineStore()
  return (
    <div className={styles.pipeline}>{pipelineContent}</div>
  )
}
