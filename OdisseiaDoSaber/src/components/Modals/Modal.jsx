import { toast } from "react-toastify";
import "./Modal.css";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";

const Modal = ({ header, submitAction, buttonText, isRegister }) => {
  const { auth } = useGlobalContext(); // Aqui você está pegando o contexto de autenticação
  const { modal } = useGlobalContext(); // Aqui você pega o modal
  let [loading, setLoading] = useState(false); // Controla o loading

  // Função para fechar o modal
  const handleClose = () => {
    modal.closeModal();
  };

  // Função para alternar entre o login e o registro
  const handleSwitch = () => {
    modal.openModal(!isRegister);
  };

  // Função de envio do formulário
  const submitForm = (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o carregamento (loading)

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries()); // Pega os dados do formulário e os converte para objeto

    // Verificando se há campos vazios
    if (Object.values(data).some((value) => value === "")) {
      toast.error("Preencha todos os campos");
      setLoading(false);
      return;
    }

    // Verificando se o registro e as senhas batem
    if (isRegister && data.password !== data.confirmPassword) {
      toast.error("As senhas não correspondem");
      setLoading(false);
      return;
    }

    // Envia dados de login ou de registro para o backend, dependendo do estado `isRegister`
    if (isRegister) {
      // Chama a função `register` do contexto que irá interagir com a API
      auth
        .register(data) // Passa os dados do formulário para a função `register`
        .then(() => {
          modal.closeModal(); // Fecha o modal após o sucesso
        })
        .finally(() => {
          setLoading(false); // Desativa o loading
        });
    } else {
      // Chama a função `login` do contexto que irá interagir com a API
      auth
        .login(data) // Passa os dados do formulário para a função `login`
        .then(() => {
          modal.closeModal(); // Fecha o modal após o sucesso
        })
        .finally(() => {
          setLoading(false); // Desativa o loading
        });
    }
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-cancel">
          <button
            href="/"
            className="modal-cancel-button"
            onClick={handleClose}
          >
            X
          </button>
        </div>
        <div className="modal-header">
          <h3>{header}</h3>
        </div>
        <div className="modal-body">
          <form onSubmit={submitForm}>
            {/* Input para nome de usuário só no registro */}
            {isRegister && (
              <div className="form-group">
                <label htmlFor="username">Nome de Usuário</label>
                <input type="text" className="form-control" name="username" />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" className="form-control" name="email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input type="password" name="password" className="form-control" />
            </div>
            {/* Campo para confirmar senha só no registro */}
            {isRegister && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Senha</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                />
              </div>
            )}
            <div className="login-or-register">
              {isRegister ? (
                <span>
                  Já possui uma conta?
                  <button
                    className="btn-rounded"
                    type="button"
                    onClick={() => {
                      handleSwitch(); // Troca entre login e registro
                    }}
                  >
                    Login
                  </button>
                </span>
              ) : (
                <span>
                  Não possui uma conta?
                  <button
                    className="btn-rounded"
                    type="button"
                    onClick={() => {
                      handleSwitch(); // Troca entre login e registro
                    }}
                  >
                    Criar uma Conta
                  </button>
                </span>
              )}
            </div>
            <div className="form-group">
              <button type="submit" className="btn-rounded btn-submit">
                {buttonText}{" "}
                <span>
                  <ClipLoader
                    loading={loading}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
