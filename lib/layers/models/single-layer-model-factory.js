/**
 * Factory for instantiating a {@code SingleLayerModel} with the specified default list of layers.
 */
const SingleLayerModel = require('./single-layer-model');

export function make(defaultLayers) {
  return new SingleLayerModel(defaultLayers);
}
