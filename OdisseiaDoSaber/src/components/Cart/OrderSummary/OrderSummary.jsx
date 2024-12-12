import { useState, useEffect } from "react";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import { toast } from "react-toastify";
import "./OrderSummary.css";

const OrderSummary = () => {
  const { store, auth } = useGlobalContext();
  const [cart, setCart] = useState(store.state.cart); 
  const [deliveryType, setDeliveryType] = useState("Standard");
  const [phone, setPhone] = useState("");
  const [promoCode, setPromoCode] = useState(""); 

  useEffect(() => {
    setCart(store.state.cart);
  }, [store.state.cart]);

  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existingProduct = updatedCart.find(item => item._id === product.IdLivro);
    if (existingProduct) {
      existingProduct.quantity += 1;  
    } else {
      updatedCart.push({ ...product, quantity: 1 });  
    }
    setCart(updatedCart);  
  };

  const checkOut = async () => {
    let payload = {
      DeliveryType: deliveryType,
      DeliveryTypeCost: deliveryType === "Standard" ? 5 : 10,
      costAfterDelieveryRate: cart.reduce((total, item) => total + item.Preco * item.quantity, 0) + (deliveryType === "Standard" ? 5 : 10),
      promoCode,
      phoneNumber: phone,
      user_id: auth.state.user?.id,
      cart,
    };

    const response = await store.confirmOrder(payload);
    if (response.showRegisterLogin) {
      modal.openModal();
    } else {
      toast.success("Compra realizada com sucesso!");
    }
  };

  return (
    <div className="is-order-summary">
      <div className="sub-container">
        <div className="contains-order">
          <div className="total-cost">
            <h4>Preço dos Itens ({cart.length})</h4>
            <h4>R${cart.reduce((total, item) => total + item.Preco * item.quantity, 0)}</h4>
          </div>
          <div className="shipping">
            <h4>Frete</h4>
            <select
              className="select-dropdown"
              onChange={(item) => setDeliveryType(item.target.value)}
            >
              <option value="Standard" className="select">Normal</option>
              <option value="Express" className="select">Expresso</option>
            </select>
          </div>
          <div className="promo-code">
            <h4>Código Promocional</h4>
            <input
              className="select-dropdown"
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button
              className="flat-button apply-promo"
              onClick={() => toast.success("Código aplicado com sucesso!")}
            >
              Aplicar
            </button>
          </div>
          <div className="phone">
            <h4>Telefone</h4>
            <input
              className="select-dropdown"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <small>Uma mensagem será enviada para confirmação de sua compra.</small>
          </div>
          <div className="final-cost">
            <h4>Preço Total</h4>
            <h4>R${cart.reduce((total, item) => total + item.Preco * item.quantity, 0) + (deliveryType === "Standard" ? 5 : 10)}</h4>
          </div>
          <div className="final-checkout">
            <button
              className="flat-button checkout"
              onClick={checkOut}
              disabled={cart.length === 0}
            >
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
