/**
 * A View that renders the 'active' base layer from the model (@see MapBaseLayersModel) on the
 * cached OpenLayers map instance.
 */

const ol = require('openlayers');

module.exports = class MapActiveBaseLayerView {

  /**
   * Constructor.
   *
   * @param map {ol.Map} OpenLayers map object for manipulation.
   * @param mapBaseLayersModel {MapBaseLayersModel} Reference to the model containing the available
   * base layers and the 'active' base layer to render.
   */
  constructor(map, mapBaseLayersModel, mapConfig) {

    // Cache the references.
    this._map = map;
    this._mapBaseLayersModel = mapBaseLayersModel;
    this._mapConfig = mapConfig;

    // Define a property to cache the current active OpenLayers layer so it can be removed from the
    // map when the active base layer changes.
    this._currentActiveLayer = null;

    // Register for events.
    mapBaseLayersModel.on(this._mapBaseLayersModel.EVENT_ACTIVE_LAYER_CHANGED, this.handleActiveLayerChange.bind(this));
  };

  /**
   * Event handler invoked when the 'active' layer is changed.
   *
   * @param layer {Object} JSON object describing the new 'active' layer.
   */
  handleActiveLayerChange(layer) {

    // Remove the current active layer.
    if (this._currentActiveLayer) {
      this._map.removeLayer(this._currentActiveLayer);
      this._currentActiveLayer = null;
    }

    // Create the new active layer if datasource information is contained in the map config.
    const dataSource = this._mapConfig.dataSources[layer.dataSourceId];
    if (dataSource) {
      const url = (dataSource.webCacheEnabled ? dataSource.webCacheUrl : dataSource.serviceUrl);
      this._currentActiveLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: url,
          params: {
            LAYERS: layer.layerName
          }
        })
      });

      // Add the layer to the map.
      this._map.addLayer(this._currentActiveLayer);

    }
  }

};
