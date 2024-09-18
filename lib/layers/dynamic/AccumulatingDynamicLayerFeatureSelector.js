import DynamicLayerFeatureSelector from "./DynamicLayerFeatureSelector";

const olEventsConditions = (global.ol ? global.ol.events.condition : require('ol/events/condition').default);
const olSelectInteraction = (global.ol ? global.ol.interaction.Select : require('ol/interaction/Select').default);

/**
 * Extends {@link DynamicLayerFeatureSelector} to provide functionality that accumulates selections
 * between mouse actions. For example, click a feature and it is selected, click another feature
 * and both features are selected.
 */
export default class AccumulatingDynamicLayerFeatureSelector extends DynamicLayerFeatureSelector {

  /**
   * Concrete implementation that configures an `olSelectInteraction` object for `accumulating`
   * selections instead of the default `toggle` action.
   *
   * @private
   */
  _makeSelectInteraction() {
    return new olSelectInteraction({
      addCondition: olEventsConditions.singleClick,
      toggleCondition: olEventsConditions.always,
    });
  }

}
