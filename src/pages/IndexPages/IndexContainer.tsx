import type React from "react";

import "./styles/IndexContainer.scss";

export const IndexContainer: React.FC = () => {
  return (
    <div className="indexContainer">
      <div className="indexUp">
        <p>Регистрация</p>
      </div>
      <div className="indexDown">
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
