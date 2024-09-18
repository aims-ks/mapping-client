const $ = (global.$ || global.jQuery ? global.$ || global.jQuery : require('jquery'));

/**
 * Action button for side-bar actions
 */
export default class ActionButton {

  /**
   * Constructor
   * @param className
   * @param title
   * @param icon
   * @param handleClick
   */
  constructor(className, title, icon, handleClick) {
    this._className = className;
    this._title = title;
    this._icon = icon;
    this._handleClick = handleClick;
  }

  /**
   * Create and return the element
   * @returns {*|jQuery|HTMLElement}
   */
  render() {
    // create element
    const $element = $(`<button type="button" class="btn btn-link ${this._className}" title="${this._title}"><i class="material-icons">${this._icon}</i></button>`);

    // Register click handler.
    $element.click(() => {
      $element.toggleClass('active');
      this._handleClick(this);
    });

    return $element;
  }

}
