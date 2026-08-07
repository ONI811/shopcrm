import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function Cart() {
  const { items, total, updateQuantity, removeItem, loading } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (loading) return <div className="container">{t("cart.loading")}</div>;

  return (
    <div className="container" style={{ paddingTop: 32, maxWidth: 700 }}>
      <h2 style={{ marginBottom: 20 }}>{t("cart.title")}</h2>

      {items.length === 0 ? (
        <div className="empty-state">
          {t("cart.empty")} <Link to="/">{t("cart.browse")}</Link>.
        </div>
      ) : (
        <div className="panel">
          {items.map(({ product, quantity }) => (
            <div className="cart-line" key={product.id}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 28 }}>{product.image}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{product.name}</div>
                  <div className="product-meta">${product.price.toFixed(2)} {t("cart.each")}</div>
                </div>
              </div>
              <div className="qty-control">
                <button onClick={() => updateQuantity(product.id, quantity - 1)} disabled={quantity <= 1}>
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                ${(product.price * quantity).toFixed(2)}
              </div>
              <button className="btn secondary" onClick={() => removeItem(product.id)}>
                {t("cart.remove")}
              </button>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <strong>{t("cart.total")}</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <button className="btn" style={{ marginTop: 16, width: "100%" }} onClick={() => navigate("/checkout")}>
            {t("cart.checkout")}
          </button>
        </div>
      )}
    </div>
  );
}
