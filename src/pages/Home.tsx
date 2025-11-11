import type React from "react";
import { useSidebar } from "../contexts/useSidebarT";
import { Sidebar } from "../components/SideBar/Sidebar";

import "./HomePages/styles/Home.scss";
import { Header } from "../components/Header/Header";
import { Pipeline } from "../components/Pipeline/Pipeline";
import { ContainerHome } from "./HomePages/ContainerHome";

export const Home: React.FC = () => {
  const { isOpen } = useSidebar();
  const headerText = "Личный кабинет";
  const actionLink = "/home";

  return (
    <div className="bodyHome">
      <Sidebar />
      <div className={`contentHome ${isOpen ? "shifted" : ""}`}>
        <Header actionText={headerText} actionLink={actionLink} />
        <Pipeline />
        <ContainerHome />
      </div>
    </div>
  );
};
