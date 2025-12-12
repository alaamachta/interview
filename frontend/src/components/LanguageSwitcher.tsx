import React from 'react';
import { useLanguage } from '../i18n/LanguageProvider';
import type { SupportedLanguage } from '../i18n/translations';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

const LABELS: Record<SupportedLanguage, string> = {
  en: 'EN',
  de: 'DE',
  ar: 'AR',
};

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, dictionary } = useLanguage();

  return (
    <div className="language-switcher" role="group" aria-label={dictionary.languageSwitcher.label}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          className={language === lang ? 'active' : ''}
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
        >
          {LABELS[lang]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
