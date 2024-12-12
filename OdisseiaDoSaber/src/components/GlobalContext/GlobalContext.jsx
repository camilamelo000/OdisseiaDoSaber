import { createContext, useContext } from "react";
import useStore from "../../store/useStore";  
import useAuth from "../../store/auth";
import useModal from "../../store/modal";
import useOrders from "../../store/orders";

const globalContext = createContext();

export const useGlobalContext = () => useContext(globalContext);

const GlobalContext = ({ children }) => {
  const store = useStore();  
  const auth = useAuth();
  const modal = useModal();
  const orders = useOrders();

  const addToCart = (product) => {
    const itemExistente = store.state.cart.find(item => item._id === product.IdLivro);
    if (itemExistente) {
      store.actions.updateQuantity(product.IdLivro, itemExistente.quantity + 1);
    } else {
      store.actions.addItemToCart(product);
    }
  };

  return (
    <globalContext.Provider value={{ store, auth, modal, orders, actions: { addToCart } }}>
      {children}
    </globalContext.Provider>
  );
};

export default GlobalContext;
