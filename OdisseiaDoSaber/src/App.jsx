import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "@/components/NavBar/NavBar";
import ShopFooter from "@/components/Footer/ShopFooter";
import ErrorView from "./views/ErrorView";
import CartView from "./views/CartView";
import HomeView from "./views/HomeView"; 
import DeliveryView from "./views/DeliveryView";
import LivrosPage from "./views/LivrosPage"; 
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import { ToastContainer } from "react-toastify";
import Modal from "./components/Modals/Modal";
import CancelOrder from "./components/Modals/CancelOrder";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';



function App() {
  const { store, modal } = useGlobalContext();
  const [livros, setLivros] = useState([]);  

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api");
      setLivros(response.data.livros);  
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    }
  };

  useEffect(() => {
    fetchAPI();  
  }, []);

  return (
    <div>
      <BrowserRouter>
        <header>
          <NavBar />
        </header>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/delivery" element={<DeliveryView />} />
          <Route path="/livros" element={<LivrosPage livros={livros} />} />  {}
          <Route path="*" element={<ErrorView />} />
        </Routes>
        <footer>
          <ShopFooter />
        </footer>
      </BrowserRouter>

      {modal.opened && (
        <Modal
          header={modal.isRegister ? "Criar uma conta" : "Login"}
          submitAction="/"
          buttonText={modal.isRegister ? "Criar uma conta" : "Login"}
          isRegister={modal.isRegister}
        />
      )}
      {modal.isCancelModal && <CancelOrder />}
      <ToastContainer />
    </div>
  );
}

export default App;
