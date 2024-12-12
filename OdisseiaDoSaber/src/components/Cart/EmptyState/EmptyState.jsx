import "./EmptyState.css";
const EmptyCart = "/images/empty-cart.png";  
import { Link } from "react-router-dom";
const EmptyState = () => {
  return (
    <div className="empty-cart-state">
      <div className="empty-cart-image">
        <img src={EmptyCart} alt="Empty cart" width={100} />
      </div>
      <div className="empty-cart-text">
        <h2>Carrinho Vazio</h2>
        <p>Parece que você ainda não tem nenhum item no seu carrinho.</p>
        <Link to={"/"} className="add-item">
         Adicionar ao carrinho
        </Link>
      </div>
    </div>
  );
};
export default EmptyState;
