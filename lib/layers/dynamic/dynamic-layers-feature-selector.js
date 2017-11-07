/**
 * Enables customised selection of dynamic features. Selections/deselections can be performed as
 * follows:
 *
 * - user clicks on a single feature. This will deselect all other features.
 * - user holds <ctrl> and highlights multiple features. This will deselect all other features and
 * then highlight the selected features.
 */

const ol = require('openlayers');

module.exports = class DynamicLayersFeatureSelector {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param olMap {ol.Map} OpenLayers map object for manipulation.
   * @param styleManager {StyleManager} Reference to the Style Manager to be used by this class
   * when styling data rendered on the map.
   */
  constructor(olMap, renderManager, styleSelector, listeners) {

    // Add an `interaction` that allows the user to select individual features by clicking on them.
    const select = new ol.interaction.Select();
    olMap.addInteraction(select);
    const selectedFeatures = select.getFeatures();

    // Handle selecting individual features. By default all other features should be removed.
    select.on('select', function(e) {

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
    const dragBox = new ol.interaction.DragBox({
      condition: ol.events.condition.platformModifierKeyOnly
    });
    dragBox.on('boxstart', function() {
      selectedFeatures.getArray().forEach((_feature) => {
        const aimsDataItem = _feature.get('aimsDataItem');
        _feature.setStyle(styleSelector.identifyStyle(aimsDataItem));
      });
      selectedFeatures.clear();
    });
    olMap.addInteraction(dragBox);
    dragBox.on('boxend', function() {
      const selections = [];
      const _extent = dragBox.getGeometry().getExtent();
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
    });

  };

}
