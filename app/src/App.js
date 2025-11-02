import './App.css';

import React, { useContext, useEffect, useState, startTransition } from 'react';
import { useTranslation } from 'react-i18next';

import { RaceModelContext } from './models/RaceModel/RaceModel';
import Sidebar from './components/Sidebar/Sidebar';
import { NavigationItem, NavigationGroup, NavigationRegistry } from './navigationPanel/navigationPanel';
import RegistrationTable from './components/RegistrationTable/RegistrationTable';
import InformationBanner from './components/InformationBanner/InformationBanner';
import ExcelReader from './components/ExcelReader/ExcelReader';
import EventSettings from './components/EventSettings/EventSettings';

function App() {

  const { t: translator } = useTranslation('translation');

  const { raceModel, forceUpdate } = useContext(RaceModelContext);
  const [ nbStages, setNbStages ] = useState( raceModel.getEventSettings().nStages );
  const [ nav, setNav ] = useState( new NavigationRegistry() );

  useEffect(() => {
    setNbStages( raceModel.getEventSettings().nStages );
  }, [raceModel]);

  const updateRacerManager = (racerManager) => {
    raceModel.updateRacerManager(racerManager); 
    forceUpdate();
  }

  const [selectedItem, setSelectedItem] = useState(nav.find('event.configuration'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 769 : true);

    // Create the navigation panel components
  const navEventConfiguration = new NavigationItem({ id: 'configuration', title: translator('navigation.configuration'), order: 5, component: (props) => (
    <EventSettings {...props} settings={raceModel.getEventSettings()} onApply={(settings) => {
      raceModel.updateEventSettings(settings); 
      setNbStages(raceModel.getEventSettings().nStages);
      forceUpdate();
    }} />
  ) });
  const navRacerRegistration = new NavigationItem({ id: 'registration', title: translator('navigation.registration'), order: 10, component: (props) => (
    <RegistrationTable {...props} dataModel={raceModel.getRacerManager()} classificationModel={raceModel.getClassifications()} setData={updateRacerManager} />
  )});
  const navRacerImport = new NavigationItem({ id: 'import', title: translator('navigation.import'), order: 20, component: (props) => (
    <ExcelReader {...props} dataModel={raceModel.getRacerManager()} updateData={updateRacerManager} />
  )});

  const navEventGroup = new NavigationGroup({id: 'event', title: translator('navigation.event'), order: 0, items: [navEventConfiguration]});
  const navRacersGroup = new NavigationGroup({id:'racers', title: translator('navigation.racers'), order: 1, items: [navRacerRegistration, navRacerImport]});  

  useEffect(() => {

    const baseNav = new NavigationRegistry([navEventGroup, navRacersGroup]);
    for (let stage=1; stage<=nbStages; stage++) {
      const navRaceGroup = new NavigationGroup({id: `stage${stage}`, title: translator('navigation.stage') + " " + stage, order: 2 + stage});
      const navStageRanking = new NavigationItem({id: "ranking", title: translator('navigation.ranking'), order: 1} );
      navRaceGroup.add(navStageRanking);
      setNav(baseNav.add(navRaceGroup));
    }

  }, [nbStages]);

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
        <Sidebar nav={nav} translator={translator} selectedId={selectedItem ? selectedItem.id : ""} onSelect={(id) => {
          // Wrap selection in a transition to avoid replacing the UI with a loading indicator
          // when the next view suspends (e.g. lazy loading or i18n resources).
          startTransition(() => setSelectedItem(nav.find(id)));
          if (!isDesktop) setSidebarOpen(false);
        }} isOpen={sidebarOpen || isDesktop} onClose={() => setSidebarOpen(false)} />
        <main style={{flex:1, overflow:'auto', padding: '1rem'}}>
          {selectedItem && selectedItem.component ? ( selectedItem.component() ) : (
            <div style={{padding: '1rem', color: '#334155'}}>Select a view from the left navigation.</div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
