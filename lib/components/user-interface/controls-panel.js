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
   * Create a custom control button and add it to the panel
   * @param className
   * @param title
   * @param icon
   * @param handleClickActivate
   * @param handleClickDeactivate
   * @return {ControlButton}
   */
  createButton(className, title, icon, handleClickActivate, handleClickDeactivate) {
    const button = new ControlButton(
      className,
      title,
      icon,
      handleClickActivate,
      handleClickDeactivate
    );

    this._$element.append(button.render());
    return button;
  }

  /**
   * Return the element
   * @returns {*|jQuery|HTMLElement}
   */
  render() {
    return this._$element;
  }
}
