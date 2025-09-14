import './App.css';
import AppTabs from './components/AppTabs/AppTabs';
import RegistrationTable from './components/RegistrationTable/RegistrationTable';
import LapByLap from './components/LapByLap/LapByLap';
import LastUserInfo from './components/LastUserInfo/LastUserInfo';


import React from 'react';

function App({ data, setData, addRow, updateRow, deleteRow, setAllData, categoryOptions, serieOptions }) {

  // Get the last user (if any)
  const lastUser = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="App">
      <h1>Tan Stack Table</h1>
      <LastUserInfo lastUser={lastUser} />
      <AppTabs
        data={data}
        setData={setData}
        addRow={addRow}
        updateRow={updateRow}
        deleteRow={deleteRow}
        setAllData={setAllData}
        tabs={[
          {
            name: 'table',
            label: 'Registration',
            component: (props) => (
              <RegistrationTable
                {...props}
                data={data}
                setData={setData}
                addRow={addRow}
                updateRow={updateRow}
                deleteRow={deleteRow}
                setAllData={setAllData}
                categoryOptions={categoryOptions}
                serieOptions={serieOptions}
              />
            ),
          },
          {
            name: 'input',
            label: 'Lap-by-Lap',
            component: (props) => <LapByLap {...props} data={data} setData={setData} />,
          },
        ]}
      />
    </div>
  );
}

export default App;
