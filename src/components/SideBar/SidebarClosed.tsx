import React from "react";
import { useMenuItems } from "./menuItems";
import styles from "./Sidebar.module.scss";

export const SidebarClosed: React.FC = () => {
  const menuItems = useMenuItems();

  return (
    <div className={styles.closedBar}>
      <a href="/" className={styles.miniLogo}>
        <img src="#" className="" alt="Мини логотип" />
      </a>
      <div className={styles.sidebarIcons}>
        {menuItems.map((item) => (
          <a
            key={item.link}
            href={item.link}
            className={styles.iconLink}
            title={item.title}
          >
            <img src={item.icon} alt={item.title} className={styles.iconImg} />
          </a>
        ))}
      </div>
    </div>
  );
};
