/**
 * Component responsible for rendering a legend of dynamic and/or static layers.
 */
export default class LegendComponent {

  /**
   * Constructor to cache the references, instantiate/cache the helpers, and inject itself into the
   * DOM.
   *
   * @param $parent {JQueryObject} A JQuery object representing the parent element into which this
   * component should insert itself.
   */
  constructor($parent) {

    // Caches for registered egendBuilder components.
    this._dynamicLayersLegendBuilders = [];
    this._staticLayersLegendBuilders = [];

    // Insert itself into the DOM at the parent element.
    $parent.append('<div class="aims-map-legend" style="display: none;" />');
    this._$legendEl = $parent.find('.aims-map-legend');
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

    // Determine if the legend is to be displayed or not.
    if ((this._$dynamicLayersLegendEl.children().length > 0) ||
      (this._$staticLayersLegendEl.children().length > 0)) {
      this._$legendEl.css('display', 'block');
    } else {
      this._$legendEl.css('display', 'none');
    }
  }

};
