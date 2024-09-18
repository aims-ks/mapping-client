import DynamicLayerFeatureSelector from './DynamicLayerFeatureSelector';

const OlEventsConditions = (global.ol ? global.ol.events.condition : require('ol/events/condition').default);
const OlSelectInteraction = (global.ol ? global.ol.interaction.Select : require('ol/interaction/Select').default);

/**
 * Extends {@link DynamicLayerFeatureSelector} to provide functionality that accumulates selections
 * between mouse actions. For example, click a feature and it is selected, click another feature
 * and both features are selected.
 */
export default class AccumulatingDynamicLayerFeatureSelector extends DynamicLayerFeatureSelector {

  /**
   * Concrete implementation that configures an `OlSelectInteraction` object for `accumulating`
   * selections instead of the default `toggle` action.
   *
   * @private
   */
  _makeSelectInteraction() {
    return new OlSelectInteraction({
      addCondition: OlEventsConditions.singleClick,
      toggleCondition: OlEventsConditions.always,
    });
  }

}
