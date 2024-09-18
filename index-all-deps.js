/**
 * Package of map-related functionality.
 *
 * @module mapping-client
 */

// Make classes available.
import MapClient from './lib/MapClient';
import AbstractLegendBuilder from './lib/components/legend/AbstractLegendBuilder';
import AbstractDynamicLayerStyleSelector from './lib/layers/dynamic/AbstractDynamicLayerFeatureStyler';
import DynamicLayerFeatureSelector from './lib/layers/dynamic/DynamicLayerFeatureSelector';
import AccumulatingDynamicLayerFeatureSelector from './lib/layers/dynamic/AccumulatingDynamicLayerFeatureSelector';
import ToggleDynamicLayerFeatureSelector from './lib/layers/dynamic/ToggleDynamicLayerFeatureSelector';
import DynamicLayerRenderer from './lib/layers/dynamic/DynamicLayerRenderer';
import StaticLayersRenderManager from './lib/layers/static/StaticLayersRenderManager';
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
export { DynamicLayerFeatureSelector };
export { AccumulatingDynamicLayerFeatureSelector };
export { ToggleDynamicLayerFeatureSelector };
export { DynamicLayerRenderer };
export { StaticLayersRenderManager };
