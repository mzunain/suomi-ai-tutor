'use client';

import { useState, useEffect, useCallback } from 'react';
import { translations, Language } from '@/i18n/translations';

const LANG_KEY = 'suomi-ui-language';

export function useTranslation() {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem(LANG_KEY) as Language | null;
    if (stored && stored in translations) setLanguageState(stored);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any = translations[language];
      for (const k of keys) value = value?.[k];
      if (typeof value === 'string') return value;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let fallback: any = translations.en;
      for (const k of keys) fallback = fallback?.[k];
      return typeof fallback === 'string' ? fallback : key;
    },
    [language]
  );

  return { t, language, setLanguage };
}
