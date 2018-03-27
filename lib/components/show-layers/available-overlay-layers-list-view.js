import AbstractAvailableLayersListView from './abstract-available-layers-list-view';
import LayerSettingsDialog from './layer-settings-dialog';
import ActionButton from './../user-interface/action-button';

/**
 * Extends AbstractAvailableLayersListView to render the layer for Overlay layers.
 */
export default class AvailableOverlayLayersListView extends AbstractAvailableLayersListView {

  /**
   * Render the layer element.
   */
  renderLayer(layer, isSelected) {
    let $el = $(`<li><span class="layer-drag-handle"><i class="material-icons">drag_handle</i></span><input type="checkbox" name="active-overlays-layer" value="${layer.layerId}" ${isSelected ? "checked" : ""}> ${layer.title}</li>`);
    let settingsDialog = new LayerSettingsDialog($el, layer, this._activeLayersModel);
    let settingsButton = new ActionButton(
      'aims-map-layer-settings-button',
      'Layer settings',
      'settings',
      () => settingsDialog.toggle()
    );

    $el.append(settingsButton.render());

    return $el;
  }

}
