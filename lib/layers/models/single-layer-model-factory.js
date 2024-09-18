/**
 * Factory for instantiating a {@code SingleLayerModel} with the specified default list of layers.
 */
import SingleLayerModel from './SingleLayerModel';

export default function make(defaultLayers) {
  return new SingleLayerModel(defaultLayers);
}
