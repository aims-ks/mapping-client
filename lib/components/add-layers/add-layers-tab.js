/**
 * The View for the modal for adding layers to the map.
 */
import TreeComponent from './tree-component';

const $ = global.$ || global.jQuery || require('jquery');

export default class AddLayersTab {

  /**
   * Constructor.
   */
  constructor(
    supportedLayersModel,
    availableLayersModel,
    activeLayersModel,
    mapConfig,
    supportedLayersManager,
  ) {
    this._supportedLayersModel = supportedLayersModel;
    this._availableLayersModel = availableLayersModel;
    this._activeLayersModel = activeLayersModel;
    this._mapConfig = mapConfig;
    this._supportedLayersManager = supportedLayersManager;
  }

  /**
   * Render the modal for the user to make a selection.
   */
  render($el) {
    this._treeComponent = new TreeComponent(
      this._supportedLayersModel.getLayers(),
      $el,
    );
    this._treeComponent
      .on(this._treeComponent.EVENT_LEAF_CLICK, this._layerSelectionHandler.bind(this));
    this._treeComponent.render();
  }

  /**
   * Save any changes on the tab.
   */
  save() {
    // Identify the selections.
    const $selections = this._treeComponent._$el.find('input[type=checkbox]:checked');

    // Add the selections to the AvailableLayersModel.
    const activeLayers = this._activeLayersModel.getLayers();
    const availableLayers = this._availableLayersModel.getLayers();
    const supportedLayers = this._supportedLayersModel.getLayers();
    $selections.each((index, element) => {
      const layerId = $(element).attr('id');

      // Find the corresponding layer in the list of supported layers.
      const supportedLayer = supportedLayers
        .find((_supportedLayer) => _supportedLayer.layerId === layerId);

      // Add the layer to the Available layers and Active layers if it hasn't already been added.
      if (supportedLayer) {
        const isFoundInAvailableLayers = availableLayers
          .some((_availableLayer) => _availableLayer.layerId === layerId);

        if (!isFoundInAvailableLayers) {
          availableLayers.push(supportedLayer);
        }
        const isFoundInActiveLayers = activeLayers
          .some((_activeLayer) => _activeLayer.layerId === layerId);

        if (!isFoundInActiveLayers) {
          activeLayers.push(supportedLayer);
        }
      }

    });
    this._availableLayersModel.setLayers(availableLayers);
    this._activeLayersModel.setLayers(activeLayers);
  }

  /**
   * Handler to download information about the selected layer if not already performed.
   *
   * TODO: This handler should be refactored out of this class.
   */
  _layerSelectionHandler(event) {
    const $targetEl = $(event.delegateTarget);
    const id = $targetEl.attr('data-id');
    const supportedLayersModel = this._supportedLayersModel;

    // Has the download been performed already?
    if (!$targetEl.hasClass('download-success') && !$targetEl.hasClass('download-failed')) {

      // Mark the layer as being selected.
      $targetEl.addClass('downloading');

      // Download the layer info.
      $.ajax({
        url: `//${this._mapConfig.host}/${this._mapConfig.layerInfoServiceUrl}?client=${this._mapConfig.clientId}&layerIds=${id}`,
      }).done((data) => {
        const supportedLayer = supportedLayersModel.findByLayerId(id);
        const cachedLayer = data.data[id];
        if (cachedLayer) {
          // Set TIME variable if it exists in options
          // and is not already set from layer configuration.
          if (
            Object.prototype.hasOwnProperty.call(cachedLayer, 'options')
            && !Object.prototype.hasOwnProperty.call(supportedLayer, 'time')
          ) {
            const timeItem = cachedLayer.options.find((item) => item.name === 'TIME');
            if (timeItem) {
              supportedLayer.time = timeItem.defaultValue;
            }
          }

          Object.keys(cachedLayer).forEach((key) => {
            supportedLayer[key] = cachedLayer[key];
          });
        }

        if (Object.prototype.hasOwnProperty.call(supportedLayer, 'hasLegend')) {
          supportedLayer.hasLegend = !(supportedLayer.hasLegend === 'false' || supportedLayer.hasLegend === false);
        } else {
          supportedLayer.hasLegend = true;
        }
        supportedLayersModel.updateLayer(supportedLayer);

        $targetEl.addClass('download-success');
      }).fail(() => {
        $targetEl.addClass('download-failed');
      }).always(() => {
        $targetEl.removeClass('downloading');
      });

    }
  }

}
