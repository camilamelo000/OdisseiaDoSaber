import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import OrderDetails from "./OrderDetails";
import OrderSummary from "./OrderSummary";

const Cart = () => {
  const { store } = useGlobalContext();

  return (
    <div className="cart">
      <h2>Seu Carrinho</h2>
      {store.state.cart.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <div>
          {store.state.cart.map((product) => (
            <OrderDetails key={product._id} product={product} />
          ))}
        </div>
      )}
      <OrderSummary />
    </div>
  );
};

export default Cart;
