import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';

const SUPPORTED_LOCALES = ['ar', 'en'];
const DEFAULT_LOCALE = 'ar';

const LanguageSync = () => {
    const { lang } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentLocale, setLocale } = useI18n();

    useEffect(() => {
        // If the URL lang is supported and different from store, update store
        if (lang && SUPPORTED_LOCALES.includes(lang)) {
            if (lang !== currentLocale) {
                setLocale(lang);
            }
        } else if (lang && !SUPPORTED_LOCALES.includes(lang)) {
            // Invalid lang in URL, redirect to default or saved
            const savedLocale = localStorage.getItem('app_locale') || DEFAULT_LOCALE;
            const newPath = location.pathname.replace(`/${lang}`, `/${savedLocale}`);
            navigate(newPath, { replace: true });
        }
    }, [lang, currentLocale, setLocale, navigate, location.pathname]);

    // If no lang param yet (shouldn't happen with our App.jsx setup but good for safety)
    if (!lang) {
        const savedLocale = localStorage.getItem('app_locale') || DEFAULT_LOCALE;
        return <Navigate to={`/${savedLocale}${location.pathname}`} replace />;
    }

    return <Outlet />;
};

export default LanguageSync;
