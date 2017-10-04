/**
 * A View responsible for rendering spatial data via an OpenLayers map instance.
 */

const ol = require('openlayers');

module.exports = class DataLayerView {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param olMap {ol.Map} OpenLayers map object for manipulation.
   * @param dataModel {aims-model.BasicModel} Reference to the Model containing the data to be
   * rendered.
   * @param styleManager {StyleManager} Reference to the Style Manager to be used by this class
   * when styling data rendered on the map.
   */
  constructor(olMap, dataModel, styleManager) {

    // Cache the references.
    this._olMap = olMap;
    this._dataModel = dataModel;
    this._styleManager = styleManager;

    // Data will be displayed via a VectorLayer which is bound to a VectorSource. To render a data
    // point on the map, add it to the VectorSource. To clear the data layer, clear the
    // VectorSource.
    this._vectorSource = new ol.source.Vector({
      // Empty/no data.
    });
    this._vectorLayer = new ol.layer.Vector({
      source: this._vectorSource,
    });
    this._olMap.addLayer(this._vectorLayer);

    // Register for events.
    this._dataModel.on(this._dataModel.EVENT_DATA_CHANGED, this._renderLayer.bind(this));

  };

  /**
   * Specialised getter that exposes the underlying 'VectorLayer'. This is made available for any
   * special post-processing, otherwise should not be updated directly.
   */
  getVectorLayer() {
    return this._vectorLayer;
  }

  /**
   * Private event handler invoked when the underlying data changes.
   */
  _renderLayer() {

    // Clear the existing render.
    this._vectorSource.clear(false);

    // Loop through the data, adding each point with appropriate styling.
    this._dataModel.getData().forEach(function (_dataItem) {
      const _style = this._styleManager.identifyStyle(_dataItem);
      if (_style) {
        const feature = new ol.Feature({
          geometry: new ol.geom.Point([
            _dataItem.longitude,
            _dataItem.latitude
          ])
        });
        feature.setStyle(_style);
        this._vectorSource.addFeature(feature);
      }
    }, this);
  };

}
