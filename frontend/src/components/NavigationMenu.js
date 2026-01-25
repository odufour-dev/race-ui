
import React, { useState, useMemo, useCallback, useEffect } from 'react';

import EventSettings      from './EventSettings/EventSettings';
import ExcelReader        from './ExcelReader/ExcelReader';
import GeneralRanking     from './GeneralRanking/GeneralRanking';
import RegistrationTable  from './RegistrationTable/RegistrationTable';
import StageRanking       from './StageRanking/StageRanking';

import './NavigationMenu.css';

export function NavigationMenu( {helper, connector, competitionid, onSelect}){

    const createStageComponent = useCallback(
      (stage) => {
        return (props) => (
          <StageRanking
            {...props}
            competitionid={competitionid}
            stage={stage}
            connector={connector}
            helper={helper}
          />
        );
      },
      [helper]
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
      [helper]
    );

    const buildNav = useCallback((model) => {

        // Create the navigation panel components
        const navEventConfiguration = model.addItem('configuration', helper.translator('navigation.configuration'), 5, (props) => (
            <EventSettings {...props} helper={helper} connector={connector} competitionid={competitionid} />
            ));
        const navRacerRegistration = model.addItem('registration', helper.translator('navigation.registration'), 20, (props) => (
            <RegistrationTable {...props} helper={helper} connector={connector} competitionid={competitionid} />
            ));
        const navRacerImport = model.addItem('import', helper.translator('navigation.import'), 10, (props) => (
            <ExcelReader {...props} helper={helper} dataModel={raceModel.Racers} updateData={(racerManager) => setRaceModel(raceModel.updateRacerManager(racerManager))} />
            ));

        const navEventGroup  = model.addGroup('event',  helper.translator('navigation.event'),  0, [navEventConfiguration]);
        const navRacersGroup = model.addGroup('racers', helper.translator('navigation.racers'), 1, [navRacerImport, navRacerRegistration]);

        const baseNav = model.createRegistry([navEventGroup, navRacersGroup]);
        
        for (let stage = 1; stage <= model.nStages; stage++) {

            const parts = [helper.translator('navigation.stage') + " " + model.stageIds[stage-1]];
            parts.push(model.stageNames[stage-1]);
            const stageName = parts.join(' - ');

            const navRaceGroup = model.addGroup("stage_" + stage, stageName, 10 * stage);

            const navConfigRanking = model.addItem("config_" + stage, helper.translator('navigation.configuration'), 1);
            navRaceGroup.add(navConfigRanking);

            const navStageRanking = model.addItem("ranking_" + stage, helper.translator('navigation.ranking'), 2, createStageComponent(stage));
            navRaceGroup.add(navStageRanking);

            const navGeneralRanking = model.addItem("general_" + stage, helper.translator('navigation.general'), 3, createGeneralComponent(stage));
            navRaceGroup.add(navGeneralRanking);

            model.annexRankingTitles.map((t, i) => {
                const navAnnexRanking = model.addItem("annex_" + stage + "_" + i, t, 4 + i);
                navRaceGroup.add(navAnnexRanking);
            });
            baseNav.add(navRaceGroup);

        }
        return baseNav;

    });
  
    const [query, setQuery]           = useState('');
    const [nav, setNav]               = useState(null);
    const [openGroups, setOpenGroups] = useState(null);
    const [selectedId, setSelectedId] = useState();

    useEffect(() => {

      if (competitionid){
        connector.fetchNavigation(competitionid)
            .then(manager => {
                setNav(buildNav(manager));
            })
            .catch(err => console.error(err));
      }
    }, [competitionid, connector]);

    useEffect(() => {
      if (nav){
        setOpenGroups(new Set(nav.groups.map(g => g.group)));
      }
    }, [nav]);

    const filtered = useMemo(() => {
      if (!query || !nav) {
        return nav;
      } else {
        return nav.filter(query);
      }
    }, [nav, query]);
  
    const toggleGroup = (group) => {
      const copy = new Set(openGroups);
      if (copy.has(group)) copy.delete(group); else copy.add(group);
      setOpenGroups(copy);
    }
  
    const itemComponent = (items) => {
      return (
          <ul className="sidebar-items">
            {items.map(item => (
              <li key={item.id}>
                <button
                  className={`sidebar-item ${selectedId === item.id ? 'active' : ''}`}
                  onClick={() => onSelect(item)}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        );
    }
  
    const groupComponent = (group) => {
      return (
        <div className="sidebar-group" key={group.id}>
          <button className="sidebar-group-toggle" onClick={() => toggleGroup(group.id)} aria-expanded={openGroups && openGroups.has(group.id)}>
            <span>{group.title}</span>
            <span className="chev">{(openGroups && openGroups.has(group.id)) ? '▾' : '▸'}</span>
          </button>
          {(openGroups && openGroups.has(group.id)) ? itemComponent(group.items) : <div className="sidebar-collapsed-indicator">...</div>}
        </div>
      )
    }
  
    return (
        <aside className="sidebar">
        <div className="sidebar-search">
            <input
            type="search"
            placeholder={helper.translator('search.placeholder') + " ..."}
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search navigation"
            />
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
            {filtered ? filtered.groups.map(group => groupComponent(group)) : ""}
        </nav>
        </aside>
    );

}

/*
 <Sidebar nav={nav} helper={helper} selectedId={selectedItem ? selectedItem.id : ""} onSelect={(id) => {
          // Wrap selection in a transition to avoid replacing the UI with a loading indicator
          // when the next view suspends (e.g. lazy loading or i18n resources).
          startTransition(() => setSelectedItem(nav.find(id)));
          if (!isDesktop) setSidebarOpen(false);
        }} isOpen={sidebarOpen || isDesktop} onClose={() => setSidebarOpen(false)} />
        <main style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
          {selectedItem && selectedItem.component ? (selectedItem.component()) : (
            <div style={{ padding: '1rem', color: '#334155' }}>Select a view from the left navigation.</div>
          )}
        </main>
*/