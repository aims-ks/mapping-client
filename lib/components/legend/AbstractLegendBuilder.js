/**
 * Abstract class describing the interface for use by Dynamic/Static Layers Legend Build components.
 */
export default class AbstractLegendBuilder {

  constructor() {
    this._onChangeListeners = [];
  }

  /**
   * Register the onChange listener.
   */
  registerOnChangeListener(listener) {
    this._onChangeListeners.push(listener);
  }

  /**
   * Helper method that emits an `onChange` event.
   */
  _emitOnChangeEvent() {
    this._onChangeListeners.forEach((listener) => {
      listener.call(this);
    }, this);
  }

  /**
   * Build a HTML snippet to display the legend.
   */
  buildHtml() {
    return null;
  }

}
