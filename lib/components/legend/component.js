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
  constructor($root) {
    let that = this;
    this._$parent = $root.find('.ol-viewport');

    // Caches for registered egendBuilder components.
    this._dynamicLayersLegendBuilders = [];
    this._staticLayersLegendBuilders = [];

    // Insert itself into the DOM at the parent element.
    this._$parent.append('<div class="aims-map-legend" style="display: none;" />');
    this._$legendEl = this._$parent.find('.aims-map-legend');
    this._$legendEl.append('<div class="controls ol-control"><button type="button" class="close-legend"><i class="material-icons">clear</i></button></div>');
    this._$legendCloseButton = this._$legendEl.find('.close-legend');
    this._$legendEl.append('<div class="dynamic-layers-legend" />');
    this._$dynamicLayersLegendEl = this._$legendEl.find('.dynamic-layers-legend');
    this._$legendEl.append('<div class="static-layers-legend" />');
    this._$staticLayersLegendEl = this._$legendEl.find('.static-layers-legend');

    // Insert icon for displaying on small screens
    this._$parent.append('<div class="aims-map-legend-icon ol-control" style="display: none;"><button type="button"><i class="material-icons">toc</i></button></div>');
    this._$legendIcon = this._$parent.find('.aims-map-legend-icon');

    // Add click event listener to icon button
    this._$legendIcon.first().on('click', function() {
      // add classes to keep state
      if (that._shouldIconBeShown()) {
        that._$legendEl.addClass('show-responsive');
        that._$legendEl.removeClass('hide-responsive');
      } else {
        that._$legendEl.removeClass('show-responsive');
        that._$legendEl.removeClass('hide-responsive');
      }

      that._$legendEl.show();
      that._$legendIcon.hide();
    });

    // Add click event listener to close button (hides legend and shows icon)
    this._$legendCloseButton.on('click', function() {
      // add classes to keep state
      if (!that._shouldIconBeShown()) {
        that._$legendEl.removeClass('show-responsive');
        that._$legendEl.addClass('hide-responsive');
      } else {
        that._$legendEl.removeClass('show-responsive');
        that._$legendEl.removeClass('hide-responsive');
      }

      that._$legendEl.hide();
      that._$legendIcon.show();
    });

    // Add event listener to switch between icon and legend
    let resizeTimeout;
    window.addEventListener('resize', function(event){
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        that._display();
      }, 50);
    });
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

    this._display();
  }

  /**
   * Determine if the legend should be shown at all. When yes determine the icon or the legend
   * itself should be shown.
   * @private
   */
  _display() {
    if (this._shouldLegendBeShown()) {
      if ((this._shouldIconBeShown() && !this._$legendEl.hasClass('show-responsive')) ||
          this._$legendEl.hasClass('hide-responsive')) {
        this._$legendIcon.show();
        this._$legendEl.hide();
      } else {
        this._$legendIcon.hide();
        this._$legendEl.show();
      }
    } else {
      this._$legendIcon.hide();
      this._$legendEl.hide();
    }
  }

  /**
   * Does the legend contain items to be shown?
   * @returns {boolean}
   * @private
   */
  _shouldLegendBeShown() {
    return (this._$dynamicLayersLegendEl.children().length > 0) ||
      (this._$staticLayersLegendEl.children().length > 0);
  }

  /**
   * Should the icon be shown because the legend would cover to much space?
   * @returns {boolean}
   * @private
   */
  _shouldIconBeShown() {
    // When legend width is smaller than 30% of parent, then show the legend, otherwise hide it
    return (this._$legendEl.width() > (this._$parent.width() * 0.3));
  }
};
