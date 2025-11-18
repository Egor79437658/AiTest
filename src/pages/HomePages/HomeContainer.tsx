import type React from "react";
import cn from "classnames";
import styles from "./styles/ContainerHome.module.scss";

export const HomeContainer: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageUp}>
        <a href="/project" className={cn(styles.block, styles.first)}>
          <p>Проект 1</p>
          <p>перейти {">>"}</p>
        </a>
        <a href="#" className={cn(styles.block, styles.second)}>
          <p>Проект 2</p>
          <p>перейти {">>"}</p>
        </a>
        <a href="#" className={cn(styles.block, styles.third)}>
          <p>Новый проект</p>
          <p>+</p>
        </a>
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
