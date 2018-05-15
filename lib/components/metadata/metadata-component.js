import WikiFormatter from '../../../external_lib/WikiFormater';

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
    this._formatter = new WikiFormatter();

    this._$metadataEl = $('<div class="aims-map-metadata"></div>');

    // Register for notification of changes to the active layers model.
    this._activeLayersModel.on(this._activeLayersModel.EVENT_CHANGED, this._handleOnChange.bind(this));
  }

  /**
   * Return the element for rendering
   * @return {*|jQuery|HTMLElement}
   */
  render() {
    this._$metadataEl.append(this._buildHtml());

    return this._$metadataEl;
  }

  _handleOnChange() {
    // @todo
  }

  /**
   * Build the HTML to display the metadata of all layers
   */
  _buildHtml() {

    let html = '';

    // Loop through the layers to populate the panel.
    this._activeLayersModel.getLayers().reverse().forEach((_layer) => {

      if (_layer.hasOwnProperty('description')) {
        html += `
          <div class="metadata-item">
            <div class="metadata-title">${_layer.title}</div>
            <div class="metadata-image">${this._formatter.format(_layer.description)}</div>
          </div>
        `;
      } else {
        // @todo show spinner because layersInfo request is not finished
      }

    }, this);

    return html;
  }
}
