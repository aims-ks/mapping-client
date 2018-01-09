/**
 * Factory for instantiating a {@code SimpleLayerModel} with the specified default list of layers.
 */
import SimpleLayerModel from './simple-layer-model';

export default function make(defaultLayers) {
  return new SimpleLayerModel(defaultLayers);
}
