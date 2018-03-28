const $ = global.$ || global.jQuery || require('jquery');

/**
 * Custom map control
 */
export default class ControlButton {

  /**
   * @param className
   * @param title
   * @param icon
   * @param handleClickActivate
   * @param handleClickDeactivate
   */
  constructor(className, title, icon, handleClickActivate, handleClickDeactivate) {
    // create element
    this._$element = $(`<div class="ol-control ${className}"><button type="button" title="${title}"><i class="material-icons">${icon}</i></button></div>`);

    // Register click handler.
    this._$element.click((event) => {

      // remove class active from other buttons
      this._$element.siblings('div.ol-control').each((index, controlButton) => {
        $(controlButton).removeClass('active');
      });

      // is it a button with a active/inactive state or a button only triggering one event
      if (handleClickDeactivate) {
        this._$element.toggleClass('active');
        if (this._$element.hasClass('active')) {
          handleClickActivate(event);
        } else {
          handleClickDeactivate(event);
          this._$element.find('button').blur();
        }
      } else {
        handleClickActivate(event);
      }
    });
  }

  /**
   * Set the button into the deactivated status
   */
  deactivate() {
    this._$element.removeClass('active');
  }

  /**
   * Return the element for rendering
   * @returns {*|jQuery|HTMLElement}
   */
  render() {
    return this._$element;
  }
}
