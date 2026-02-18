import { createContext } from 'react'
import { Script, ScriptRun, ScriptUpdateData } from '@interfaces/'

export interface ScriptContextType {
  // Состояние
  scripts: Script[]
  script: Script | null
  runs: ScriptRun[]
  isLoading: boolean
  error: string | null

  // Выделение (для массовых операций)
  selectedScriptIds: number[]
  toggleScriptSelection: (id: number) => void
  selectAllScripts: () => void
  clearScriptSelection: () => void
  setSelectionType: (type: 'delete' | 'refactor' | 'edit' | 'default') => void

  // Действия с данными
  loadAllScripts: (projectId: number) => Promise<Script[]>
  loadScript: (projectId: number, scriptId: number) => Promise<Script>
  createScript: (projectId: number, data: ScriptUpdateData) => Promise<Script>
  updateScript: (
    projectId: number,
    scriptId: number,
    data: ScriptUpdateData
  ) => Promise<Script>
  deleteScript: (projectId: number, scriptId: number) => Promise<void>
  deleteSelectedScripts: (projectId: number) => Promise<void>
  runScript: (projectId: number, scriptId: number) => Promise<ScriptRun>
  refactorScript: (
    projectId: number,
    scriptIds: number[],
    includeNegative?: boolean
  ) => Promise<void>
  archiveScripts: (projectId: number, scriptIds: number[]) => Promise<void>

  // Запуски
  loadScriptRuns: (projectId: number, scriptId: number) => Promise<ScriptRun[]>
  loadScriptRun: (
    projectId: number,
    scriptId: number,
    runId: number
  ) => Promise<ScriptRun>

  // Массовые операции (обёртки)
  generateAllScripts: (
    projectId: number,
    includeNegative?: boolean
  ) => Promise<void>
  generateNewScripts: (
    projectId: number,
    includeNegative?: boolean
  ) => Promise<void>
  refactorAllScripts: (projectId: number) => Promise<void>

  // Setters (для ручного управления состоянием)
  setScripts: (scripts: Script[]) => void
  setScript: (script: Script | null) => void
  setRuns: (runs: ScriptRun[]) => void
  clearScript: () => void
  clearAllScripts: () => void

  // Статистика
  stats: {
    total: number
    selected: number
    active: number
    draft: number
    archived: number
  }
}

export const ScriptContext = createContext<ScriptContextType | undefined>(
  undefined
)
