import AvailableBaseLayersListView from './available-base-layers-list-view';
import AvailableLayersChangeHandler from './available-layers-change-handler';
import AvailableOverlayLayersListView from './available-overlay-layers-list-view';

const { v4: uuidv4 } = require('uuid');
const Sortable = require('sortablejs');
const $ = global.$ || global.jQuery || require('jquery');
require('bootstrap');

const NAME = 'mapping-client-show-layers-dialog-content';
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
   * component should insert itself.
   * @param availableBaseLayersModel {SimpleModel}
   * @param activeBaseLayersModel
   * @param availableOverlayLayersModel
   * @param activeOverlayLayersModel
   */
  constructor(
    availableBaseLayersModel,
    activeBaseLayersModel,
    availableOverlayLayersModel,
    activeOverlayLayersModel,
  ) {

    // Cache the references.
    this._availableBaseLayersModel = availableBaseLayersModel;
    this._activeBaseLayersModel = activeBaseLayersModel;
    this._availableOverlayLayersModel = availableOverlayLayersModel;
    this._activeOverlayLayersModel = activeOverlayLayersModel;

    // Create element
    this._$el = $(TEMPLATE);

    // Hook up the list renderers.
    const $baseLayersList = this._$el.find('.base-layers-list');
    const availableBaseLayersListView = new AvailableBaseLayersListView(
      availableBaseLayersModel,
      activeBaseLayersModel,
      $baseLayersList,
    );
    new AvailableLayersChangeHandler(
      activeBaseLayersModel,
      availableBaseLayersModel,
      availableBaseLayersListView,
      $baseLayersList,
      false,
    );

    const $overlayLayersList = this._$el.find('.overlay-layers-list');
    const availableOverlayLayersListView = new AvailableOverlayLayersListView(
      availableOverlayLayersModel,
      activeOverlayLayersModel,
      $overlayLayersList,
    );
    const availableLayersChangeHandler = new AvailableLayersChangeHandler(
      activeOverlayLayersModel,
      availableOverlayLayersModel,
      availableOverlayLayersListView,
      $overlayLayersList,
      true,
    );

    // make list sortable
    Sortable.create($overlayLayersList.get(0), {
      ghostClass: 'sortable-ghost', // Class name for the drop placeholder
      dragClass: 'sortable-drag', // Class name for the dragging item
      handle: '.layer-drag-handle',
      onEnd: availableLayersChangeHandler.handleChange.bind(availableLayersChangeHandler),
    });
  }

  /**
   * Public API method for adding a toggle-able option to the Show Layers dialog.
   *
   * @param text the text to display for the toggle-able option.
   * @param defaultState the default state of the option (true/false).
   * @param onClickHandler the handler to invoke when the user clicks the toggle/checkbox.
   */
  addToggleOption(text, defaultState, onClickHandler) {
    const toggleId = uuidv4();
    this._$el.append(`
      <div>
        <input type="checkbox" name="${toggleId}" id="${toggleId}" ${defaultState ? "checked" : ""}>
        <b>${text}</b>
      </div>
    `);
    this._$el.find(`#${toggleId}`).click(onClickHandler);
  }

  /**
   * Method invoked when the display state of the dialog should be toggled between `shown` and
   * `hidden`.
   */
  render() {
    return this._$el;
  }

}
