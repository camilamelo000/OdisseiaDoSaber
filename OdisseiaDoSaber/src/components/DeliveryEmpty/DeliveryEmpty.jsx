const EmptyCart = "/images/empty-cart.png"; 
import { Link } from "react-router-dom";
import "./DeliveryEmpty.css";
import { useGlobalContext } from "../../GlobalContext/GlobalContext";
const DeliveryEmpty = () => {
  const { modal } = useGlobalContext();
  const handleLogin = () => {
    modal.openModal(false);
  };
  return (
    <div className="empty-cart-state">
      <div className="empty-cart-image">
        <img src={EmptyCart} alt="Empty cart" width={100} />
      </div>
      <div className="empty-cart-text">
        <h2>Oops!</h2>
        <p>
          Parece que você não tem nenhum item no seu carrinho, faça um pedido ou realize o login para ver seus pedidos
        </p>
        <div className="no-delivery-action-container">
          <Link to={"/"} className="add-item">
            Faça um Pedido
          </Link>
          <span>or</span>
          <button className="btn-rounded login-bg" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeliveryEmpty;
