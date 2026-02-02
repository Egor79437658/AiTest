import React, { useEffect, useRef, useState } from "react";

import { Filter, FilterOperator, FilterRule } from "../Filter";
import styles from "./table.module.scss";

export interface TableColumn {
  key: string;
  header: string;
  nameInFilter?: string;
  cellClassName?: string;
  headerClassName?: string;
  style?: React.CSSProperties;
  includeInFilter?: boolean,
  render?: (
    value: any,
    row: any,
    rowIndex: number,
    onUpdate: (newValue: any) => void
  ) => React.ReactNode;
  operators?:  Set<FilterOperator>
  equalFunc?: (val1: any, val2: any) => boolean
  greaterFunc?: (val1: any, val2: any) => boolean
  includesFunc?: (val1: any, val2: any) => boolean
  selectFrom?: { value: any, label: string }[]
}

interface TableProps<T extends Record<string, any> > {
  id?: string;
  columns: TableColumn[];
  data: T[];
  onDataChange?: (updatedData: any[]) => void;
  className?: string;
  showFilters?: boolean;
  noHeader?: boolean;
  rowStyleFunc?: (tableData: T) => string
}

export const Table = <T extends Record<string, any>, >({
  id,
  columns,
  data,
  onDataChange,
  className = "",
  showFilters = true,
  noHeader = false,
  rowStyleFunc
}: TableProps<T>) => {
  const [filteredData, setFilteredData] = useState(data);
  const [filters, setFilters] = useState<{
    rules: FilterRule[];
    logic: "AND" | "OR";
  }>({
    rules: [],
    logic: "AND",
  });
  const [isError, setIsError] = useState(false);
  const errorDiv = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (id) {
      const savedFilters = localStorage.getItem(`tableFilters-${id}`);
      if (savedFilters) {
        const { rules, logic } = JSON.parse(savedFilters);
        setFilters({ rules, logic });
        handleFilterChange(rules, logic);
      }
    }
  }, [id]);

  useEffect(() => {
      // console.log(data)
      setIsError(false);
      const filtered = data.filter((row) => {
      return filters.rules[filters.logic === "AND" ? "every" : "some"]((rule) => {
        const value = row[rule.field];
        const ruleValue = rule.value;
        const column = columns.find(col => col.key === rule.field);

        const equal = () => column?.equalFunc ? column.equalFunc(value, ruleValue) : `${value}` == `${ruleValue}`;
        const greater =  () =>  column?.greaterFunc ? column.greaterFunc(value, ruleValue) : value > ruleValue;
        const includes =  () =>  column?.includesFunc ? column.includesFunc(value, ruleValue) : String(value).includes(ruleValue);
        console.log(ruleValue)
        console.log(value, ruleValue)
        console.log(typeof(value), typeof(ruleValue))
        // console.log(())

        try {
          switch (rule.operator) {
            case FilterOperator.EQ:
              return equal();
            case FilterOperator.NEQ:
              return !equal();
            case FilterOperator.CONTAINS:
              return includes();
            case FilterOperator.NOT_CONTAINS:
              return !includes();
            case FilterOperator.GT:
              return greater();
            case FilterOperator.LT:
              return !greater() && !equal();
            case FilterOperator.GTE:
              return greater() || equal();
            case FilterOperator.LTE:
              return !greater();
            default:
              return true;
            }
        }
        catch (e: any){
          setIsError(true);
          if (errorDiv.current){
            errorDiv.current.textContent = `Ошибка при фильтрации по "${column?.header}":\n ${e.message}`;
          }
          return false;
        }
        // switch (rule.operator) {
        //   case FilterOperator.EQ:
        //     return `${value}` == ruleValue;
        //   case FilterOperator.NEQ:
        //     return `${value}` !== ruleValue;
        //   case FilterOperator.CONTAINS:
        //     return String(value).includes(ruleValue);
        //   case FilterOperator.NOT_CONTAINS:
        //     return !String(value).includes(ruleValue);
        //   case FilterOperator.GT:
        //     return Number(value) > Number(ruleValue);
        //   case FilterOperator.LT:
        //     return Number(value) < Number(ruleValue);
        //   case FilterOperator.GTE:
        //     return Number(value) >= Number(ruleValue);
        //   case FilterOperator.LTE:
        //     return Number(value) <= Number(ruleValue);
        //   default:
        //     return true;
        // }
      });
    });
    // console.log(filtered)
    setFilteredData(filtered);
}, [data, filters]);

  const handleFilterChange = (rules: FilterRule[], logic: "AND" | "OR") => {
    setFilters({ rules, logic });

    if (id) {
      localStorage.setItem(
        `tableFilters-${id}`,
        JSON.stringify({ rules, logic })
      );
    }
  };

  const handleUpdate = (rowIndex: number, key: string, newValue: any) => {
    const updatedData = [...data];
    updatedData[rowIndex][key] = newValue;
    onDataChange?.(updatedData);
  };

  return (
    <div>
      {showFilters && (
        <Filter
          columns={columns}
          onFilterChange={handleFilterChange}
          initialRules={filters.rules}
          initialLogic={filters.logic}
        />
      )}
      <table className={`${styles.table} ${className || ""}`} id={id}>
        {!noHeader && (
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`${styles.header} ${column.headerClassName}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex} className={`${styles.row} ${rowStyleFunc ? rowStyleFunc(row) : ""}`}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`${styles.cell} ${column.cellClassName ? column.cellClassName : ""}`}
                  style={column.style ? column.style : undefined}
                >
                  {column.render
                    ? column.render(
                        row[column.key],
                        row,
                        rowIndex,
                        (newValue) =>
                          handleUpdate(
                            data.findIndex((r) => r === row),
                            column.key,
                            newValue
                          )
                      )
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.tableErrorDiv} style={{opacity: isError ? 1 : 0, display: isError ? "block" : "none" }} ref={errorDiv}></div>
    </div>
  );
};
