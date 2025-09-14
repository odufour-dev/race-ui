import { render, screen } from '@testing-library/react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import App from './App';

const mockDataModel = {
  data: [],
  setData: jest.fn(),
  addRow: jest.fn(),
  updateRow: jest.fn(),
  deleteRow: jest.fn(),
  setAllData: jest.fn(),
  categoryOptions: [],
  serieOptions: [],
};

// Create a test i18n instance with in-memory resources
const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      RegistrationTable: {
        registration: { title: 'Registration' },
        columns: {
          bib: 'Bib',
          name: 'Name',
          firstName: 'First name',
          club: 'Club',
          category: 'Category',
          serie: 'Serie',
          licenseId: 'License ID',
          uciId: 'UCI ID'
        }
      },
      LastUserInfo: {
        lastUser: 'Last user',
      },
      LapByLap: {
        lap: 'Lap',
      },
      AppTabs: {
        tabs: 'Tabs',
      }
    }
  }
});

test('renders learn react link', () => {
  render(
    <I18nextProvider i18n={testI18n}>
      <App dataModel={mockDataModel} />
    </I18nextProvider>
  );
  const linkElement = screen.getByText(/Tan Stack Table/i);
  expect(linkElement).toBeInTheDocument();
});
