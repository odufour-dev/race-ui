import './App.css';

import React, { useMemo, useEffect, useState, useCallback }  from 'react';
import { useTranslation }                       from 'react-i18next';

import APIConnection                            from './components/APIConnection/APIConnection';
import { createComponents }                     from './components/Components';
import { NavigationMenu }                       from './components/NavigationMenu';

import { RaceConnector }                        from './models/RaceConnector';
import { Metadata }                             from './models/Metadata/Metadata';

import { Helper }                               from './tools/Helper';

function App() {

  const { t: translator } = useTranslation('translation');
  const helper = new Helper(translator);

  const [appName, setAppName]           = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [components, setComponents]     = useState(null);

  const [competitionid, setCompetitionId] = useState("");
  const connector = useMemo(() => new RaceConnector("/api/v1", console), []);

  const handleInit = (competitionid) => {
      createComponents({ helper, connector, competitionid })
          .then(setComponents); // Met à jour l'état quand c'est prêt
  }
  useEffect(() => {
        handleInit(competitionid);
    }, [competitionid]);

  useEffect(() => {
    const metadata = new Metadata();
    metadata.initialize().then(() => {
      const name = metadata.fullName;
      setAppName(name);
    });
  }, []);
  
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <APIConnection helper={helper} connector={connector} value={competitionid} onChange={setCompetitionId} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <NavigationMenu helper={helper} connector={connector} competitionid={competitionid} onSelect={setSelectedItem}/>
      </div>
      <main style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
        { components ? 
            components.renderById("event-settings",competitionid) : 
            (<div style={{ padding: '1rem', color: '#334155' }}>Select a view from the left navigation.</div>)
        }
      </main>
      <footer>{appName}</footer>
    </div>
  );
}

export default App;

/*
<main style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
  {selectedItem && selectedItem.component ? (selectedItem.component()) : (
    <div style={{ padding: '1rem', color: '#334155' }}>Select a view from the left navigation.</div>
  )}
</main>
*/