/**
 * Extends {@link SimpleLayerModel} to ensure the internal list contains only a single layer at any
 * time.
 */

import SimpleLayerModel from './SimpleLayerModel';

export default class SingleLayerModel extends SimpleLayerModel {

  /**
   * Getter method for the {@link #_intenalCache} property. If the internal list contains more than
   * one layer, the internal list is truncated before the super method is invoked.
   */
  getLayers() {
    if (this._internalCache.length > 0) {
      this._internalCache.splice(1);
    }
    return super.getLayers();
  }

  /**
   * Setter method for the {@link #_internalCache} property. If an array is specified, cache only
   * the last member. If an object is specified, wrap it as an array.
   */
  setLayers(layers) {
    super.setLayers([(layers.length > 0 ? layers[layers.length - 1] : layers)]);
  }

}
