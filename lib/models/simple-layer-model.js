/**
 * A simple {@code Model} that maintains a list of {@code Layer} information objects that can be
 * rendered by a compatible {@code View}. This class extends {@code EventEmitter} for event
 * notifications.
 *
 * A layer object is expected to have the following minimum properties:
 *
 *   - `layerId` - A unique identifier for the layer.
 *   - `title` - A human-readable name for the layer, used when displaying the layer in the UI.
 */
const EventEmitter = require('events').EventEmitter;

module.exports = class SimpleLayerModel extends EventEmitter {

  /**
   * Constructor.
   */
  constructor(defaultList) {
    super();

    // Declare the internal cache.
    this._internalCache = defaultList || [];

    // Declare the events that are emitted from this class.
    this.EVENT_CHANGED = 'aims.map.models.single-layer-model.changedEvent';

  }

  /**
   * Getter method for the {@link #_intenalCache} property.
   */
  getLayers() {
    return this._internalCache;
  }

  /**
   * Setter method for the {@link #_internalCache} property.
   */
  setLayers(layers) {
    this._internalCache = layers;
    this.emit(this.EVENT_CHANGED, this);
  }

  /**
   * Clear the {@link _internalCache}.
   */
  clear() {
    this._internalCache = [];
    this.emit(this.EVENT_CHANGED, this);
  }

};
