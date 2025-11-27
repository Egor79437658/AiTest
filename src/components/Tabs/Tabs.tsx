import React, { useState } from "react";

import styles from "./tabs.module.scss";

interface TabsProps {
  tabs: { id: string; label: string }[];
  currentTab?: string;
  onChange?: (tabId: string) => void;
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ tabs, currentTab, onChange, className="" }) => {
  const [activeTab, setActiveTab] = useState(currentTab || tabs[0]?.id);

  const handleTabClick = (event: React.MouseEvent, tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
    event.currentTarget.blur();
  };

  return (
    <div className={`${styles.tabsContainer} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
          onClick={(e) => handleTabClick(e, tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
