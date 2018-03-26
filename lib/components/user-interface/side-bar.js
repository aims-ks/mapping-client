const TEMPLATE = `
    <div class="aims-map-side-bar aims-section aims-section-default" style="display: none;">
        <div class="aims-section-header">
            <span class="aims-title"></span>
            <div class="aims-actions"></div>
        </div>
        <div class="aims-section-content"></div>
    </div>
`;

/**
 * A side bar ui component which can either be shown on the left or right
 */
export default class SideBar {

  /**
   * Constructor
   * @param position
   */
  constructor(position) {
    this._$element = $(TEMPLATE);
    this._$element.addClass(position);
    this._$header = this._$element.find('.aims-section-header');
    this._$content = this._$element.find('.aims-section-content');
  }

  /**
   * Return the element for rendering
   * @returns {*|jQuery|HTMLElement}
   */
  render() {
    if (this._$infoPanel) {
      this._$element.append(this._$infoPanel);
    }

    this._$element.append(this._$controlsContainer);
    return this._$element;
  }

  /**
   * Show the side bar
   * @param title
   * @param actionButtons
   * @param content
   */
  showPanel(title, actionButtons, content) {
    this._$header.find('.aims-title').html(title);
    this._$header.find('.aims-actions').append(actionButtons.map(button => button.render()));
    this._$content.html(content);
    this._$element.show();
  }

}
