import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LapByLap from './LapByLap';

// Create a test i18n instance with in-memory resources
const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      LapByLap: {
        lap: 'Lap',
      }
    }
  }
});

describe('LapByLap', () => {
  it('renders editable-input-table', () => {
    render(
      <I18nextProvider i18n={testI18n}>
        <LapByLap />
      </I18nextProvider>
    );
    // Find the table by role and class
    const table = screen.getByRole('table', { name: '' });
    expect(table).toHaveClass('editable-input-table');
  });
});
