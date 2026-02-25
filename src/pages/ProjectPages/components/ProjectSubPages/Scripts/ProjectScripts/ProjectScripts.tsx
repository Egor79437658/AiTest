import React, { useEffect, useState } from 'react'
import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useScript, useTestCase } from '@contexts/'
import { useHeaderStore } from '@stores/'
import { Link, useNavigate } from 'react-router-dom'
import styles from './ProjectScripts.module.scss'
import { Breadcrumbs, QuestionDialog } from '@components/'
import { ProjectScriptTable } from '../ProjectScriptTable'
import { MassScriptOperationsTab } from '../MassOperationsTab'

export const ProjectScripts: React.FC = () => {
  const { project } = useProject()
  const {
    scripts,
    loadAllScripts,
    deleteScript,
    runScript,
    refactorScript,
    archiveScripts,
    generateAllScripts,
    generateNewScripts,
    refactorAllScripts,
    isLoading,
    error,
  } = useScript()
  const { setHeaderContent } = useHeaderStore()
  const navigate = useNavigate()
  const { loadAllTestCases, allTestCases } = useTestCase()

  const [showDeleteDiag, setShowDeleteDiag] = useState(false)
  const [showRefactorDiag, setShowRefactorDiag] = useState(false)
  const [activeTab, setActiveTab] = useState<'table' | 'operations'>('table')
  const [deleteIds, setDeleteIds] = useState<number[]>([])
  const [refactorIds, setRefactorIds] = useState<number[]>([])
  const [includeNegative, setIncludeNegative] = useState(false)

  useEffect(() => {
    if (project) {
      loadAllScripts(project.id)
      loadAllTestCases(project.id)
    }
  }, [project, loadAllScripts, loadAllTestCases])

  useEffect(() => {
    if (project) {
      setHeaderContent(
        <Breadcrumbs
          items={[
            {
              text: 'Проекты',
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.HOME}`,
            },
            {
              text: project.name,
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${project.id}`,
            },
            { text: 'Скрипты' },
          ]}
        />
      )
    }
  }, [project, setHeaderContent])

  const totalTCWithoutScript = allTestCases.filter(
    (tc) => tc.status === 1 && !scripts.some((s) => s.testCaseId === tc.id)
  ).length

  const totalActiveScripts = scripts.filter((s) => s.status === 1).length

  const handleRun = (ids: number[]) => {
    if (!project) return
    if (ids.length === 1) {
      if (window.confirm(`Запустить скрипт ID ${ids[0]}?`)) {
        runScript(project.id, ids[0])
      }
    } else {
      if (window.confirm(`Запустить ${ids.length} скриптов?`)) {
        ids.forEach((id) => runScript(project.id, id))
      }
    }
  }

  const handleRefactor = (ids: number[]) => {
    setRefactorIds(ids)
    setShowRefactorDiag(true)
  }

  const askDelete = (ids: number[]) => {
    setDeleteIds(ids)
    setShowDeleteDiag(true)
  }

  const handleDelete = async () => {
    if (!project) return
    try {
      await Promise.all(deleteIds.map((id) => deleteScript(project.id, id)))
      await loadAllScripts(project.id)
      setDeleteIds([])
      setShowDeleteDiag(false)
    } catch (error) {
      console.error('Ошибка при удалении скриптов:', error)
    }
  }

  const handleArchive = async (ids: number[]) => {
    if (!project) return
    try {
      await archiveScripts(project.id, ids)
      setShowDeleteDiag(false)
    } catch (error) {
      console.error('Ошибка при архивации скриптов:', error)
    }
  }

  const handleRefactorSelected = async () => {
    if (!project) return
    try {
      await refactorScript(project.id, refactorIds, includeNegative)
      await loadAllScripts(project.id)
      setRefactorIds([])
      setIncludeNegative(false)
      setShowRefactorDiag(false)
    } catch (error) {
      console.error('Ошибка при рефакторинге скриптов:', error)
    }
  }

  const handleGenerateAll = (includeNegative: boolean) => {
    if (!project) return
    generateAllScripts(project.id, includeNegative)
  }

  const handleGenerateNew = (includeNegative: boolean) => {
    if (!project) return
    generateNewScripts(project.id, includeNegative)
  }

  const handleRefactorAll = () => {
    if (!project) return
    refactorAllScripts(project.id)
  }

  const getProjectBaseUrl = () => {
    const path = window.location.pathname
    const scriptPart = '/' + PAGE_ENDPOINTS.PROJECT_PARTS.SCRIPT
    const parts = path.split(scriptPart)
    return parts[0] || path
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Произошла ошибка</h3>
        <p>{error}</p>
        <br />
        <Link to="/" className={styles.backLink}>
          Вернуться к списку проектов
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Загрузка скриптов...</p>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <h1>Скрипты автотестирования</h1>
        <p className={styles.projectInfo}>
          Проект: <strong>{project?.name}</strong> | Всего скриптов:{' '}
          <strong>{scripts.length}</strong>
        </p>
      </div>

      {/* Вкладки */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'table' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('table')}
          >
            База скриптов
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'operations' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('operations')}
          >
            Генерация скриптов
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'table' ? (
            <ProjectScriptTable
              scripts={scripts}
              onRun={handleRun}
              onRefactor={handleRefactor}
              onDelete={askDelete}
              onOpenHistory={(id) => navigate(`${id}/history`)}
              onEdit={(id) => navigate(`${id}/edit`)}
              onView={(id) => navigate(`${id}/view`)}
              projectBaseUrl={getProjectBaseUrl()}
            />
          ) : (
            <MassScriptOperationsTab
              totalActiveScripts={totalActiveScripts}
              totalTCWithoutScript={totalTCWithoutScript}
              onGenerateAll={handleGenerateAll}
              onGenerateNew={handleGenerateNew}
              onRefactorAll={handleRefactorAll}
            />
          )}
        </div>
      </div>

      {/* Диалог удаления */}
      <QuestionDialog
        showQuestion={showDeleteDiag}
        changeShowQuestion={setShowDeleteDiag}
        onYesClick={handleDelete}
        onNoClick={() => setDeleteIds([])}
      >
        Вы уверены, что хотите удалить следующие скрипты? <br />
        {scripts
          .filter((s) => deleteIds.includes(s.id))
          .map((s) => (
            <div key={s.id}>{s.name}</div>
          ))}
        <div className={styles.archiveSuggestionDiv}>
          Вместо этого вы можете
          <button
            className={styles.archiveBtn}
            onClick={() => handleArchive(deleteIds)}
          >
            заархивировать их
          </button>
        </div>
      </QuestionDialog>

      {/* Диалог рефакторинга */}
      <QuestionDialog
        showQuestion={showRefactorDiag}
        changeShowQuestion={setShowRefactorDiag}
        onYesClick={handleRefactorSelected}
        onNoClick={() => {
          setRefactorIds([])
          setIncludeNegative(false)
        }}
      >
        <div className={styles.dialogContent}>
          <h3>Рефакторинг выбранных скриптов</h3>
          <p>
            Будет оптимизировано: <strong>{refactorIds.length} скриптов</strong>
          </p>
          <p>
            Проект: <strong>{project?.name}</strong>
          </p>

          {refactorIds.length > 0 && (
            <div className={styles.selectedList}>
              <h4>Выбранные скрипты:</h4>
              {scripts
                .filter((s) => refactorIds.includes(s.id))
                .map((s) => (
                  <div key={s.id} className={styles.selectedItem}>
                    {s.name} (ID: {s.id})
                  </div>
                ))}
            </div>
          )}

          <div className={styles.checkboxSection}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={includeNegative}
                onChange={(e) => setIncludeNegative(e.target.checked)}
              />
              Включая негативные тест-кейсы (для генерации новых скриптов)
            </label>
          </div>

          <div className={styles.warningSection}>
            <div className={styles.warningIcon}>⚠️</div>
            <div className={styles.warningText}>
              <p>
                <strong>Внимание!</strong>
              </p>
              <p>
                Рефакторинг может изменить код скриптов. Убедитесь, что это не
                повлияет на текущие тест-планы.
              </p>
            </div>
          </div>
        </div>
      </QuestionDialog>
    </div>
  )
}
