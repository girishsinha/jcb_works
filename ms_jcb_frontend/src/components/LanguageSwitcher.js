import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button onClick={toggleLanguage} className="px-3 py-1 bg-gray-200 rounded">
      {i18n.language === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
};

export default LanguageSwitcher;
