
const NAME = 'aims-map-add-layers-button';
const TEMPLATE = `
    <button type="button" class="btn btn-link ${NAME}">
        <i class="material-icons md-18">add</i>
    </button>
`;

/**
 * Renders an AddLayers button and responds to the user clicking the button by triggering the
 * AddLayersDialog.
 */
export default class AddLayersButton {

  /**
   * Constructor.
   */
  constructor(addLayersDialog) {

    // Cache the references.
    this._addLayersDialog = addLayersDialog;

  }

  /**
   * Render the button and register the click handler.
   */
  render($parent) {
    $parent.append(TEMPLATE);
    $parent.find(`.${NAME}`).click(this.handleClick.bind(this));
  };

  /**
   * Handler invoked when the user clicks the Add Layer button.
   */
  handleClick() {
    this._addLayersDialog.render();
  };

}
