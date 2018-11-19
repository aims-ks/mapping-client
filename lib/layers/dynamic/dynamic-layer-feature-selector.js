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

/**
 * Abstract base implementation of the feature selector for a dynamic layer. Instantiate one of the
 * concrete subclasses based on desired behaviour.
 *
 * @see AccumulatingDynamicLayerFeatureSelector
 * @see ToggleDynamicLayerFeatureSelector
 */
export class DynamicLayerFeatureSelector {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param olMap {ol.Map} `OpenLayers` map object for manipulation.
   * @param vectorSource {ol.Source.Vector} Reference to `OpenLayers` data object for identifying
   * features located within an extent.
   * @param listeners A list of listeners to notify when the selected features change. The listener
   * interface expects: 'all selected', 'added', 'removed'. When not in accumulation mode, 'added'
   * and 'all selected' will be the same.
   * @param featureSelectionsModel
   * @param featureSelectionsModel
   */
  constructor(olMap, vectorSource, listeners, featureSelectionsModel) {

    // Capture the references.
    this._vectorSource = vectorSource;
    this._listeners = listeners;

    // Declare an internal list used to manage which features are selected on the map. The list
    // is keyed on 'ol_uid'.
    this._selectedFeatures = {};

    // If the 'featureSelectionsModel' is defined, listen for changes and update 'selectedFeatures'.
    if (featureSelectionsModel) {
      featureSelectionsModel.on(featureSelectionsModel.EVENT_DATA_CHANGED, (model) => {
        // Copy the model data, making a new object.
        this._selectedFeatures = {};
        const modelData = model.getData();
        for (const _id in modelData) {
          const featureData = modelData[_id];
          this._selectedFeatures[_id] = {
            id: _id,
            latitude: featureData.latitude || featureData.lat,
            longitude: featureData.longitude || featureData.lon
          };
        }
      });
    }

    // Delegate instantiation of the olSelectInteraction to a factory method and add it to the map.
    this._selectInteraction = this._makeSelectInteraction();
    if (this._selectInteraction) {
      olMap.addInteraction(this._selectInteraction);
    }

    // Event handler invoked when the user clicks an individual feature. Handling of the click
    // event is delegated to the `_handleOnSelectEvent` method.
    this._selectInteraction.on('select', this._handleOnSelectEvent, this);

    // Delegate instantiation of the olDragBoxInteraction to a factory method and add it to the map.
    this._dragBoxInteraction = this._makeDragBoxInteraction();
    if (this._dragBoxInteraction) {
      olMap.addInteraction(this._dragBoxInteraction);
    }

    // Event handler invoked when the user begins a drag box action. Handling this event is
    // delegated to the `_handleOnBoxStartEvent` method.
    this._dragBoxInteraction.on('boxstart', this._handleOnDragBoxStartEvent, this);
    this._dragBoxInteraction.on('boxend', this._handleOnDragBoxEndEvent, this);

  };

  /**
   * Provides an API method to enable feature selection, which is enabled by default.
   */
  enable() {
    this._selectInteraction.setActive(true);
    this._dragBoxInteraction.setActive(true);
  }

  /**
   * Provides an API method to disable feature selection.
   */
  disable() {
    this._selectInteraction.setActive(false);
    this._dragBoxInteraction.setActive(false);
  }

  /**
   * Provides an API method to clear any selections of map features.
   */
  clear() {
    this._selectInteraction.getFeatures().clear();
  }

  /**
   * Event handler invoked when the user begins a drag box action. Default implementation is to do
   * nothing.
   *
   * @private
   */
  _handleOnDragBoxStartEvent(event) {
    // Do nothing.
  }

  /**
   * Event handler invoked when the user completes a drag box action.
   *
   * @private
   */
  _handleOnDragBoxEndEvent(event) {

    // Define temporary lists to identify which features have been added to the selection, and
    // which have been removed. A feature that is already selected and is part of the drag box
    // will continue to be selected.
    const addedFeatures = [];
    const removedFeatures = [];

    // Invoke the pre-processing method.
    this._preHandleOnDragBoxEndEvent(event, addedFeatures, removedFeatures);

    // Build a list of all selected features, ignoring any that were already selected.
    const _extent = this._dragBoxInteraction.getGeometry().getExtent();
    this._vectorSource.forEachFeatureIntersectingExtent(_extent, function (_feature) {
      const aimsDataItem = _feature.get('aimsDataItem');

      // Determine if the feature can be selected.
      if (aimsDataItem && this._canSelect(aimsDataItem.id)) {

        // Is this feature already selected?
        if (!this._selectedFeatures[aimsDataItem.id]) {

          // Not previously selected, so adding.
          this._selectedFeatures[aimsDataItem.id] = {
            id: aimsDataItem.id,
            latitude: aimsDataItem.latitude || aimsDataItem.lat,
            longitude: aimsDataItem.longitude || aimsDataItem.lon
          };
          addedFeatures.push(aimsDataItem);

        } else {
          // Was previously selected, so ignore.
        }

      }

    }, this);

    // Build a list of all selected features.
    const selectedFeatures = [];
    Object.keys(this._selectedFeatures).forEach((_id) => {
      selectedFeatures.push(this._selectedFeatures[_id]);
    });

    if (this._listeners && this._listeners.onSelectListeners) {
      this._listeners.onSelectListeners.forEach((listener) => {
        listener.call(this, selectedFeatures, addedFeatures, removedFeatures);
      });
    }
  }

  /**
   * Perform any pre-processing prior to handling the completion of a drag box action.
   */
  _preHandleOnDragBoxEndEvent(event, addFeatures, removedFeatures) {
    // Do nothing.
  }

  /**
   * Event handler invoked when the `olSelectionInteraction` fires an event resulting from the user
   * clicking the map.
   *
   * @private
   */
  _handleOnSelectEvent(event) {

    // Define temporary lists to identify which features have been added to the selection, and
    // which have been removed. A feature that is already selected and is clicked again it
    // treated as a toggle and will therefore be removed.
    const addedFeatures = [];
    const removedFeatures = [];

    // Handle any features that have been selected/clicked.
    event.selected.forEach((_feature) => {
      const aimsDataItem = _feature.get('aimsDataItem');

      // Determine if the feature can be selected.
      if (aimsDataItem && this._canSelect(aimsDataItem.id)) {

        // If this feature being added or removed?
        if (!this._selectedFeatures[aimsDataItem.id]) {

          // Not previously selected, so adding.
          this._selectedFeatures[aimsDataItem.id] = {
            id: aimsDataItem.id,
            latitude: aimsDataItem.latitude || aimsDataItem.lat,
            longitude: aimsDataItem.longitude || aimsDataItem.lon
          };
          addedFeatures.push(aimsDataItem);

        } else {

          // Was previously selected, so remove.
          delete this._selectedFeatures[aimsDataItem.id];
          removedFeatures.push(aimsDataItem);
        }

      }

    });

    // Handle any features that are specifically being deselected.
    event.deselected.forEach((_feature) => {
      const aimsDataItem = _feature.get('aimsDataItem');
      // Only deselect aimsDataItems and ignore rest
      if (aimsDataItem) {
        delete this._selectedFeatures[aimsDataItem.id];
        removedFeatures.push(aimsDataItem);
      }
    });

    // Build a list of all selected features.
    const selectedFeatures = [];
    Object.keys(this._selectedFeatures).forEach((_id) => {
      selectedFeatures.push(this._selectedFeatures[_id]);
    });

    // Clear any selections cached by the interaction object.
    this.clear();

    // Invoke any listeners with the list of all selected features.
    if (this._listeners && this._listeners.onSelectListeners) {
      this._listeners.onSelectListeners.forEach((listener) => {
        listener.call(this, selectedFeatures, addedFeatures, removedFeatures);
      });
    }

  }

  /**
   * Helper method delegated responsibility to determine if the feature identified by the {@code id}
   * is permitted to be selected. Implementation classes should override this if required.
   *
   * @return {@code true} by default.
   */
  _canSelect(id) {
    return true;
  }

  /**
   * Abstract implementation for a factory method to instantiate and configure an
   * `olSelectInteraction` object.
   *
   * @private
   */
  _makeSelectInteraction() {
    throw new Error('Abstract method not implemented.');
  }

  /**
   * Default implementation of a factory method to instantiate and configure an
   * `olDragBoxInteraction` object.
   *
   * @private
   */
  _makeDragBoxInteraction() {
    return new olDragBoxInteraction({
      condition: olEventsConditions.platformModifierKeyOnly
    });
  }

}


/**
 * Extends {@link DynamicLayerFeatureSelector} to provide functionality that toggles selections
 * between mouse actions. For example, click a feature and it is selected, click another feature
 * and the first feature is de-selected and the second feature is selected. This is generally the
 * default action of a feature selector.
 */
export class ToggleDynamicLayerFeatureSelector extends DynamicLayerFeatureSelector {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param olMap {ol.Map} `OpenLayers` map object for manipulation.
   * @param vectorSource {ol.Source.Vector} Reference to `OpenLayers` data object for identifying
   * features located within an extent.
   * @param listeners A list of listeners to notify when the selected features change. The listener
   * interface expects: 'all selected', 'added', 'removed'. When not in accumulation mode, 'added'
   * and 'all selected' will be the same.
   */
  constructor(olMap, vectorSource, listeners, featureSelectionsModel) {

    super(olMap, vectorSource, listeners, featureSelectionsModel);

  }

  /**
   * Concrete implementation that instantiates an `olSelectInteraction` object with the default
   * behaviour of toggling selections.
   *
   * @private
   */
  _makeSelectInteraction() {
    return new olSelectInteraction();
  }

  /**
   * Clear all existing selections.
   */
  _preHandleOnDragBoxEndEvent(event, addFeatures, removedFeatures) {

    Object.keys(this._selectedFeatures).forEach((_key) => {
      const aimsDataItem = this._selectedFeatures[_key];
      removedFeatures.push(aimsDataItem);
    });

  }

}


/**
 * Extends {@link DynamicLayerFeatureSelector} to provide functionality that accumulates selections
 * between mouse actions. For example, click a feature and it is selected, click another feature
 * and both features are selected.
 */
export class AccumulatingDynamicLayerFeatureSelector extends DynamicLayerFeatureSelector {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param olMap {ol.Map} `OpenLayers` map object for manipulation.
   * @param vectorSource {ol.Source.Vector} Reference to `OpenLayers` data object for identifying
   * features located within an extent.
   * @param listeners A list of listeners to notify when the selected features change. The listener
   * interface expects: 'all selected', 'added', 'removed'. When not in accumulation mode, 'added'
   * and 'all selected' will be the same.
   */
  constructor(olMap, vectorSource, listeners, featureSelectionsModel) {

    super(olMap, vectorSource, listeners, featureSelectionsModel);

  }

  /**
   * Concrete implementation that configures an `olSelectInteraction` object for `accumulating`
   * selections instead of the default `toggle` action.
   *
   * @private
   */
  _makeSelectInteraction() {
    return new olSelectInteraction({
      addCondition: olEventsConditions.singleClick,
      toggleCondition: olEventsConditions.always
    });
  }

}
