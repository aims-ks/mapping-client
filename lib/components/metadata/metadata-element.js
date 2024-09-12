import loaderIcon from '../../images/loader.svg';
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

    this._$containerEl.addClass('mapping-client-metadata-container');
    this._$headerEl.addClass('mapping-client-metadata-title');
    this._$contentEl.addClass('mapping-client-metadata-content');

    this._formatter = new WikiFormatter();
  }

  /**
   * Update the content
   * @param layer
   */
  updateContent(layer) {
    if (Object.prototype.hasOwnProperty.call(layer, 'description')) {
      this._$contentEl.removeClass('loading');
      this._$contentEl.html(this._formatter.format(layer.description));
    } else {
      this._$contentEl.addClass('loading');
      this._$contentEl.html(`<img alt="Loading" src="${loaderIcon}">`);
    }
  }

}
