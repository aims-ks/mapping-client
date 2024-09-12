/**
 * A co-ordinating component that has overall responsibility for monitoring a
 * {@code StaticLayersModel} (a model which contains the definitions of all static layers to be
 * rendered), and the rendering/destruction of the corresponding {@code layers} via an OpenLayers
 * map. Note that a single OpenLayers Map can have multiple StaticLayersRenderManager components
 * operating on it.
 */

import WMSLayerFactory from './wms-layer-factory';

export default class StaticLayersRenderManager {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param olMap {ol.Map} OpenLayers map object for manipulation.
   * @param layerModel {SimpleLayerModel} The `Model` that references the layer(s) to render.
   * @param mapConfig {Object} Configuration object.
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
    this._layerModel.on(this._layerModel.EVENT_CHANGED, this._handleModelChange.bind(this));

    // Declare an internal cache binding each OpenLayers active layer to it's layerId.
    this._olRenderedLayers = {};

    // Initialise the display.
    this._handleModelChange();
  }

  /**
   * Internal event handler invoked when the {@link #_layerModel} emits a change event.
   */
  _handleModelChange() {
    // Remove all previously rendered layers from the map. This does NOTHING to the layers.
    Object.keys(this._olRenderedLayers).forEach((key) => {
      const olLayer = this._olRenderedLayers[key];
      this._olMap.removeLayer(olLayer);

      // remove reference between ol-layer and aims layer
      olLayer.olRenderedLayer = null;
    }, this);

    // Loop through the model, either using the existing OpenLayers layer or rendering a new one.
    const tempLayerList = {};
    this._layerModel.getLayers().forEach((layer) => {
      // Has the layers already been rendered?
      const olRenderedLayer = this._olRenderedLayers[layer.layerId];
      if (olRenderedLayer) {
        olRenderedLayer.setOpacity(layer.opacity);
        if (layer.time) {
          olRenderedLayer.getSource().updateParams({ TIME: layer.time });
        }

        // Layer has been previously rendered, so use it.
        tempLayerList[layer.layerId] = olRenderedLayer;

      } else {

        // Not already rendered, so render a new layer.
        const dataSource = this._supportedDataSources[layer.dataSourceId];
        if (dataSource) {

          // Render the layer.
          let olLayer = null;
          switch (dataSource.layerType.toUpperCase()) {

            case 'WMS':
              olLayer = WMSLayerFactory(
                layer,
                dataSource,
                this._olMap.getView().getProjection().getCode(),
                this._zIndex,
              );
              break;
          }

          // Cache the layer and set reference between ol-layer and aims layer
          if (olLayer) {
            tempLayerList[layer.layerId] = olLayer;
            layer.olRenderedLayer = olLayer;
          }

        }

      }
    }, this);

    // Add each of the layers to the map.
    Object.keys(tempLayerList).forEach((key) => {
      const olLayer = tempLayerList[key];
      this._olMap.addLayer(olLayer);
    });

    this._olRenderedLayers = tempLayerList;
  }

}
