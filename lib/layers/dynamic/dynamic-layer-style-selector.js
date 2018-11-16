const olStyle = (global.ol ? global.ol.style.Style : require('ol/style/style').default);

import SymbologyFilterEvaluator from './symbology-filter-evaluator';

/**
 * Abstract utility class used by `DynamicLayersRenderManager` to determine a `Style` to apply to a
 * datapoint based on configuration settings and any application-specific parameters.
 */
export default class AbstractDynamicLayerStyleSelector {


  /**
   * Constructor to define internal properties used by this abstract class.
   *
   * {@link #_internalCache} represents a simple internal cache implementation which can be used in
   * many cases. Each member of the cache must be an object that contains the `filter` to evaluate
   * and the corresponding pre-populated `featureStyle`. This cache MUST be pre-populated prior to
   * invoking the {@link #internalStyle()} method.
   *
   * {@link #_defaultFieldName} represents the default field to use when evaluating filters. This
   * value must be populated/assigned before the {@link #identifyStyle()} method is invoked.
   */
  constructor() {

    // A simple internal cache implementation that assumes only a single array of styling options.
    this._internalCache = [];

    // The default field name to use for evaluation by the `identifyStyle` method.
    this._defaultFieldName = null;
  }

  /**
   * Returns the reference to the default, basic internal cache used for lookup of pre-populated
   * feature styles. Concrete implementation classes may want to override this for more complex
   * implementations.
   */
  _getInternalCache() {
    return this._internalCache;
  };

  /**
   * Method invoked by the render manager to identify the style for the specified site.
   */
  identifyStyle(siteDetails) {
    // Concrete implementation required.
  };

};
