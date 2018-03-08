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
   * @param renderManager {RenderManager} Reference to the manager object used to identify the
   * features within a selection extent.
   * @param listeners A list of listeners to notify when the selected features change. The listener
   * interface expects: 'all selected', 'added', 'removed'. When not in accumulation mode, 'added'
   * and 'all selected' will be the same.
   * @param options An object of options supports by this class. Currently this is restricted to
   * 'selection'.
   */
  constructor(olMap, renderManager, listeners, options) {

    options = options || {};
    console.log('options: ' + JSON.stringify(options));

    // Declare an internal list used to manage which features are selected on the map. The list
    // is keyed on 'ol_uid'.
    this._selectedFeatures = {};

    // Determine the interaction conditions to use. By default:
    // - singleClick deselects all and selects single feature.
    // - box deselects all and selects features within box.
    if (options.selection === 'add') {
      this._select = new olSelectInteraction({
        addCondition: olEventsConditions.singleClick,
        toggleCondition: olEventsConditions.always
      });
    } else {
      this._select = new olSelectInteraction();
    }

    // Add the `interaction` that allows the user to select individual features by clicking on them.
    olMap.addInteraction(this._select);

    // Even handler invoked when the user clicks an individual feature. Clicking a feature already
    // selected will deselect that feature.
    this._select.on('select', function(e) {

      // Define temporary lists to identify which features have been added to the selection, and
      // which have been removed. A feature that is already selected and is clicked again it
      // treated as a toggle and will therefore be removed.
      const addedFeatures = [];
      const removedFeatures = [];

      // Handle any features that have been selected/clicked.
      e.selected.forEach((_feature) => {
        const aimsDataItem = _feature.get('aimsDataItem');

        // If this feature being added or removed?
        if (!this._selectedFeatures[aimsDataItem.id]) {

          // Not previously selected, so adding.
          this._selectedFeatures[aimsDataItem.id] = _feature;
          addedFeatures.push(aimsDataItem);

        } else {

          // Was previously selected, so remove.
          delete this._selectedFeatures[aimsDataItem.id];
          removedFeatures.push(aimsDataItem);
        }
      });

      // Handle any features that are specifically being deselected.
      e.deselected.forEach((_feature) => {
        const aimsDataItem = _feature.get('aimsDataItem');
        delete this._selectedFeatures[aimsDataItem.id];
        removedFeatures.push(aimsDataItem);
      });

      // Build a list of all selected features.
      const selectedFeatures = [];
      Object.keys(this._selectedFeatures).forEach((_key) => {
        const _feature = this._selectedFeatures[_key];
        const aimsDataItem = _feature.get('aimsDataItem');
        selectedFeatures.push(aimsDataItem);
      });

      // Invoke any listeners with the list of all selected features.
      if (listeners && listeners.onSelectListeners) {
        listeners.onSelectListeners.forEach((listener) => {
          listener.call(this, selectedFeatures, addedFeatures, removedFeatures);
        });
      }

    }, this);

    // Handle DragBox selection interaction. To consolidate handling after selection, use the
    // 'selectedFeatures'.
    this._dragBox = new olDragBoxInteraction({
      condition: olEventsConditions.platformModifierKeyOnly
    });
    olMap.addInteraction(this._dragBox);
    this._dragBox.on('boxstart', function() {
      // Do nothing.
    });
    this._dragBox.on('boxend', function() {

      // Define temporary lists to identify which features have been added to the selection, and
      // which have been removed. A feature that is already selected and is part of the drag box
      // will continue to be selected.
      const addedFeatures = [];
      const removedFeatures = [];

      // If selections are not in accumulative mode, clear all existing selections.
      if (options.selection !== 'add') {
        Object.keys(this._selectedFeatures).forEach((_key) => {
          const _feature = this._selectedFeatures[_key];
          const aimsDataItem = _feature.get('aimsDataItem');
          removedFeatures.push(aimsDataItem);
        });
      }

      // Build a list of all selected features, ignoring any that were already selected.
      const _extent = this._dragBox.getGeometry().getExtent();
      renderManager.getVectorSource().forEachFeatureIntersectingExtent(_extent, function(_feature) {
        const aimsDataItem = _feature.get('aimsDataItem');

        // Is this feature already selected?
        if (!this._selectedFeatures[aimsDataItem.id]) {

          // Not previously selected, so adding.
          this._selectedFeatures[aimsDataItem.id] = _feature;
          addedFeatures.push(aimsDataItem);

        } else {
          // Was previously selected, so ignore.
        }

      }, this);

      // Build a list of all selected features.
      const selectedFeatures = [];
      Object.keys(this._selectedFeatures).forEach((_key) => {
        const _feature = this._selectedFeatures[_key];
        const aimsDataItem = _feature.get('aimsDataItem');
        selectedFeatures.push(aimsDataItem);
      });

      if (listeners && listeners.onSelectListeners) {
        listeners.onSelectListeners.forEach((listener) => {
          listener.call(this, selectedFeatures, addedFeatures, removedFeatures);
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
