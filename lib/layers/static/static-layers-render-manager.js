/**
 * A co-ordinating component that has overall responsibility for monitoring a
 * {@code StaticLayersModel} (a model which contains the definitions of all static layers to be
 * rendered), and the rendering/destruction of the corresponding {@code layers} via an OpenLayers
 * map. Note that a single OpenLayers Map can have multiple StaticLayersRenderManager components
 * operating on it.
 */

const WMSLayerFactory = require('./wms-layer-factory');

module.exports = class StaticLayersRenderManager {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param olMap {ol.Map} OpenLayers map object for manipulation.
   * @param layerModel {SimpleLayerModel} The `Model` that references the layer(s) to render.
   * @param _mapConfig {Object} Configuration object.
   * @param zIndex {int} An integer that controls the order
   */
  constructor(olMap, layerModel, mapConfig, zIndex) {

    // Cache the references.
    this._olMap = olMap;
    this._layerModel = layerModel;
    this._mapConfig = mapConfig;
    this._supportedDataSources = this._mapConfig.dataSources;
    this._zIndex = zIndex;

    // Register for events.
    this._layerModel.on(this._layerModel.EVENT_CHANGED,this._handleModelChange.bind(this));

    // Declare an internal cache binding each OpenLayers active layer to it's layerId.
    this._olRenderedLayers = {};

    // Initialise the display.
    this._handleModelChange(this._layerModel);

  };

  /**
   * Internal event handler invoked when the {@link #_layerModel} emits a change event.
   *
   * @param model {Object} Reference to the model that emitted the event.
   */
  _handleModelChange(model) {

    // Remove all previously rendered layers from the map. This does NOTHING to the layers.
    Object.keys(this._olRenderedLayers).forEach((_key) => {
      const _olLayer = this._olRenderedLayers[_key];
      this._olMap.removeLayer(_olLayer);
    }, this);

    // Loop through the model, either using the existing OpenLayers layer or rendering a new one.
    let _tempLayerList = {};
    this._layerModel.getLayers().forEach((_layer) => {

      // Has the layers already been rendered?
      const _olRenderedLayer = this._olRenderedLayers[_layer.layerId];
      if (_olRenderedLayer) {

        // Layer has been previously rendered, so use it.
        _tempLayerList[_layer.layerId] = _olRenderedLayer;

      } else {

        // Not already rendered, so render a new layer.
        const _dataSource = this._supportedDataSources[_layer.dataSourceId];
        if (_dataSource) {

          // Render the layer.
          let _olLayer = undefined;
          switch (_dataSource.layerType.toUpperCase()) {

            case 'WMS':
              _olLayer = WMSLayerFactory.make(
                _layer,
                _dataSource,
                this._mapConfig.projection,
                this._zIndex
              );
              break;
          }

          // Cache the layer.
          if (_olLayer) {
            _tempLayerList[_layer.layerId] = _olLayer;
          }

        }

      }
    }, this);

    // Add each of the layers to the map.
    Object.keys(_tempLayerList).forEach((_key) => {
      const _olLayer = _tempLayerList[_key];
      this._olMap.addLayer(_olLayer);
    });

    this._olRenderedLayers = _tempLayerList;
  }

};
