/**
 * Factory for instantiating a {@code SingleLayerModel} with the specified default list of layers.
 */
import SingleLayerModel from './single-layer-model';

export default function make(defaultLayers) {
  return new SingleLayerModel(defaultLayers);
}
