/**
 * The View for the modal for adding layers to the map. This class is responsible for the modal
 * itself, not the add functionality.
 */
import AddLayersTab from './add-layers-tab';

const NAME = 'aims-map-add-layer-modal';
const BASE_LAYERS_PANEL_NAME = 'base-layers-panel';
const OVERLAY_LAYERS_PANEL_NAME = 'overlay-layers-panel';
const TEMPLATE = `
<div class="modal fade" id="${NAME}" tabindex="-1" role="dialog" aria-labelledby="map-add-layer-modal-label">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Add layers</h4>
            </div>
            <div class="modal-body">
                <ul class="nav nav-pills" role="tablist">
                    <li role="presentation" class="active"><a href="#${BASE_LAYERS_PANEL_NAME}" role="tab" data-toggle="tab">Base Layers</a></li>
                    <li role="presentation"><a href="#${OVERLAY_LAYERS_PANEL_NAME}" role="tab" data-toggle="tab">Overlay Layers</a></li>
                </ul>
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="${BASE_LAYERS_PANEL_NAME}" ></div>
                    <div role="tabpanel" class="tab-pane" id="${OVERLAY_LAYERS_PANEL_NAME}" ></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary btn-save">Save</button>
            </div>
        </div>
    </div>
</div>
`;

export default class AddLayersDialog {

  /**
   * Constructor.
   */
  constructor(supportedBaseLayersModel,
              availableBaseLayersModel,
              activeBaseLayersModel,
              supportedOverlayLayersModel,
              availableOverlayLayersModel,
              activeOverlayLayersModel,
              mapConfig) {

    // Construct the views for the tabs.
    this._baseLayerTab = new AddLayersTab(
      supportedBaseLayersModel,
      availableBaseLayersModel,
      activeBaseLayersModel,
      mapConfig
    );
    this._overlayLayerTab = new AddLayersTab(
      supportedOverlayLayersModel,
      availableOverlayLayersModel,
      activeOverlayLayersModel,
      mapConfig
    );
  };

  /**
   * Render the modal for the user to make a selection.
   */
  render() {

    // Remove any previous instances of the modal from the body.
    $(`#${NAME}`).remove();

    // Append the template afresh to the body and capture the reference.
    $('body').append(TEMPLATE);
    const $modal = $(`#${NAME}`);

    this._baseLayerTab.render($modal.find(`#${BASE_LAYERS_PANEL_NAME}`));
    this._overlayLayerTab.render($modal.find(`#${OVERLAY_LAYERS_PANEL_NAME}`));

    // Handle the user clicking Save.
    $modal.find('.btn-save').click(function(event) {

      this._baseLayerTab.save();
      this._overlayLayerTab.save();

      // Hide the modal.
      $modal.modal('hide');

      this._map
    }.bind(this));

    // Handle the dialog being closed by removing it from the DOM.
    $modal.on('hidden.bs.modal', (event) => {
      $(event.target).remove();
    });

    // Display the modal.
    $modal.modal('show');

  }

}
