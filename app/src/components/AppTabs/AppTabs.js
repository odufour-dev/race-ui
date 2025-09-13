import React, { useState } from 'react';
import './AppTabs.css';
import RegistrationTable from '../RegistrationTable/RegistrationTable';
import LapByLap from '../LapByLap/LapByLap';

function AppTabs({ data, setData, lastUser }) {
  const [activeTab, setActiveTab] = useState('table');

  return (
    <div>
      <div className="app-tabs-bar">
        <button
          className={activeTab === 'table' ? 'active' : ''}
          onClick={() => setActiveTab('table')}
        >
          Table Utilisateurs
        </button>
        <button
          className={activeTab === 'input' ? 'active' : ''}
          onClick={() => setActiveTab('input')}
        >
          Saisie Numérique
        </button>
      </div>
      <div className="app-tabs-content">
        {activeTab === 'table' && (
          <>
            <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#2563eb' }}>
              {lastUser ? (
                <span>Dernier utilisateur : {lastUser.firstName} {lastUser.lastName}</span>
              ) : (
                <span>Aucun utilisateur</span>
              )}
            </div>
            <RegistrationTable data={data} setData={setData} />
          </>
        )}
  {activeTab === 'input' && <LapByLap />}
      </div>
    </div>
  );
}

export default AppTabs;
