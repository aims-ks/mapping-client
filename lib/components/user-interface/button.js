
/**
 * Custom map control
 */
export default class Button {

  /**
   * @param name
   * @param title
   * @param icon
   * @param handleClick
   */
  constructor(name, title, icon, handleClick) {
    const self = this;

    // create element
    this._$elementListItem = $(`<div class="ol-control ${name}"><button type="button" title="${title}"><i class="material-icons">${icon}</i></button></div>`);

    // Register click handler.
    this._$elementListItem.click(function() {
      self._$elementListItem.addClass('active');
      handleClick(self);
    });

  };

  render() {
    return this._$elementListItem;
  }
}
