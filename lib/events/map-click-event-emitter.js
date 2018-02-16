/**
 * A simple {@code EventEmitter} for emitting click events on the map.
 */
const EventEmitter = require('events').EventEmitter;

export default class MapClickEventEmitter extends EventEmitter {

  /**
   * Constructor.
   */
  constructor(olMap) {
    super();
    let self = this;

    this._olMap = olMap;

    // save map dimensions
    this._mapSize = this._olMap.getSize();

    // declare the events that are emitted from this class.
    this.EVENT_SINGLE_CLICK = 'aims.map.events.map-click-event-emitter.singleClickEvent';

    // listen to single click events on the map
    this._olMap.on('singleclick', function(evt) {
      self._checkMapSize();
      self.emit(self.EVENT_SINGLE_CLICK, evt);
    });
  }

  /**
   * Check if the map size has changed, and if so call the updateSize method
   * @private
   */
  _checkMapSize() {
    let newMapSize = this._olMap.getSize();
    if (newMapSize[0] !== this._mapSize[0] || newMapSize[1] !== this._mapSize[1]) {
      this._mapSize = newMapSize;
      this._olMap.updateSize();
    }
  }
};
