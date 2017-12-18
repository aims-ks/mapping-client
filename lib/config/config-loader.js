const DataSourceTransformer = require('./datasource-transformer');
const LayersTransformer = require('./layers-transformer');

/**
 * Helper responsible for loading the configuration information provided by the AtlasMapper,
 * performing any pre-processing/transformations.
 */
module.exports = {
  load: function (url) {

    // Default value for URL if not specified.
    const _url = (url ? url : '//maps.eatlas.org.au/config/main.json');

    // Return a promise that will be resolved after pre-processing/transformation is completed.
    return new Promise((resolve, reject) => {
      console.log('Loading AtlasMapper config.');
      $.ajax({
        url: _url
      }).done((mapConfig) => {

        // Loading complete, now perform in-place pre-processing/transformations.
        DataSourceTransformer.process(mapConfig);
        LayersTransformer.process(mapConfig);

        // Resolve with an object that caches the return values.
        resolve(mapConfig);

      }).fail(function (jqXHR, textStatus, errorThrown) {
        reject(errorThrown);
      });
    });
  }
}