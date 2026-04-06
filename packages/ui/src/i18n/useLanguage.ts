import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { LANGUAGE_STORAGE_KEY } from './index';

export type Language = 'en' | 'ja';

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
];

export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = (i18n.language || 'en') as Language;

  const setLanguage = useCallback(
    (lang: Language) => {
      void i18n.changeLanguage(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      }
    },
    [i18n],
  );

  return { currentLanguage, setLanguage };
}
