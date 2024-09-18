import loaderIcon from '../../images/loader.svg';

const $ = (global.$ || global.jQuery ? global.$ || global.jQuery : require('jquery'));

/**
 * Collapsible element in a list
 */
export default class CollapsibleElement {

  /**
   * Constructor
   * @param layer
   */
  constructor(layer) {
    this._layerId = layer.layerId;
    // Only keep state (open/closed) when user actively clicked the collapse button
    this._keepState = false;

    this._$containerEl = $('<div class="mapping-client-collapsible-element-container"></div>');
    this._$collapseButtonEl = $(`<button type="button" class="btn btn-link mapping-client-collapsible-element-collapse-button" title="Open"><i class="material-icons">keyboard_arrow_down</i>${layer.title}</button>`);

    this._$headerEl = $('<div class="mapping-client-collapsible-element-title"></div>');
    this._$headerEl.append(this._$collapseButtonEl);

    this._$contentEl = $('<div class="mapping-client-collapsible-element-content loading"></div>');
    this._$contentEl.append(`<img alt="Loading" src="${loaderIcon}">`);
    this.hide();

    // add all elements to the feature element container
    this._$containerEl.append(this._$headerEl);
    this._$containerEl.append(this._$contentEl);
  }

  /**
   * Return the layer id
   * @return {*}
   */
  get layerId() {
    return this._layerId;
  }

  /**
   * Return keepState
   * @return {boolean}
   */
  get keepState() {
    return this._keepState;
  }

  /**
   * Return the element for rendering
   * @return {*|jQuery|HTMLElement}
   */
  render() {
    if (this._keepState === false) {
      this.hide();
    }
    this._$collapseButtonEl.click(this._handleCollapseButtonClick.bind(this));
    return this._$containerEl;
  }

  /**
   * Show the content
   */
  show() {
    this._$contentEl.show();
    this._$containerEl.addClass('mapping-client-collapsible-element-content-open');
    this._$collapseButtonEl.prop('title', 'Close');
    this._$collapseButtonEl.find('i').html('keyboard_arrow_up');
  }

  /**
   * Hide the content
   */
  hide() {
    this._$contentEl.hide();
    this._$containerEl.removeClass('mapping-client-collapsible-element-content-open');
    this._$collapseButtonEl.prop('title', 'Open');
    this._$collapseButtonEl.find('i').html('keyboard_arrow_down');
  }

  /**
   * Handle the click on the collapse button
   * @private
   */
  _handleCollapseButtonClick() {
    this._keepState = true;
    if (this._$contentEl.is(':visible')) {
      this.hide();
    } else {
      this.show();
    }
  }

}
