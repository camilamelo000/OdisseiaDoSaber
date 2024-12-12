import { useState, useEffect } from 'react';

const API_URL_PRODUCTS = 'http://localhost:8080/api';  
const API_URL_CART = 'http://localhost:8080/api/cart';  
const useStore = () => {
  const [state, setState] = useState({
    products: [],  
    cart: [],     
    cartTotal: 0, 
    cartQuantity: 0, 
  });

  const loadProducts = async () => {
    try {
      const response = await fetch(API_URL_PRODUCTS); 
      const data = await response.json();
      const modifiedData = data.map((product) => ({
        ...product,
        addedToCart: false, 
      }));
      setState((prevState) => ({
        ...prevState,
        products: modifiedData,
      }));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  useEffect(() => {
    loadProducts(); 
  }, []);

  const addToCart = async (product) => {
    const productInCart = state.cart.find(item => item.IdLivro === product.IdLivro);  

    let updatedCart;
    if (productInCart) {
      updatedCart = state.cart.map(item =>
        item.IdLivro === product.IdLivro
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...state.cart, { ...product, quantity: 1 }];
    }

    const updatedTotal = updatedCart.reduce((acc, item) => acc + item.preco * item.quantity, 0);  
    const updatedQuantity = updatedCart.reduce((acc, item) => acc + item.quantity, 0);  

    setState({
      ...state,
      cart: updatedCart,
      cartTotal: updatedTotal,
      cartQuantity: updatedQuantity,
    });

    try {
      await fetch(API_URL_CART, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          IdLivro: product.IdLivro,  
          quantity: productInCart ? productInCart.quantity + 1 : 1 
        }),
      });
    } catch (error) {
      console.error('Erro ao atualizar o carrinho no servidor:', error);
    }
  };

  const removeFromCart = async (productId) => {
    const updatedCart = state.cart.filter((item) => item.IdLivro !== productId);  
    const updatedTotal = updatedCart.reduce((acc, item) => acc + item.preco * item.quantity, 0);
    const updatedQuantity = updatedCart.reduce((acc, item) => acc + item.quantity, 0);

    setState({
      ...state,
      cart: updatedCart,
      cartTotal: updatedTotal,
      cartQuantity: updatedQuantity,
    });

    try {
      await fetch(`${API_URL_CART}/${productId}`, {
        method: 'DELETE',  
      });
    } catch (error) {
      console.error('Erro ao remover item do carrinho no servidor:', error);
    }
  };

  return {
    state,
    addToCart,
    removeFromCart,
  };
};

export default useStore;
