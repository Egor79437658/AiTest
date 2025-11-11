import type React from "react";
import { Sidebar } from "../components/SideBar/Sidebar";
import { useSidebar } from "../contexts/useSidebarT";
import { Header } from "../components/Header/Header";
import { Pipeline } from "../components/Pipeline/Pipeline";
import { ProjectContainer } from "./ProjectPages/ProjectContainer";

import "./ProjectPages/styles/Project.scss";

export const Project: React.FC = () => {
  const { isOpen } = useSidebar();
  const headerText = "Личный кабинет";
  const actionLink = "/home";

  return (
    <div className="bodyProject">
      <Sidebar />
      <div className={`contentProject ${isOpen ? "shifted" : ""}`}>
        <Header actionText={headerText} actionLink={actionLink} />
        <Pipeline />
        <ProjectContainer />
      </div>
    </div>
  );
};
