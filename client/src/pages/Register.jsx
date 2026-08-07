import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import PasswordStrengthMeter, { passwordMeetsMinimum } from "../components/PasswordStrengthMeter";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!passwordMeetsMinimum(form.password)) {
      setError(t("auth.passwordHint"));
      return;
    }

    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 48 }}>
      <h2 style={{ marginBottom: 20 }}>{t("auth.createAccount")}</h2>
      <form className="panel" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="name">{t("auth.fullName")}</label>
          <input id="name" name="name" className="input" value={form.name} onChange={handleChange} autoComplete="name" required />
        </div>
        <div className="form-row">
          <label htmlFor="email">{t("auth.email")}</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">{t("auth.password")}</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />
          <PasswordStrengthMeter password={form.password} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn" type="submit" style={{ width: "100%" }} disabled={submitting}>
          {submitting ? t("auth.creatingAccount") : t("auth.signup")}
        </button>
      </form>
      <p style={{ marginTop: 14, fontSize: 13 }}>
        {t("auth.haveAccount")} <Link to="/login">{t("auth.login")}</Link>
      </p>
    </div>
  );
}
