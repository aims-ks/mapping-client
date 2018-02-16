import AbstractEventHandler from './abstract-event-handler';
import MapClickEventEmitter from './map-click-event-emitter';

/**
 * Event handler for the map-click event
 */
export default class MapSingleClickEventHandler extends AbstractEventHandler {

  /**
   * Constructor.
   */
  constructor(olMap) {
    const mapClickEventEmitter = new MapClickEventEmitter(olMap);
    super(mapClickEventEmitter.EVENT_SINGLE_CLICK, mapClickEventEmitter);
  }

};
