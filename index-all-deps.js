/**
 * Package of map-related functionality.
 *
 * @module mapping-client
 */

// Make classes available.
import MapClient from './lib/map-client';
import AbstractLegendBuilder from './lib/components/legend/abstract-legend-builder';
import AbstractDynamicLayerStyleSelector from './lib/layers/dynamic/dynamic-layer-feature-styler';
import {
  DynamicLayerFeatureSelector,
  AccumulatingDynamicLayerFeatureSelector,
  ToggleDynamicLayerFeatureSelector,
} from './lib/layers/dynamic/dynamic-layer-feature-selector';
import DynamicLayerRenderer from './lib/layers/dynamic/dynamic-layer-renderer';
import StaticLayersRenderManager from './lib/layers/static/static-layers-render-manager';
// Include for polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// Include basic CSS
import './lib/styles/app.scss';
// Include basic CSS
import 'ol/ol.css';

export { MapClient };
export { AbstractLegendBuilder };
export { AbstractDynamicLayerStyleSelector };
export {
  DynamicLayerFeatureSelector,
  AccumulatingDynamicLayerFeatureSelector,
  ToggleDynamicLayerFeatureSelector,
};
export { DynamicLayerRenderer };
export { StaticLayersRenderManager };
