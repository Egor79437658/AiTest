import type React from "react";
import { Sidebar } from "../components/SideBar/Sidebar";
import { useSidebar } from "../contexts/useSidebarT";
import { Header } from "../components/Header/Header";
import { Pipeline } from "../components/Pipeline/Pipeline";

import "./IndexPages/styles/Index.scss";
import { IndexContainer } from "./IndexPages/IndexContainer";

export const Index: React.FC = () => {
  const { isOpen } = useSidebar();
  const headerText = "Войти";
  const actionLink = "/home";

  return (
    <div className="bodyIndex">
      <Sidebar />
      <div className={`contentIndex ${isOpen ? "shifted" : ""}`}>
        <Header actionText={headerText} actionLink={actionLink} />
        <Pipeline />
        <IndexContainer />
      </div>
    </div>
  );
};
