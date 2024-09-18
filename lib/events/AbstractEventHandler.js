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
    this._eventEmitter = eventEmitter;
    this._listeners = [];

    this._eventEmitter.on(eventName, (event) => {
      this._emitEvent(event);
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
   * Unregister an event listener from a certain event
   * @param listener
   */
  unregisterListener(listener) {
    // add listener to the beginning of the array to allow stopPropagation to work
    this._listeners.splice(this._listeners.indexOf(listener), 1);
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

}
