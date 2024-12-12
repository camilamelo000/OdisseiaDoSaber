import "./DeliveryItem.css";
import { useState } from "react";
import { FaCaretUp } from "react-icons/fa";
import { useGlobalContext } from "../../GlobalContext/GlobalContext";

const DeliveryItem = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(order.expected_delivery_date);
  const currentDate = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const numberOfDays = () => {
    if (currentDate.getTime() > date.getTime()) {
      return "0";
    }
    return Math.ceil((date.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    
  }
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const checkFlair = (percentage) => {
    if (percentage < 50) {
      return "flair danger-flair";
    } else if (percentage < 90) {
      return "flair warning-flair";
    } else {
      return "flair success-flair";
    }
  };

  const checkFlairText = (percentage) => {
    if (order.order_cancelled) {
      return "Pedido Cancelado";
    } else if (percentage < 50) {
      return "Verificação Pendente";
    } else if (percentage < 90) {
      return "Verificado e liberado para entrega";
    } else {
      return "Enviado para Entrega";
    }
  };

  const { modal, orders } = useGlobalContext();

  const handleOpenCancelModal = (order_id) => {
    modal.openCancelModal();
    orders.setOrderToBeCanceled(order_id);
  };

  return (
    <div className="sub-container delivery-item-container">
      <div className="delivery-overview">
        <div className="delivery-summary">
          <div className="delivery-order-number">
            <h2 className="delivery-item-title order-main" title={order._id}>
              Pedido: <span>#</span>
              {order._id.slice(0, 6)}
            </h2>
            <div className="delivery-items">
              <h5>Itenst: {order.totalItemCount}</h5>
              <h5>Preço Total: R${order.cost_after_delivery_rate}</h5>
              <h5>Tipo de Entrega: {order.delivery_type}</h5>
              <h6>Preço total inclui frete</h6>
            </div>
          </div>
          <div className="delivery-progress">
            <h3 className="delivery-item-title">Completar</h3>
            <h4>
              {order.percentage_complete}%{" "}
              <span className={checkFlair(order.percentage_complete)}>
                {checkFlairText(order.percentage_complete)}
              </span>
            </h4>
            <progress
              className="progress-bar"
              value={order.percentage_complete}
              max="100"
            ></progress>
          </div>
          <div className="delivery-date">
            <h3 className="delivery-item-title">Esperando Entrega</h3>
            {(order.order_processed != true &&
              order.order_cancelled != true && <h4>{formattedDate}</h4>) ||
              (order.order_processed == true && (
                <h4 className="is-delivered">Enviado</h4>
              )) ||
              (order.order_cancelled == true && (
                <h4 className="is-cancelled">Cancelado</h4>
              ))}

            {(order.order_processed != true &&
              order.order_cancelled != true && (
                <h4>{numberOfDays()} day(s)</h4>
              )) ||
              ""}
          </div>
        </div>
        <div
          className={expanded ? "fully-expanded isExpanded" : "fully-expanded"}
        >
          <div className="products-in-delivery">
            <h3>Produtos para Entrega</h3>
            <div className="delivery-products">
              {order.items.map((item) => {
                return (
                  <div className="delivery-products-item" key={item._id}>
                    <img src={item.product_image} alt="" width="50" />
                    <h5>Nome do Produto: {item.name}</h5>
                    <h5>Descrição: {item.description}</h5>
                    <h5>Preço: R${item.price}</h5>
                    <h5>Quantidade: {item.quantity}</h5>
                  </div>
                );
              })}
            </div>
          </div>
          {order.order_processed != true && order.order_cancelled != true && (
            <div className="danger-zone">
              <h3 className="danger-zone-text">Perigo</h3>
              <div className="danger-zone-buttons">
                <button
                  className="btn-rounded danger-zone-button"
                  onClick={() => {
                    handleOpenCancelModal(order._id);
                  }}
                >
                  Cancelar Pedido
                </button>
                <button
                  className="btn-rounded danger-zone-button report-issue"
                  onClick={() => {
                    // mailto link
                    window.location.href = `mailto:www.minisylar3@gmail.com?subject=Reporting Order #${order._id.slice(
                      0,
                      6
                    )}`;
                  }}
                >
                  Reportar Erro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="expand-collapse-delivery">
        <button onClick={toggleExpanded}>
          {expanded ? "Collapse" : "Expand"}
          <span>
            <FaCaretUp
              className={
                expanded ? "caret-delivery" : "caret-delivery caret-expanded"
              }
            ></FaCaretUp>
          </span>
        </button>
      </div>
    </div>
  );
};
export default DeliveryItem;
