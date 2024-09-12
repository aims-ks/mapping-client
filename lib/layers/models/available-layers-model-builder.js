/**
 * Builder that returns a populated {@code AvailableLayersModel}. The underlying model is a
 * {@code SimpleLayerModel} which is populated with a subset of layers from the specified
 * {@code SupportsLayersModel}. The subset of layers is defined by {@code MapConfig.defaultLayers}.
 */

import SimpleLayerModel from './simple-layer-model';

export default function make(defaultLayers, filterFunc, supportedLayersModel) {
  const list = [];

  defaultLayers.forEach((defaultLayer) => {
    if (filterFunc(defaultLayer)) {
      list.push(supportedLayersModel.findByLayerId(defaultLayer.layerId));
    }
  });

  return new SimpleLayerModel(list);
}
