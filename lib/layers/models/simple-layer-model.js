/**
 * A simple {@code Model} for maintaining a list of {@code Layer} definitions (note: not actual
 * OpenLayers layer objects). This class extends {@code EventEmitter} to support event
 * notifications when the list changes. The only restriction imposed on the content of the list by
 * the model itself is that every entry must contain a field titled {@code layerId} that is unique
 * to that entry.
 */
const EventEmitter = require('events').EventEmitter;

export default class SimpleLayerModel extends EventEmitter {

  /**
   * Constructor.
   */
  constructor(defaultList) {
    super();

    // Declare the internal cache.
    this._internalCache = defaultList || [];

    // Declare the events that are emitted from this class.
    this.EVENT_CHANGED = 'aims.map.models.simple-layer-model.changedEvent';

  }

  /**
   * Search method based on {@code layerId}.
   */
  findByLayerId(layerId) {
    return this._internalCache.find((_layer) => {
      return _layer.layerId === layerId;
    });
  }

  /**
   * Return the index of the layer in the array
   * @param layer
   * @returns {number}
   */
  getIndex(layer) {
    return this._internalCache.indexOf(layer);
  }

  /**
   * Getter method for the {@link #_intenalCache} property.
   */
  getLayers() {
    // Copy the internal cache.
    return this._internalCache.slice();
  }

  /**
   * Setter method for the {@link #_internalCache} property. This method ensures a layer is NOT
   * present more than once, in which case only the first occurence of the layer is retained.
   */
  setLayers(layers) {
    let _tempList = [];

    // Loop through each specified layer. Copy the list first.
    layers.slice()
      .forEach((_layer) => {

        // Has the layer previously been added to the temp list?
        const _tempLayer = _tempList.find((_findLayer) => {
          return _findLayer.layerId === _layer.layerId;
        });
        if (!_tempLayer) {
          // Not previously added, so add.
          _tempList.push(_layer);
        }
      });

    // Update the internal cache.
    this._internalCache = _tempList;
    this.emit(this.EVENT_CHANGED, this);
  }

  /**
   * Update a single layer and emit the change event
   * @param layer
   */
  updateLayer(layer) {
    this._internalCache[this.getIndex(layer)] = layer;
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
