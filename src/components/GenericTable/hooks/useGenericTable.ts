// src/components/common/hooks/useGenericTable.ts
import { useState, useMemo, useCallback } from 'react'
import {
  SortConfig,
  FilterConfig,
  PaginationConfig,
  SelectionConfig,
  ExpansionConfig,
  SortDirection,
} from '../types'

export interface UseGenericTableProps<T extends Record<string, unknown>> {
  data: T[]
  initialSort?: SortConfig<T>
  initialFilters?: FilterConfig<T>[]
  initialPagination?: Omit<PaginationConfig, 'totalItems'>
  initialSelection?: Omit<SelectionConfig, 'enabled'>
  initialExpansion?: Omit<ExpansionConfig<T>, 'enabled'>
  pageSizeOptions?: number[]
  onStateChange?: (state: {
    sort: SortConfig<T> | null
    filters: FilterConfig<T>[]
    pagination: PaginationConfig
    selection: SelectionConfig
    expansion: ExpansionConfig<T>
  }) => void
}

export function useGenericTable<T extends Record<string, unknown>>({
  data,
  initialSort,
  initialFilters = [],
  initialPagination = { page: 1, pageSize: 20 },
  initialSelection = { selectedIds: [], selectionType: 'multiple' },
  initialExpansion = { expandedIds: [] },
  pageSizeOptions = [10, 20, 50, 100],
  onStateChange,
}: UseGenericTableProps<T>) {
  // Состояние
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    initialSort || null
  )
  const [filters, setFilters] = useState<FilterConfig<T>[]>(initialFilters)
  const [pagination, setPagination] = useState<PaginationConfig>({
    ...initialPagination,
    totalItems: data.length,
  })
  const [selection, setSelection] = useState<SelectionConfig>({
    enabled: true,
    ...initialSelection,
  })
  const [expansion, setExpansion] = useState<ExpansionConfig<T>>({
    enabled: true,
    ...initialExpansion,
  })

  // Обновление общего состояния
  const updateState = useCallback(
    (updates: Partial<TableState<T>>) => {
      if (updates.sortConfig !== undefined) {
        setSortConfig(updates.sortConfig)
      }
      if (updates.filters !== undefined) {
        setFilters(updates.filters)
      }
      if (updates.pagination !== undefined) {
        setPagination(updates.pagination)
      }
      if (updates.selection !== undefined) {
        setSelection(updates.selection)
      }
      if (updates.expansion !== undefined) {
        setExpansion(updates.expansion)
      }

      onStateChange?.({
        sort: updates.sortConfig ?? sortConfig,
        filters: updates.filters ?? filters,
        pagination: updates.pagination ?? pagination,
        selection: updates.selection ?? selection,
        expansion: updates.expansion ?? expansion,
      })
    },
    [sortConfig, filters, pagination, selection, expansion, onStateChange]
  )

  // Сортировка
  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      const aStr = String(aValue || '')
      const bStr = String(bValue || '')
      return sortConfig.direction === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr)
    })
  }, [data, sortConfig])

  // Фильтрация
  const filteredData = useMemo(() => {
    if (filters.length === 0) return sortedData

    return sortedData.filter((item) => {
      return filters.every((filter) => {
        const itemValue = String(item[filter.key] || '').toLowerCase()
        const filterValue = filter.value.toLowerCase()

        switch (filter.operator) {
          case 'contains':
            return itemValue.includes(filterValue)
          case 'equals':
            return itemValue === filterValue
          case 'startsWith':
            return itemValue.startsWith(filterValue)
          case 'endsWith':
            return itemValue.endsWith(filterValue)
          default:
            return itemValue.includes(filterValue)
        }
      })
    })
  }, [sortedData, filters])

  // Пагинация
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, pagination])

  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / pagination.pageSize)

  useState(() => {
    if (pagination.totalItems !== totalItems) {
      setPagination((prev) => ({ ...prev, totalItems }))
    }
  })

  // Действия
  const handleSort = useCallback(
    (key: keyof T) => {
      const newSortConfig: SortConfig<T> | null =
        !sortConfig || sortConfig.key !== key
          ? { key, direction: 'asc' }
          : sortConfig.direction === 'asc'
            ? { key, direction: 'desc' }
            : null

      updateState({ sortConfig: newSortConfig })
    },
    [sortConfig, updateState]
  )

  const handleAddFilter = useCallback(
    (filter: FilterConfig<T>) => {
      const newFilters = filters.filter((f) => f.key !== filter.key)
      newFilters.push(filter)

      updateState({
        filters: newFilters,
        pagination: { ...pagination, page: 1 },
      })
    },
    [filters, pagination, updateState]
  )

  const handleRemoveFilter = useCallback(
    (key: keyof T) => {
      const newFilters = filters.filter((filter) => filter.key !== key)

      updateState({
        filters: newFilters,
        pagination: { ...pagination, page: 1 },
      })
    },
    [filters, pagination, updateState]
  )

  const handleClearFilters = useCallback(() => {
    updateState({
      filters: [],
      pagination: { ...pagination, page: 1 },
    })
  }, [pagination, updateState])

  const handlePageChange = useCallback(
    (page: number) => {
      updateState({ pagination: { ...pagination, page } })
    },
    [pagination, updateState]
  )

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      updateState({ pagination: { ...pagination, pageSize, page: 1 } })
    },
    [pagination, updateState]
  )

  // Выделение
  const handleSelect = useCallback(
    (id: string | number, checked: boolean) => {
      if (selection.selectionType === 'single') {
        const newSelectedIds = checked ? [id] : []
        updateState({
          selection: { ...selection, selectedIds: newSelectedIds },
        })
      } else {
        const newSelectedIds = checked
          ? [...selection.selectedIds, id]
          : selection.selectedIds.filter((selectedId) => selectedId !== id)

        updateState({
          selection: { ...selection, selectedIds: newSelectedIds },
        })
      }
    },
    [selection, updateState]
  )

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (selection.selectionType === 'single') return

      const newSelectedIds = checked
        ? filteredData.map((item) => item.id as string | number)
        : []

      updateState({
        selection: { ...selection, selectedIds: newSelectedIds },
      })
    },
    [selection, filteredData, updateState]
  )

  const clearSelection = useCallback(() => {
    updateState({
      selection: { ...selection, selectedIds: [] },
    })
  }, [selection, updateState])

  // Расширение
  const handleExpand = useCallback(
    (id: string | number) => {
      const newExpandedIds = expansion.expandedIds.includes(id)
        ? expansion.expandedIds.filter((expandedId) => expandedId !== id)
        : [...expansion.expandedIds, id]

      updateState({
        expansion: { ...expansion, expandedIds: newExpandedIds },
      })
    },
    [expansion, updateState]
  )

  const expandAll = useCallback(() => {
    const allIds = filteredData.map((item) => item.id as string | number)
    updateState({
      expansion: { ...expansion, expandedIds: allIds },
    })
  }, [expansion, filteredData, updateState])

  const collapseAll = useCallback(() => {
    updateState({
      expansion: { ...expansion, expandedIds: [] },
    })
  }, [expansion, updateState])

  // Вспомогательные функции
  const getSortDirection = useCallback(
    (key: keyof T): SortDirection | null => {
      if (!sortConfig || sortConfig.key !== key) return null
      return sortConfig.direction
    },
    [sortConfig]
  )

  const getFilterValue = useCallback(
    (key: keyof T): string | null => {
      const filter = filters.find((f) => f.key === key)
      return filter ? filter.value : null
    },
    [filters]
  )

  const isSelected = useCallback(
    (id: string | number): boolean => {
      return selection.selectedIds.includes(id)
    },
    [selection.selectedIds]
  )

  const isExpanded = useCallback(
    (id: string | number): boolean => {
      return expansion.expandedIds.includes(id)
    },
    [expansion.expandedIds]
  )

  const getSelectedRows = useCallback((): T[] => {
    return filteredData.filter((row) =>
      selection.selectedIds.includes(row.id as string | number)
    )
  }, [filteredData, selection.selectedIds])

  // Статистика
  const stats = useMemo(
    () => ({
      total: data.length,
      filtered: filteredData.length,
      selected: selection.selectedIds.length,
      expanded: expansion.expandedIds.length,
      page: pagination.page,
      totalPages,
      pageSize: pagination.pageSize,
      startIndex: (pagination.page - 1) * pagination.pageSize + 1,
      endIndex: Math.min(
        pagination.page * pagination.pageSize,
        filteredData.length
      ),
    }),
    [
      data.length,
      filteredData.length,
      selection.selectedIds.length,
      expansion.expandedIds.length,
      pagination,
      totalPages,
    ]
  )

  return {
    // Данные
    data: paginatedData,
    filteredData,
    sortedData,

    // Состояние
    sortConfig,
    filters,
    pagination,
    selection,
    expansion,
    stats,

    // Действия
    handleSort,
    handleAddFilter,
    handleRemoveFilter,
    handleClearFilters,
    handlePageChange,
    handlePageSizeChange,
    handleSelect,
    handleSelectAll,
    clearSelection,
    handleExpand,
    expandAll,
    collapseAll,

    // Вспомогательные функции
    getSortDirection,
    getFilterValue,
    isSelected,
    isExpanded,
    getSelectedRows,

    // Утилиты
    pageSizeOptions,
    hasFilters: filters.length > 0,
    hasSelection: selection.selectedIds.length > 0,
    hasExpansion: expansion.expandedIds.length > 0,
    canGoBack: pagination.page > 1,
    canGoForward: pagination.page < totalPages,
    allSelected:
      filteredData.length > 0 &&
      selection.selectedIds.length === filteredData.length,
    someSelected:
      selection.selectedIds.length > 0 &&
      selection.selectedIds.length < filteredData.length,
  }
}

export type UseGenericTableReturn<T> = ReturnType<
  typeof useGenericTable<Record<string, T>>
>

// Тип для табличного состояния
interface TableState<T> {
  sortConfig: SortConfig<T> | null
  filters: FilterConfig<T>[]
  pagination: PaginationConfig
  selection: SelectionConfig
  expansion: ExpansionConfig<T>
}
