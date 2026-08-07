import { createContext, useContext, useMemo, useState } from "react";
import { translations, LANGUAGES } from "../i18n/translations";

const LanguageContext = createContext(null);

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem("shopcrm_lang") || "en");

  function setLang(code) {
    setLangState(code);
    localStorage.setItem("shopcrm_lang", code);
  }

  const t = useMemo(() => {
    return (key, vars) => {
      const dict = translations[lang] || translations.en;
      let value = getByPath(dict, key);
      if (value === undefined) value = getByPath(translations.en, key);
      if (value === undefined) return key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, v);
        });
      }
      return value;
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
