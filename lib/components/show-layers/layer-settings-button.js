const NAME = 'aims-map-layer-settings-button';
const TEMPLATE = `<button type="button" class="btn btn-link ${NAME}"><i class="material-icons">settings</i></button>`;

/**
 *
 */
export default class LayerSettingsButton {

  /**
   *
   */
  constructor($parent, settingsDialog) {
    this._$parent = $parent;

    // Cache the references.
    this._settingsDialog = settingsDialog;

    // Insert itself into the DOM at the parent element.
    $parent.append(TEMPLATE);
    this._$el = this._$parent.find(`button.${NAME}`);

    // Register click handler.
    this._$el.click(this.handleClick.bind(this));

  };

  /**
   * Handler invoked when the user clicks the button.
   */
  handleClick() {
    this._$el.toggleClass('active');
    this._$parent.draggable = !this._$el.hasClass('active');
    this._settingsDialog.toggle();
  };

}
