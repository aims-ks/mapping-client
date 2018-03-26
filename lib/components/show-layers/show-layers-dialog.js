const Sortable = require('sortablejs');

require('bootstrap');

import AvailableBaseLayersListView from './available-base-layers-list-view';
import AvailableLayersChangeHandler from './available-layers-change-handler';
import AvailableOverlayLayersListView from './available-overlay-layers-list-view';

const NAME = 'aims-map-show-layers-dialog-content';
const TEMPLATE = `
    <div class="${NAME}">
      <p><b>Overlays</b></p>
      <ul class="overlay-layers-list">
      </ul>
      <p><b>Base Layers</b></p>
      <ul class="base-layers-list">
      </ul>
    </div>
`;

/**
 * Component responsible for rendering a list of available layers.
 */
export default class ShowLayersDialog {

  /**
   * Constructor to cache the references, instantiate/cache the helpers, and inject itself into the
   * DOM.
   *
   * @param $parent {JQueryObject} A JQuery object representing the parent element into which this
   * component should insert itself.
   * @param availableBaseLayersModel {SimpleModel}
   * @param activeBaseLayersModel
   * @param availableOverlayLayersModel
   * @param activeOverlayLayersModel
   * {@code #render($parent)} is invoked.
   */
  constructor($parent, availableBaseLayersModel, activeBaseLayersModel, availableOverlayLayersModel,
              activeOverlayLayersModel) {

    // Cache the references.
    this._availableBaseLayersModel = availableBaseLayersModel;
    this._activeBaseLayersModel = activeBaseLayersModel;
    this._availableOverlayLayersModel = availableOverlayLayersModel;
    this._activeOverlayLayersModel = activeOverlayLayersModel;

    // Create element
    this.$el = $(TEMPLATE);

    // Hook up the list renderers.
    const _$baseLayersList = this.$el.find('.base-layers-list');
    const availableBaseLayersListView = new AvailableBaseLayersListView(
      availableBaseLayersModel,
      activeBaseLayersModel,
      _$baseLayersList
    );
    new AvailableLayersChangeHandler(
      activeBaseLayersModel,
      availableBaseLayersModel,
      availableBaseLayersListView,
      _$baseLayersList,
      false
    );

    const _$overlayLayersList = this.$el.find('.overlay-layers-list');
    const availableOverlayLayersListView = new AvailableOverlayLayersListView(
      availableOverlayLayersModel,
      activeOverlayLayersModel,
      _$overlayLayersList
    );
    const availableLayersChangeHandler = new AvailableLayersChangeHandler(
      activeOverlayLayersModel,
      availableOverlayLayersModel,
      availableOverlayLayersListView,
      _$overlayLayersList,
      true
    );

   // make list sortable
    Sortable.create(_$overlayLayersList.get(0),{
      ghostClass: "dragging",
      handle: ".layer-drag-handle",
      onEnd: availableLayersChangeHandler.handleChange.bind(availableLayersChangeHandler)
    });

    // Render action buttons.
    // const _$actionsEl = this.$el.find('.aims-actions');
    // actionButtons.forEach((actionButton) => {
    //   actionButton.render(_$actionsEl);
    // });

  };

  // /**
  //  * Public API method for adding a toggle-able option to the Show Layers dialog.
  //  *
  //  * @param text the text to display for the toggle-able option.
  //  * @param defaultState the default state of the option (true/false).
  //  * @param onClickHandler the handler to invoke when the user clicks the toggle/checkbox.
  //  */
  // addToggleOption(text, defaultState, onClickHandler) {
  //   const toggleId = uuidv4();
  //   this.$el.find('.aims-section-content').append(`
  //     <div>
  //       <input type="checkbox" name="${toggleId}" id="${toggleId}" ${defaultState ? "checked" : ""}>
  //       <b>${text}</b>
  //     </div>
  //
  //   `);
  //   this.$el.find(`#${toggleId}`).click(onClickHandler);
  // }

  /**
   * Method invoked when the display state of the dialog should be toggled between `shown` and
   * `hidden`.
   */
  render() {
    return this.$el;
  }

}
