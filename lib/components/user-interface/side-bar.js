import Tab from './tab';

export default class SideBar {

  constructor(position) {
    this._$elementListItem      = $(`<div class="aims-map-side-bar ${position}"></div>`);
    this._$controlPanel = $(`<div class="aims-map-tab-bar"><ul class="control-tabs"></ul></div>`);
    this._$infoPanel    = $(`<div class="aims-map-info-panel"></div>`);
  }

  render() {
    this._$elementListItem.append(this._$controlPanel);
    this._$elementListItem.append(this._$infoPanel);

    return this._$elementListItem;
  }

  addTab(name, icon, title, contentCallback) {
    const tab = new Tab(name, icon, title, this._$infoPanel, contentCallback);
    this._$controlPanel.find('ul').append(tab.render());
  }
}
