import React from "react";
import { useMenuItems } from "./menuItems";
import { useSidebar } from "../../contexts/useSidebarT";

export const SidebarOpen: React.FC = () => {
  const menuItems = useMenuItems();
  const { closeSidebar } = useSidebar();

  return (
    <nav className="sidebarMenu open">
      <button className="closeSidebarMobile" onClick={closeSidebar}>
        &times;
      </button>
      <div className="logoCont">
        <a href="#">
          <img src="#" alt="Полный логотип" />
        </a>
      </div>
      <ul className="menuList">
        {menuItems.map((item) => (
          <li key={item.link} className="menuItem">
            <a href={item.link} className="menuLink">
              <img src={item.icon} alt={item.title} className="menuIcon" />
              <span className="menuText">{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
