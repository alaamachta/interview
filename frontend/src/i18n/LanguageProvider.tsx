import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
  translations,
  type TranslationSchema,
} from './translations';

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  dictionary: TranslationSchema;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => detectLanguage());

  const setLanguage = useCallback((nextLanguage: SupportedLanguage) => {
    setLanguageState(nextLanguage);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.warn('Unable to persist language preference', error);
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      dictionary: translations[language],
    }),
    [language, setLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

function detectLanguage(): SupportedLanguage {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const stored = readStoredLanguage();
  if (stored) {
    return stored;
  }

  const locales = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : navigator.language
      ? [navigator.language]
      : [];

  for (const locale of locales) {
    const language = normalizeLocale(locale);
    if (language) {
      return language;
    }
  }

  return DEFAULT_LANGUAGE;
}

function readStoredLanguage(): SupportedLanguage | null {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isSupportedLanguage(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage errors and fall back to detection
  }
  return null;
}

function normalizeLocale(locale: string | undefined | null): SupportedLanguage | null {
  if (!locale) {
    return null;
  }

  const normalized = locale.toLowerCase();
  if (normalized.startsWith('de')) {
    return 'de';
  }
  if (normalized.startsWith('ar')) {
    return 'ar';
  }
  if (normalized.startsWith('en')) {
    return 'en';
  }

  return null;
}

function isSupportedLanguage(value: string): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
