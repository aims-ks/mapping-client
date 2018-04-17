import loaderIcon from './../../images/loader.svg';
const $ = global.$ || global.jQuery || require('jquery');

/**
 * Element in the list showing the feature information
 */
export default class GetFeatureInfoElement {

  /**
   * Constructor
   * @param layer
   */
  constructor(layer) {
    this._layerId = layer.layerId;

    this._$containerEl = $('<div class="aims-map-get-features-container"></div>');
    this._$collapseButtonEl = $(`<button type="button" class="btn btn-link get-feature-collapse-button" title="Open"><i class="material-icons">keyboard_arrow_down</i>${layer.title}</button>`);

    this._$headerEl = $('<div class="aims-map-get-feature-info-title"></div>');
    this._$headerEl.append(this._$collapseButtonEl);

    this._$contentEl = $('<div class="aims-map-get-feature-info-content loading"></div>');
    this._$contentEl.append(`<img src="${loaderIcon}">`);
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
   * Return the element for rendering
   * @return {*|jQuery|HTMLElement}
   */
  render() {
    this._$collapseButtonEl.click(this._handleCollapseButtonClick.bind(this));
    return this._$containerEl;
  }

  /**
   * Request the information
   * @param url
   */
  sendRequest(url) {
    $.ajax({
      url: url
    }).done((featureContent) => {
      this._$contentEl.removeClass('loading');
      if (featureContent !== '') {
        this._$contentEl.html(featureContent);
      } else {
        this._$contentEl.html('<p>No results</p>');
      }
    });
  }

  /**
   * Show the content
   */
  show() {
    this._$contentEl.show();
    this._$containerEl.addClass('aims-map-get-features-content-open');
    this._$collapseButtonEl.prop('title', 'Close');
    this._$collapseButtonEl.find('i').html('keyboard_arrow_up');
  }

  /**
   * Hide the content
   */
  hide() {
    this._$contentEl.hide();
    this._$containerEl.removeClass('aims-map-get-features-content-open');
    this._$collapseButtonEl.prop('title', 'Open');
    this._$collapseButtonEl.find('i').html('keyboard_arrow_down');
  }

  /**
   * Handle the click on the collapse button
   * @private
   */
  _handleCollapseButtonClick() {
    if (this._$contentEl.is(':visible')) {
      this.hide();
    } else {
      this.show();
    }
  }
}
