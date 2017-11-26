const AvailableBaseLayersListView = require('./available-base-layers-list-view');
const AvailableLayersSelectionHandler = require('./available-layers-selection-handler');
const AvailableOverlayLayersListView = require('./available-overlay-layers-list-view');

const NAME = 'aims-map-show-layers-dialog';
const TEMPLATE = `
    <div class="${NAME} aims-section aims-section-default" style="display: none;">
        <div class="aims-section-header">
            <span class="aims-title">Layers</span>
            <div class="aims-actions">
            </div>
        </div>
        <div class="aims-section-content">
            <p><b>Overlays</b></p>
            <ul class="overlay-layers-list">
            </ul>
            <p><b>Base Layers</b></p>
            <ul class="base-layers-list">
            </ul>
        </div>
    </div>
`;

/**
 * Component responsible for rendering a list of available layers.
 */
module.exports = class ShowLayersDialog {

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
   * @param actionButtons {array} An array of action button components that render themselves when
   * {@code #render($parent)} is invoked.
   */
  constructor($parent, availableBaseLayersModel, activeBaseLayersModel, availableOverlayLayersModel,
              activeOverlayLayersModel, actionButtons) {

    // Cache the references.
    this._availableBaseLayersModel = availableBaseLayersModel;
    this._activeBaseLayersModel = activeBaseLayersModel;
    this._availableOverlayLayersModel = availableOverlayLayersModel;
    this._activeOverlayLayersModel = activeOverlayLayersModel;

    // Insert itself into the DOM at the parent element.
    $parent.append(TEMPLATE);
    this.$el = $parent.find(`.${NAME}`);

    // Hook up the list renderers.
    const _$baseLayersList = this.$el.find('.base-layers-list');
    const availableBaseLayersListView = new AvailableBaseLayersListView(
      availableBaseLayersModel,
      activeBaseLayersModel,
      _$baseLayersList
    );
    new AvailableLayersSelectionHandler(
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
    new AvailableLayersSelectionHandler(
      activeOverlayLayersModel,
      availableOverlayLayersModel,
      availableOverlayLayersListView,
      _$overlayLayersList,
      true
    );

    // Render action buttons.
    const _$actionsEl = this.$el.find('.aims-actions');
    actionButtons.forEach((actionButton) => {
      actionButton.render(_$actionsEl);
    });

  };

  /**
   * Method invoked when the display state of the dialog should be toggled between `shown` and
   * `hidden`.
   */
  toggle() {
    this.$el.toggle();
  }

}
