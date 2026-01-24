import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Custom hook to fetch and use translations for a specific page
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const usePageTranslations = (slug, apiEndpoint = API_BASE_URL) => {
  const { i18n } = useTranslation();
  const [translations, setTranslations] = useState({});
  const [currentLang, setCurrentLang] = useState(i18n.language || localStorage.getItem('language') || 'en');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch translations by slug from server
  const fetchTranslationsBySlug = async (pageSlug) => {
    try {
      const response = await fetch(`${apiEndpoint}/api/pages/slug/${pageSlug}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.data && data.data.page) {
        const pageContent = data.data.page;
        setTranslations(prev => ({
          ...prev,
          [pageSlug]: pageContent
        }));
        return pageContent;
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchTranslationsBySlug(slug);
        if (data) {
          setTranslations(prev => ({
            ...prev,
            [slug]: data
          }));
        } else {
          // If page not found, fall back to static translations
          console.warn(`Page with slug "${slug}" not found, using static translations`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadTranslations();
    }
  }, [slug, apiEndpoint]);

  // Sync currentLang with i18n.language
  useEffect(() => {
    if (i18n.language && i18n.language !== currentLang) {
      setCurrentLang(i18n.language);
    }
  }, [i18n.language]);

  // Translation function specific to this page
  const t = (key) => {
    const pageTranslations = translations[slug];
    if (pageTranslations && pageTranslations[currentLang]) {
      return pageTranslations[currentLang][key] || key;
    }
    return key;
  };

  // Function to change language
  const changeLanguage = async (lang) => {
    setCurrentLang(lang);
    await i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', lang);
  };

  return {
    t,
    isLoading,
    error,
    currentLang,
    changeLanguage,
    translations: translations[slug] || {}
  };
};