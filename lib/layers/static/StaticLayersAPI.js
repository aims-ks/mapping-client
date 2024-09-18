const $ = (global.$ || global.jQuery ? global.$ || global.jQuery : require('jquery'));

/**
 * API for interacting with either Base or Overlay static layers.
 */
export default class StaticLayersAPI {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   */
  constructor(supportedLayersModel, availableLayersModel, activeLayersModel, mapConfig) {

    // Cache the references.
    this._supportedLayersModel = supportedLayersModel;
    this._availableLayersModel = availableLayersModel;
    this._activeLayersModel = activeLayersModel;
    this._mapConfig = mapConfig;
  }

  /**
   * Getter method to retrieve a list of supported layers.
   */
  getSupportedLayers() {
    return this._supportedLayersModel.getLayers();
  }

  /**
   * Set a style for a supported layer
   * @param layerId
   * @param property
   * @param value
   */
  setLayerProperty(layerId, property, value) {
    const layer = this._supportedLayersModel.findByLayerId(layerId);
    if (layer) {
      layer[property] = value;
    }
  }

  /**
   * Getter method to retrieve the list of `Available` layers. `Available` layers are a subset of
   * `Supported` layers.
   */
  getAvailableLayers() {
    return this._availableLayersModel.getLayers();
  }

  /**
   * Utility method to add a layer to the list of `Available` layers. The layer must already be
   * a `Supported` layer.
   */
  addAvailableLayer(layerId) {
    return new Promise((resolve) => {
      const layer = this._supportedLayersModel.findByLayerId(layerId);
      if (layer) {
        this._downloadLayerInformation(layer, (downloadedLayer) => {
          this._availableLayersModel.setLayers(this._availableLayersModel
            .getLayers().concat(downloadedLayer));
          resolve();
        });
      }
    });
  }

  /**
   * Add layer at a certain position (index)
   * @param layerId
   * @param index
   */
  insertAvailableLayer(layerId, index) {
    return new Promise((resolve) => {
      const layer = this._supportedLayersModel.findByLayerId(layerId);
      if (layer) {
        this._downloadLayerInformation(layer, (downloadedLayer) => {
          const layers = this._availableLayersModel.getLayers();
          layers.splice(index, 0, downloadedLayer);
          this._availableLayersModel.setLayers(layers);
          resolve();
        });
      }
    });
  }

  /**
   * Utility method to remove a layer from the list of `Available` layers.
   */
  removeAvailableLayer(layerId) {
    this._availableLayersModel.setLayers(this._availableLayersModel.getLayers()
      .filter((_layer) => _layer.layerId !== layerId));
  }

  /**
   * Getter method to retrieve the list of `Active` layers. `Active` layers are a subset of
   * `Available` layers.
   */
  getActiveLayers() {
    return this._activeLayersModel.getLayers();
  }

  /**
   * Utility method to add a layer to the list of `Active` layers. The layer must already be an
   * `Available` layer.
   * @param layerId
   */
  addActiveLayer(layerId) {
    const layer = this._availableLayersModel.findByLayerId(layerId);
    if (layer) {
      const layers = this._activeLayersModel.getLayers();
      layers.splice(this._availableLayersModel.getIndex(layer), 0, layer);
      this._activeLayersModel.setLayers(layers);
    }
  }

  /**
   * Utility method to remove a layer from the list of `Active` layers.
   */
  removeActiveLayer(layerId) {
    this._activeLayersModel.setLayers(this._activeLayersModel.getLayers()
      .filter((layer) => layer.layerId !== layerId));
  }

  /**
   * Download additional layer information
   * @param originalLayer
   * @param callback
   * @private
   */
  _downloadLayerInformation(originalLayer, callback) {
    const layer = { ...originalLayer };

    // Download the layer info.
    $.ajax({
      url: `//${this._mapConfig.host}/${this._mapConfig.layerInfoServiceUrl}?client=${this._mapConfig.clientId}&layerIds=${layer.layerId}`,
    }).done((data) => {
      const cachedLayer = data.data[layer.layerId];
      if (cachedLayer) {
        // Set TIME variable if it exists in options and is not already set from layer configuration
        if (Object.prototype.hasOwnProperty.call(cachedLayer, 'options') && !Object.prototype.hasOwnProperty.call(layer, 'time')) {
          const timeItem = cachedLayer.options.find((item) => item.name === 'TIME');
          if (timeItem) {
            layer.time = timeItem.defaultValue;
          }
        }

        Object.keys(cachedLayer).forEach((key) => {
          layer[key] = cachedLayer[key];
        });

        if (Object.prototype.hasOwnProperty.call(layer, 'hasLegend')) {
          layer.hasLegend = !(layer.hasLegend === 'false' || layer.hasLegend === false);
        } else {
          layer.hasLegend = true;
        }

        callback(layer);
      }
    });
  }

}
