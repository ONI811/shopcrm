import { useLanguage } from "../context/LanguageContext";

// Mirrors the server-side rule in server/routes/auth.js: 8+ characters and
// at least 3 of {lowercase, uppercase, number, symbol}. This gives instant
// feedback client-side, the same way Facebook/Google show a strength bar
// while you type, but the server always re-checks before creating anything.
export function scorePassword(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 5);
}

export function passwordMeetsMinimum(password) {
  if (!password || password.length < 8) return false;
  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((re) => re.test(password)).length;
  return classes >= 3;
}

export default function PasswordStrengthMeter({ password }) {
  const { t } = useLanguage();
  const score = scorePassword(password);

  if (!password) return null;

  const levels = [
    { max: 1, key: "strengthWeak", color: "var(--danger)" },
    { max: 2, key: "strengthWeak", color: "var(--danger)" },
    { max: 3, key: "strengthFair", color: "#c98f30" },
    { max: 4, key: "strengthGood", color: "#3f8a5a" },
    { max: 5, key: "strengthStrong", color: "var(--teal)" },
  ];
  const level = levels[Math.min(score, 4)];

  return (
    <div className="password-strength" aria-live="polite">
      <div className="password-strength-track">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="password-strength-segment"
            style={{ background: i < score ? level.color : undefined }}
          />
        ))}
      </div>
      <div className="password-strength-label" style={{ color: level.color }}>
        {t("auth.passwordStrength")}: {t(`auth.${level.key}`)}
      </div>
      <p className="password-strength-hint">{t("auth.passwordHint")}</p>
    </div>
  );
}
