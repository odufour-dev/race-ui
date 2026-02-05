
import React, { useState, useMemo, useCallback, useEffect } from 'react';

import './NavigationMenu.css';

export function NavigationMenu( {helper, connector, competitionid, onSelect}){

    const buildNav = useCallback((model) => {

      return [
        {id: "configuration", title: helper.translator("navigation.configuration"), items: [
          {id: "event-settings",  title: helper.translator("navigation.configuration")},
          {id: "registration",    title: helper.translator("navigation.registration")},  
        ]},
        {id: "stages", title: helper.translator("navigation.stages"), items: model.stages.map((stage) => ({
            id: "stage-" + stage.id, title: stage.name, items: [
              {id: "config-"  + stage.number, title: helper.translator("navigation.stageconfig")},
              {id: "ranking-" + stage.number, title: helper.translator("navigation.stageranking")},
              {id: "general-" + stage.number, title: helper.translator("navigation.stagegeneral")},
            ]
          }))
        }];
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
        setOpenGroups(new Set(nav.map(g => g.group)));
      }
    }, [nav]);

    const filterHierarchy = (data,query) => {
      const filtereddata = [];
      (data || []).map((item) => {
        if (item.title.toLowerCase().includes(query.toLowerCase())){
          filtereddata.push(item);
        } else if (("items" in item)){
          const children = filterHierarchy(item.items,query);
          if (children.length > 0){
            filtereddata.push({...item, items: children});
          }
        }
      }); 
      return filtereddata;
    }

    const filtered = useMemo(() => (query && query !== "" && nav ? filterHierarchy(nav,query) : nav), [nav, query]);
  
    const toggleGroup = (group) => {
      const copy = new Set(openGroups);
      if (copy.has(group)) copy.delete(group); else copy.add(group);
      setOpenGroups(copy);
    }

    const createComponent = (element) => {
      if ("items" in element){ // Group
        return (
          <div className="sidebar-group" key={element.id}>
            <button className="sidebar-group-toggle" onClick={() => toggleGroup(element.id)} aria-expanded={openGroups && openGroups.has(element.id)}>
              <span>{element.title}</span>
              <span className="chev">{(openGroups && openGroups.has(element.id)) ? '▾' : '▸'}</span>
            </button>
            {(openGroups && openGroups.has(element.id)) ? element.items.map((i) => createComponent(i)) : <div className="sidebar-collapsed-indicator">...</div>}
          </div>
        )
      } else { // Item
        return (
          <li key={element.id}>
            <button
              className={`sidebar-item ${selectedId === element.id ? 'active' : ''}`}
              onClick={() => onSelect(element.id)}
            >
              {element.title}
            </button>
          </li>
        )
      }
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
            {filtered ? filtered.map(element => createComponent(element)) : ""}
        </nav>
        </aside>
    );

}
