import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './src/languages/en.json';
import pt from './src/languages/pt-br.json';
import { getLocales } from 'react-native-localize';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

export const locale = getLocales()[0].languageCode.toLowerCase();

const i18n = i18next.createInstance();
i18n.use(initReactI18next).init({
  resources,
  lng: locale,
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: { escapeValue: false },
});

export default i18n;
