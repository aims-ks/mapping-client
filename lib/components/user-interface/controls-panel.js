import ControlButton from './control-button';

const $ = global.$ || global.jQuery || require('jquery');

/**
 * Panel containing control buttons. It can be positioned either left or right.
 */
export default class ControlsPanel {

  /**
   * Constructor
   * @param position
   */
  constructor(position) {
    this._$element = $(`<div class="aims-map-controls-panel ${position}"></div>`);
  }

  /**
   * Add a openlayer control (e.g. zoom buttons)
   * @param olControl
   */
  addOLControl(olControl) {
    this._$element.append(olControl);
  }

  /**
   * Add a custom control button
   * @param button {ControlButton}
   */
  addButton(button) {
    this._$element.append(button.render());
  }

  /**
   * Return the element
   * @returns {*|jQuery|HTMLElement}
   */
  render() {
    return this._$element;
  }
}
