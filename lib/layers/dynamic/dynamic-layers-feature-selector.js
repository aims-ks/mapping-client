/**
 * Enables customised selection of dynamic features. Selections/deselections can be performed as
 * follows:
 *
 * - user clicks on a single feature. This will deselect all other features.
 * - user holds <ctrl> and highlights multiple features. This will deselect all other features and
 * then highlight the selected features.
 */

const olDragBoxInteraction = (global.ol ? global.ol.interaction.DragBox: require('ol/interaction/dragbox').default);
const olEventsConditions = (global.ol ? global.ol.events.condition : require('ol/events/condition').default);
const olSelectInteraction = (global.ol ? global.ol.interaction.Select : require('ol/interaction/select').default);

export default class DynamicLayersFeatureSelector {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param olMap {ol.Map} OpenLayers map object for manipulation.
   * @param styleManager {StyleManager} Reference to the Style Manager to be used by this class
   * when styling data rendered on the map.
   */
  constructor(olMap, renderManager, styleSelector, listeners) {

    // Add an `interaction` that allows the user to select individual features by clicking on them.
    this._select = new olSelectInteraction();
    olMap.addInteraction(this._select);
    const selectedFeatures = this._select.getFeatures();

    // Handle selecting individual features. By default all other features should be removed.
    this._select.on('select', function(e) {

      // Build a list of selected features while updating their style.
      const selections = [];
      e.selected.forEach((selectedFeature) => {
        const aimsDataItem = selectedFeature.get('aimsDataItem');
        selectedFeature.setStyle(styleSelector.identifySelectionStyle(aimsDataItem));
        selections.push(aimsDataItem);
      });
      if (listeners && listeners.onSelectListeners) {
        listeners.onSelectListeners.forEach((listener) => {
          listener.call(this, selections);
        });
      }

      // Reset the style on all features being deselected.
      e.deselected.forEach((deselectedFeature) => {
        const aimsDataItem = deselectedFeature.get('aimsDataItem');
        deselectedFeature.setStyle(styleSelector.identifyStyle(aimsDataItem));
      });

    });

    // Handle DragBox selection interaction. To consolidate handling after selection, use the
    // 'selectedFeatures'.
    // const selectedFeatures = select.getFeatures();
    this._dragBox = new olDragBoxInteraction({
      condition: olEventsConditions.platformModifierKeyOnly
    });
    this._dragBox.on('boxstart', function() {
      selectedFeatures.getArray().forEach((_feature) => {
        const aimsDataItem = _feature.get('aimsDataItem');
        _feature.setStyle(styleSelector.identifyStyle(aimsDataItem));
      });
      selectedFeatures.clear();
    });
    olMap.addInteraction(this._dragBox);
    this._dragBox.on('boxend', function() {
      const selections = [];
      const _extent = this._dragBox.getGeometry().getExtent();
      renderManager.getVectorSource().forEachFeatureIntersectingExtent(_extent, function(_feature) {
        selectedFeatures.push(_feature);
        const aimsDataItem = _feature.get('aimsDataItem');
        selections.push(aimsDataItem);
        _feature.setStyle(styleSelector.identifySelectionStyle(aimsDataItem));
      });
      if (listeners && listeners.onSelectListeners) {
        listeners.onSelectListeners.forEach((listener) => {
          listener.call(this, selections);
        });
      }
    }, this);

  };

  /**
   * Provides an API method to enable feature selection, which is enabled by default.
   */
  enable() {
    this._select.setActive(true);
    this._dragBox.setActive(true);
  }

  /**
   * Provides an API method to disable feature selection.
   */
  disable() {
    this._select.setActive(false);
    this._dragBox.setActive(false);
  }

  /**
   * Provides an API method to clear any selections of map features.
   */
  clear() {
    this._select.getFeatures().clear();
  }

}
