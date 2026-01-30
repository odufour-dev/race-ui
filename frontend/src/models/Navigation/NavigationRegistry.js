import { NavigationGroup } from "./NavigationGroup";

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
      } else if (g.title.toLowerCase().includes(lowerTxt) || g.id.toLowerCase().includes(lowerTxt)) {
        groups.push(g);
      }
    }
    return new NavigationRegistry(groups);
  }

  clear(){
    this.groups = [];
  }

}