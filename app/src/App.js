import './App.css';

import React, { useContext, useEffect, useState, startTransition } from 'react';

import { RaceModelContext } from './models/RaceModel/RaceModel';
import Sidebar from './components/Sidebar/Sidebar';
import { buildNavFromTabs } from './navigation/navConfig';
import RegistrationTable from './components/RegistrationTable/RegistrationTable';
import InformationBanner from './components/InformationBanner/InformationBanner';
import ExcelReader from './components/ExcelReader/ExcelReader';

function App() {

  const { raceModel, forceUpdate } = useContext(RaceModelContext);
  const [ nbStages, setNbStages ] = useState( raceModel.getNumberOfStages() );

  useEffect(() => {
    setNbStages( raceModel.getNumberOfStages() );
  }, [raceModel]);

  const updateRacerManager = (racerManager) => {
    raceModel.updateRacerManager(racerManager); 
    forceUpdate();
  }

  var tabs = [
    {
      name: 'configuration',
      label: 'Configuration',
      group: 'admin',
      component: (props) => (
        <div style={{padding: '1rem', color: '#334155'}}>
          <h2>Configuration</h2>
          <p>Number of stages: {nbStages}</p>
          <input
            type="number"
            min={1}
            max={30}
            value={nbStages}
            onChange={(e) => {
              const newNbStages = parseInt(e.target.value, 10);
              setNbStages(newNbStages);
              raceModel.setNumberOfStages(newNbStages);
              forceUpdate();
            }}
          />
        </div>
      ),
    },
    {
      name: 'import',
      label: 'Import',
      group: 'registration',
      component: (props) => (
        <ExcelReader {...props}
          dataModel={raceModel.getRacerManager()} 
          updateData={updateRacerManager} 
        />
      ),
    },
    {
      name: 'registration',
      label: 'Registration',
      group: 'registration',
      component: (props) => (
        <RegistrationTable
          {...props}
          dataModel={raceModel.getRacerManager()} 
          classificationModel={raceModel.getClassifications()}
          setData={updateRacerManager} 
        />
      ),
    },
  ];
  for (let i = 1; i <= nbStages; i++) {
    tabs.push({
      name: `stage${i}_ranking`,
      label: `Stage ${i}`,
      group: 'ranking',
      component: (props) => (
        <div style={{padding: '1rem', color: '#334155'}}>
          <h2>Stage {i} Ranking</h2>
          <p>Ranking details for stage {i} would go here.</p>
        </div>
      ),
    });
    tabs.push({
      name: `stage${i}_annex`,
      label: `Stage ${i}`,
      group: 'annex',
      component: (props) => (
        <div style={{padding: '1rem', color: '#334155'}}>
          <h2>Stage {i} Annex</h2>
          <p>Annex details for stage {i} would go here.</p>
        </div>
      ),      
    });
  } 
      
  const nav = buildNavFromTabs(tabs);
  const [selectedId, setSelectedId] = useState(nav[0]?.items?.[0]?.id || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 769 : true);

  useEffect(() => {
    function onResize() {
      const desktop = window.innerWidth >= 769;
      setIsDesktop(desktop);
    }
    // initialize
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const selectedItem = (() => {
    for (const g of nav) {
      const found = g.items.find(i => i.id === selectedId);
      if (found) return found;
    }
    return null;
  })();

  return (
    <div className="App" style={{display:'flex', flexDirection:'column', height: '100vh'}}>      
      <InformationBanner dataModel={raceModel} />      
      <div style={{display:'flex', alignItems:'center', padding: '0.5rem 1rem'}}>
        {/* Mobile hamburger to open sidebar */}
        <button
          className="hamburger"
          aria-label="Open navigation"
          onClick={() => setSidebarOpen(true)}
          style={{display: 'inline-flex', alignItems: 'center', padding: '0.5rem', borderRadius: 6, border: '1px solid transparent', background: 'transparent'}}
        >
          ☰
        </button>
      </div>
      <div style={{display:'flex', flex:1, overflow:'hidden'}}>
  {!isDesktop && sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <Sidebar nav={nav} selectedId={selectedId} onSelect={(id) => {
          // Wrap selection in a transition to avoid replacing the UI with a loading indicator
          // when the next view suspends (e.g. lazy loading or i18n resources).
          startTransition(() => setSelectedId(id));
          if (!isDesktop) setSidebarOpen(false);
        }} isOpen={sidebarOpen || isDesktop} onClose={() => setSidebarOpen(false)} />
        <main style={{flex:1, overflow:'auto', padding: '1rem'}}>
          {(() => {
            // Prefer rendering the original tab component from the `tabs` array to preserve exact props
            const tab = tabs.find(t => t.name === selectedId);
            if (tab && tab.component) {
              console.log('Rendering tab', tab.name);
              return tab.component({ data: raceModel, setData: updateRacerManager, lastUser: null });
            }
            return <div style={{padding: '1rem', color: '#334155'}}>Select a view from the left navigation.</div>;
          })()}
        </main>
      </div>
    </div>
  );
}

export default App;
