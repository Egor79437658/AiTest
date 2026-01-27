import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaFilter } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

import { TableColumn } from "../Table";
import styles from "./filter.module.scss";

export enum FilterOperator {
  EQ = "eq",
  NEQ = "neq",
  LT = "lt",
  GT = "gt",
  LTE = "lte",
  GTE = "gte",
  CONTAINS = "contains",
  NOT_CONTAINS = "notcontains",
}

const FilterOperatorDict = {
  eq: "равно",
  neq: "не равно",
  lt: "меньше",
  gt: "больше",
  lte: "меньше или равно",
  gte: "больше или равно",
  contains: "содержит",
  notcontains: "не содержит",
};

export interface FilterRule {
  field: string;
  operator: FilterOperator;
  value: string;
}

interface FilterProps {
  columns: TableColumn[];
  onFilterChange: (rules: FilterRule[], logic: "AND" | "OR") => void;
  initialRules?: FilterRule[];
  initialLogic?: "AND" | "OR";
}

export const Filter: React.FC<FilterProps> = ({
  columns,
  onFilterChange,
  initialRules = [],
  initialLogic = "AND",
}) => {
  const [rules, setRules] = useState<FilterRule[]>(initialRules);
  const [logic, setLogic] = useState<"AND" | "OR">(initialLogic);

  useEffect(() => {
    setRules(initialRules);
  }, [initialRules]);

  useEffect(() => {
    setLogic(initialLogic);
  }, [initialLogic]);

  const addRule = () => {
    setRules([
      ...rules,
      {
        field: (
          columns.find((el) => el.includeInFilter !== false) || columns[0]
        ).key,
        operator: FilterOperator.EQ,
        value: "",
      },
    ]);
  };

  const updateRule = (
    index: number,
    field: string,
    operator: FilterOperator,
    value: string
  ) => {
    const newRules = [...rules];
    newRules[index] = { field, operator, value };
    setRules(newRules);
  };

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  const applyFilter = () => {
    onFilterChange(rules, logic);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.actionsContainer}>
        <div className={styles.conditionsContainer}>
          <button onClick={addRule} className={styles.addButton}>
            <FaFilter />
            <span>Добавить условие</span>
          </button>
          <div style={{ width: "10px" }}></div>
          <button
            onClick={() => setLogic("AND")}
            className={`${styles.conditionButton} ${logic === "AND" && styles.conditionButtonSelected}`}
          >
            <span>И</span>
          </button>
          <button
            onClick={() => setLogic("OR")}
            className={`${styles.conditionButton} ${logic === "OR" && styles.conditionButtonSelected}`}
          >
            <span>ИЛИ</span>
          </button>
        </div>
        <button
          onClick={applyFilter}
          className={`${styles.addButton} ${styles.aplyFilterButton}`}
        >
          <FaCheckCircle />
          <span>Применить фильтры</span>
        </button>
      </div>
      {rules.map((rule, index) => (
        <div key={index} className={styles.rule}>
          <select
            value={rule.field}
            onChange={(e) => {
              const column = columns.find((col) => col.key === e.target.value);
              const possibleSelectVal = column?.selectFrom?.[0]?.value;
              updateRule(
                index,
                e.target.value,
                column?.operators && (column.operators.has(rule.operator) ? rule.operator : Array.from(column.operators)[0]) || rule.operator,
                possibleSelectVal || rule.value
              );
            }}
            className={styles.select}
          >
            {columns.map((column) => {
              if (
                column.includeInFilter === undefined ||
                column.includeInFilter === true
              ) {
                return (
                  <option key={column.key} value={column.key}>
                    {column.nameInFilter || column.header}
                  </option>
                );
              }
            })}
          </select>
          <select
            value={rule.operator}
            onChange={(e) =>
              updateRule(
                index,
                rule.field,
                e.target.value as any as FilterOperator,
                rule.value
              )
            }
            className={styles.select}
          >
            {columns.find((col) => col.key === rule.field)?.operators ? (
              Array.from(
                columns.find((col) => col.key === rule.field)!.operators!
              ).map((el) => (
                <option value={el} key={el}>
                  {FilterOperatorDict[el]}
                </option>
              ))
            ) : (
              <>
                <option value={FilterOperator.EQ}>
                  {FilterOperatorDict[FilterOperator.EQ]}
                </option>
                <option value={FilterOperator.NEQ}>
                  {FilterOperatorDict[FilterOperator.NEQ]}
                </option>
                <option value={FilterOperator.CONTAINS}>
                  {FilterOperatorDict[FilterOperator.CONTAINS]}
                </option>
                <option value={FilterOperator.NOT_CONTAINS}>
                  {FilterOperatorDict[FilterOperator.NOT_CONTAINS]}
                </option>
                <option value={FilterOperator.GT}>
                  {FilterOperatorDict[FilterOperator.GT]}
                </option>
                <option value={FilterOperator.LT}>
                  {FilterOperatorDict[FilterOperator.LT]}
                </option>
                <option value={FilterOperator.GTE}>
                  {FilterOperatorDict[FilterOperator.GTE]}
                </option>
                <option value={FilterOperator.LTE}>
                  {FilterOperatorDict[FilterOperator.LTE]}
                </option>
              </>
            )}
          </select>
          {columns.find((col) => col.key === rule.field)?.selectFrom ? (
            <>
              <select
                value={rule.value}
                onChange={(e) =>
                  updateRule(index, rule.field, rule.operator, e.target.value)
                }
                className={styles.input}
              >
                {columns
                  .find((col) => col.key === rule.field)
                  ?.selectFrom!.map((option) => (
                    <option value={option.value} key={option.label}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </>
          ) : (
            <>
              <input
                type="text"
                value={rule.value}
                onChange={(e) =>
                  updateRule(index, rule.field, rule.operator, e.target.value)
                }
                className={styles.input}
                placeholder="Значение"
              />
            </>
          )}
          <button
            onClick={() => removeRule(index)}
            className={styles.removeButton}
          >
            <FaXmark className={styles.removeButtonIcon} />
          </button>
        </div>
      ))}
    </div>
  );
};
