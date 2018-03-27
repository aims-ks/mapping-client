/**
 * Event handler that responds to the user selecting a layer for display.
 */
export default class AvailableLayersChangeHandler {

  /**
   * Constructor.
   */
  constructor(activeLayersModel, availableLayersModel, availableLayersListView, $el, allowMultiple) {

    // Capture the references.
    this._activeLayersModel = activeLayersModel;
    this._availableLayersModel = availableLayersModel;
    this._availableLayersListView = availableLayersListView;
    this._$el = $el;
    this._allowMultiple = allowMultiple;

    // Register for notification of changes.
    this._availableLayersListView.on(
      this._availableLayersListView.EVENT_LIST_UPDATED,
      this.handleListUpdate.bind(this)
    );

    // Invoke the event handler to do the initial population.
    this.handleListUpdate();
  };

  /**
   * Handler invoked when the underlying list changes.
   */
  handleListUpdate() {

    // Add listeners for when the user makes a selection.
    this._$el.find('input.aims-layer-input')
      .click(this.handleChange.bind(this));
  };

  /**
   * Handler invoked when the user rearranges the layers or makes a selection by adding the
   * available layer to the list of active layers if {@link #_allowMultiple} is set, or
   * overwriting the list of active layers if{@link #_allowMultiple} is not set.
   * Note that these lists must be in the same order for correct rendering.
   */
  handleChange() {
    let availableLayers = this._availableLayersModel.getLayers();
    let inputFields = this._$el.find('input.aims-layer-input')
      .toArray()
      .reverse();

    this._updateActiveLayersModel(availableLayers, inputFields);
    this._updateAvailableLayersModel(availableLayers, inputFields);
  }

  /**
   * Update the active layers model
   * @param availableLayers
   * @param inputFields
   * @private
   */
  _updateActiveLayersModel(availableLayers, inputFields) {
    inputFields = inputFields.filter(input => input.checked);

    if (!this._allowMultiple && inputFields.length > 1) {
      inputFields = inputFields.slice(1);
    }

    let _tempActiveLayers = inputFields.map(input =>
      availableLayers.find(layer => input.value === layer.layerId)
    );

    // Capture the active layers.
    this._activeLayersModel.setLayers(_tempActiveLayers);
  }

  /**
   * Update the available layers model
   * @param availableLayers
   * @param inputFields
   * @private
   */
  _updateAvailableLayersModel(availableLayers, inputFields) {
    let _tempAvailableLayers = inputFields.map(input =>
      availableLayers.find(layer => input.value === layer.layerId)
    );

    // Set the available layers
    this._availableLayersModel.setLayers(_tempAvailableLayers);
  }

}
