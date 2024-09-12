import DynamicLayersSlider from './dynamic-layers-slider';
import DynamicLayerRenderer from './dynamic-layer-renderer';

/**
 * API for interacting with dynamic layers.
 */
export default class DynamicLayersAPI {

  /**
   * Constructor to cache the references.
   */
  constructor(olMap) {
    // Cache the references.
    this._olMap = olMap;
  }

  /**
   * Create a dynamic layer renderer attached to the OpenLayers Map object.
   */
  createDynamicLayerRenderer(featureStyler) {
    return new DynamicLayerRenderer(this._olMap, featureStyler);
  }

  /**
   * Create a Slider between two (2) {@link DynamicLayerRenderer}s.
   */
  createSlider($slider, dynamicLayerRenderer1, dynamicLayerRenderer2) {
    return new DynamicLayersSlider(
      this._olMap,
      $slider,
      dynamicLayerRenderer1,
      dynamicLayerRenderer2,
    );
  }

}
