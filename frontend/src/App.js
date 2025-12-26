import './App.css';

import React, { useMemo, useEffect, useState, useCallback, startTransition } from 'react';
import { useTranslation } from 'react-i18next';

import APIConnection      from './components/APIConnection/APIConnection';
import EventSettings      from './components/EventSettings/EventSettings';
import ExcelReader        from './components/ExcelReader/ExcelReader';
import GeneralRanking     from './components/GeneralRanking/GeneralRanking';
import { NavigationItem, NavigationGroup, NavigationRegistry } from './navigationPanel/navigationPanel';
import RegistrationTable  from './components/RegistrationTable/RegistrationTable';
import Sidebar            from './components/Sidebar/Sidebar';
import StageRanking       from './components/StageRanking/StageRanking';

import { RaceModel }      from './models/RaceModel';
import { RaceConnector }  from './models/RaceConnector';
import { Metadata  }      from './models/Metadata/Metadata';

import { Helper }         from './tools/Helper';

function App() {

  const { t: translator } = useTranslation('translation');
  const helper = new Helper(translator);

  const [ nav, setNav ]                 = useState( () => new NavigationRegistry() );
  const [selectedItem, setSelectedItem] = useState(nav.find('event.configuration'));
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [isDesktop, setIsDesktop]       = useState(typeof window !== 'undefined' ? window.innerWidth >= 769 : true);

  const [appName, setAppName] = useState("");

  const [ raceModel, setRaceModel ] = useState( () => new RaceModel() );
  const [ competitionid, setCompetitionId] = useState("");
  const connector = useMemo(() => new RaceConnector("/api/v1", console), []);
  
  useEffect(() => {
    if (!competitionid) return;

    connector.fetchFullModel(competitionid)
      .then(newModel => {
        setRaceModel(newModel);
      })
    .catch(err => console.error(err));
}, [competitionid, connector]);

  /* TODO : Enable loading from backend
  const [ raceModel, setRaceModel ]     = useState( (null );
  const connector = useMemo(() => new RaceConnector(competitionId), [competitionId]);

  // Chargement initial
  useEffect(() => {
    connector.fetchFullModel().then(setModel);
  }, [connector]);

  const debouncedSync = useMemo(
    () => debounce((manager) => {
      console.log("Sauvegarde automatique vers le backend...");
      connector.syncRacers(manager).catch(console.error);
    }, 1000),
    [connector]
  );
  */

  const handleStageChange = useCallback(
  (stage, data) => {
    setRaceModel(raceModel.updateStageRanking(stage, data));
  },
  [raceModel]
);

  const createStageComponent = useCallback(
    (stage) => {
      return (props) => (
        <StageRanking
          {...props}
          stage={stage}
          data={raceModel.getStageRanking(stage)}
          helper={helper}
          onChange={(data) => handleStageChange(stage, data)}
        />
      );
    },
    [raceModel, handleStageChange, helper]
  );

  const createGeneralComponent = useCallback(
    (stage) => {
      return (props) => (
        <GeneralRanking
          {...props}
          stage={stage}
          data={raceModel.getGeneralRanking(stage)}
          helper={helper}
        />
      );
    },
    [raceModel, handleStageChange, helper]
  );

  useEffect(() => {
    const metadata = new Metadata();
    metadata.initialize().then(() => {
      const name = metadata.fullName;
      setAppName(name);
      console.log(metadata.fullName);
    });
  }, []);
  
  useEffect(() => {
      console.log('Stage #1 ranking:', raceModel.getStageRanking(1));
      console.log('General #1 ranking:', raceModel.getGeneralRanking(1));
    }, [ raceModel ]);

  // Create the navigation panel components
  const navEventConfiguration = new NavigationItem({ id: 'configuration', title: helper.translator('navigation.configuration'), order: 5, component: (props) => (
    <EventSettings {...props} helper={helper} settings={raceModel.Race} annexRanking={raceModel.Annex} onApply={(settings) => setRaceModel(raceModel.updateRace(settings))} />
  ) });
  const navRacerRegistration = new NavigationItem({ id: 'registration', title: helper.translator('navigation.registration'), order: 20, component: (props) => (
    <RegistrationTable {...props} helper={helper} dataModel={raceModel.Racers} classificationModel={raceModel.Classifications} setData={(racerManager) => setRaceModel(raceModel.updateRacerManager(racerManager))} />
  )});
  const navRacerImport = new NavigationItem({ id: 'import', title: helper.translator('navigation.import'), order: 10, component: (props) => (
    <ExcelReader {...props} helper={helper} dataModel={raceModel.Racers} updateData={(racerManager) => setRaceModel(raceModel.updateRacerManager(racerManager))} />
  )});

  const navEventGroup = new NavigationGroup({id: 'event', title: helper.translator('navigation.event'), order: 0, items: [navEventConfiguration]});
  const navRacersGroup = new NavigationGroup({id:'racers', title: helper.translator('navigation.racers'), order: 1, items: [navRacerImport,navRacerRegistration]});  

  useEffect(() => {

    const baseNav = new NavigationRegistry([navEventGroup, navRacersGroup]);
    const evtSettings = raceModel.Race;
    for (let stage=1; stage<=evtSettings.nStages; stage++) {
      
      const s = evtSettings.stages[stage-1];
      const parts = [helper.translator('navigation.stage') + " " + String(s.id)];
      if (s && s.name) parts.push(String(s.name));
      const stageName = parts.join(' - ');
      
      const navRaceGroup = new NavigationGroup({id: "stage_" + stage, title: stageName, order: 10 * stage});
      
      const navConfigRanking = new NavigationItem({id: "config_" + stage, title: helper.translator('navigation.configuration'), order: 1} );
      navRaceGroup.add(navConfigRanking);

      const navStageRanking = new NavigationItem({id: "ranking_" + stage, title: helper.translator('navigation.ranking'), order: 2, component: createStageComponent(stage)} );
      navRaceGroup.add(navStageRanking);
      
      const navGeneralRanking = new NavigationItem({id: "general_" + stage, title: helper.translator('navigation.general'), order: 3, component: createGeneralComponent(stage)});
      navRaceGroup.add(navGeneralRanking);

      evtSettings.annexRankings.map((r,i) => {
        const navAnnexRanking = new NavigationItem({id: "annex_" + stage + "_" + i, title: r.title, order: 4 + i} );
        navRaceGroup.add(navAnnexRanking);
      });
      baseNav.add(navRaceGroup);
    }
    setNav(baseNav);

  }, [raceModel]);

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
      <APIConnection helper={helper} connector={connector} value={competitionid} onChange={setCompetitionId} />      
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
        <Sidebar nav={nav} helper={helper} selectedId={selectedItem ? selectedItem.id : ""} onSelect={(id) => {
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
      <footer>{appName}</footer>
    </div>
  );
}

export default App;
