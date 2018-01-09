/**
 * Utility class that populates the layer models (`supported`, `available` and `active`) on
 * instantiation, and then makes the models available via getter methods.
 */

import ActiveLayersModelBuilder from './active-layers-model-builder';
import AvailableLayersModelBuilder from './available-layers-model-builder';
import SimpleLayerModel from './simple-layer-model';
import SimpleLayerModelFactory from './simple-layer-model-factory';
import SingleLayerModelFactory from './single-layer-model-factory';

export default class LayerModelsLoader {

  /**
   * Constructor to cache the references and perform the load/population of the models.
   */
  constructor(mapConfig) {

    this._supportedBaseLayersModel = new SimpleLayerModel(mapConfig.supportedLayers.baseLayers);
    this._availableBaseLayersModel = AvailableLayersModelBuilder(
      mapConfig.defaultLayers,
      function (defaultLayer) {
        return defaultLayer.isBaseLayer;
      },
      this._supportedBaseLayersModel
    );
    this._activeBaseLayersModel = ActiveLayersModelBuilder(
      SingleLayerModelFactory,
      this._availableBaseLayersModel
    );

    this._supportedOverlayLayersModel = new SimpleLayerModel(mapConfig.supportedLayers.overlayLayers);
    this._availableOverlayLayersModel = AvailableLayersModelBuilder(
      mapConfig.defaultLayers,
      function (defaultLayer) {
        return !defaultLayer.isBaseLayer;
      },
      this._supportedOverlayLayersModel
    );
    this._activeOverlayLayersModel = ActiveLayersModelBuilder(
      SimpleLayerModelFactory,
      this._availableOverlayLayersModel
    );

  }

  /**
   * Getter method for the `activeBaseLayersModel`.
   */
  getActiveBaseLayersModel() {
    return this._activeBaseLayersModel;
  }

  /**
   * Getter method for the `availableBaseLayersModel`.
   */
  getAvailableBaseLayersModel() {
    return this._availableBaseLayersModel;
  }

  /**
   * Getter method for the `supportedBaseLayersModel`.
   */
  getSupportedBaseLayersModel() {
    return this._supportedBaseLayersModel;
  }

  /**
   * Getter method for the `activeOverlayLayersModel`.
   */
  getActiveOverlayLayersModel() {
    return this._activeOverlayLayersModel;
  }

  /**
   * Getter method for the `availableOverlayLayersModel`.
   */
  getAvailableOverlayLayersModel() {
    return this._availableOverlayLayersModel;
  }

  /**
   * Getter method for the `supportedOverlayLayersModel`.
   */
  getSupportedOverlayLayersModel() {
    return this._supportedOverlayLayersModel;
  }

};
