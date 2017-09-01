/**
 * Package of map-related functionality.
 *
 * @module aims-map
 */

import ol from 'openlayers';

// Make classes available.
import MapBaseLayersModel from './lib/base-layer/base-layers-model';
export { MapBaseLayersModel };

import MapActiveBaseLayerView from './lib/base-layer/active-base-layers-view';
export { MapActiveBaseLayerView };

import MapDataLayerModelAdapter from './lib/data-layer/data-layer-model-adapter';
export { MapDataLayerModelAdapter };

import MapDataLayerView from './lib/data-layer/data-layer-view';
export { MapDataLayerView };

import StyleManager from './lib/data-layer/data-layer-style-manager';
export { StyleManager };

/**
 * Render the map with the specified `options`.
 *
 * @param options.target {string} The element ID in which to render the map. Default value is
 * `map`.
 * @param options.lon {number} The longitude on which to centre the map. Default value is `148.2`.
 * @param options.lat {number} The latitude on which to centre the map. Default value is `-17.8`.
 * @param options.zoom {int} The initial zoom of the map.
 * @returns {ol.Map} An OpenLayers `map` object for manipulation.
 */
const render = function(options) {

  // Set default values for the options if required.
  options = options || {};

  options.target = options.target || 'map';

  options.lon = options.lon || 148.2;
  options.lat = options.lat || -17.8;

  options.zoom = options.zoom || 6;

  // Render the map.
  const map = new ol.Map({
    target: options.target,
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [options.lon, options.lat],
      zoom: options.zoom
    })
  });

  return map;

};

export { render };
