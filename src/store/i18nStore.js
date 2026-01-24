import { create } from 'zustand';
import i18n from '../i18n';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds
const SUPPORTED_LOCALES = ['ar', 'en'];
const DEFAULT_LOCALE = 'ar';

export const useI18nStore = create((set, get) => ({
    // State
    currentLocale: localStorage.getItem('app_locale') || DEFAULT_LOCALE,
    pages: {}, // Record<string, Page>
    loading: false,
    error: null,
    isRTL: (localStorage.getItem('app_locale') || DEFAULT_LOCALE) === 'ar',
    currentDirection: (localStorage.getItem('app_locale') || DEFAULT_LOCALE) === 'ar' ? 'rtl' : 'ltr',
    lastFetchedAll: null,

    // Actions
    setLocale: (locale) => {
        if (!SUPPORTED_LOCALES.includes(locale)) return;

        localStorage.setItem('app_locale', locale);
        const isRTL = locale === 'ar';
        const currentDirection = isRTL ? 'rtl' : 'ltr';

        // Update document direction and lang
        document.documentElement.dir = currentDirection;
        document.documentElement.lang = locale;

        // Update i18next global instance
        i18n.changeLanguage(locale);

        set({
            currentLocale: locale,
            isRTL,
            currentDirection
        });
    },

    loadPageContent: async (slug) => {
        if (get().pages[slug]) {
            return; // Already loaded
        }

        set({ loading: true, error: null });

        try {
            // Robust URL construction
            const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
            const response = await axios.get(`${baseUrl}/api/pages/slug/${slug}`);
            const page = response.data.data?.page || response.data.data;

            set((state) => ({
                pages: { ...state.pages, [slug]: page },
                loading: false
            }));
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Failed to load page content',
                loading: false
            });
            console.error('Error loading page content:', err);
        }
    },

    preloadAllPages: async () => {
        const { lastFetchedAll } = get();
        const now = Date.now();

        // 30 minutes cache for all pages
        if (lastFetchedAll && (now - lastFetchedAll < CACHE_TTL)) {
            return;
        }

        set({ loading: true, error: null });

        try {
            // Robust URL construction
            const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
            const response = await axios.get(`${baseUrl}/api/pages`);
            const allPages = response.data.data?.pages || (Array.isArray(response.data.data) ? response.data.data : []);

            const pagesMap = {};
            allPages.forEach(page => {
                if (page && page.slug) {
                    pagesMap[page.slug] = page;
                }
            });

            set({
                pages: pagesMap,
                lastFetchedAll: now,
                loading: false
            });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Failed to preload pages',
                loading: false
            });
            console.error('Error preloading pages:', err);
        }
    },

    // Translation function
    t: (pageSlug, key, fallback = null) => {
        const { pages, currentLocale } = get();
        const page = pages[pageSlug];

        if (!page) {
            // Fallback to global i18next if no page-specific content
            return i18n.t(key) || fallback || key;
        }

        const content = page.content ? page.content[currentLocale] : null;

        if (!content) {
            return i18n.t(key) || fallback || key;
        }

        // First, try to find the key as a direct property (flat structure)
        if (key in content && typeof content[key] === 'string') {
            return content[key];
        }

        // If not found, try nested keys with dot notation (e.g., 'header.title')
        const keys = key.split('.');
        let value = content;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return i18n.t(key) || fallback || key;
            }
        }

        return typeof value === 'string' ? value : (i18n.t(key) || fallback || key);
    },

    getPageKeys: (pageSlug) => {
        const { pages, currentLocale } = get();
        const page = pages[pageSlug];
        if (!page) return [];

        const content = page.content ? page.content[currentLocale] : null;
        if (!content) return [];

        const extractKeys = (obj, prefix = '') => {
            const keys = [];
            for (const [key, value] of Object.entries(obj)) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    keys.push(...extractKeys(value, fullKey));
                } else {
                    keys.push(fullKey);
                }
            }
            return keys;
        };

        return extractKeys(content);
    },

    hasTranslation: (pageSlug, key) => {
        const { pages, currentLocale } = get();
        const page = pages[pageSlug];
        if (!page) return false;

        const content = page.content ? page.content[currentLocale] : null;
        if (!content) return false;

        if (key in content && typeof content[key] === 'string') {
            return true;
        }

        const keys = key.split('.');
        let value = content;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return false;
            }
        }

        return typeof value === 'string';
    },

    initialize: async () => {
        const detectLocaleFromPath = () => {
            if (typeof window === 'undefined') return null;
            const [possibleLocale] = window.location.pathname.split('/').filter(Boolean);
            return SUPPORTED_LOCALES.includes(possibleLocale) ? possibleLocale : null;
        };

        const detectBrowserLocale = () => {
            if (typeof navigator === 'undefined') return null;
            const browserLang = navigator.language?.toLowerCase();
            if (!browserLang) return null;
            if (browserLang.startsWith('ar')) return 'ar';
            if (browserLang.startsWith('en')) return 'en';
            return null;
        };

        const localeFromPath = detectLocaleFromPath();
        const savedLocale = localStorage.getItem('app_locale');
        const browserLocale = detectBrowserLocale();

        const localeToUse = localeFromPath || savedLocale || browserLocale || DEFAULT_LOCALE;

        get().setLocale(localeToUse);

        // Preload all pages for better performance
        await get().preloadAllPages();
    }
}));
