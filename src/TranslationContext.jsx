import React, { createContext, useContext } from 'react';
import { useTranslation } from '../node_modules/react-i18next';

const TranslationContext = createContext({
  t: (key) => key,
  i18n: {},
  changeLanguage: () => { },
});

export const TranslationProvider = ({ children }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (lang) => {
    try {
      await i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <TranslationContext.Provider value={{ t, i18n, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
};