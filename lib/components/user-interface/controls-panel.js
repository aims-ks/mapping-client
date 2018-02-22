import Button from './button';

export default class ControlsPanel {

  constructor(position) {
    this._$element = $(`<div class="aims-map-controls-panel ${position}"></div>`);
  }

  addOLControl(olControl) {
    this._$element.append(olControl);
  }

  addButton(name, icon, title, handleClick) {
    const button = new Button(name, icon, title, handleClick);
    this._$element.append(button.render());
  }

  render() {
    return this._$element;
  }
}
