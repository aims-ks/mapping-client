const $ = global.$ || global.jQuery || require('jquery');
const { EventEmitter } = require('events');

/**
 * Custom map control
 */
export default class ControlButton extends EventEmitter {

  /**
   * @param className
   * @param title
   * @param icon
   * @param toggleState {boolean} Should the state (active/inactive) be toggled?
   */
  constructor(className, title, icon, toggleState) {
    super();

    this._toggleState = toggleState;

    // Declare the events that are emitted from this class.
    this.EVENT_ACTIVATED = 'aims.map.components.user-interface.control-button.activatedEvent';
    this.EVENT_DEACTIVATED = 'aims.map.components.user-interface.control-button.deactivatedEvent';
    this.EVENT_CLICKED = 'aims.map.components.user-interface.control-button.clickedEvent';

    // create element
    this._$element = $(`<div class="ol-control ${className}"><button type="button" title="${title}"><i class="material-icons">${icon}</i></button></div>`);

    // Register click handler.
    this._$element.click(this._handleClick.bind(this));
  }

  /**
   * Is button currently active?
   * @return {*|boolean}
   * @private
   */
  isActive() {
    return this._$element.hasClass('active');
  }

  /**
   * Set the button into the activated status and emit event
   * @param silentMode {boolean} When true no event will be emitted
   */
  activate(silentMode) {
    if (!this.isActive()) {
      this._$element.addClass('active');

      if (!silentMode) {
        this.emit(this.EVENT_ACTIVATED, this);
      }
    }
  }

  /**
   * Set the button into the deactivated status and emit event
   * @param silentMode {boolean} When true no event will be emitted
   */
  deactivate(silentMode) {
    if (this.isActive()) {
      this._$element.removeClass('active');
      this._$element.find('button').blur();

      if (!silentMode) {
        this.emit(this.EVENT_DEACTIVATED, this);
      }
    }
  }

  /**
   * Return the element for rendering
   * @returns {*|jQuery|HTMLElement}
   */
  render() {
    return this._$element;
  }

  /**
   * Perform default button click handling and emit own events
   * @private
   */
  _handleClick() {
    this.emit(this.EVENT_CLICKED, this);

    // is it a button with a active/inactive state or a button only triggering one event
    if (this._toggleState) {
      if (this.isActive()) {
        this.deactivate(false);
      } else {
        this.activate(false);
      }
    }
  }

}
