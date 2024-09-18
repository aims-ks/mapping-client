const $ = (global.$ || global.jQuery ? global.$ || global.jQuery : require('jquery'));
const DataSourceTransformer = require('./datasource-transformer');
const LayersTransformer = require('./layers-transformer');

/**
 * Helper responsible for loading the configuration information provided by the AtlasMapper,
 * performing any pre-processing/transformations.
 */
export default function load(host, url, disableDefaultOverlayLayer = false) {

  // Default value for URL if not specified.
  const configHost = host || 'maps.eatlas.org.au';
  const configUrl = url || 'config/main.json';

  // Return a promise that will be resolved after pre-processing/transformation is completed.
  return new Promise((resolve, reject) => {
    console.log('Loading AtlasMapper config.');
    $.ajax({
      url: `//${configHost}/${configUrl}`,
    }).done((downloadedMapConfig) => {
      const mapConfig = { ...downloadedMapConfig };
      mapConfig.host = configHost;

      if (disableDefaultOverlayLayer === true) {
        // only keep base layers
        mapConfig.defaultLayers = mapConfig.defaultLayers.filter((layer) => !!layer.isBaseLayer);
      }

      // Loading complete, now perform in-place pre-processing/transformations.
      DataSourceTransformer.process(mapConfig);
      LayersTransformer.process(mapConfig);

      // Resolve with an object that caches the return values.
      resolve(mapConfig);

    }).fail((jqXHR, textStatus, errorThrown) => {
      reject(errorThrown);
    });
  });
}
