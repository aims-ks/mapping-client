const $ = global.$ || global.jQuery || require('jquery');

/**
 * Component responsible for rendering a legend of dynamic and/or static layers.
 */
export default class LegendComponent {

  /**
   * Constructor to cache the references, instantiate/cache the helpers, and inject itself into the
   * DOM.
   */
  constructor() {
    // Caches for registered egendBuilder components.
    this._dynamicLayersLegendBuilders = [];
    this._staticLayersLegendBuilders = [];

    this._$legendEl = $('<div class="aims-map-legend" />');

    this._$legendEl.append('<div class="dynamic-layers-legend" />');
    this._$dynamicLayersLegendEl = this._$legendEl.find('.dynamic-layers-legend');
    this._$legendEl.append('<div class="static-layers-legend" />');
    this._$staticLayersLegendEl = this._$legendEl.find('.static-layers-legend');
  };

  /**
   * Register the Dynamic Layers Legend Builder.
   */
  registerDynamicLayersLegendBuilder(builder) {
    builder.registerOnChangeListener(this._render.bind(this));
    this._dynamicLayersLegendBuilders.push(builder);
    this._render();
  }

  /**
   * Register the Static Layers Legend Builder.
   */
  registerStaticLayersLegendBuilder(builder) {
    builder.registerOnChangeListener(this._render.bind(this));
    this._staticLayersLegendBuilders.push(builder);
    this._render();
  }

  /**
   * Return the element for rendering
   * @return {*|jQuery|HTMLElement}
   */
  render() {
    return this._$legendEl;
  }

  /**
   * (Re-)render the legend on the Map.
   */
  _render() {
    // Dynamic layers.
    this._$dynamicLayersLegendEl.empty();
    let dynamicHtml = '';
    this._dynamicLayersLegendBuilders.forEach((builder) => {
      dynamicHtml += builder.buildHtml();
    });
    this._$dynamicLayersLegendEl.append(dynamicHtml);

    // Static layers.
    this._$staticLayersLegendEl.empty();
    let staticHtml = '';
    this._staticLayersLegendBuilders.forEach((builder) => {
      staticHtml += builder.buildHtml();
    });
    this._$staticLayersLegendEl.append(staticHtml);
  }
};
