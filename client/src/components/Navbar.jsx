import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

// A reusable COMPONENT rendered on every storefront page. It reads shared
// state (auth + cart) from context rather than receiving it as props from
// each page, which keeps every page that uses it simple.
export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // EVENT handler: responds to the click on "Log out".
  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          Shop<span>CRM</span>
        </Link>
        <nav className="nav-links">
          <Link to="/">{t("nav.catalog")}</Link>
          {user && (
            <Link to="/cart">
              {t("nav.cart")}<span className="cart-pill">{count}</span>
            </Link>
          )}
          {user && <Link to="/orders">{t("nav.orders")}</Link>}
          {user && <Link to="/support">{t("nav.support")}</Link>}
          {user?.role === "admin" && <Link to="/admin">{t("nav.crm")}</Link>}
          <LanguageSwitcher />
          {user ? (
            <>
              <span>{t("nav.hi")}, {user.name.split(" ")[0]}</span>
              <button className="btn secondary" onClick={handleLogout}>
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login">{t("nav.login")}</Link>
              <Link to="/register" className="btn">
                {t("nav.signup")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
