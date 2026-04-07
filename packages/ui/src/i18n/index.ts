import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ja from './locales/ja.json';

const LANGUAGE_STORAGE_KEY = 'openchamber-language';

const SUPPORTED_LANGUAGES = ['en', 'ja'] as const;
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

const isSupported = (lang: string): lang is SupportedLanguage =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);

const getStoredLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isSupported(stored)) return stored;
  } catch {
    // localStorage unavailable (e.g. private browsing with strict settings)
  }
  return 'en';
};

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  keySeparator: false,
  // escapeValue: false is correct here — React already handles XSS escaping
  // in JSX, and react-i18next recommends this setting.
  interpolation: {
    escapeValue: false,
  },
});

export { LANGUAGE_STORAGE_KEY };
export default i18n;
