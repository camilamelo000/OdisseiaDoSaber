import React from "react";
import "./ShopFooter.css";

const ShopFooter = () => {
  return (
    <div className="main">
      <div className="footer">
        <div className="bubbles">
          {Array.from({ length: 128 }).map((_, i) => (
            <div
              key={i}
              className="bubble"
              style={{
                "--size": `${2 + Math.random() * 4}rem`,
                "--distance": `${6 + Math.random() * 4}rem`,
                "--position": `${-5 + Math.random() * 110}%`,
                "--time": `${2 + Math.random() * 2}s`,
                "--delay": `${-(2 + Math.random() * 2)}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="content">
          <div className="column">
            <div>
              <a href="/">Home</a>
              {}
              <a href="mailto:contato@exemplo.com">Contato</a>
              {}
              <a href="https://www.google.com/maps?q=Sua+Localizacao+Aqui" target="_blank" rel="noopener noreferrer">
                Como Chegar
              </a>
            </div>
          </div>
          <div className="column">
          </div>
          <div className="column">
          </div>
        </div>
      </div>

      <svg style={{ position: "fixed", top: "100vh" }}>
        <defs>
          <filter id="blob">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="blob"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default ShopFooter;
