const $ = (global.$ || global.jQuery ? global.$ || global.jQuery : require('jquery'));

const NAME = 'mapping-client-layer-settings';
const TEMPLATE = `
<div class="${NAME}">
    <div class="form-group row">
        <label for="mapping-client-layer-opacity-${NAME}" class="col-sm-3 col-form-label">Opacity</label>
        <div class="col-sm-9">
            <input type="range" min="0" max="1" step="0.05" value="1" class="mapping-client-layer-opacity form-control" id="mapping-client-layer-opacity-${NAME}">
        </div>    
    </div>
</div>
`;

/**
 * Layer settings dialog
 * - set layer opacity
 */
export default class LayerSettingsDialog {

  /**
   * Constructor
   * @param layer
   * @param activeLayersModel
   */
  constructor(layer, activeLayersModel) {
    this._$el = $(TEMPLATE);
    this._isActive = false;
    this._$opacityInput = this._$el.find('input.mapping-client-layer-opacity');
    this._$opacityInput.val(layer.opacity);

    this._$opacityInput.on('change', (event) => this.handleOpacityChange(event));

    this._layer = layer;
    this._activeLayersModel = activeLayersModel;
  }

  /**
   * Return isActive which indicates if the dialog is open/active or closed/inactive
   * @return {boolean}
   */
  get isActive() {
    return this._isActive;
  }

  /**
   * Return the element for rendering
   * @return {*|jQuery|HTMLElement}
   */
  render() {
    return this._$el;
  }

  /**
   * Show/hide dialog
   */
  toggle() {
    if (this._isActive) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Show dialog
   */
  show() {
    this._$el.show();
    this._isActive = true;
  }

  /**
   * Hide dialog
   */
  hide() {
    this._$el.hide();
    this._isActive = false;
  }

  /**
   * Set the layer opacity
   * @param event
   */
  handleOpacityChange(event) {
    this._layer.opacity = parseFloat(event.target.value);
    this._activeLayersModel.updateLayer(this._layer);
  }

}
