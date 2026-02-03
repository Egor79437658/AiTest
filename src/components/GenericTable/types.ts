// src/components/common/GenericTable/types.ts
import { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig<T> {
  key: keyof T
  direction: SortDirection
}

export interface Column<T> {
  key: keyof T | string
  title: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
  hideOnMobile?: boolean
  render?: (value: unknown, row: T, index: number) => ReactNode
}

export interface FilterConfig<T> {
  key: keyof T
  value: string
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith'
}

export interface PaginationConfig {
  page: number
  pageSize: number
  totalItems: number
}

export interface SelectionConfig {
  enabled: boolean
  selectedIds: (string | number)[]
  selectionType?: 'single' | 'multiple'
}

export interface ExpansionConfig<T> {
  enabled: boolean
  expandedIds: (string | number)[]
  renderExpandedRow?: (row: T, index: number) => ReactNode
}

export interface GenericTableProps<T extends Record<string, unknown>> {
  // Данные
  data: T[]
  columns: Column<T>[]
  keyField?: keyof T | string

  // Конфигурация
  sortable?: boolean
  filterable?: boolean
  pagination?: boolean
  selectable?: boolean
  expandable?: boolean

  // Состояние
  initialSort?: SortConfig<T>
  initialFilters?: FilterConfig<T>[]
  initialPagination?: Omit<PaginationConfig, 'totalItems'>
  selectionConfig?: Omit<SelectionConfig, 'enabled'>
  expansionConfig?: Omit<ExpansionConfig<T>, 'enabled'>

  // Колбэки
  onSortChange?: (sortConfig: SortConfig<T> | null) => void
  onFilterChange?: (filters: FilterConfig<T>[]) => void
  onPaginationChange?: (pagination: PaginationConfig) => void
  onSelectionChange?: (selectedIds: (string | number)[]) => void
  onExpansionChange?: (expandedIds: (string | number)[]) => void
  onRowClick?: (row: T, index: number) => void

  // UI
  className?: string
  headerClassName?: string
  rowClassName?: string | ((row: T, index: number) => string)
  cellClassName?: string
  emptyMessage?: ReactNode
  loading?: boolean
  loadingMessage?: ReactNode

  // Дополнительно
  pageSizeOptions?: number[]
  maxHeight?: string | number
  stickyHeader?: boolean
}

export interface TableState<T> {
  sortConfig: SortConfig<T> | null
  filters: FilterConfig<T>[]
  pagination: PaginationConfig
  selection: SelectionConfig
  expansion: ExpansionConfig<T>
}
