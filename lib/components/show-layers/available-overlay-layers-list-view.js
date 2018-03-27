import AbstractAvailableLayersListView from './abstract-available-layers-list-view';
import LayerSettingsDialog from './layer-settings-dialog';
import LayerSettingsButton from './layer-settings-button';

const $ = global.$ || global.jQuery || require('jquery');

/**
 * Extends AbstractAvailableLayersListView to render the layer for Overlay layers.
 */
export default class AvailableOverlayLayersListView extends AbstractAvailableLayersListView {

  /**
   * Render the layer element.
   */
  renderLayer(layer, isSelected) {
    let $el = $(`<li><span class="layer-drag-handle"><i class="material-icons">drag_handle</i></span><input type="checkbox" class="aims-layer-input" name="active-overlays-layer" value="${layer.layerId}" ${isSelected ? "checked" : ""}> ${layer.title}</li>`);
    new LayerSettingsButton($el, new LayerSettingsDialog($el, layer, this._activeLayersModel));

    return $el;
  }

}
