import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { XMLParser } from 'fast-xml-parser';

const xmlParser = new XMLParser();

const backendOptions = {
  loadPath: '/locales/{{lng}}/{{ns}}.xml',
  parse: (data) => {
    const json = xmlParser.parse(data);
    return json.translation;
  },
};

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    backend: backendOptions,
    lng: 'en',
    fallbackLng: 'en',
    ns: ['RegistrationTable'],
    defaultNS: 'RegistrationTable',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
