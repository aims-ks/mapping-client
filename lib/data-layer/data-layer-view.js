/**
 * A View that renders a data layer on the cached OpenLayers map instance. The Model for this View
 * is abstacted via an Adaptor which is cached on construction.
 */

const ol = require('openlayers');

module.exports = class MapDataLayerView {

  /**
   * Constructor.
   *
   * @param map {ol.Map} OpenLayers map object for manipulation.
   * @param adaptor {MapDataLayerModelAdaptor} Reference to the Model Adaptor containing the data to
   * be rendered.
   * @param styleManager {StyleManager} Reference to the Style Manager to be used by this class
   * when styling data rendered on the map.
   */
  constructor(map, adaptor, styleManager, mapConfig) {

    // Cache the references.
    this._map = map;
    this._adaptor = adaptor;
    this._styleManager = styleManager;
    this._mapConfig = mapConfig;

    // Data will be displayed via a VectorLayer which is bound to a VectorSource. To render a data
    // point on the map, add it to the VectorSource. To clear the data layer, clear the
    // VectorSource.
    this._vectorSource = new ol.source.Vector({
      // Empty/no data.
    });
    this._vectorLayer = new ol.layer.Vector({
      source: this._vectorSource,
    });
    this._map.addLayer(this._vectorLayer);

    // Register for events.
    adaptor.on(adaptor.EVENT_DATA_CHANGED, this.renderLayer.bind(this));

  };

  /**
   * Specialised getter that exposes the underlying 'VectorLayer'. This is made available for any
   * special post-processing, otherwise should not be updated directly.
   */
  getVectorLayer() {
    return this._vectorLayer;
  }

  /**
   * Event handler invoked when either the data in the cached Adaptor changes, or the StyleManager
   * changes.
   */
  renderLayer() {

    // Clear the existing render.
    this._vectorSource.clear(false);

    // Loop through the data, adding each point with appropriate styling.
    this._adaptor.getData().forEach(function (dataItem) {
      const style = this._styleManager.identifyStyle(dataItem);
      if (style) {
        const feature = new ol.Feature({
          geometry: new ol.geom.Point([
            dataItem.longitude,
            dataItem.latitude
          ])
        });
        feature.setStyle(style);
        this._vectorSource.addFeature(feature);
      }
    }, this);
  };

}
