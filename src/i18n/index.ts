import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en/translation.json';
import ja from '../locales/ja/translation.json';
import mr from '../locales/mr/translation.json';

export const uiLangToI18nLang: Record<string, string> = {
  EN: 'en',
  JP: 'ja',
  MR: 'mr',
};

const storedUiLang = localStorage.getItem('lang');
const initialUiLang = storedUiLang && uiLangToI18nLang[storedUiLang] ? storedUiLang : 'EN';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
    mr: { translation: mr },
  },
  lng: uiLangToI18nLang[initialUiLang] ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
