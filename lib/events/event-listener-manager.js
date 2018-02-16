import MapSingleClickEventHandler from './map-single-click-event-handler';

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
}
