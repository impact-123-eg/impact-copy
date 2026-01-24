import { useI18nStore } from '../store/i18nStore';
import { useLocation, useNavigate } from 'react-router-dom';

export function useI18n() {
    const i18nStore = useI18nStore();
    const location = useLocation();
    const navigate = useNavigate();

    const {
        currentLocale,
        loading,
        error,
        isRTL,
        currentDirection,
        pages,
        setLocale,
        loadPageContent,
        preloadAllPages,
        t,
        getPageKeys,
        hasTranslation,
        initialize
    } = i18nStore;

    /**
     * Prepends the current locale to a path if it's not already there.
     * @param {string} path 
     * @returns {string} Localized path
     */
    const localizePath = (path) => {
        if (!path) return `/${currentLocale}`;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;

        // Don't localize absolute external URLs
        if (cleanPath.startsWith('http')) return path;

        // Don't localize admin paths
        if (cleanPath.startsWith('/dash')) return cleanPath;

        // Check if path already starts with a locale
        const parts = cleanPath.split('/').filter(Boolean);
        if (parts.length > 0 && ['en', 'ar'].includes(parts[0])) {
            return cleanPath;
        }

        return `/${currentLocale}${cleanPath}`;
    };

    /**
     * Navigates to a path prepended with the current locale.
     */
    const navigateWithLang = (path, options = {}) => {
        navigate(localizePath(path), options);
    };

    /**
     * Switches the current language and updates the URL.
     * @param {string} newLocale 
     */
    const switchLanguage = (newLocale) => {
        if (newLocale === currentLocale) return;

        const pathParts = location.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0 && ['en', 'ar'].includes(pathParts[0])) {
            pathParts[0] = newLocale;
        } else {
            pathParts.unshift(newLocale);
        }

        const newPath = '/' + pathParts.join('/');
        setLocale(newLocale);
        navigate(newPath + location.search + location.hash, { replace: true });
    };

    return {
        // State
        currentLocale,
        loading,
        error,
        isRTL,
        currentDirection,
        pages,

        // Actions
        setLocale,
        switchLanguage,
        loadPageContent,
        preloadAllPages,
        t,
        getPageKeys,
        hasTranslation,
        initialize,
        localizePath,
        navigateWithLang
    };
}
