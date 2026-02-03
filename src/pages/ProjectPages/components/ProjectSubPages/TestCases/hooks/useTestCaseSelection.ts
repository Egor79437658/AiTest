import { useState, useCallback, useMemo } from 'react'
import { TestCase } from '@interfaces/'

export type SelectionType = 'delete' | 'refactor' | 'edit' | 'default'

export interface UseTestCaseSelectionProps {
  initialSelected?: number[]
  maxSelection?: number
}

export function useTestCaseSelection({
  initialSelected = [],
  maxSelection = Infinity,
}: UseTestCaseSelectionProps = {}) {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelected)
  const [selectionType, setSelectionType] = useState<SelectionType>('default')

  const toggleSelection = useCallback(
    (id: number) => {
      setSelectedIds((current) => {
        if (current.includes(id)) {
          return current.filter((selectedId) => selectedId !== id)
        } else {
          if (current.length >= maxSelection) {
            console.warn(`Maximum selection limit reached (${maxSelection})`)
            return current
          }
          return [...current, id]
        }
      })
    },
    [maxSelection]
  )

  const selectRange = useCallback(
    (startId: number, endId: number, allIds: number[]) => {
      const startIndex = allIds.indexOf(startId)
      const endIndex = allIds.indexOf(endId)

      if (startIndex === -1 || endIndex === -1) return

      const minIndex = Math.min(startIndex, endIndex)
      const maxIndex = Math.max(startIndex, endIndex)

      const rangeIds = allIds.slice(minIndex, maxIndex + 1)

      setSelectedIds((current) => {
        const newSelected = [...new Set([...current, ...rangeIds])]

        if (newSelected.length > maxSelection) {
          return newSelected.slice(0, maxSelection)
        }

        return newSelected
      })
    },
    [maxSelection]
  )

  const selectAll = useCallback(
    (allIds: number[]) => {
      if (selectedIds.length === allIds.length) {
        setSelectedIds([])
      } else {
        const idsToSelect = allIds.slice(0, maxSelection)
        setSelectedIds(idsToSelect)

        if (allIds.length > maxSelection) {
          console.warn(`Only ${maxSelection} items can be selected at once`)
        }
      }
    },
    [selectedIds.length, maxSelection]
  )

  const clearSelection = useCallback(() => {
    setSelectedIds([])
    setSelectionType('default')
  }, [])

  const setType = useCallback((type: SelectionType) => {
    setSelectionType(type)
  }, [])

  const isSelected = useCallback(
    (id: number) => {
      return selectedIds.includes(id)
    },
    [selectedIds]
  )

  const getSelectedTestCases = useCallback(
    (allTestCases: TestCase[]): TestCase[] => {
      return allTestCases.filter((tc) => selectedIds.includes(tc.id))
    },
    [selectedIds]
  )

  const getLatestSelectedVersions = useCallback(
    (allTestCases: TestCase[]): TestCase[] => {
      const grouped = allTestCases.reduce(
        (acc, testCase) => {
          if (
            !acc[testCase.id] ||
            new Date(testCase.creationDate) >
              new Date(acc[testCase.id].creationDate)
          ) {
            acc[testCase.id] = testCase
          }
          return acc
        },
        {} as Record<number, TestCase>
      )

      return selectedIds
        .map((id) => grouped[id])
        .filter((tc): tc is TestCase => tc !== undefined)
    },
    [selectedIds]
  )

  const selectionStats = useMemo(
    () => ({
      count: selectedIds.length,
      isEmpty: selectedIds.length === 0,
      isFull: selectedIds.length === maxSelection,
      type: selectionType,
    }),
    [selectedIds.length, maxSelection, selectionType]
  )

  return {
    // Состояние
    selectedIds,
    selectionType,
    selectionStats,

    // Действия
    toggleSelection,
    selectRange,
    selectAll,
    clearSelection,
    setSelectionType: setType,

    // Проверки
    isSelected,

    // Вспомогательные функции
    getSelectedTestCases,
    getLatestSelectedVersions,

    // Полезные значения
    hasSelection: selectedIds.length > 0,
    selectionCount: selectedIds.length,
  }
}
