import type React from "react";
import { useSidebar } from "../../contexts/";
import { MenuButton } from "../";

import "./Header.scss";

interface HeaderProps {
  actionText?: string;
  actionLink?: string;
}

export const Header: React.FC<HeaderProps> = ({ actionText, actionLink }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="header">
      <div className="headerLeft">
        <MenuButton onClick={toggleSidebar} />
      </div>
      <div className="headerMid">
        <div className="inputUrl">
          <label htmlFor="url">URL:</label>
          <input id="url" type="text" className="url" />
        </div>
        <div className="inputsLow">
          <div className="inputLow">
            <label htmlFor="login">Login:</label>
            <input id="login" type="text" className="login" />
          </div>
          <div className="inputLow">
            <label htmlFor="password">Password: </label>
            <input id="password" type="text" className="password" />
          </div>
        </div>
      </div>
      <div className="headerRight">
        <a href="/" className="headerAction">
          Выйти
        </a>
        {actionLink && actionText ? (
          <a href={actionLink} className="headerAction">
            {actionText}
          </a>
        ) : (
          <a href={"/home"} className="headerAction">
            {window.location.pathname == "/" ? "Войти" : "личный кабинет"}
          </a>
        )}
      </div>
    </div>
  );
};
