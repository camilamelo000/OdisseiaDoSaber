import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../GlobalContext/GlobalContext";
import { FaStar, FaRegStar, FaTrashAlt } from "react-icons/fa"; 
import "./DeliveryEmpty.css"; 

const DeliveryEmpty = () => {
  const { modal } = useGlobalContext();
  const handleLogin = () => {
    modal.openModal(false);
  };

  
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState(""); 
  const [rating, setRating] = useState(5); 
  const productId = 1; 
  const [userComments, setUserComments] = useState([]); 
  
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/comentarios`)
      .then((response) => {
        setComentarios(response.data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar comentários:", error);
        setLoading(false);
      });
  }, []);
  

 
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color="#FFD700" />);
      } else {
        stars.push(<FaRegStar key={i} color="#FFD700" />);
      }
    }
    return stars;
  };

 
  const handleAddComment = () => {
    if (newComment) {
      const commentData = {
        Comentarios: newComment,
        Estrelas: rating,
        IdLivro: productId,
        IdUsuario: 1, 
      };

      axios
        .post("http://localhost:8080/api/comentarios", commentData)
        .then((response) => {
          setUserComments([...userComments, response.data]); 
          setNewComment(""); 
          setRating(5); 
        })
        .catch((error) => {
          console.error("Erro ao adicionar comentário:", error);
        });
    }
  };

  
  const handleDeleteComment = (commentId) => {
    
    axios
      .delete(`http://localhost:8080/api/comentarios/${commentId}`)
      .then(() => {
        setUserComments(userComments.filter(comment => comment.IdComentario !== commentId)); 
      })
      .catch((error) => {
        console.error("Erro ao excluir comentário:", error);
      });
  };

  return (
    <div className="forum-comments-container">
      <h3>Comentários sobre nossos livros</h3>
      {loading ? (
        <p>Carregando comentários...</p>
      ) : comentarios.length > 0 || userComments.length > 0 ? (
        <>
          {}
          {comentarios.slice(0, 8).map((comentario) => (  
            <div className="comment-card" key={comentario.IdComentario}>
              <div className="comment-header">
                <div className="book-info">
                  <img
                    src={comentario.ImagemLivro}
                    alt={comentario.TituloLivro}
                    className="book-image"
                  />
                  <h4>{comentario.TituloLivro}</h4>
                </div>
                <span className="comment-author">{comentario.NomeUsuario}</span>
              </div>
              <div className="comment-body">
                <p>{comentario.Comentarios}</p>
                <div className="comment-rating">
                  {renderStars(comentario.Estrelas)} {}
                </div>
              </div>
            </div>
          ))}

          {}
          {userComments.length > 0 && (
            <div>
              <h4>Seus Comentários</h4>
              {userComments.map((comentario) => (
                <div className="comment-card" key={comentario.IdComentario}>
                  <div className="comment-header">
                    <div className="book-info">
                      <img
                        src={comentario.ImagemLivro || ''} 
                        alt={comentario.TituloLivro}
                        className="book-image"
                      />
                      <h4>{comentario.TituloLivro}</h4>
                    </div>
                    <span className="comment-author">Você</span>
                  </div>
                  <div className="comment-body">
                    <p>{comentario.Comentarios}</p>
                    <div className="comment-rating">
                      {renderStars(comentario.Estrelas)}
                    </div>
                  </div>
                  <button
                    className="delete-comment-btn"
                    onClick={() => handleDeleteComment(comentario.IdComentario)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>Nenhum comentário encontrado.</p>
      )}

      {}
      <div className="add-comment-section">
        <h4>Adicione seu comentário</h4>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Deixe seu comentário sobre o seu livro..."
        />
        <div className="rating-input">
          <label>Avaliação: </label>
          {renderStars(rating)}
          <input
            type="range"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </div>
        <button className="btn-submit" onClick={handleAddComment}>
          Enviar Comentário
        </button>
      </div>

      {}
      <div className="faq-section">
        <h4>Dúvidas Frequentes</h4>
        <div className="faq-item">
          <h5>Como comprar o livro?</h5>
          <p>Para comprar o livro, basta clicar no botão 'Adicionar ao Carrinho' na página do produto.</p>
        </div>
        <div className="faq-item">
          <h5>Qual a política de devolução?</h5>
          <p>A devolução pode ser realizada dentro de 30 dias após a compra, desde que o produto esteja em bom estado.</p>
        </div>
        <div className="faq-item">
          <h5>O livro possui versão em eBook?</h5>
          <p>Sim, todos os nossos livros estão disponíveis em versão digital. Você pode adquiri-los em nossa loja online.</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryEmpty;
