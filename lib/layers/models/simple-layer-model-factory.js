/**
 * Factory for instantiating a {@code SimpleLayerModel} with the specified default list of layers.
 */
import SimpleLayerModel from './SimpleLayerModel';

export default function make(defaultLayers) {
  return new SimpleLayerModel(defaultLayers);
}
