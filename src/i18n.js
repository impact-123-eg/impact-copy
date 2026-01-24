import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation:{
            hi:"hello",
        },
    },
    ar: {
        translation:{
            hi:"مرحبا",
        },
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('app_locale') || 'ar',
        fallbackLng: 'ar',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
