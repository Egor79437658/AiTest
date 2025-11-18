import React from "react";
import cn from "classnames";
import styles from "./MenuButton.module.scss";

export const MenuButton: React.FC<{
  onClick: () => void;
  isActive?: boolean;
}> = ({ onClick, isActive }) => {
  return (
    <div
      className={cn(styles.menuToggle, { [styles.open]: isActive })}
      onClick={onClick}
    >
      <div className={styles.bar} />
      <div className={styles.bar} />
      <div className={styles.bar} />
    </div>
  );
};
