import MetadataElement from './metadata-element';

const $ = global.$ || global.jQuery || require('jquery');

/**
 * Component responsible for showing the metadata for the active layers
 */
export default class Metadata {

  /**
   * Constructor
   * @param activeLayersModel
   */
  constructor(activeLayersModel) {
    this._activeLayersModel = activeLayersModel;
    this._elementList = [];
    this._$metadataEl = $('<div class="aims-map-metadata"></div>');

    // Register for notification of changes to the active layers model.
    this._activeLayersModel.on(this._activeLayersModel.EVENT_CHANGED, this._handleOnChange.bind(this));
  }

  /**
   * Return the element for rendering
   * @return {*|jQuery|HTMLElement}
   */
  render() {
    this._buildHtml();
    return this._$metadataEl;
  }

  _handleOnChange() {
    this._buildHtml();
  }

  /**
   * Build the HTML to display the metadata of all layers
   */
  _buildHtml() {
    this._$metadataEl.empty();

    let firstMetadataElement = null;
    // Loop through the layers to populate the panel.
    this._activeLayersModel.getLayers().reverse().forEach((_layer) => {

      let metadataElement = this._elementList.find(element => element.layerId === _layer.layerId);
      if (metadataElement === undefined) {
        metadataElement = new MetadataElement(_layer);
        this._elementList.push(metadataElement);
      } else {
        metadataElement.updateContent(_layer);
      }

      if (firstMetadataElement === null) {
        firstMetadataElement = metadataElement;
      }
      this._$metadataEl.append(metadataElement.render());
    }, this);

    if (firstMetadataElement === null) {
      this._$metadataEl.html('<p>No results</p>');
    }
    // show first feature info element when all are closed
    else if (this._$metadataEl.find('.aims-map-collapsible-element-content-open').length === 0 && firstMetadataElement.keepState === false) {
      firstMetadataElement.show();
    }
  }
}
