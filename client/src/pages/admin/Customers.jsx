import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const { token } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    api.getCustomers(token).then(setCustomers);
  }, [token]);

  async function openProfile(id) {
    const data = await api.getCustomer(id, token);
    setSelected(data);
  }

  return (
    <div>
      <div className="crm-topbar">
        <div>
          <div className="crm-eyebrow">{t("admin.relationships")}</div>
          <h2 style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 22 }}>{t("admin.customerProfiles")}</h2>
        </div>
      </div>

      <table className="crm-table">
        <thead>
          <tr>
            <th>{t("admin.name")}</th>
            <th>{t("admin.email")}</th>
            <th>{t("admin.orders")}</th>
            <th>{t("admin.totalSpent")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.orderCount}</td>
              <td>${c.totalSpent.toFixed(2)}</td>
              <td>
                <button className="btn secondary" onClick={() => openProfile(c.id)}>
                  {t("admin.view")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="crm-panel" style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 14 }}>{selected.name} - {t("admin.purchaseHistory")}</h3>
          <p style={{ color: "var(--crm-muted)", fontSize: 12 }}>{selected.email}</p>
          {selected.orders.length === 0 ? (
            <p style={{ color: "var(--crm-muted)" }}>{t("admin.noOrders")}</p>
          ) : (
            selected.orders.map((o) => (
              <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--crm-line)" }}>
                <span>#{o.id.slice(0, 8)} - {new Date(o.createdAt).toLocaleDateString()}</span>
                <span className={`badge ${o.status}`}>{o.status}</span>
                <span>${o.total.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
