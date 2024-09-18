import CollapsibleElement from '../user-interface/collapsible-element';

const $ = (global.$ || global.jQuery ? global.$ || global.jQuery : require('jquery'));

/**
 * Element in the list showing the feature information
 */
export default class GetFeatureInfoElement extends CollapsibleElement {

  /**
   * Constructor
   * @param layer
   */
  constructor(layer) {
    super(layer);

    this._$containerEl.addClass('mapping-client-get-features-container');
    this._$headerEl.addClass('mapping-client-get-feature-info-title');
    this._$contentEl.addClass('mapping-client-get-feature-info-content');
  }

  /**
   * Request the information
   * @param url
   */
  sendRequest(url) {
    $.ajax({
      url,
    }).done((featureContent) => {
      this._$contentEl.removeClass('loading');
      if (featureContent !== '') {
        this._$contentEl.html(featureContent);
      } else {
        this._$contentEl.html('<p>No results</p>');
      }
    });
  }

}
