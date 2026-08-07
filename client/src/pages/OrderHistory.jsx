import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    api
      .getOrders(token)
      .then((data) => setOrders(data.slice().reverse()))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="container" style={{ paddingTop: 32, maxWidth: 700 }}>
      <h2 style={{ marginBottom: 20 }}>{t("orders.title")}</h2>

      {location.state?.justPlaced && (
        <div className="panel" style={{ marginBottom: 16, background: "#dcefe4" }}>
          {t("orders.placed")} {location.state.justPlaced.slice(0, 8)}
        </div>
      )}

      {loading ? (
        <p>{t("orders.loading")}</p>
      ) : orders.length === 0 ? (
        <div className="empty-state">{t("orders.empty")}</div>
      ) : (
        orders.map((order) => (
          <div className="panel" key={order.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{t("orders.order")} #{order.id.slice(0, 8)}</strong>
                <div className="product-meta">{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <span className={`badge ${order.status}`}>{order.status}</span>
            </div>
            <ul style={{ margin: "12px 0", paddingLeft: 18 }}>
              {order.items.map((item) => (
                <li key={item.productId} style={{ fontSize: 14 }}>
                  {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <strong>{t("orders.total")}: ${order.total.toFixed(2)}</strong>
          </div>
        ))
      )}
    </div>
  );
}
