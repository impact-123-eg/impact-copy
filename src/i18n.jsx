import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import english from "./Languages/en.json";
import arabic from "./Languages/ar.json";

const resources = {
  en: {
    translation: english,
  },
  ar: {
    translation: arabic,
  },
};

const savedLanguage = localStorage.getItem("language") || "ar"; // Default to Arabic
document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"; // Set direction on load
i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang"),
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
