import './App.css';
import AppTabs from './components/AppTabs/AppTabs';
import RegistrationTable from './components/RegistrationTable/RegistrationTable';
import LapByLap from './components/LapByLap/LapByLap';
import LastUserInfo from './components/LastUserInfo/LastUserInfo';
import ExcelReader from './components/ExcelReader/ExcelReader';

import React from 'react';

function App({ dataModel }) {
  const { data, setData, addRow, updateRow, deleteRow, setAllData, categoryOptions, serieOptions } = dataModel;
  const lastUser = data.length > 0 ? data[data.length - 1] : null;
  return (
    <div className="App">
      <h1>Cycling race management</h1>
      {/*<LastUserInfo lastUser={lastUser} />*/}
      <AppTabs
        dataModel={dataModel}
        tabs={[
          {
            name: 'import',
            label: 'Import',
            component: (props) => <ExcelReader {...props} dataModel={dataModel} />,
          },
          {
            name: 'table',
            label: 'Registration',
            component: (props) => (
              <RegistrationTable
                {...props}
                dataModel={dataModel}
              />
            ),
          },
          {
            name: 'input',
            label: 'Lap-by-Lap',
            component: (props) => <LapByLap {...props} dataModel={dataModel} />,
          },
        ]}
      />
    </div>
  );
}

export default App;
