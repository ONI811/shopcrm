import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const { addItem } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    api.getProduct(id).then(setProduct);
  }, [id]);

  if (!product) return <div className="container">{t("product.loading")}</div>;

  async function handleAdd() {
    if (!user) return navigate("/login");
    await addItem(product.id, quantity);
    navigate("/cart");
  }

  return (
    <div className="container" style={{ paddingTop: 32, maxWidth: 640 }}>
      <div className="panel">
        <div style={{ fontSize: 64 }}>{product.image}</div>
        <h2 style={{ marginTop: 10 }}>{product.name}</h2>
        <p className="product-meta">{product.category}</p>
        <p style={{ margin: "14px 0" }}>{product.description}</p>
        <p className="product-price" style={{ fontSize: 22 }}>
          ${product.price.toFixed(2)}
        </p>
        <p className="product-meta">{product.stock} {t("product.inStock")}</p>

        <div className="qty-control" style={{ margin: "16px 0" }}>
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
        </div>

        <button className="btn" disabled={product.stock === 0} onClick={handleAdd}>
          {t("product.addToCart")}
        </button>
      </div>
    </div>
  );
}
