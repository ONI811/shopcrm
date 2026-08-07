import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { token } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    api.getAnalytics(token).then(setStats);
  }, [token]);

  if (!stats) return <p>{t("product.loading")}</p>;

  return (
    <div>
      <div className="crm-topbar">
        <div>
          <div className="crm-eyebrow">{t("admin.overview")}</div>
          <h2 style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 22 }}>{t("admin.analyticsDashboard")}</h2>
        </div>
      </div>

      <div className="crm-grid">
        <div className="stat-card">
          <div className="stat-value">${stats.totalSales.toFixed(2)}</div>
          <div className="stat-label">{t("admin.totalSales")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-label">{t("admin.totalOrders")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.activeCustomers}</div>
          <div className="stat-label">{t("admin.activeCustomers")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.lowStock.length}</div>
          <div className="stat-label">{t("admin.lowStockAlerts")}</div>
        </div>
      </div>

      <div className="crm-panel">
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>{t("admin.ordersByStatus")}</h3>
        {Object.entries(stats.salesByStatus).length === 0 ? (
          <p style={{ color: "var(--crm-muted)" }}>{t("admin.noOrdersYet")}</p>
        ) : (
          Object.entries(stats.salesByStatus).map(([status, count]) => (
            <div key={status} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span className={`badge ${status}`}>{status}</span>
              <span>{count}</span>
            </div>
          ))
        )}
      </div>

      <div className="crm-panel">
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>{t("admin.lowInventory")}</h3>
        {stats.lowStock.length === 0 ? (
          <p style={{ color: "var(--crm-muted)" }}>{t("admin.wellStocked")}</p>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>{t("admin.product")}</th>
                <th>{t("admin.stockLeft")}</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStock.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
