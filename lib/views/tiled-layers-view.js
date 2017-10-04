/**
 * An abstract View to render tiled layer(s) referenced in a Model via an OpenLayers map instance.
 */

const ol = require('openlayers');

module.exports = class MapActiveBaseLayersView {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param olMap {ol.Map} OpenLayers map object for manipulation.
   * @param layerModel {SimpleLayerModel} The `Model` that references the layer(s) to render.
   * @param supportedDataSources {Object} Object containing information for accessing supported
   * data sources.
   * @param zIndex {int} An integer that controls the order in which layers are rendered. Suggested
   * values are `-2` for base layers, and `-1` for overlay layers.
   */
  constructor(olMap, layerModel, supportedDataSources, mapConfig, zIndex) {

    // Cache the references.
    this._olMap = olMap;
    this._layerModel = layerModel;
    this._supportedDataSources = supportedDataSources;
    this._mapConfig = mapConfig;
    this._zIndex = zIndex;

    // Register for events.
    this._layerModel.on(this._layerModel.EVENT_CHANGED,this._handleModelChange.bind(this));

    // Declare an internal cache of OpenLayers active layers.
    this._olRenderedLayers = [];

    // Initialise the display.
    this._handleModelChange(this._layerModel);

  };

  /**
   * Internal event handler invoked when the {@link #_layerModel} emits a change event.
   *
   * @param model {Object} Reference to the model that emitted the event.
   */
  _handleModelChange(model) {

    // Remove all previously rendered map layers.
    this._olRenderedLayers.forEach(function(_olLayer) {
      this._olMap.removeLayer(_olLayer);
    }, this);
    this._olRenderedLayers = [];

    // Populate the OpenLayers map object with a new map layer for each specified layer, provided
    // the relevant datasource is available.
    this._layerModel.getLayers().forEach(function(_layer) {
      if (_layer) {
        const _dataSource = this._supportedDataSources[_layer.dataSourceId];
        if (_dataSource) {

          // Build the URL based on whether the web cache is enabled or not.
          const url = (_dataSource.webCacheEnable ? _dataSource.webCacheUrl : _dataSource.serviceUrl);

          // Build the parameters.
          const params = {
            SERVICE: "WMS",
            VERSION: _dataSource.wmsVersion,
            REQUEST: "GetMap",
            LAYERS: _layer.layerName || _layer.layerId,
            QUERY_LAYERS: _layer.layerName,

          };
          // Some WMS server require 1.1.1 parameters even when the layer has been requested as 1.3.0 (and vice versa)
          // so the easiest and more strait forward way to ensure the feature request works is to always add both set
          // of parameters.

          // For version 1.3.0
          const projection = this._mapConfig.projection;
          params.CRS = projection;

          // For version 1.1.1
          params.SRS = projection;

          const _olLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
              url: url,
              params: params
            }),
            zIndex: this._zIndex
          });

          // Add the layer to the map.
          this._olMap.addLayer(_olLayer);

          // Cache the layer.
          this._olRenderedLayers.push(_olLayer);

        }
      }
    }, this);
  }

};
