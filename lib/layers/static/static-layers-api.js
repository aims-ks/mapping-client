/**
 * API for interacting with either Base or Overlay static layers.
 */
export default class StaticLayersAPI {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   */
  constructor(supportedLayersModel, availableLayersModel, activeLayersModel) {

    // Cache the references.
    this._supportedLayersModel = supportedLayersModel;
    this._availableLayersModel = availableLayersModel;
    this._activeLayersModel = activeLayersModel;

  };

  /**
   * Getter method to retrieve a list of supported layers.
   */
  getSupportedLayers() {
    return this._supportedLayersModel.getData();
  }

  /**
   * Getter method to retrieve the list of `Available` layers. `Available` layers are a subset of
   * `Supported` layers.
   */
  getAvailableLayers() {
    return this._availableLayersModel.getData();
  }

  /**
   * Utility method to add a layer to the list of `Available` layers. The layer must already be
   * a `Supported` layer.
   */
  addAvailableLayer(layerId) {
    const _layer = this._supportedLayersModel.findByLayerId(layerId);
    if (_layer) {
      this._availableLayersModel.setLayers(
        this._availableLayersModel.getLayers().concat(_layer)
      );
    }
  }

  /**
   * Utility method to remove a layer from the list of `Available` layers.
   */
  removeAvailableLayer(layerId) {
    this._availableLayersModel.setLayers(
      this._availableLayersModel.getLayers()
        .filter((_layer) => {
          return _layer.layerId !== layerId;
        })
    );
  }

  /**
   * Getter method to retrieve the list of `Active` layers. `Active` layers are a subset of
   * `Available` layers.
   */
  getActiveLayers() {
    return this._activeLayersModel.getData();
  }

  /**
   * Utility method to add a layer to the list of `Active` layers. The layer must already be an
   * `Available` layer.
   * @param layerId
   */
  addActiveLayer(layerId) {
    const _layer = this._availableLayersModel.findByLayerId(layerId);
    if (_layer) {
      this._activeLayersModel.setLayers(
        this._activeLayersModel.getLayers().concat(_layer)
      );
    }
  }

  /**
   * Utility method to remove a layer from the list of `Active` layers.
   */
  removeActiveLayer(layerId) {
    this._activeLayersModel.setLayers(
      this._activeLayersModel.getLayers()
        .filter((_layer) => {
          return _layer.layerId !== layerId;
        })
    );
  }

};
