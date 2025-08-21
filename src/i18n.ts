import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Basic i18n initialization. Update supportedLngs/fallbackLng as needed (e.g., for MEA region).
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Add your supported languages here
    supportedLngs: ['en', 'ja'],
    fallbackLng: 'en',
    // Map locales like ja-JP to ja automatically
    nonExplicitSupportedLngs: true,

    // Namespace setup (common default is 'translation')
    ns: ['translation', 'positions'],
    defaultNS: 'translation',

    // Where to load translation files from
    backend: {
      // Use PUBLIC_URL to support subpath deployments (e.g., GitHub Pages)
      loadPath: `${process.env.PUBLIC_URL || ''}/locales/{{lng}}/{{ns}}.json`,
    },

    // Language detection configuration
    detection: {
      order: ['querystring', 'localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    // Helpful during development
    debug: process.env.NODE_ENV === 'development',
  });

// Keep the <html lang> attribute in sync with the current language
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lng);
  }
});

export default i18n;
