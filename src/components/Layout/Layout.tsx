import type React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import { Pipeline } from "../Pipeline/Pipeline";
import { Sidebar } from "../SideBar/Sidebar";
import { Sidebar2 } from "../SideBar/Sidebar2";
import { useSidebar } from "../../contexts/useSidebarT";

import "./Layout.scss";


export const Layout: React.FC = () => {
  const { isOpen } = useSidebar();

  return (
    <div className="bodyLayout">
      <Sidebar2 />
      <div className={`contentLayout ${isOpen ? "shifted" : ""}`}>
        <Header />
        <Pipeline />
        <Outlet/>
      </div>
    </div>
  );
};
