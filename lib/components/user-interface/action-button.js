
/**
 * Action button for side-bar actions
 */
export default class ActionButton {

  /**
   * @param className
   * @param title
   * @param icon
   * @param handleClick
   */
  constructor(className, title, icon, handleClick) {
    const self = this;

    // create element
    this._$element = $(`<button type="button" class="btn btn-link ${className}" title="${title}"><i class="material-icons">${icon}</i></button>`);

    // Register click handler.
    this._$element.click(function() {
      self._$element.toggleClass('active');
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
