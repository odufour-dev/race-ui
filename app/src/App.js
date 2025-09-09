import logo from './logo.svg';
import './App.css';
import React from 'react';
import EditableTable from './EditableTable';

function App() {

  const tableData = [
    { id: 1, firstName: 'John', lastName: 'Doe', age: 30, city: 'New York' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', age: 25, city: 'Los Angeles' },
    { id: 3, firstName: 'Peter', lastName: 'Jones', age: 40, city: 'Chicago' },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          CACA <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <h1>Table Éditable React</h1>
      <EditableTable initialData={tableData} />
    </div>
  );
}

export default App;
