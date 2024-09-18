import MapSingleClickEventHandler from './MapSingleClickEventHandler';

/**
 * A manager class for registering and un-registering event listeners
 */
export default class EventListenerManager {

  /**
   * Constructor.
   */
  constructor(olMap) {
    this._eventHandlers = {};

    // create event handlers
    this._eventHandlers.mapClickEventHandler = new MapSingleClickEventHandler(olMap);
  }

  /**
   * Register a new listener for the map-click event
   * @param listener
   */
  registerMapSingleClickListener(listener) {
    this._eventHandlers.mapClickEventHandler.registerListener(listener);
  }

  /**
   * Unregister a listener from the map-click event
   * @param listener
   */
  unregisterMapSingleClickListener(listener) {
    this._eventHandlers.mapClickEventHandler.unregisterListener(listener);
  }

}
