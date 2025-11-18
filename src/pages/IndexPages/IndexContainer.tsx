import type React from "react";
import styles from "./styles/IndexContainer.module.scss";

export const IndexContainer: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageUp}>
        <p>Регистрация</p>
      </div>
      <div className={styles.pageDown}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quis vel
          facere sunt. Soluta libero quibusdam voluptatem veniam necessitatibus
          excepturi reprehenderit? Voluptatibus, tempora similique? Earum
          molestias debitis facilis nostrum quo.
        </p>
      </div>
    </div>
  );
};
