/**
 * An abstract class for custom event handlers
 */

export default class AbstractEventHandler {

  /**
   * Constructor.
   * @param eventName
   * @param eventEmitter
   */
  constructor(eventName, eventEmitter) {
    const self = this;
    this._eventEmitter = eventEmitter;
    this._listeners = [];

    this._eventEmitter.on(eventName, function(event) {
      self._emitEvent(event);
    });
  }

  /**
   * Register an event listener for a certain event
   * @param listener
   */
  registerListener(listener) {
    // add listener to the beginning of the array to allow stopPropagation to work
    this._listeners.unshift(listener);
  }

  /**
   * Notify listeners
   * @param event
   * @private
   */
  _emitEvent(event) {
    this._listeners.forEach((listener) => {
      if (!event.propagationStopped) {
        listener(event);
      }
    }, event);
  }
};
