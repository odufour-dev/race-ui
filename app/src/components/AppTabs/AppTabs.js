import React, { useState } from 'react';
import './AppTabs.css';
// RegistrationTable and LapByLap will be passed as props

function AppTabs({ data, setData, lastUser, tabs = [] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.name || '');

  return (
    <div>
      <div className="app-tabs-bar">
        {tabs.map(tab => (
          <button
            key={tab.name}
            className={activeTab === tab.name ? 'active' : ''}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="app-tabs-content">
        {tabs.map(tab => (
          activeTab === tab.name && (
            <React.Fragment key={tab.name}>
              {/* LastUserInfo moved to App.js header */}
              {tab.component && tab.component({ data, setData })}
            </React.Fragment>
          )
        ))}
      </div>
    </div>
  );
}

export default AppTabs;
