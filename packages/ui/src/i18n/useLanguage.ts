import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { LANGUAGE_STORAGE_KEY } from './index';

export type Language = 'en' | 'ja';

const VALID_LANGUAGES: readonly Language[] = ['en', 'ja'];

const isValidLanguage = (value: unknown): value is Language =>
  typeof value === 'string' && (VALID_LANGUAGES as string[]).includes(value);

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
];

export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage: Language = isValidLanguage(i18n.language)
    ? i18n.language
    : 'en';

  const setLanguage = useCallback(
    (lang: Language) => {
      i18n.changeLanguage(lang).catch((err: unknown) => {
        console.error('[i18n] Failed to change language:', err);
      });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        } catch {
          // localStorage unavailable (e.g. private browsing with strict settings)
        }
      }
    },
    [i18n],
  );

  return { currentLanguage, setLanguage };
}
