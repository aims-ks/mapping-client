import loaderIcon from './../../images/loader.svg';
import CollapsibleElement from '../user-interface/collapsible-element';
import WikiFormatter from '../../../external_lib/WikiFormater';

/**
 * Element in the list showing the feature information
 */
export default class MetadataElement extends CollapsibleElement {

  /**
   * Constructor
   * @param layer
   */
  constructor(layer) {
    super(layer);

    this._$containerEl.addClass("aims-map-metadata-container");
    this._$headerEl.addClass("aims-map-metadata-title");
    this._$contentEl.addClass("aims-map-metadata-content");

    this._formatter = new WikiFormatter();
  }

  /**
   * Update the content
   * @param layer
   */
  updateContent(layer) {
    if (layer.hasOwnProperty('description')) {
      this._$contentEl.removeClass('loading');
      this._$contentEl.html(this._formatter.format(layer.description));
    } else {
      this._$contentEl.addClass('loading');
      this._$contentEl.html(`<img src="${loaderIcon}">`);
    }
  }
}
