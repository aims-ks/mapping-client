/**
 * The View for the modal for adding layers to the map.
 */
const $ = global.$ || global.jQuery || require('jquery');

import TreeComponent from './tree-component';

export default class AddLayersTab {

  /**
   * Constructor.
   */
  constructor(supportedLayersModel, availableLayersModel, activeLayersModel, mapConfig, supportedLayersManager) {
    this._supportedLayersModel = supportedLayersModel;
    this._availableLayersModel = availableLayersModel;
    this._activeLayersModel = activeLayersModel;
    this._mapConfig = mapConfig;
    this._supportedLayersManager = supportedLayersManager;
  };

  /**
   * Render the modal for the user to make a selection.
   */
  render($el) {
    this._treeComponent = new TreeComponent(
      this._supportedLayersModel.getLayers(),
      $el
    );
    this._treeComponent.on(this._treeComponent.EVENT_LEAF_CLICK, this._layerSelectionHandler.bind(this));
    this._treeComponent.render();
  };

  /**
   * Save any changes on the tab.
   */
  save() {

    // Identify the selections.
    const $selections = this._treeComponent._$el.find('input[type=checkbox]:checked');

    // Add the selections to the AvailableLayersModel.
    const _activeLayers = this._activeLayersModel.getLayers();
    const _availableLayers = this._availableLayersModel.getLayers();
    const _supportedLayers = this._supportedLayersModel.getLayers();
    $selections.each((index, element) => {
      const layerId = $(element).attr('id');

      // Find the corresponding layer in the list of supported layers.
      const _supportedLayer = _supportedLayers.find((_supportedLayer) => {
        return _supportedLayer.layerId == layerId;
      });

      // Add the layer to the Available layers and Active layers if it hasn't already been added.
      if (_supportedLayer) {
        const isFoundInAvailableLayers = _availableLayers.some((_availableLayer) => {
          return _availableLayer.layerId == layerId;
        });
        if (!isFoundInAvailableLayers) {
          _availableLayers.push(_supportedLayer);
        }
        const isFoundInActiveLayers = _activeLayers.some((_activeLayer) => {
          return _activeLayer.layerId == layerId;
        });
        if (!isFoundInActiveLayers) {
          _activeLayers.push(_supportedLayer);
        }
      }

    });
    this._availableLayersModel.setLayers(_availableLayers);
    this._activeLayersModel.setLayers(_activeLayers);
  };

  /**
   * Handler to download information about the selected layer if not already performed.
   *
   * TODO: This handler should be refactored out of this class.
   */
  _layerSelectionHandler(event) {
    const _$targetEl = $(event.delegateTarget);
    const _id = _$targetEl.attr('data-id');
    const _supportedLayersModel = this._supportedLayersModel;

    // Has the download been performed already?
    if (!_$targetEl.hasClass('download-success') && !_$targetEl.hasClass('download-failed')) {

      // Mark the layer as being selected.
      _$targetEl.addClass('downloading');

      // Download the layer info.
      $.ajax({
        url: '//' + this._mapConfig.host + '/' +
          this._mapConfig.layerInfoServiceUrl + '?' +
          'client=' + this._mapConfig.clientId + '&' +
          'layerIds=' + _id
      }).done(function(data) {
        const supportedLayer = _supportedLayersModel.findByLayerId(_id);
        const cachedLayer = data.data[_id];
        if (cachedLayer) {
          Object.keys(cachedLayer).forEach((key) => {
            supportedLayer[key] = cachedLayer[key];
          });
        }
        _$targetEl.addClass('download-success');
      }).fail(function() {
        _$targetEl.addClass('download-failed');
      }).always(function() {
        _$targetEl.removeClass('downloading');
      });

    }
  }

}
