import ActionButton from './action-button';

const $ = global.$ || global.jQuery || require('jquery');

const TEMPLATE = `
    <div class="aims-map-row-panel aims-section aims-section-default">
        <div class="aims-section-header">
            <span class="aims-title"></span>
        </div>
        <div class="aims-section-content"></div>
        <div class="aims-actions"><span class="aims-component-actions"></span></div>
    </div>
`;

/**
 * User interface component.
 * This component provides a single row to display simple content.
 */
export default class RowPanel {

  /**
   * Constructor
   */
  constructor(position) {
    this._$element = $(TEMPLATE);
    this._$element.addClass(position);
    this._$header = this._$element.find('.aims-section-header');
    this._$content = this._$element.find('.aims-section-content');
    this._$closeActionButton = new ActionButton(
      'aims-map-row-panel-close',
      'Close',
      'close',
      this.hidePanel.bind(this)
    );
    this._$element.find('.aims-actions').append(this._$closeActionButton.render());
  }

  /**
   * Return the element for rendering
   * @returns {*|jQuery|HTMLElement}
   */
  render() {
    return this._$element;
  }

  /**
   * Show the row panel
   * @param title
   * @param actionButtons
   * @param content
   */
  showPanel(title, actionButtons, content) {
    // clear action buttons and append new ones including close button
    this._$header.find('.aims-actions span.aims-component-actions').contents().detach();
    this._$header.find('.aims-actions span.aims-component-actions').append(actionButtons.map(button => button.render()));

    this._$header.find('.aims-title').html(title);

    this._$content.contents().detach();
    this._$content.append(content);

    this._$element.css('display', 'flex');
  }

  /**
   * Hide the row panel
   */
  hidePanel() {
    if (this._$element.is(':visible')) {
      this._$element.hide();
    }
  }
}
