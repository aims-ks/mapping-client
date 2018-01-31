/**
 * Package of map-related functionality.
 *
 * @module aims-map
 */

// Make classes available.
import MapClient from './lib/map-client';
export { MapClient };

import AbstractLegendBuilder from './lib/components/legend/abstract-legend-builder';
export { AbstractLegendBuilder };

import AbstractDynamicLayerStyleSelector from './lib/layers/dynamic/dynamic-layer-style-selector';
export { AbstractDynamicLayerStyleSelector };

import DynamicLayersFeatureSelector from './lib/layers/dynamic/dynamic-layers-feature-selector';
export { DynamicLayersFeatureSelector };

import DynamicLayersRenderManager from './lib/layers/dynamic/dynamic-layers-render-manager';
export { DynamicLayersRenderManager };

import StaticLayersRenderManager from './lib/layers/static/static-layers-render-manager';
export { StaticLayersRenderManager };

// Include polyfills
import 'babel-polyfill';

// Include basic CSS
import './lib/styles/app.scss'
