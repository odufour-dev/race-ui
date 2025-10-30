import React, { useState, useMemo } from 'react';
import './Sidebar.css';

function Sidebar({ nav, selectedId, onSelect }) {
  const [query, setQuery] = useState('');
  const [openGroups, setOpenGroups] = useState(() => new Set(nav.map(g => g.group)));

  const filtered = useMemo(() => {
    if (!query) return nav;
    const q = query.toLowerCase();
    return nav
      .map(g => ({
        group: g.group,
        items: g.items.filter(i => i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
      }))
      .filter(g => g.items.length > 0);
  }, [nav, query]);

  const toggleGroup = (group) => {
    const copy = new Set(openGroups);
    if (copy.has(group)) copy.delete(group); else copy.add(group);
    setOpenGroups(copy);
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-search">
        <input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search navigation"
        />
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {filtered.map(group => (
          <div className="sidebar-group" key={group.group}>
            <button className="sidebar-group-toggle" onClick={() => toggleGroup(group.group)} aria-expanded={openGroups.has(group.group)}>
              <span>{group.group}</span>
              <span className="chev">{openGroups.has(group.group) ? '▾' : '▸'}</span>
            </button>
            {openGroups.has(group.group) && (
              <ul className="sidebar-items">
                {group.items.map(item => (
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
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
