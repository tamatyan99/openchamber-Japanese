import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ja from './locales/ja.json';

const LANGUAGE_STORAGE_KEY = 'openchamber-language';

const getStoredLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
};

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export { LANGUAGE_STORAGE_KEY };
export default i18n;
