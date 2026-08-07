import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [error, setError] = useState("");
  const { token } = useAuth();
  const { t } = useLanguage();

  function load() {
    api.getTickets(token).then(setTickets);
  }

  useEffect(load, [token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.createTicket(form, token);
      setForm({ subject: "", message: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 32, maxWidth: 600 }}>
      <h2 style={{ marginBottom: 20 }}>{t("support.title")}</h2>

      <form className="panel" onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div className="form-row">
          <label htmlFor="subject">{t("support.subject")}</label>
          <input id="subject" name="subject" className="input" value={form.subject} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label htmlFor="message">{t("support.message")}</label>
          <textarea id="message" name="message" className="input" rows={3} value={form.message} onChange={handleChange} required />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn" type="submit">
          {t("support.submit")}
        </button>
      </form>

      {tickets.map((t2) => (
        <div className="panel" key={t2.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{t2.subject}</strong>
            <span className={`badge ${t2.status}`}>{t2.status}</span>
          </div>
          <p style={{ margin: "8px 0" }}>{t2.message}</p>
          {t2.replies.map((r, i) => (
            <div key={i} style={{ fontSize: 13, marginTop: 6, paddingLeft: 10, borderLeft: "2px solid var(--teal)" }}>
              <strong>{t("support.supportLabel")}:</strong> {r.message}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
