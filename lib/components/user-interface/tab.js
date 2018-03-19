
/**
 * Tab control
 */
export default class Tab {

  /**
   * @param name
   * @param title
   * @param icon
   * @param $target
   * @param contentHandler
   */
  constructor(name, title, icon, $target, contentHandler) {
    // create element
    this._$elementLink = $(`<a href="#${name}"></a>`);
    this._$elementLink.append(`<i class="material-icons">${icon}</i>${title}`);
    this._$elementListItem = $('<li class="control-tab"></li>');
    this._$elementListItem.append(this._$elementLink);

    this._$elementLink.on('click', (event) => {
      this._$elementListItem.closest('ul')
        .children('li')
        .removeClass('active');

      let content = contentHandler(event);
      $target.html(content);
    });

  };

  render() {
    return this._$elementListItem;
  }
}
