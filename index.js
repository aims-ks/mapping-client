/**
 * Package of map-related functionality.
 *
 * @module mapping-client
 */

// Make classes available.
import MapClient from './lib/MapClient';
import AbstractLegendBuilder from './lib/components/legend/AbstractLegendBuilder';
import AccumulatingDynamicLayerFeatureSelector from './lib/layers/dynamic/AccumulatingDynamicLayerFeatureSelector';
import ToggleDynamicLayerFeatureSelector from './lib/layers/dynamic/ToggleDynamicLayerFeatureSelector';
import AbstractDynamicLayerFeatureStyler from './lib/layers/dynamic/AbstractDynamicLayerFeatureStyler';
import DynamicLayerRenderer from './lib/layers/dynamic/DynamicLayerRenderer';
import StaticLayersRenderManager from './lib/layers/static/StaticLayersRenderManager';
// Include for polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// Include basic CSS
import './lib/styles/app.scss';

export { MapClient };
export { AbstractLegendBuilder };
export { AccumulatingDynamicLayerFeatureSelector };
export { ToggleDynamicLayerFeatureSelector };
export { AbstractDynamicLayerFeatureStyler };
export { DynamicLayerRenderer };
export { StaticLayersRenderManager };
