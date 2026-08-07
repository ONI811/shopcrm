import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang, languages, t } = useLanguage();

  return (
    <select
      className={`lang-switcher ${className}`}
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label={t("lang.label")}
      title={t("lang.label")}
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
