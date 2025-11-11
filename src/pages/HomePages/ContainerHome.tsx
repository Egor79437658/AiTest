import type React from "react";

import "./styles/ContainerHome.scss";

export const ContainerHome: React.FC = () => {
  return (
    <div className="containerHome">
      <div className="homeUp">
        <a href="/project" className="block first">
          <p>Проект 1</p>
          <p>перейти {">>"}</p>
        </a>
        <a href="#" className="block second">
          <p>Проект 2</p>
          <p>перейти {">>"}</p>
        </a>
        <a href="#" className="block third">
          <p>Новый проект</p>
          <p>+</p>
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
