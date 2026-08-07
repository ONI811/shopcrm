import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  // FORM CONTROL: each input is a controlled component - its value comes
  // from state and every keystroke updates that state via onChange.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemo(role) {
    if (role === "admin") {
      setEmail("admin@shopcrm.test");
      setPassword("Admin!2345");
    } else {
      setEmail("shopper@shopcrm.test");
      setPassword("Shopper!2345");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 48 }}>
      <h2 style={{ marginBottom: 20 }}>{t("auth.welcomeBack")}</h2>
      <form className="panel" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="email">{t("auth.email")}</label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">{t("auth.password")}</label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn" type="submit" style={{ width: "100%" }} disabled={submitting}>
          {submitting ? t("auth.loggingIn") : t("auth.login")}
        </button>
      </form>
      <p style={{ marginTop: 14, fontSize: 13 }}>
        {t("auth.noAccount")} <Link to="/register">{t("auth.signup")}</Link>
      </p>
      <div className="demo-accounts">
        <button type="button" className="demo-chip" onClick={() => fillDemo("admin")}>
          {t("auth.demoAdmin")}: admin@shopcrm.test
        </button>
        <button type="button" className="demo-chip" onClick={() => fillDemo("shopper")}>
          {t("auth.demoShopper")}: shopper@shopcrm.test
        </button>
      </div>
    </div>
  );
}
