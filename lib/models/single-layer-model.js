/**
 * Extends {@link SimpleLayerModel} to ensure only a single layer is cached.
 */

import SimpleLayerModel from './simple-layer-model';

module.exports = class SingleLayerModel extends SimpleLayerModel {

  /**
   * Constructor.
   */
  constructor(defaultList) {
    super(defaultList);
  }

  /**
   * Getter method for the {@link #_intenalCache} property. Return only the first item in the cache
   * if more than one found.
   */
  getLayers() {
    return (this._internalCache.length > 0 ? [this._internalCache[0]] : []);
  }

  /**
   * Setter method for the {@link #_internalCache} property. If an array is specified, cache only
   * the first member. If an object is specified, wrap it as an array.
   */
  setLayers(layers) {
    super.setLayers([(layers.length > 0 ? layers[0] : layers)]);
  }

};
