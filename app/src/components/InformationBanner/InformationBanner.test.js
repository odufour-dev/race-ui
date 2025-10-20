import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import InformationBanner from './InformationBanner';

// Create a test i18n instance with in-memory resources
const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      LastUserInfo: {
        lastUser: 'Last user',
      }
    }
  }
});

describe('InformationBanner', () => {
  it('renders without crashing', () => {
    render(
      <I18nextProvider i18n={testI18n}>
        <InformationBanner dataModel={null} />
      </I18nextProvider>
    );
    expect(screen.getByText('Aucun utilisateur')).toBeInTheDocument();
  });
});
