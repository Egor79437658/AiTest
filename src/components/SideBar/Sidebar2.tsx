import React, { useEffect, useRef, useState } from "react";
import { useSidebar } from "../../contexts";
import { useMenuItems } from "./menuItems";

import "./SidebarStyle2.scss";

export const Sidebar2: React.FC = () => {
  const { isOpen, closeSidebar } = useSidebar();
  // const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLUListElement>(null);
  const menuItems = useMenuItems();

  useEffect(() => {
    // if(loading) {
    //   return;
    // }
    const className = isOpen ? "animateOpen" : "animateClose"
    if (listRef.current) {
      listRef.current.classList.add(className);
    }
    const timer = setTimeout(() => {
      if (listRef.current) {
        listRef.current.classList.remove(className);
      }
      return () => clearTimeout(timer);
    }, 510+100*menuItems.length);
  }, [isOpen]);

  // useEffect(() => {
  //   setLoading(false)
  // }, [])

  return (
    <>
      {isOpen && (
        <div
          className={`sidebarOverlay ${isOpen ? "active" : ""}`}
          onClick={closeSidebar}
        />
      )}
      <div className={`sidebar ${isOpen ? "open" : "closedBar"}`}>
        <nav className={isOpen ? "sidebarMenu open" : ""}>
          {isOpen && (
            <button className="closeSidebarMobile" onClick={closeSidebar}>
              &times;
            </button>
          )}
          <div className="logoCont">
            <a href="/" className={`${isOpen ? "" : "miniLogo"}`}>
              <img src="#" alt="логотип" />
            </a>
          </div>
          <ul ref={listRef} className={isOpen ? "menuList" : "sidebarIcons"}>
            {menuItems.map((item) => (
              <li
                key={item.link}
                className={`menuItem`}
              >
                <a
                  href={item.link}
                  className={isOpen ? "menuLink" : "iconLink"}
                  title={!isOpen ? item.title : undefined}
                >
                  <img
                    src={item.icon}
                    alt={item.title}
                    className={isOpen ? "menuIcon" : "iconImg"}
                  />
                  {isOpen && <span className="menuText">{item.title}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
