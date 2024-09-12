import ActionButton from './action-button';

const { EventEmitter } = require('events');
const $ = global.$ || global.jQuery || require('jquery');

const TEMPLATE = `
    <div class="mapping-client-row-panel aims-section aims-section-default">
        <div class="aims-section-header">
            <h6 class="aims-title"></h6>
        </div>
        <div class="aims-section-content"></div>
        <div class="aims-actions"><span class="aims-component-actions"></span></div>
    </div>
`;

/**
 * User interface component.
 * This component provides a single row to display simple content.
 */
export default class RowPanel extends EventEmitter {

  /**
   * Constructor
   */
  constructor(position) {
    super();

    this._$element = $(TEMPLATE);
    this._$element.addClass(position);
    this._$header = this._$element.find('.aims-section-header');
    this._$content = this._$element.find('.aims-section-content');
    this._$closeActionButton = new ActionButton(
      'mapping-client-row-panel-close',
      'Close',
      'close',
      this.hidePanel.bind(this),
    );
    this._$element.find('.aims-actions').append(this._$closeActionButton.render());

    // Declare the events that are emitted from this class.
    this.EVENT_CLOSED = 'aims.map.components.user-interface.row-panel.closedEvent';
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
    this._$header.find('.aims-actions span.aims-component-actions').append(actionButtons.map((button) => button.render()));

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
      this.emit(this.EVENT_CLOSED, this);
    }
  }

}
