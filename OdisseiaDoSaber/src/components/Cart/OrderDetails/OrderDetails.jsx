import "./OrderDetails.css";
import { useState } from "react";

const OrderDetails = ({ product, onRemove, onUpdateQuantity }) => {
  const [quantity, setQuantity] = useState(product.quantity);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
    onUpdateQuantity(product.IdLivro, quantity + 1);  
  };

  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onUpdateQuantity(product.IdLivro, quantity - 1);  
    }
  };

  const removeFromCart = () => {
    onRemove(product.IdLivro);  
  };

  return (
    <div className="order-details">
      <div className="order-detail">
        <div className="right-side">
          <h3>{product.Titulo}</h3>
          <p>{product.Description}</p>
        </div>
      </div>
      <div className="order-price">
        <h3>R${product.Preco}</h3>
        <p>Total: R${(product.Preco * quantity).toFixed(2)}</p>
      </div>
      <div className="quantity">
        <p>Quantidade</p>
        <div className="increase-quantity">
          <button onClick={decreaseQuantity}>-</button>
          <p>{quantity}</p>
          <button onClick={increaseQuantity}>+</button>
        </div>
      </div>
      <div className="remove">
        <button onClick={removeFromCart}>Remover</button>
      </div>
    </div>
  );
};

export default OrderDetails;
