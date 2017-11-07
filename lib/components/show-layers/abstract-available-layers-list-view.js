const $ = require('jquery');
const EventEmitter = require('events').EventEmitter;

/**
 * A View that renders the list of available layers, highlighting any active layers.
 */
module.exports = class AbstractAvailableLayersListView extends EventEmitter {

  /**
   * Constructor.
   */
  constructor(availableLayersModel, activeLayersModel, $el) {
    super();

    // Capture the references.
    this._availableLayersModel = availableLayersModel;
    this._activeLayersModel = activeLayersModel;
    this.$el = $el;

    // Declare the events that are emitted from this class.
    this.EVENT_LIST_UPDATED = 'list.updated';

    // Capture the reference to the underlying selector.

    // Define a local cache of layers being displayed.
    this._internalCache = [];

    // Register for notification of changes.
    this._availableLayersModel.on(this._availableLayersModel.EVENT_CHANGED, this.handleChange.bind(this));
    this._activeLayersModel.on(this._activeLayersModel.EVENT_CHANGED, this.handleChange.bind(this));

    // Invoke the event handler to do the initial population.
    this.handleChange();

  };

  /**
   * Handler invoked when the underlying list changes.
   */
  handleChange() {

    // Clear the selector.
    this.$el.empty();
    this._internalCache = [];

    // Re-populate with the list.
    this._availableLayersModel.getLayers().forEach(function (_availableLayer) {
      this._internalCache.push(_availableLayer);
      const isChecked = this._activeLayersModel.getLayers().some((_activeLayer) => {
        return _activeLayer.layerId == _availableLayer.layerId;
      });
      this.$el.append(this.renderLayer(_availableLayer, isChecked));
    }, this);

    // Emit the event to say the list has been updated.
    this.emit(this.EVENT_LIST_UPDATED, this);

  };

}
