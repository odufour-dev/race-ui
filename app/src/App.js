import './App.css';
import AppTabs from './components/AppTabs/AppTabs';
import RegistrationTable from './components/RegistrationTable/RegistrationTable';
import LapByLap from './components/LapByLap/LapByLap';
import LastUserInfo from './components/LastUserInfo/LastUserInfo';


import React, { useState } from 'react';

function App() {
  const [data, setData] = useState([
    {
      bib: 101,
      lastName: 'MARTIN',
      firstName: 'Lucas',
      club: 'Velo Club Paris',
      category: 'Junior',
      serie: 'A',
      licenseId: 'FRA123456',
      uciId: 'UCI998877',
    },
    {
      bib: 102,
      lastName: 'DUPONT',
      firstName: 'Emma',
      club: 'Cyclo Lyon',
      category: 'Senior',
      serie: 'B',
      licenseId: 'FRA654321',
      uciId: 'UCI112233',
    },
    {
      bib: 103,
      lastName: 'BERNARD',
      firstName: 'Hugo',
      club: 'Team Marseille',
      category: 'Junior',
      serie: 'A',
      licenseId: 'FRA789012',
      uciId: 'UCI445566',
    },
  ]);

  // Get the last user (if any)
  const lastUser = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="App">
      <h1>Tan Stack Table</h1>
      <LastUserInfo lastUser={lastUser} />
      <AppTabs
        data={data}
        setData={setData}
        tabs={[
          {
            name: 'table',
            label: 'Table Utilisateurs',
            component: (props) => (
              <RegistrationTable
                {...props}
                categoryOptions={['Junior', 'Senior', 'Espoir', 'Elite']}
                serieOptions={['A', 'B', 'C', 'D']}
              />
            ),
          },
          {
            name: 'input',
            label: 'Saisie Numérique',
            component: () => <LapByLap />,
          },
        ]}
      />
    </div>
  );
}

export default App;
