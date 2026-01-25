
import { NavigationItem } from "./NavigationItem";

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
