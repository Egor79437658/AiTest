import React from "react";
import { useMenuItems } from "./menuItems";

export const SidebarClosed: React.FC = () => {
  const menuItems = useMenuItems();

  return (
    <div className="closedBar">
      <a href="/" className="miniLogo">
        <img src="#" className="" alt="Мини логотип" />
      </a>
      <div className="sidebarIcons">
        {menuItems.map((item) => (
          <a
            key={item.link}
            href={item.link}
            className="iconLink"
            title={item.title}
          >
            <img src={item.icon} alt={item.title} className="iconImg" />
          </a>
        ))}
      </div>
    </div>
  );
};
