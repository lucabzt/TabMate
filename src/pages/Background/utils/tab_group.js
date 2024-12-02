class TabGroup {
  constructor(name, tabs) {
    this.name = name;
    this.tab_ids = tabs;
  }

  addTab(tab_id) {
    this.tab_ids.push(tab_id);
  }
}

export default TabGroup;