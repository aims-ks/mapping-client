
export default class SideBar {

  constructor(position) {
    this._$element = $(`<div class="aims-map-side-bar ${position}"></div>`);
    this._$infoPanel = SideBar._buildInfoPanel();
  }

  render() {
    if (this._$infoPanel) {
      this._$element.append(this._$infoPanel);
    }

    this._$element.append(this._$controlsContainer);
    return this._$element;
  }

  displayInInfoPanel(markup) {
    // this._$element.closest('.aims-map-ui-container')
    //   .find('.aims-map-controls-panel .ol-control.active')
    //   .addClass('side-bar-open');
    this._$infoPanel.html(markup);
    this._$element.show();
  }


  static _buildInfoPanel() {
    return $(`<div class="aims-map-info-panel"><div class="controls ol-control ol-unselectable"><button type="button" class="close-legend"><i class="material-icons">clear</i></button></div></div>`);
  }

}
