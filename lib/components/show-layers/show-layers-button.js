
const NAME = 'aims-map-show-layers-button';
const TEMPLATE = `
    <div class="ol-control ${NAME}">
        <button type="button">
            <i class="material-icons">layers</i>
        </button>
  </div>
`;

/**
 * Custom map control for triggering the {@code ShowLayersDialog} to display.
 */
export default class ShowLayersButton {

  /**
   * Constructor to cache the references, instantiate/cache the helpers, and inject itself into the
   * DOM.
   *
   * @param $parent {JQueryObject} A JQuery object representing the parent element into which this
   * component should insert itself.
   * @param dialog {ShowLayersDialog} Reference to the dialog to be shown/hidden when the user
   * clicks this component.
   */
  constructor($parent, showLayersDialog) {

    // Cache the references.
    this._showLayersDialog = showLayersDialog;

    // Insert itself into the DOM at the parent element.
    $parent.find('.ol-viewport').first().append(TEMPLATE);

    // Register click handler.
    $parent.find(`.${NAME} button`).click(this.handleClick.bind(this));

  };

  /**
   * Handler invoked when the user clicks the button.
   */
  handleClick() {
    this._showLayersDialog.toggle();
  };

}
