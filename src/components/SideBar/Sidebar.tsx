import React from "react";
import { SidebarClosed } from "./SidebarClosed";
import { SidebarOpen } from "./SidebarOpen";
import { useSidebar } from "../../contexts/useSidebarT";

import "./SidebarStyle.scss";

export const Sidebar: React.FC = () => {
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <>
      {isOpen && (
        <div
          className={`sidebarOverlay ${isOpen ? "active" : ""}`}
          onClick={closeSidebar}
        />
      )}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {isOpen ? <SidebarOpen /> : <SidebarClosed />}
      </div>
    </>
  );
};
