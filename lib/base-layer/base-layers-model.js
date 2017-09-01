/**
 * A Model to maintain the list of available Base Layers, with one designated as the 'active' layer.
 *
 * A layer object is expected to have the following properties at a minimum:
 *
 *   - `layerId` - A unique identifier for the layer.
 *   - `title` - A human-readable name for the layer, used when displaying the layer in the UI.
 */
const EventEmitter = require('events').EventEmitter;

module.exports = class MapBaseLayersModel extends EventEmitter {

  /**
   * Constructor to declare the instance variables.
   */
  constructor() {
    super();

    // Internal list of available layers.
    this._layers = [];

    // Internal reference to the single active layer. This layer must exist in 'this._layers'.
    this._activeLayer = null;

    // Name of event fired when a layer is added to _layers.
    this.EVENT_LAYER_ADDED = 'map.layer.add';

    // Name of event fired when a layer is removed from _layers.
    this.EVENT_LAYER_REMOVED = 'map.layer.remove';

    // Name of event fired when _activeLayer is changed.
    this.EVENT_ACTIVE_LAYER_CHANGED = 'map.layer.active.change';

  }

  /**
   * Add the specified layer to the model and fire an event. Make this the `active` layer if none
   * already set.
   */
  addLayer(layer) {
    if (layer && layer.layerId && layer.title) {
      this._layers.push(layer);
      this.emit(this.EVENT_LAYER_ADDED, layer);
      if (!this._activeLayer) {
        this.setActiveLayer(layer.layerId);
      }
    }
  }

  /**
   * Getter method for the {@link #_layers} property.
   */
  getLayers () {
    return this._layers;
  }

  /**
   * Remove the layer specified by the 'layerId' from the model and fire an event. Ignore this
   * instruction if this is the last layer in the list.
   */
  removeLayer(layerId) {

    // Check that the specified layer is in the list of layers.
    const layer = this._layers.find(function (_layer) {
      return _layer.layerId == layerId;
    });
    if (layer && this._layers.length > 1) {

      // Layer found, so remove it from list.
      this._layers = this._layers.filter(function (_layer) {
        return _layer.layerId != layerId;
      });
      this.emit(this.EVENT_LAYER_REMOVED, layer);

      // Choose a different `active` layer if necessary.
      if (!this._activeLayer || this._activeLayer.layerId == layerId) {
        this.setActiveLayer(this._layers[0].layerId);
      }

    }

  }

  /**
   * Getter method for the `active` layer.
   */
  getActiveLayer() {
    return this._activeLayer;
  }

  /**
   * Setter method for the `active` layer.
   */
  setActiveLayer(layerId) {
    const _layer = this._layers.find((_l) => _l.layerId == layerId);
    if (_layer) {
      this._activeLayer = _layer;
      this.emit(this.EVENT_ACTIVE_LAYER_CHANGED, _layer);
    }
  }

}
