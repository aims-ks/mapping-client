import AbstractAvailableLayersListView from './AbstractAvailableLayersListView';
import LayerSettingsDialog from './LayerSettingsDialog';
import ActionButton from '../user-interface/ActionButton';

const $ = (global.$ || global.jQuery ? global.$ || global.jQuery : require('jquery'));

/**
 * Extends AbstractAvailableLayersListView to render the layer for Overlay layers.
 */
export default class AvailableOverlayLayersListView extends AbstractAvailableLayersListView {

  /**
   * Render the layer element.
   */
  renderLayer(layer, status) {
    const $el = $(`<li data-layer-id="${layer.layerId}"><span class="layer-drag-handle"><i class="material-icons">drag_handle</i></span><input type="checkbox" class="aims-layer-input" name="active-overlays-layer" value="${layer.layerId}" ${status.selected ? "checked" : ""}> ${layer.title}</li>`);
    $el.data('status', status);
    const settingsDialog = new LayerSettingsDialog(layer, this._activeLayersModel);
    settingsDialog.init();

    const settingsButton = new ActionButton(
      'mapping-client-layer-settings-button',
      'Layer settings',
      'settings',
      () => {
        settingsDialog.toggle();
        $el.data('status').settingsActive = settingsDialog.isActive;
      },
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
