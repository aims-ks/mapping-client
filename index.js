/**
 * Package of map-related functionality.
 *
 * @module aims-map
 */

import ol from 'openlayers';

// Make classes available.
import SimpleLayerModel from './lib/models/simple-layer-model';
export { SimpleLayerModel };

import SingleLayerModel from './lib/models/single-layer-model';
export { SingleLayerModel };

import DataLayerStyleManager from './lib/styles/data-layer-style-manager';
export { DataLayerStyleManager };

import DataLayerView from './lib/views/data-layer-view';
export { DataLayerView };

import TiledLayerView from './lib/views/tiled-layers-view';
export { TiledLayerView };

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
