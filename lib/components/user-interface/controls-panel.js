import Button from './button';

export default class ControlsPanel {

  constructor(position) {
    this._$elementListItem = $(`<div class="aims-map-controls-panel ${position}"></div>`);
  }

  addOLControl(olControl) {
    this._$elementListItem.append(olControl);
  }

  addButton(name, icon, title, handleClick) {
    const button = new Button(name, icon, title, handleClick);
    this._$elementListItem.append(button.render());
  }

  render() {
    return this._$elementListItem;
  }
}
