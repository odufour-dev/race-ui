// navConfig.js
// Helper to build a navigation config from the existing tabs array.

export function buildNavFromTabs(tabs) {
  // Convert incoming tabs to a nav structure grouped by logical category
  const items = tabs.map(tab => {
    let group = 'Other';
    if (tab.name === 'registration') group = 'Participants';
    else if (tab.name === 'import') group = 'Data';
    else if (tab.name === 'configuration') group = 'Admin';
    else if (tab.name && tab.name.startsWith('stage')) group = 'Stages';
    return {
      id: tab.name,
      title: tab.label || tab.name,
      group,
      component: tab.component || null,
      order: tab.order ?? 100,
    };
  });

  // Group and sort
  const groups = {};
  items.forEach(it => {
    groups[it.group] = groups[it.group] || [];
    groups[it.group].push(it);
  });

  const nav = Object.keys(groups).map(groupName => ({
    group: groupName,
    items: groups[groupName].sort((a,b) => (a.order || 0) - (b.order || 0))
  }));

  // Keep consistent ordering for groups
  const preferredOrder = ['Participants','Stages','Data','Admin','Other'];
  nav.sort((a,b) => (preferredOrder.indexOf(a.group) - preferredOrder.indexOf(b.group)));

  return nav;
}
