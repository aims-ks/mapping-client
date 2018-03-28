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
    const self = this;

    // create element
    this._$element = $(`<div class="ol-control ${className}"><button type="button" title="${title}"><i class="material-icons">${icon}</i></button></div>`);

    // Register click handler.
    this._$element.click(function() {
      // remove class active from other buttons
      self._$element.siblings('div.ol-control').each((index, controlButton) => {
        $(controlButton).removeClass('active');
      });

      // is it a button with a active/inactive state or a button only triggering one event
      if (handleClickDeactivate) {
        self._$element.toggleClass('active');
        if (self._$element.hasClass('active')) {
          handleClickActivate(self);
        } else {
          handleClickDeactivate(self);
          self._$element.find('button').blur();
        }
      } else {
        handleClickActivate(self);
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
