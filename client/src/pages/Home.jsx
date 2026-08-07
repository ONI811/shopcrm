import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["All", "Electronics", "Home", "Sportswear", "Accessories"];

export default function Home() {
  // STATE: search text, category filter, and the fetched product list all
  // live as component state so the UI re-renders whenever they change.
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { user } = useAuth();
  const { addItem } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    setLoading(true);
    setLoadError("");
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "All") params.set("category", category);
    api
      .getProducts(`?${params.toString()}`)
      .then(setProducts)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [search, category]);

  // EVENT handler tied to the search input's onChange.
  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  async function handleAddToCart(productId) {
    if (!user) return alert(t("home.loginToAdd"));
    await addItem(productId, 1);
  }

  return (
    <div className="container">
      <section className="hero">
        <h1>{t("home.title")}</h1>
        <p>{t("home.subtitle")}</p>
      </section>

      <div className="toolbar">
        <input
          className="input"
          style={{ flex: 1, minWidth: 220 }}
          placeholder={t("home.search")}
          value={search}
          onChange={handleSearchChange}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loadError ? (
        <div className="empty-state error-text">{loadError}</div>
      ) : loading ? (
        <p>{t("home.loading")}</p>
      ) : products.length === 0 ? (
        <div className="empty-state">{t("home.empty")}</div>
      ) : (
        // LIST OPERATIONS: mapping the fetched array into ProductCard
        // components, each keyed by its stable product id.
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
