import React, { useState, type ReactNode } from "react";
import { SidebarContext } from "./SidebarContextT";

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const openSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
