import './App.css';

import React, { useContext } from 'react';

import { RaceModelContext } from './models/RaceModel/RaceModel';
import AppTabs from './components/AppTabs/AppTabs';
import RegistrationTable from './components/RegistrationTable/RegistrationTable';
import LapByLap from './components/LapByLap/LapByLap';
import LastUserInfo from './components/LastUserInfo/LastUserInfo';
import ExcelReader from './components/ExcelReader/ExcelReader';

function App({ dataModel, updateModel }) {

  const { raceModel, forceUpdate } = useContext(RaceModelContext);
    
  return (
    <div className="App">
      <h1>Cycling race management</h1>
      <LastUserInfo dataModel={raceModel} />      
      <AppTabs
        dataModel={raceModel}
        tabs={[
          {
            name: 'import',
            label: 'Import',
            component: (props) => <ExcelReader {...props} dataModel={raceModel.getRacerManager()} updateData={() => forceUpdate()} />,
          },
          {
            name: 'table',
            label: 'Registration',
            component: (props) => (
              <RegistrationTable
                {...props}
                dataModel={raceModel}
              />
            ),
          },
          {
            name: 'input',
            label: 'Lap-by-Lap',
            component: (props) => <LapByLap {...props} dataModel={raceModel} />,
          },
        ]}
      />
    </div>
  );
}

export default App;
