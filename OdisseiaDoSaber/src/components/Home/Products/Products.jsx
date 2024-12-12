import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import Skeleton from "react-loading-skeleton";
import "./Products.css";

const Products = () => {
  const { store } = useGlobalContext();
  const { addToCart } = store;

  const [produtos, setProdutos] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false); 
  const [isPopupCartVisible, setIsPopupCartVisible] = useState(false); 
  const [selectedProduto, setSelectedProduto] = useState(null); 
  const [quantidade, setQuantidade] = useState(1);
  const [frete, setFrete] = useState("normal");

  useEffect(() => {
    fetch("http://localhost:8080/api")
      .then((response) => response.json())
      .then((data) => setProdutos(data))
      .catch((error) => console.error("Erro ao carregar produtos:", error));
  }, []);

  const openPopup = (produtoId) => {
    const produto = produtos.find(p => p.IdLivro === produtoId);
    setSelectedProduto(produto); 
    setIsPopupVisible(true); 
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedProduto(null);
  };

  const calcularPrecoTotal = () => {
    const preco = parseFloat(selectedProduto?.Preco || 0);
    const taxaFrete = frete === "normal" ? 5 : 10;
    return preco * quantidade + taxaFrete;
  };

  const simularCompra = () => {
    alert(`Compra realizada com sucesso! Produto: ${selectedProduto.Titulo}, Quantidade: ${quantidade}, Preço Total: R$${calcularPrecoTotal()}`);
    setIsPopupCartVisible(false); 
  };

  const handleAddToCart = (produto) => {
    addToCart(produto);
    setSelectedProduto(produto);
    setIsPopupCartVisible(true); 
  };

  return (
    <div className="deals-container">
      <h1 className="deals-title black-text">Promoções para Você!</h1>

      <div className="deals-card-container">
        {produtos.length > 0 ? (
          produtos.slice(-3).map((produto) => (
            <div className="deals-card" key={produto.IdLivro}>
              <div className="deals-imgBox">
                <img
                  src={produto.Imagem}
                  alt={produto.Titulo}
                  className="deals-product-image"
                />
              </div>
              <div className="deals-contentBox">
                <h3 className="black-text">{produto.Titulo}</h3>
                <h2 className="deals-price black-text">R${produto.Preco}</h2>
                <button
                  className="deals-buy"
                  onClick={() => handleAddToCart(produto)}
                >
                  Adicionar ao Carrinho
                </button>
                <p
                  className="more-info black-text"
                  onClick={() => openPopup(produto.IdLivro)}
                >
                  Mais Informações
                </p>
              </div>
            </div>
          ))
        ) : (
          <Skeleton count={3} height={250} />
        )}
      </div>

      {}
      {isPopupVisible && selectedProduto && (
        <div className="popup-overlay">
          <div className="popup-content-info">
            <img
              src={selectedProduto.Imagem}
              alt={selectedProduto.Titulo}
              className="popup-product-image"
            />
            <h2 className="popup-title">{selectedProduto.Titulo}</h2>
            <p><strong>Autor:</strong> {selectedProduto.Autor}</p>
            <p><strong>Status do Livro:</strong> {selectedProduto.StatusLivro}</p>
            <p><strong>Preço:</strong> R${selectedProduto.Preco}</p>
            <p><strong>Descrição:</strong> {selectedProduto.Descricao}</p>
            <button className="close-popup" onClick={closePopup}>Fechar</button>
          </div>
        </div>
      )}

      {}
      {isPopupCartVisible && selectedProduto && (
        <div className="popup-overlay">
          <div className="popup-content-cart">
            <img
              src={selectedProduto.Imagem}
              alt={selectedProduto.Titulo}
              className="popup-product-image-cart"
            />
            <h2 className="popup-title-cart">{selectedProduto.Titulo}</h2>
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

export default Products;
