const $ = require('jquery');

/**
 * Event handler that responds to the user selecting a layer for display.
 */
module.exports = class AvailableLayersSelectionHandler {

  /**
   * Constructor.
   */
  constructor(activeLayersModel, availableLayersModel, availableLayersListView, $el) {

    // Capture the references.
    this._activeLayersModel = activeLayersModel;
    this._availableLayersModel = availableLayersModel;
    this._availableLayersListView = availableLayersListView;
    this.$el = $el;

    // Register for notification of changes.
    this._availableLayersListView.on(
      this._availableLayersListView.EVENT_LIST_UPDATED,
      this.handleListUpdate.bind(this)
    );

    // Invoke the event handler to do the initial population.
    this.handleListUpdate(this._availableLayersListView);

  };

  /**
   * Handler invoked when the underlying list changes.
   */
  handleListUpdate(view) {

    // Add listeners for when the user makes a selection.
    this.$el.find('input').click(this.handleSelection.bind(this));

  };

  /**
   * Handler invoked when the user makes a selection by adding the available layer to the list of
   * active layers. Note that these lists must be in the same order for correct rendering.
   */
  handleSelection(event) {

    // Identify the layer to add.
    const layerId = event.target.value;

    // Declare a temporary list to build.
    let _tempActiveLayers = [];

    // Loop through available layers.
    this._availableLayersModel.getLayers().forEach((_availableLayer) => {

      // Is this the layer selected?
      if (_availableLayer.layerId == layerId) {

        // Has the layer been selected/deselected?
        if (event.target.checked) {

          // Add to the active layers.
          _tempActiveLayers.push(_availableLayer);

        } else {

          // Ignore.

        }
      } else {

        // Not the selected layer, so include if it was already in the active layer list.
        const _activeLayer = this._activeLayersModel.getLayers().find((_layer) => {
          return _layer.layerId == _availableLayer.layerId;
        });
        if (_activeLayer) {
          _tempActiveLayers.push(_activeLayer);
        }
      }

    });

    // Capture the active layers.
    this._activeLayersModel.setLayers(_tempActiveLayers);
  }

}
