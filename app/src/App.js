import './App.css';
import AppTabs from './components/AppTabs/AppTabs';


import React, { useState } from 'react';

function App() {
  const [data, setData] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', age: 30, status: 'Actif' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', age: 25, status: 'Inactif' },
    { id: 3, firstName: 'Peter', lastName: 'Jones', age: 40, status: 'Actif' },
    { id: 4, firstName: 'Mary', lastName: 'Williams', age: 35, status: 'En attente' },
    { id: 5, firstName: 'Louis', lastName: 'Dubois', age: 28, status: 'Actif' },
    { id: 6, firstName: 'Sophie', lastName: 'Durand', age: 32, status: 'Inactif' },
  ]);

  // Get the last user (if any)
  const lastUser = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="App">
      <h1>Tan Stack Table</h1>
      <AppTabs data={data} setData={setData} lastUser={lastUser} />
    </div>
  );
}

export default App;
