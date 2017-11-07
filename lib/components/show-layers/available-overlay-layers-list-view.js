const $ = require('jquery');
import AbstractAvailableLayersListView from './abstract-available-layers-list-view';

/**
 * Extends AbstractAvailableLayersListView to render the layer for Overlay layers.
 */
module.exports = class AvailableBaseLayersListView extends AbstractAvailableLayersListView {

  /**
   * Render the layer element.
   */
  renderLayer(layer, isSelected) {
    return `<li><input type="checkbox" name="active-overlays-layer" value="${layer.layerId}" ${isSelected ? "checked" : ""}> ${layer.title}</li>`;
  }

}
