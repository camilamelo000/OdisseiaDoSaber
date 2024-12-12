import React, { useState, useEffect } from 'react';
import './LivrosPage.css';
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";  

const LivrosPage = () => {
  const { store } = useGlobalContext();  
  const [livros, setLivros] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupCartVisible, setIsPopupCartVisible] = useState(false); 
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [frete, setFrete] = useState("normal");

  useEffect(() => {
    fetch("http://localhost:8080/api")
      .then((response) => response.json())
      .then((data) => setLivros(data))
      .catch((error) => console.error('Erro ao carregar os livros:', error));
  }, []);

  const livrosFiltrados = categoriaSelecionada
    ? livros.filter(livro => livro.Categoria === categoriaSelecionada)
    : livros;

  const categoriaTitulo = categoriaSelecionada
    ? `Livros de ${categoriaSelecionada} encontrados:`
    : "Todos os livros encontrados";

  const adicionarAoCarrinho = (livro) => {
    const produto = {
      _id: livro.IdLivro,
      nome: livro.Titulo,
      preco: livro.Preco,
      imagem: livro.Imagem,  
    };
    store.addToCart(produto);
    setLivroSelecionado(livro); 
    setIsPopupCartVisible(true); 
  };

  const openPopup = (livro) => {
    setLivroSelecionado(livro); 
    setIsPopupVisible(true); 
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setLivroSelecionado(null);  
  };

  const calcularPrecoTotal = () => {
    const preco = parseFloat(livroSelecionado?.Preco || 0);
    const taxaFrete = frete === "normal" ? 5 : 10;
    return preco * quantidade + taxaFrete;
  };

  const simularCompra = () => {
    alert(`Compra realizada com sucesso! Produto: ${livroSelecionado.Titulo}, Quantidade: ${quantidade}, Preço Total: R$${calcularPrecoTotal()}`);
    setIsPopupCartVisible(false); 
  };

  return (
    <div className="livros-page">
      <h1>Livros</h1>
      <p className="subtitle">Aqui estão alguns livros em destaque:</p>

      {}
      <div className="mini-navbar">
        <button onClick={() => setCategoriaSelecionada("Direito")}>Direito</button>
        <button onClick={() => setCategoriaSelecionada("Medicina")}>Medicina</button>
        <button onClick={() => setCategoriaSelecionada("Economia")}>Economia</button>
        <button onClick={() => setCategoriaSelecionada("Tecnologia")}>Tecnologia</button>
        <button onClick={() => setCategoriaSelecionada("Exatas")}>Exatas</button>
        <button onClick={() => setCategoriaSelecionada(null)}>Todos</button>
      </div>

      <h2 className="category-title">{categoriaTitulo}</h2>

      {}
      <div className="card-container">
        {livrosFiltrados.map((livro) => (
          <div className="card" key={livro.IdLivro}>
            <div className="imgBox">
              <img
                src={livro.Imagem}  
                alt={livro.Titulo}
                className="product-image"
                id={`image-${livro.IdLivro}`}
              />
            </div>
            <div className="contentBox">
              <h3>{livro.Titulo}</h3>
              <h2 className="price">R${livro.Preco}</h2>
              <button
                className="buy"
                onClick={() => adicionarAoCarrinho(livro)}  
                id={`buy-${livro.IdLivro}`}
              >
                Adicionar ao Carrinho
              </button>
              <span
                className="more-info"
                onClick={() => openPopup(livro)} 
              >
                Mais Informações
              </span>
            </div>
          </div>
        ))}
      </div>

      {isPopupVisible && livroSelecionado && (
        <div className="popup-overlay">
          <div className="popup-content">
            <img
              src={livroSelecionado.Imagem}
              alt={livroSelecionado.Titulo}
              className="popup-product-image"
            />
            <h2 className="popup-title">{livroSelecionado.Titulo}</h2>
            <p><strong>Autor:</strong> {livroSelecionado.Autor}</p>
            <p><strong>Status do Livro:</strong> {livroSelecionado.StatusLivro}</p>
            <p><strong>Preço:</strong> R${livroSelecionado.Preco}</p>
            <p><strong>Descrição:</strong> {livroSelecionado.Descricao}</p>
            <button className="close-popup" onClick={closePopup}>Fechar</button>
          </div>
        </div>
      )}

      {isPopupCartVisible && livroSelecionado && (
        <div className="popup-overlay-cart">
          <div className="popup-content-cart">
            <img
              src={livroSelecionado.Imagem}
              alt={livroSelecionado.Titulo}
              className="popup-product-image-cart"
            />
            <h2 className="popup-title-cart">{livroSelecionado.Titulo}</h2>
            <div className="popup-frete">
              <label>Selecione o Frete:</label>
              <select value={frete} onChange={(e) => setFrete(e.target.value)}>
                <option value="normal">Normal (R$ 5)</option>
                <option value="expresso">Expresso (R$ 10)</option>
              </select>
            </div>
            <div className="popup-quantidade">
              <label>Quantidade:</label>
              <input
                type="number"
                value={quantidade}
                min="1"
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </div>
            <p><strong>Preço Total:</strong> R${calcularPrecoTotal()}</p>
            <button className="popup-buy" onClick={simularCompra}>
              Comprar
            </button>
            <button className="close-popup-cart" onClick={() => setIsPopupCartVisible(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivrosPage;
