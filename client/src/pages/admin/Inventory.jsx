import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const EMPTY_FORM = { name: "", category: "", price: "", stock: "", image: "📦", description: "" };

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const { t } = useLanguage();

  function load() {
    api.getProducts().then(setProducts);
  }

  useEffect(load, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
      description: product.description,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.updateProduct(editingId, form, token);
      } else {
        await api.createProduct(form, token);
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm(t("admin.deleteConfirm"))) return;
    await api.deleteProduct(id, token);
    load();
  }

  return (
    <div>
      <div className="crm-topbar">
        <div>
          <div className="crm-eyebrow">{t("admin.catalog")}</div>
          <h2 style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 22 }}>{t("admin.inventoryControl")}</h2>
        </div>
      </div>

      <form className="crm-panel" onSubmit={handleSubmit}>
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>{editingId ? t("admin.editProduct") : t("admin.addProduct")}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
          <input className="input" name="name" placeholder={t("admin.name")} value={form.name} onChange={handleChange} required />
          <input className="input" name="category" placeholder={t("admin.category")} value={form.category} onChange={handleChange} />
          <input className="input" name="price" type="number" step="0.01" placeholder={t("admin.price")} value={form.price} onChange={handleChange} required />
          <input className="input" name="stock" type="number" placeholder={t("admin.stock")} value={form.stock} onChange={handleChange} required />
          <input className="input" name="image" placeholder={t("admin.emojiIcon")} value={form.image} onChange={handleChange} />
        </div>
        <textarea
          className="input"
          style={{ width: "100%", marginTop: 10 }}
          name="description"
          rows={2}
          placeholder={t("admin.description")}
          value={form.description}
          onChange={handleChange}
        />
        {error && <p className="error-text">{error}</p>}
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className="btn" type="submit">
            {editingId ? t("admin.saveChanges") : t("admin.addProduct")}
          </button>
          {editingId && (
            <button className="btn secondary" type="button" onClick={cancelEdit}>
              {t("admin.cancel")}
            </button>
          )}
        </div>
      </form>

      <table className="crm-table">
        <thead>
          <tr>
            <th>{t("admin.product")}</th>
            <th>{t("admin.category")}</th>
            <th>{t("admin.price")}</th>
            <th>{t("admin.stock")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.image} {p.name}</td>
              <td>{p.category}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.stock}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <button className="btn secondary" onClick={() => startEdit(p)}>{t("admin.edit")}</button>
                <button className="btn danger" onClick={() => handleDelete(p.id)}>{t("admin.delete")}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
