/**
 * Factory for instantiating a {@code SimpleLayerModel} with the specified default list of layers.
 */
const SimpleLayerModel = require('./simple-layer-model');

export function make(defaultLayers) {
  return new SimpleLayerModel(defaultLayers);
}
