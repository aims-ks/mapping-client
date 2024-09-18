import AbstractAvailableLayersListView from './AbstractAvailableLayersListView';

/**
 * Extends AbstractAvailableLayersListView to render the layer for Base layers.
 */
export default class AvailableBaseLayersListView extends AbstractAvailableLayersListView {

  /**
   * Render the layer element.
   */
  renderLayer(layer, status) {
    return `<li><input type="radio" class="aims-layer-input" name="active-base-layer" value="${layer.layerId}" ${status.selected ? "checked" : ""}> ${layer.title}</li>`;
  }

}
