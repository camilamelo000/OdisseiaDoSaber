 const getProducts = () => {
  // Dados estáticos dos produtos
  const staticProducts = [
    { _id: 1, name: "Produto 1", price: 100, description: "Descrição do produto 1", image: "produto1.jpg", times_bought: 20 },
    { _id: 2, name: "Produto 2", price: 200, description: "Descrição do produto 2", image: "produto2.jpg", times_bought: 50 },
    { _id: 3, name: "Produto 3", price: 150, description: "Descrição do produto 3", image: "produto3.jpg", times_bought: 30 },
  ];

  
  const modifiedData = staticProducts.map((product) => {
    return { ...product, addedToCart: false }; 
  });

 
  dispatch({
    type: actions.GET_PRODUCTS,
    products: modifiedData,
    backed_up_cart: [],  
  });
};

export default getProducts;
