import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

// A small, focused COMPONENT: it only knows how to render one product and
// fire an "add to cart" callback. It has no idea where the data came from,
// which makes it reusable across the Home grid and (later) search results.
export default function ProductCard({ product, onAddToCart }) {
  const { t } = useLanguage();
  return (
    <div className="product-card">
      <div className="product-emoji">{product.image}</div>
      <Link to={`/products/${product.id}`} className="product-name">
        {product.name}
      </Link>
      <div className="product-meta">{product.category}</div>
      <div className="product-price">${product.price.toFixed(2)}</div>
      {product.stock <= 5 && (
        <div className="stock-low">
          {product.stock === 0 ? t("home.outOfStock") : t("home.onlyLeft", { n: product.stock })}
        </div>
      )}
      <button
        className="btn secondary"
        disabled={product.stock === 0}
        onClick={() => onAddToCart(product.id)}
      >
        {t("home.addToCart")}
      </button>
    </div>
  );
}
