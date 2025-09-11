import React, { useState } from 'react';
import './AppTabs.css';
import BasicTable from '../BasicTable/BasicTable';
import EditableInputTable from '../EditableInputTable/EditableInputTable';

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
            <BasicTable data={data} setData={setData} />
          </>
        )}
        {activeTab === 'input' && <EditableInputTable />}
      </div>
    </div>
  );
}

export default AppTabs;
