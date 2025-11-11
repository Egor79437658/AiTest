import type React from "react";

import "./styles/ProjectContainer.scss";

export const ProjectContainer: React.FC = () => {
  return (
    <div className="projectContainer">
      <div className="projectUp">
        <a href="#" className="block">
          <p>Тест-кейсы</p>
        </a>
        <a href="#" className="block">
          <p>Тест-план</p>
        </a>
        <a href="#" className="block">
          <p>Скрипты</p>
        </a>
        <a href="#" className="block">
          <p>Автотестинг</p>
        </a>
        <a href="#" className="block">
          <p>Отчеты</p>
        </a>
      </div>
      <div className="homeDown">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quis vel
          facere sunt. Soluta libero quibusdam voluptatem veniam necessitatibus
          excepturi reprehenderit? Voluptatibus, tempora similique? Earum
          molestias debitis facilis nostrum quo.
        </p>
      </div>
    </div>
  );
};
