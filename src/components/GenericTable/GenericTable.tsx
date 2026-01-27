// src/components/common/GenericTable/GenericTable.tsx
import React from 'react'
import { Column, GenericTableProps } from './types'
import styles from './GenericTable.module.scss'
import {
  ChevronRightIcon,
  SortAscIcon,
  SortDescIcon,
  FilterIcon,
  CheckIcon,
} from '../Icons'
import { useGenericTable } from './hooks'

export function GenericTable<T extends Record<string, unknown>>({
  // Данные
  data,
  columns,
  keyField = 'id',

  // Конфигурация
  sortable = true,
  filterable = false,
  pagination = true,
  selectable = false,
  expandable = false,

  // Состояние
  initialSort,
  initialFilters = [],
  initialPagination = { page: 1, pageSize: 20 },
  selectionConfig = { selectedIds: [], selectionType: 'multiple' },
  expansionConfig = { expandedIds: [] },

  // Колбэки
  onSortChange,
  onFilterChange,
  onPaginationChange,
  onSelectionChange,
  onExpansionChange,
  onRowClick,

  // UI
  className = '',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
  emptyMessage = 'Нет данных для отображения',
  loading = false,
  loadingMessage = 'Загрузка...',

  // Дополнительно
  pageSizeOptions = [10, 20, 50, 100],
  maxHeight,
  stickyHeader = false,
}: GenericTableProps<T>) {
  const {
    data: paginatedData,
    filters,
    selection,
    stats,
    handleSort,
    handleSelect,
    handleSelectAll,
    handleExpand,
    getSortDirection,
    isSelected,
    isExpanded,
    handlePageChange,
    handlePageSizeChange,
    hasSelection,
    allSelected,
    someSelected,
    canGoBack,
    canGoForward,
  } = useGenericTable({
    data,
    initialSort,
    initialFilters,
    initialPagination,
    initialSelection: { ...selectionConfig, enabled: selectable },
    initialExpansion: { ...expansionConfig, enabled: expandable },
    pageSizeOptions,
    onStateChange: (state) => {
      onSortChange?.(state.sort)
      onFilterChange?.(state.filters)
      onPaginationChange?.(state.pagination)
      onSelectionChange?.(state.selection.selectedIds)
      onExpansionChange?.(state.expansion.expandedIds)
    },
  })

  // Рендер ячейки
  const renderCell = (column: Column<T>, row: T, rowIndex: number) => {
    if (column.render) {
      return column.render(row[column.key as keyof T], row, rowIndex)
    }

    const value = row[column.key as keyof T]

    // Форматирование значений по типу
    if (value === null || value === undefined) {
      return <span className={styles.emptyCell}>—</span>
    }

    if (typeof value === 'boolean') {
      return value ? '✓' : '✗'
    }

    if (value instanceof Date) {
      return value.toLocaleDateString('ru-RU')
    }

    return String(value)
  }

  // Рендер заголовка с сортировкой
  const renderHeader = (column: Column<T>) => {
    const sortDirection = getSortDirection(column.key as keyof T)
    const isSorted = sortDirection !== null

    return (
      <th
        key={String(column.key)}
        style={{
          width: column.width,
          minWidth: column.minWidth,
          textAlign: column.align || 'left',
        }}
        className={`
          ${styles.headerCell}
          ${column.sortable !== false && sortable ? styles.sortable : ''}
          ${isSorted ? styles.sorted : ''}
          ${column.hideOnMobile ? styles.hideOnMobile : ''}
        `}
        onClick={() => {
          if (column.sortable !== false && sortable) {
            handleSort(column.key as keyof T)
          }
        }}
      >
        <div className={styles.headerContent}>
          <span className={styles.headerTitle}>{column.title}</span>
          {column.sortable !== false && sortable && (
            <span className={styles.sortIndicator}>
              {isSorted ? (
                sortDirection === 'asc' ? (
                  <SortAscIcon className={styles.sortIcon} />
                ) : (
                  <SortDescIcon className={styles.sortIcon} />
                )
              ) : (
                <span className={styles.sortPlaceholder}>↕</span>
              )}
            </span>
          )}
          {column.filterable && filterable && (
            <button
              className={styles.filterButton}
              onClick={(e) => {
                e.stopPropagation()
                // TODO: Открыть фильтр
              }}
            >
              <FilterIcon className={styles.filterIcon} />
            </button>
          )}
        </div>
      </th>
    )
  }

  // Рендер строки
  const renderRow = (row: T, index: number) => {
    const rowKey = String(row[keyField as keyof T] || index)
    const selected = isSelected(rowKey)
    const expanded = isExpanded(rowKey)

    const rowClass =
      typeof rowClassName === 'function'
        ? rowClassName(row, index)
        : rowClassName

    return (
      <React.Fragment key={rowKey}>
        <tr
          className={`
            ${styles.row}
            ${rowClass}
            ${selected ? styles.selected : ''}
            ${onRowClick ? styles.clickable : ''}
            ${expanded ? styles.expanded : ''}
          `}
          onClick={() => onRowClick?.(row, index)}
        >
          {/* Колонка выделения */}
          {selectable && (
            <td className={styles.selectCell}>
              <input
                type={
                  selection.selectionType === 'single' ? 'radio' : 'checkbox'
                }
                checked={selected}
                onChange={(e) => {
                  e.stopPropagation()
                  handleSelect(rowKey, e.target.checked)
                }}
                className={styles.selectInput}
                onClick={(e) => e.stopPropagation()}
              />
            </td>
          )}

          {/* Колонка расширения */}
          {expandable && (
            <td className={styles.expandCell}>
              <button
                className={`
                  ${styles.expandButton}
                  ${expanded ? styles.expanded : ''}
                `}
                onClick={(e) => {
                  e.stopPropagation()
                  handleExpand(rowKey)
                }}
              >
                {expanded ? (
                  <ChevronRightIcon className={styles.expandIcon} />
                ) : (
                  <ChevronRightIcon className={styles.expandIcon} />
                )}
              </button>
            </td>
          )}

          {/* Основные колонки */}
          {columns.map((column) => (
            <td
              key={String(column.key)}
              className={`
                ${styles.cell}
                ${cellClassName}
                ${column.align ? styles[`align${column.align}`] : ''}
                ${column.hideOnMobile ? styles.hideOnMobile : ''}
              `}
              style={{ textAlign: column.align || 'left' }}
            >
              {renderCell(column, row, index)}
            </td>
          ))}
        </tr>

        {/* Расширенная строка */}
        {expandable && expanded && expansionConfig.renderExpandedRow && (
          <tr className={styles.expandedRow}>
            <td
              colSpan={
                columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)
              }
              className={styles.expandedCell}
            >
              {expansionConfig.renderExpandedRow(row, index)}
            </td>
          </tr>
        )}
      </React.Fragment>
    )
  }

  // Рендер пустого состояния
  const renderEmptyState = () => {
    if (loading) {
      return (
        <tr>
          <td
            colSpan={
              columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)
            }
          >
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>{loadingMessage}</p>
            </div>
          </td>
        </tr>
      )
    }

    return (
      <tr>
        <td
          colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}
        >
          <div className={styles.emptyState}>
            <p>{emptyMessage}</p>
          </div>
        </td>
      </tr>
    )
  }

  // Рендер пагинации
  const renderPagination = () => {
    if (!pagination || stats.totalPages <= 1) return null

    return (
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          <span>
            Показано {stats.startIndex}–{stats.endIndex} из {stats.filtered}
            {stats.filtered !== stats.total && ` (всего: ${stats.total})`}
          </span>
        </div>

        <div className={styles.paginationControls}>
          <select
            value={stats.pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className={styles.pageSizeSelect}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} на странице
              </option>
            ))}
          </select>

          <button
            onClick={() => handlePageChange(stats.page - 1)}
            disabled={!canGoBack}
            className={styles.paginationButton}
          >
            ←
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, stats.totalPages) }, (_, i) => {
              let pageNum
              if (stats.totalPages <= 5) {
                pageNum = i + 1
              } else if (stats.page <= 3) {
                pageNum = i + 1
              } else if (stats.page >= stats.totalPages - 2) {
                pageNum = stats.totalPages - 4 + i
              } else {
                pageNum = stats.page - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`
                    ${styles.pageButton}
                    ${stats.page === pageNum ? styles.active : ''}
                  `}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(stats.page + 1)}
            disabled={!canGoForward}
            className={styles.paginationButton}
          >
            →
          </button>
        </div>
      </div>
    )
  }

  //   const renderToolbar = () => {
  //     if (!selectable && !filterable) return null

  //     return (
  //       <div className={styles.toolbar}>
  //         {selectable && (
  //           <div className={styles.selectionInfo}>
  //             <span>
  //               Выбрано: {stats.selected} из {stats.filtered}
  //             </span>
  //             {hasSelection && (
  //               <button
  //                 onClick={clearSelection}
  //                 className={styles.clearSelectionButton}
  //               >
  //                 Снять выделение
  //               </button>
  //             )}
  //           </div>
  //         )}

  //         {filterable && filters.length > 0 && (
  //           <div className={styles.filterInfo}>
  //             <span>Активных фильтров: {filters.length}</span>
  //             <button
  //               onClick={handleClearFilters}
  //               className={styles.clearFiltersButton}
  //             >
  //               Очистить фильтры
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //     )
  //   }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* {renderToolbar()} */}

      <div className={styles.tableWrapper} style={{ maxHeight }}>
        <table className={styles.table}>
          <thead
            className={`${styles.header} ${headerClassName} ${stickyHeader ? styles.sticky : ''}`}
          >
            <tr>
              {selectable && (
                <th className={styles.selectHeader}>
                  {selection.selectionType === 'multiple' && (
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = someSelected && !allSelected
                        }
                      }}
                      onChange={(e) => {
                        handleSelectAll(e.target.checked)
                      }}
                      className={styles.selectAllInput}
                    />
                  )}
                </th>
              )}

              {expandable && <th className={styles.expandHeader}></th>}

              {columns.map(renderHeader)}
            </tr>
          </thead>

          <tbody className={styles.body}>
            {paginatedData.length > 0
              ? paginatedData.map(renderRow)
              : renderEmptyState()}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  )
}

export default GenericTable
