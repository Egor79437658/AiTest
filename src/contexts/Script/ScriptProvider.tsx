import React, { useCallback, useState } from 'react'
import { Script, ScriptRun, ScriptUpdateData } from '@interfaces/'
import { ScriptContext, ScriptContextType } from './ScriptContext'
import { scriptApi } from '@api'

interface ScriptProviderProps {
  children: React.ReactNode
  onSuccess?: (action: string, data?: unknown) => void
  onError?: (action: string, error: Error) => void
}

export const ScriptProvider: React.FC<ScriptProviderProps> = ({
  children,
  onSuccess,
  onError,
}) => {
  const [scripts, setScripts] = useState<Script[]>([])
  const [script, setScript] = useState<Script | null>(null)
  const [runs, setRuns] = useState<ScriptRun[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedScriptIds, setSelectedScriptIds] = useState<number[]>([])
  const [selectionType, setSelectionType] = useState<
    'delete' | 'refactor' | 'edit' | 'default'
  >('default')

  const toggleScriptSelection = useCallback((id: number) => {
    setSelectedScriptIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }, [])

  const selectAllScripts = useCallback(() => {
    setSelectedScriptIds(scripts.map((s) => s.id))
  }, [scripts])

  const clearScriptSelection = useCallback(() => {
    setSelectedScriptIds([])
  }, [])

  const updateScriptInList = useCallback(
    (scriptId: number, updates: Partial<Script>) => {
      setScripts((prev) =>
        prev.map((s) => (s.id === scriptId ? { ...s, ...updates } : s))
      )
    },
    []
  )

  const removeScriptsFromList = useCallback((ids: number[]) => {
    setScripts((prev) => prev.filter((s) => !ids.includes(s.id)))
  }, [])

  const addScriptsToList = useCallback((newScripts: Script[]) => {
    setScripts((prev) => [...prev, ...newScripts])
  }, [])

  const loadAllScripts = useCallback(
    async (projectId: number): Promise<Script[]> => {
      if (isNaN(projectId) || !isFinite(projectId)) {
        setError('Некорректный ID проекта')
        throw new Error('Invalid projectId')
      }
      setIsLoading(true)
      setError(null)
      try {
        const data = await scriptApi.getScripts(projectId)
        setScripts(data)
        onSuccess?.('loadAllScripts', { projectId, count: data.length })
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка загрузки скриптов'
        setError(message)
        onError?.('loadAllScripts', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [onSuccess, onError]
  )

  const loadScript = useCallback(
    async (projectId: number, scriptId: number): Promise<Script> => {
      if (
        isNaN(projectId) ||
        !isFinite(projectId) ||
        isNaN(scriptId) ||
        !isFinite(scriptId)
      ) {
        setError('Некорректные ID')
        throw new Error('Invalid ids')
      }
      setIsLoading(true)
      setError(null)
      try {
        const data = await scriptApi.getScript(projectId, scriptId)
        setScript(data)
        setScripts((prev) => prev.map((s) => (s.id === scriptId ? data : s)))
        onSuccess?.('loadScript', { projectId, scriptId })
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка загрузки скрипта'
        setError(message)
        onError?.('loadScript', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [onSuccess, onError]
  )

  const createScript = useCallback(
    async (projectId: number, data: ScriptUpdateData): Promise<Script> => {
      if (isNaN(projectId) || !isFinite(projectId)) {
        setError('Некорректный ID проекта')
        throw new Error('Invalid projectId')
      }
      setIsLoading(true)
      setError(null)
      try {
        const newScript = await scriptApi.createScript(projectId, data)
        addScriptsToList([newScript])
        onSuccess?.('createScript', { projectId, scriptId: newScript.id })
        return newScript
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка создания скрипта'
        setError(message)
        onError?.('createScript', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [addScriptsToList, onSuccess, onError]
  )

  const updateScript = useCallback(
    async (
      projectId: number,
      scriptId: number,
      updates: ScriptUpdateData
    ): Promise<Script> => {
      if (
        isNaN(projectId) ||
        !isFinite(projectId) ||
        isNaN(scriptId) ||
        !isFinite(scriptId)
      ) {
        setError('Некорректные ID')
        throw new Error('Invalid ids')
      }
      setIsLoading(true)
      setError(null)
      try {
        const updated = await scriptApi.updateScript(
          projectId,
          scriptId,
          updates
        )
        updateScriptInList(scriptId, updates)
        if (script?.id === scriptId) setScript(updated)
        onSuccess?.('updateScript', { projectId, scriptId, updates })
        return updated
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка обновления скрипта'
        setError(message)
        onError?.('updateScript', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [updateScriptInList, script, onSuccess, onError]
  )

  const deleteScript = useCallback(
    async (projectId: number, scriptId: number): Promise<void> => {
      if (
        isNaN(projectId) ||
        !isFinite(projectId) ||
        isNaN(scriptId) ||
        !isFinite(scriptId)
      ) {
        setError('Некорректные ID')
        throw new Error('Invalid ids')
      }
      setIsLoading(true)
      setError(null)
      try {
        await scriptApi.deleteScript(projectId, scriptId)
        removeScriptsFromList([scriptId])
        if (script?.id === scriptId) setScript(null)
        onSuccess?.('deleteScript', { projectId, scriptId })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка удаления скрипта'
        setError(message)
        onError?.('deleteScript', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [removeScriptsFromList, script, onSuccess, onError]
  )

  const deleteSelectedScripts = useCallback(
    async (projectId: number): Promise<void> => {
      if (selectedScriptIds.length === 0) {
        setError('Нет выбранных скриптов')
        throw new Error('No scripts selected')
      }
      setIsLoading(true)
      setError(null)
      try {
        await Promise.all(
          selectedScriptIds.map((id) => scriptApi.deleteScript(projectId, id))
        )
        removeScriptsFromList(selectedScriptIds)
        clearScriptSelection()
        onSuccess?.('deleteSelectedScripts', {
          projectId,
          count: selectedScriptIds.length,
        })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка массового удаления'
        setError(message)
        onError?.('deleteSelectedScripts', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [
      selectedScriptIds,
      removeScriptsFromList,
      clearScriptSelection,
      onSuccess,
      onError,
    ]
  )

  const runScript = useCallback(
    async (projectId: number, scriptId: number): Promise<ScriptRun> => {
      if (
        isNaN(projectId) ||
        !isFinite(projectId) ||
        isNaN(scriptId) ||
        !isFinite(scriptId)
      ) {
        setError('Некорректные ID')
        throw new Error('Invalid ids')
      }
      setIsLoading(true)
      setError(null)
      try {
        const run = await scriptApi.runScript(projectId, scriptId)
        onSuccess?.('runScript', { projectId, scriptId, runId: run.id })
        return run
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка запуска скрипта'
        setError(message)
        onError?.('runScript', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [onSuccess, onError]
  )

  const refactorScript = useCallback(
    async (
      projectId: number,
      scriptIds: number[],
      includeNegative?: boolean
    ): Promise<void> => {
      if (isNaN(projectId) || !isFinite(projectId) || !scriptIds.length) {
        setError('Некорректные данные')
        throw new Error('Invalid arguments')
      }
      setIsLoading(true)
      setError(null)
      try {
        await scriptApi.refactorScripts(projectId, scriptIds, includeNegative)
        await loadAllScripts(projectId)
        onSuccess?.('refactorScript', { projectId, scriptIds, includeNegative })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка рефакторинга'
        setError(message)
        onError?.('refactorScript', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadAllScripts, onSuccess, onError]
  )

  const loadScriptRuns = useCallback(
    async (projectId: number, scriptId: number): Promise<ScriptRun[]> => {
      if (
        isNaN(projectId) ||
        !isFinite(projectId) ||
        isNaN(scriptId) ||
        !isFinite(scriptId)
      ) {
        setError('Некорректные ID')
        throw new Error('Invalid ids')
      }
      setIsLoading(true)
      setError(null)
      try {
        const runsData = await scriptApi.getScriptRuns(projectId, scriptId)
        setRuns(runsData)
        return runsData
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка загрузки запусков'
        setError(message)
        onError?.('loadScriptRuns', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [onError]
  )

  const loadScriptRun = useCallback(
    async (
      projectId: number,
      scriptId: number,
      runId: number
    ): Promise<ScriptRun> => {
      if (
        isNaN(projectId) ||
        !isFinite(projectId) ||
        isNaN(scriptId) ||
        !isFinite(scriptId) ||
        isNaN(runId) ||
        !isFinite(runId)
      ) {
        setError('Некорректные ID')
        throw new Error('Invalid ids')
      }
      setIsLoading(true)
      setError(null)
      try {
        const run = await scriptApi.getScriptRun(projectId, scriptId, runId)
        return run
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка загрузки запуска'
        setError(message)
        onError?.('loadScriptRun', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [onError]
  )

  const generateAllScripts = useCallback(
    async (projectId: number, includeNegative?: boolean): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        await scriptApi.generateAllScripts(projectId, includeNegative)
        await loadAllScripts(projectId)
        onSuccess?.('generateAllScripts', { projectId, includeNegative })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка генерации всех скриптов'
        setError(message)
        onError?.('generateAllScripts', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadAllScripts, onSuccess, onError]
  )

  const generateNewScripts = useCallback(
    async (projectId: number, includeNegative?: boolean): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        await scriptApi.generateNewScripts(projectId, includeNegative)
        await loadAllScripts(projectId)
        onSuccess?.('generateNewScripts', { projectId, includeNegative })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка генерации новых скриптов'
        setError(message)
        onError?.('generateNewScripts', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadAllScripts, onSuccess, onError]
  )

  const refactorAllScripts = useCallback(
    async (projectId: number): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        await scriptApi.refactorAllScripts(projectId)
        await loadAllScripts(projectId)
        onSuccess?.('refactorAllScripts', { projectId })
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Ошибка рефакторинга всех скриптов'
        setError(message)
        onError?.('refactorAllScripts', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadAllScripts, onSuccess, onError]
  )

  const archiveScripts = useCallback(
    async (projectId: number, scriptIds: number[]): Promise<void> => {
      if (isNaN(projectId) || !isFinite(projectId) || !scriptIds.length) {
        const errMsg = 'Некорректные данные'
        setError(errMsg)
        throw new Error(errMsg)
      }
      setIsLoading(true)
      setError(null)
      try {
        await scriptApi.archiveScripts(projectId, scriptIds)
        await loadAllScripts(projectId)
        onSuccess?.('archiveScripts', { projectId, scriptIds })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка архивации скриптов'
        setError(message)
        onError?.('archiveScripts', err as Error)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [setIsLoading, setError, loadAllScripts, onSuccess, onError]
  )

  const clearScript = useCallback(() => setScript(null), [])
  const clearAllScripts = useCallback(() => {
    setScripts([])
    setScript(null)
    setRuns([])
  }, [])

  const stats = {
    total: scripts.length,
    selected: selectedScriptIds.length,
    active: scripts.filter((s) => s.status === 1).length,
    draft: scripts.filter((s) => s.status === 2).length,
    archived: scripts.filter((s) => s.status === 0).length,
  }

  const value: ScriptContextType = {
    scripts,
    script,
    runs,
    isLoading,
    error,
    selectedScriptIds,
    toggleScriptSelection,
    selectAllScripts,
    clearScriptSelection,
    setSelectionType,
    loadAllScripts,
    loadScript,
    createScript,
    updateScript,
    deleteScript,
    deleteSelectedScripts,
    runScript,
    refactorScript,
    loadScriptRuns,
    loadScriptRun,
    generateAllScripts,
    generateNewScripts,
    refactorAllScripts,
    archiveScripts,
    setScripts,
    setScript,
    setRuns,
    clearScript,
    clearAllScripts,
    stats,
  }

  return (
    <ScriptContext.Provider value={value}>{children}</ScriptContext.Provider>
  )
}
