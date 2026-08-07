import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();
  const { t } = useLanguage();

  function load() {
    api.getOrders(token).then((data) => setOrders(data.slice().reverse()));
  }

  useEffect(load, [token]);

  async function handleStatusChange(id, status) {
    await api.updateOrderStatus(id, status, token);
    load();
  }

  return (
    <div>
      <div className="crm-topbar">
        <div>
          <div className="crm-eyebrow">{t("admin.fulfillment")}</div>
          <h2 style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 22 }}>{t("admin.orderManagement")}</h2>
        </div>
      </div>

      <table className="crm-table">
        <thead>
          <tr>
            <th>{t("admin.order")}</th>
            <th>{t("admin.customer")}</th>
            <th>{t("admin.items")}</th>
            <th>{t("admin.total")}</th>
            <th>{t("admin.status")}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id.slice(0, 8)}</td>
              <td>
                {order.customerName}
                <div style={{ color: "var(--crm-muted)", fontSize: 11 }}>{order.customerEmail}</div>
              </td>
              <td>{order.items.reduce((n, i) => n + i.quantity, 0)} {t("admin.items")}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p style={{ color: "var(--crm-muted)" }}>{t("admin.noOrdersPlaced")}</p>}
    </div>
  );
}
