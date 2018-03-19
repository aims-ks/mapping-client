const NAME = 'aims-map-layer-settings';
const TEMPLATE = `
<div class="${NAME}">
    <div class="form-group row">
    <label for="aims-map-layer-opacity-${NAME}" class="col-sm-2 col-form-label">Opacity</label>
    <div class="col-sm-10">
      <input type="range" min="0" max="1" step="0.05" value="1" class="form-control aims-map-layer-opacity" id="aims-map-layer-opacity-${NAME}">
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
   * @param $parent
   * @param layer
   * @param activeLayersModel
   */
  constructor($parent, layer, activeLayersModel) {
    // Insert itself into the DOM at the parent element.
    $parent.append(TEMPLATE);
    this._$el = $parent.find(`.${NAME}`);
    this._$opacityInput = this._$el.find('input.aims-map-layer-opacity');
    this._$opacityInput.val(layer.opacity);

    this._$opacityInput.on('change', (event) => this.handleOpacityChange(event));

    this._layer = layer;
    this._activeLayersModel = activeLayersModel;
  }

  /**
   * Show/hide dialog
   */
  toggle() {
    this._$el.toggle();
  }

  /**
   * Set the layer opacity
   * @param event
   */
  handleOpacityChange(event) {
    this._layer['opacity'] = (event.target.value);
    this._activeLayersModel.updateLayer(this._layer);
  }

}
