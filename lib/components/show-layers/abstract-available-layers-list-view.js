const $ = global.$ || global.jQuery || require('jquery');
const { EventEmitter } = require('events');

/**
 * A View that renders the list of available layers, highlighting any active layers.
 */
export default class AbstractAvailableLayersListView extends EventEmitter {

  /**
   * Constructor.
   */
  constructor(availableLayersModel, activeLayersModel, $el) {
    super();

    // Capture the references.
    this._availableLayersModel = availableLayersModel;
    this._activeLayersModel = activeLayersModel;
    this._$el = $el;

    // Declare the events that are emitted from this class.
    this.EVENT_LIST_UPDATED = 'list.updated';

    // Capture the reference to the underlying selector.

    // Define a local cache of layers being displayed.
    this._internalCache = [];

    // Register for notification of changes.
    this._availableLayersModel.on(
      this._availableLayersModel.EVENT_CHANGED,
      this.handleChange.bind(this),
    );
    this._activeLayersModel.on(
      this._activeLayersModel.EVENT_CHANGED,
      this.handleChange.bind(this),
    );

    // Invoke the event handler to do the initial population.
    this.handleChange();
  }

  /**
   * Handler invoked when the underlying list changes.
   */
  handleChange() {
    // save layer status before the list is being emptied
    const prevLayerStatus = {};
    this._$el.find('li').each((index, element) => {
      prevLayerStatus[$(element).data('layer-id')] = $(element).data('status') !== undefined ? $(element).data('status') : {};
    });

    // Clear the selector.
    this._$el.empty();
    this._internalCache = [];

    // Re-populate with the list.
    this._availableLayersModel.getLayers().reverse().forEach((availableLayer) => {
      let status = {};
      // if status has been saved previously, restore it
      if (prevLayerStatus[availableLayer.layerId]) {
        status = prevLayerStatus[availableLayer.layerId];
      }

      this._internalCache.push(availableLayer);
      status.selected = this._activeLayersModel.getLayers()
        .some((_activeLayer) => _activeLayer.layerId === availableLayer.layerId);
      this._$el.append(this.renderLayer(availableLayer, status));
    }, this);

    // Emit the event to say the list has been updated.
    this.emit(this.EVENT_LIST_UPDATED, this);
  }

}
