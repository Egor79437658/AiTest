import React from "react";

import styles from "./textArea.module.scss";

type TextAreaProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e?: Event) => void;
  onFocus?: (e?: Event) => void;
  className?: string;
  disable?: boolean;
  placeholder?: string;
  maxLen?: number;
  minLen?: number;
};

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  onBlur,
  onFocus,
  className = "",
  disable = false,
  placeholder = "",
  maxLen,
  minLen,
}) => {
  function handleOnChange(newVal: string) {
    onChange(newVal);
  }

  return (
    <div
      className={`${styles.textAreaDiv} ${disable ? styles.disabled : ""} ${className}`}
    >
      <textarea
        value={value}
        onChange={(e) => handleOnChange(e.target.value)}
        className={styles.textareaInput}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disable}
        placeholder={placeholder}
        maxLength={maxLen}
        minLength={minLen}
      />
    </div>
  );
};
