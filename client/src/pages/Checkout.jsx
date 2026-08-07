import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function Checkout() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();
  const { items, total, refresh } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const order = await api.checkout(address, token);
      await refresh();
      navigate("/orders", { state: { justPlaced: order.id } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return <div className="container empty-state">{t("checkout.emptyCart")}</div>;
  }

  return (
    <div className="container" style={{ paddingTop: 32, maxWidth: 500 }}>
      <h2 style={{ marginBottom: 20 }}>{t("checkout.title")}</h2>
      <form className="panel" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="address">{t("checkout.shippingAddress")}</label>
          <textarea
            id="address"
            className="input"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("checkout.addressPlaceholder")}
            required
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", margin: "16px 0" }}>
          <span>{t("checkout.orderTotal")}</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn" type="submit" style={{ width: "100%" }} disabled={submitting}>
          {submitting ? t("checkout.placing") : t("checkout.placeOrder")}
        </button>
      </form>
    </div>
  );
}
