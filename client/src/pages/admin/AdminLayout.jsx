import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function AdminLayout() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const LINKS = [
    { to: "/admin", label: t("admin.dashboard"), end: true },
    { to: "/admin/inventory", label: t("admin.inventory") },
    { to: "/admin/orders", label: t("admin.orders") },
    { to: "/admin/customers", label: t("admin.customers") },
    { to: "/admin/support", label: t("admin.support") },
  ];

  return (
    <div className="crm">
      <div className="crm-shell">
        <aside className="crm-sidebar">
          <div className="brand">
            Shop<span>CRM</span>
          </div>
          <div className="crm-eyebrow" style={{ marginTop: 6 }}>
            {t("admin.backOffice")}
          </div>
          <nav className="crm-nav">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div style={{ marginTop: 40 }}>
            <LanguageSwitcher />
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--crm-muted)" }}>
            {t("admin.signedInAs")} {user?.name}
          </div>
        </aside>
        <main className="crm-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
