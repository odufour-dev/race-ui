import React, { useState, useMemo } from 'react';
import './Sidebar.css';

function Sidebar({ nav, selectedId, onSelect, translator }) {
console.log(nav);
  const [query, setQuery] = useState('');
  const [openGroups, setOpenGroups] = useState(() => new Set(nav.groups.map(g => g.group)));

  const filtered = useMemo(() => {
    if (!query) {
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
                onClick={() => onSelect(item.id)}
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
        <button className="sidebar-group-toggle" onClick={() => toggleGroup(group.id)} aria-expanded={openGroups.has(group.id)}>
          <span>{group.title}</span>
          <span className="chev">{openGroups.has(group.id) ? '▾' : '▸'}</span>
        </button>
        {openGroups.has(group.id) ? itemComponent(group.items) : <div className="sidebar-collapsed-indicator">...</div>}
      </div>
    )
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-search">
        <input
          type="search"
          placeholder={translator('search.placeholder') + " ..."}
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search navigation"
        />
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {filtered.groups.map(group => groupComponent(group))}
      </nav>
    </aside>
  );
}

export default Sidebar;
