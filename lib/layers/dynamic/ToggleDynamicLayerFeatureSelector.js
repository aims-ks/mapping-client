import DynamicLayerFeatureSelector from "./DynamicLayerFeatureSelector";

const olSelectInteraction = (global.ol ? global.ol.interaction.Select : require('ol/interaction/Select').default);

/**
 * Extends {@link DynamicLayerFeatureSelector} to provide functionality that toggles selections
 * between mouse actions. For example, click a feature and it is selected, click another feature
 * and the first feature is de-selected and the second feature is selected. This is generally the
 * default action of a feature selector.
 */
export default class ToggleDynamicLayerFeatureSelector extends DynamicLayerFeatureSelector {

  /**
   * Concrete implementation that instantiates an `olSelectInteraction` object with the default
   * behaviour of toggling selections.
   *
   * @private
   */
  _makeSelectInteraction() {
    return new olSelectInteraction();
  }

  /**
   * Clear all existing selections.
   */
  _preHandleOnDragBoxEndEvent(event, addFeatures, removedFeatures) {
    Object.keys(this._selectedFeatures).forEach((key) => {
      const aimsDataItem = this._selectedFeatures[key];
      removedFeatures.push(aimsDataItem);
    });
  }

}
