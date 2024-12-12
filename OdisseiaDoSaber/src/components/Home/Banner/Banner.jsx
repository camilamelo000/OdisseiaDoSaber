import React, { useState, useEffect } from "react";
import girlHeadphones from "/images/apostila_matematica.png"; 
import "./Banner.css";


const fetchLivro = async () => {
  const response = await fetch("http://localhost:8080/api/12");  
  const data = await response.json();
  return data;  
};

const Banner = () => {
  const [showPopup, setShowPopup] = useState(false); 
  const [livro, setLivro] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    rendaPerCapta: "",
    nome: "",
    endereco: "",
    telefone: "",
  });

  useEffect(() => {
    fetchLivro().then((livro) => setLivro(livro));
  }, []);

  const togglePopup = () => {
    setShowPopup(!showPopup); 
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const renda = parseFloat(formData.rendaPerCapta);
    const apto = renda <= 1000; 

    if (apto) {
      alert("Formulário enviado com sucesso. Você está apto para receber o livro!");
    } else {
      alert("Formulário enviado com sucesso. Você não está apto para receber o livro.");
    }

    setShowPopup(false);
  };

  return (
    <div className="sub-container">
      <div className="banner">
        <div className="banner-text">
          <h1>
            Garanta 50% de desconto <br></br>em Apostilas Vestibulares!
          </h1>
          <span className="is-buy-now">
            {}
            <button className="btn-rounded buy-now" onClick={togglePopup}>
              Ganhe Já
            </button>
          </span>
        </div>
        <div className="subject">
          {}
          <img src={girlHeadphones} alt="Apostila" width={"100%"} />
        </div>
      </div>

      {}
      {showPopup && livro && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Formulário Socioeconômico</h2>
            <p>Informe seus dados para saber se você está apto a receber o livro!</p>

            {}
            <div className="livro-form-container">
              <div className="livro-info">
                <h3>{livro.Titulo}</h3>
                <img src={livro.Imagem} alt={livro.Titulo} className="livro-imagem" />
              </div>

              {}
              <form onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome Completo:</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="email">Seu E-mail:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="rendaPerCapta">Renda Per Capta (R$):</label>
                <input
                  type="number"
                  id="rendaPerCapta"
                  name="rendaPerCapta"
                  value={formData.rendaPerCapta}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="endereco">Endereço Completo:</label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="telefone">Telefone para Contato:</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                />

                <button type="submit">Enviar</button>
              </form>
            </div>

            {}
            <button className="close-btn" onClick={togglePopup}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
