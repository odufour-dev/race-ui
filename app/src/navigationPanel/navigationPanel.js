// navigationPanel.js
// A registry that allows registering navigation items in any order and attaching components later.

export class NavigationGroup {

  constructor({id, title, order = 0, items = []}) {
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
    return new NavigationRegistry(this.groups);
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
        const newGroup = new NavigationGroup({id: g.id, title: g.title, order: g.order, items: matchedItems});
        groups.push(newGroup);
      }
    }console.log(groups);
    return new NavigationRegistry(groups);
  }

  clear(){
    this.groups = [];
  }

}
