export class NavigationItem {

  constructor({ id, title, order = 0, component = null }) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.component = component;
  }

}