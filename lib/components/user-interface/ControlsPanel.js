import ControlButton from './ControlButton';

const { EventEmitter } = require('events');
const $ = (global.$ || global.jQuery ? global.$ || global.jQuery : require('jquery'));

/**
 * Panel containing control buttons. It can be positioned either left or right.
 */
export default class ControlsPanel extends EventEmitter {

  /**
   * Constructor
   * @param position
   */
  constructor(position) {
    super();

    this._$element = $(`<div class="mapping-client-controls-panel ${position}"></div>`);

    this._buttons = [];

    // Declare the events that are emitted from this class.
    this.EVENT_ALL_DEACTIVATED = 'aims.map.components.user-interface.controls-panel.allDeactivatedEvent';
  }

  /**
   * Return the buttons assigned to this control panel
   * @return {Array}
   */
  get buttons() {
    return this._buttons;
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
   * @param toggleState
   * @param position
   * @return {ControlButton}
   */
  createButton(className, title, icon, toggleState, position) {
    const button = new ControlButton(
      className,
      title,
      icon,
      toggleState,
    );

    button.on(button.EVENT_ACTIVATED, (activatedButton) => {
      this._buttons.forEach((theButton) => {
        if (theButton !== activatedButton) {
          theButton.deactivate();
        }
      });
    });
    button.on(button.EVENT_DEACTIVATED, () => {
      if (this._buttons.filter((theButton) => theButton.isActive()).length === 0) {
        this.emit(this.EVENT_ALL_DEACTIVATED, this);
      }
    });

    if (position === 'top') {
      this._buttons.unshift(button);
      this._$element.prepend(button.render());
    } else {
      this._buttons.push(button);
      this._$element.append(button.render());
    }

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
