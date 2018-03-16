const NAME = 'aims-map-layer-settings';
const TEMPLATE = `
<div class="${NAME}">
    <div class="form-group row">
    <label for="aims-map-layer-opacity" class="col-sm-2 col-form-label">Opacity</label>
    <div class="col-sm-10">
      <input type="range" min="0" max="1" step="0.1" value="1" class="form-control" id="aims-map-layer-opacity">
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
   */
  constructor($parent, layer) {

    // Insert itself into the DOM at the parent element.
    $parent.append(TEMPLATE);
    this.$el = $parent.find(`.${NAME}`);

    this._layer = layer;
  }

  /**
   * Show/hide dialog
   */
  toggle() {
    this.$el.toggle();
  }

}
