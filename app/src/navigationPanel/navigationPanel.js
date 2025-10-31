// navigationPanel.js
// A registry that allows registering navigation items in any order and attaching components later.

export class NavigationGroup {

  constructor(id, title, order = 0, items = []) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.items = [];
    items.map(i => this.add(i));
  }
  
  add(item){

    if (!(item instanceof NavigationItem || item instanceof NavigationGroup)) {
      throw new Error('Item must be an instance of NavigationItem or NavigationGroup');
    }    
    item.id = this.id + "." + item.id;
    this.items.push(item);
  }

  remove(id){
    this.items = this.items.filter(i => i.id !== id); 
  }

  clear(){
    this.items = [];
  }

}

export class NavigationItem {

  constructor({ id, title, order = 0, component = null }) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.component = component;
  }

}

export class NavigationRegistry {

  constructor(groups = []) {
    this.groups = groups; // preserves insertion order
  }

  add(group){
    if (!(group instanceof NavigationGroup)) {
      throw new Error('Item must be an instance of NavigationGroup');
    }
    const existingGroup = this.groups.findIndex(g => g.id === group.id);
    if (existingGroup !== -1) {
      // merge updates (component can be attached later)
      const existing = this.groups[existingGroup];
      this.groups[existingGroup] = new NavigationGroup(group.id,group.title ?? existing.title,group.order ?? existing.order, group.items ?? existing.items);
    } else {
      this.groups.push(group);
    }
  }

  remove(id){
    this.groups = this.groups.filter(g => g.id !== id); 
  }

  find(id){
    for (const g of this.groups) {
      if (g.id === id) return g;
      const item = g.items.find(i => i.id === id);
      if (item) return item;
    }
    return null;
  }

  filter(txt){
    const lowerTxt = txt.toLowerCase();
    const groups = [];
    for (const g of this.groups) {
      const matchedItems = g.items.filter(i => i.title.toLowerCase().includes(lowerTxt) || i.id.toLowerCase().includes(lowerTxt));
      if (matchedItems.length > 0) {
        const newGroup = new NavigationGroup(g.id, g.title, g.order, matchedItems);
        groups.push(newGroup);
      }
    }
    return new NavigationRegistry(groups);
  }

  clear(){
    this.groups = [];
  }

}
/*
const items = new Map(); // preserves insertion order

export function registerNavItem({ id, title, group = 'Other', order = null, component = null, priority = 100 }) {
  if (!id) throw new Error('registerNavItem requires an id');
  if (items.has(id)) {
    // merge updates (component can be attached later)
    const existing = items.get(id);
    items.set(id, { ...existing, id, title: title ?? existing.title, group: group ?? existing.group, order: order ?? existing.order, component: component ?? existing.component, priority: priority ?? existing.priority });
  } else {
    items.set(id, { id, title, group, order, component, priority });
  }
}

export function setNavComponent(id, component) {
  if (!items.has(id)) throw new Error(`No nav item with id=${id} to attach component`);
  const existing = items.get(id);
  items.set(id, { ...existing, component });
}

export function unregisterNavItem(id) {
  items.delete(id);
}

export function clearNav() {
  items.clear();
}

export function getNav() {
  // Group items by group while preserving insertion order within groups (unless order provided)
  const groupsMap = new Map();

  for (const item of items.values()) {
    const group = item.group || 'Other';
    if (!groupsMap.has(group)) groupsMap.set(group, []);
    groupsMap.get(group).push(item);
  }

  // Convert to array and sort groups by a preferred order, but keep item insertion unless order specified
  const preferredOrder = ['Participants','Stages','Data','Admin','Other'];
  const groupsArray = Array.from(groupsMap.entries()).map(([group, items]) => ({ group, items }));

  groupsArray.sort((a,b) => (preferredOrder.indexOf(a.group) - preferredOrder.indexOf(b.group)));

  // For each group, if items have an explicit order, sort by it, otherwise keep insertion order
  const result = groupsArray.map(g => ({
    group: g.group,
    items: g.items.slice().sort((x,y) => {
      const ox = typeof x.order === 'number' ? x.order : x.priority ?? 100;
      const oy = typeof y.order === 'number' ? y.order : y.priority ?? 100;
      return ox - oy;
    })
  }));

  return result;
}

export function getItem(id) {
  return items.get(id) || null;
}

export function getAllItems() {
  return Array.from(items.values());
}
*/