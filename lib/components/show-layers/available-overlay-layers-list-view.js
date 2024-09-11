import AbstractAvailableLayersListView from './abstract-available-layers-list-view';
import LayerSettingsDialog from './layer-settings-dialog';
import ActionButton from './../user-interface/action-button';

const $ = global.$ || global.jQuery || require('jquery');

/**
 * Extends AbstractAvailableLayersListView to render the layer for Overlay layers.
 */
export default class AvailableOverlayLayersListView extends AbstractAvailableLayersListView {

  /**
   * Render the layer element.
   */
  renderLayer(layer, status) {
    let $el = $(`<li data-layer-id="${layer.layerId}"><span class="layer-drag-handle"><i class="material-icons">drag_handle</i></span><input type="checkbox" class="aims-layer-input" name="active-overlays-layer" value="${layer.layerId}" ${status.selected ? "checked" : ""}> ${layer.title}</li>`);
    $el.data('status', status);
    let settingsDialog = new LayerSettingsDialog(layer, this._activeLayersModel);
    let settingsButton = new ActionButton(
      'mapping-client-layer-settings-button',
      'Layer settings',
      'settings',
      () => {
        settingsDialog.toggle();
        $el.data('status').settingsActive = settingsDialog.isActive;
      }
    );
    $el.append(settingsDialog.render());
    $el.append(settingsButton.render());

    // show settings dialog if it has been active before, otherwise hide it
    if (status.settingsActive) {
      settingsDialog.show();
    } else {
      settingsDialog.hide();
    }

    return $el;
  }

}
