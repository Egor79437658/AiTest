import { useState, useMemo, useCallback } from 'react'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig<T> {
  key: keyof T
  direction: SortDirection
}

export interface FilterConfig<T> {
  key: keyof T
  value: string
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith'
}

export interface PaginationConfig {
  page: number
  pageSize: number
}

export interface UseTableActionsProps<T> {
  data: T[]
  initialSort?: SortConfig<T>
  initialFilters?: FilterConfig<T>[]
  initialPagination?: PaginationConfig
  defaultPageSize?: number
}

export function useTableActions<T extends Record<string, unknown>>({
  data,
  initialSort,
  initialFilters = [],
  initialPagination = { page: 1, pageSize: 20 },
}: UseTableActionsProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    initialSort || null
  )

  const [filters, setFilters] = useState<FilterConfig<T>[]>(initialFilters)

  const [pagination, setPagination] =
    useState<PaginationConfig>(initialPagination)

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

      const aStr = String(aValue)
      const bStr = String(bValue)
      return sortConfig.direction === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr)
    })
  }, [data, sortConfig])

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

  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, pagination])

  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / pagination.pageSize)

  const handleSort = useCallback((key: keyof T) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' }
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return null
    })
  }, [])

  const handleAddFilter = useCallback((filter: FilterConfig<T>) => {
    setFilters((current) => {
      const filtered = current.filter((f) => f.key !== filter.key)
      return [...filtered, filter]
    })
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  const handleRemoveFilter = useCallback((key: keyof T) => {
    setFilters((current) => current.filter((filter) => filter.key !== key))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters([])
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination({ page: 1, pageSize })
  }, [])

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

  return {
    // Данные
    data: paginatedData,
    totalItems,
    totalPages,

    // Состояние
    sortConfig,
    filters,
    pagination,

    // Действия
    handleSort,
    handleAddFilter,
    handleRemoveFilter,
    handleClearFilters,
    handlePageChange,
    handlePageSizeChange,

    // Вспомогательные функции
    getSortDirection,
    getFilterValue,

    // Полезные вычисления
    hasFilters: filters.length > 0,
    isSorted: sortConfig !== null,
    canGoBack: pagination.page > 1,
    canGoForward: pagination.page < totalPages,
  }
}
