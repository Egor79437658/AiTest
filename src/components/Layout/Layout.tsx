import type React from "react";
import { Outlet } from "react-router-dom";
import { Header, Pipeline, Sidebar2 } from "../";
import { useSidebar } from "../../contexts";

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
