
/**
 * Custom map control
 */
export default class ControlButton {

  /**
   * @param className
   * @param title
   * @param icon
   * @param handleClick
   */
  constructor(className, title, icon, handleClick) {
    const self = this;

    // create element
    this._$element = $(`<div class="ol-control ${className}"><button type="button" title="${title}"><i class="material-icons">${icon}</i></button></div>`);

    // Register click handler.
    this._$element.click(function() {
      self._$element.addClass('active');
      handleClick(self);
    });

  };

  /**
   * Return the element
   * @returns {*|jQuery|HTMLElement}
   */
  render() {
    return this._$element;
  }
}
