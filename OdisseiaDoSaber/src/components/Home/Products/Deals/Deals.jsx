import { useState, useEffect } from "react";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import Skeleton from "react-loading-skeleton";
import "./Deals.css";

const Deals = () => {
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
      .then((data) => {
        setProdutos(data);
      })
      .catch((error) => console.error("Erro ao carregar produtos:", error));
  }, []);

  const handleAddToCart = (produto) => {
    addToCart(produto);
    setSelectedProduto(produto);
    setIsPopupCartVisible(true); 
  };

  const openPopup = (produtoId) => {
    fetch(`http://localhost:8080/api/${produtoId}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedProduto(data);
        setIsPopupVisible(true);
      })
      .catch((error) => console.error("Erro ao carregar os detalhes do produto:", error));
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedProduto(null);
  };

  const closePopupCart = () => {
    setIsPopupCartVisible(false);
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

  return (
    <div className="deals-container">
      <h1 className="deals-title">Novidades para Você!</h1>

      <div className="deals-card-container">
        {produtos.length > 0 ? (
          produtos.slice(0, 3).map((produto) => (
            <div className="deals-card" key={produto.IdLivro}>
              <div className="deals-imgBox">
                <img src={produto.Imagem} alt={produto.Titulo} className="deals-product-image" />
              </div>
              <div className="deals-contentBox">
                <h3>{produto.Titulo}</h3>
                <h2 className="deals-price">R${produto.Preco}</h2>
                <button className="deals-buy" onClick={() => handleAddToCart(produto)}>
                  Adicionar ao Carrinho
                </button>
                <button className="more-info" onClick={() => openPopup(produto.IdLivro)}>
                  Mais Informações
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="deals-skeleton">
            <Skeleton count={3} height={250} />
          </div>
        )}
      </div>

      {}
      {isPopupVisible && selectedProduto && (
        <div className="popup-overlay">
          <div className="popup-content-info">
            <img src={selectedProduto.Imagem} alt={selectedProduto.Titulo} className="popup-product-image" />
            <h2 className="popup-title">{selectedProduto.Titulo}</h2>
            <p><strong>Autor:</strong> {selectedProduto.Autor}</p>
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
            <img src={selectedProduto.Imagem} alt={selectedProduto.Titulo} className="popup-product-image-cart" />
            <h2 className="popup-title-cart">{selectedProduto.Titulo}</h2>
            <p><strong>Autor:</strong> {selectedProduto.Autor}</p>
            <p><strong>Preço:</strong> R${selectedProduto.Preco}</p>

            <div className="popup-frete">
              <label>Escolha o frete:</label>
              <select value={frete} onChange={(e) => setFrete(e.target.value)}>
                <option value="normal">Frete Normal - R$5</option>
                <option value="expresso">Frete Expresso - R$10</option>
              </select>
            </div>

            <div className="popup-quantidade">
              <label>Quantidade:</label>
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </div>

            <p><strong>Total:</strong> R${calcularPrecoTotal()}</p>

            <div className="popup-actions">
              <button className="popup-buy" onClick={simularCompra}>Comprar</button>
              <button className="close-popup-cart" onClick={closePopupCart}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
