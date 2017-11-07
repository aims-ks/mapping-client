/**
 * Factory for instantiating a WMS layer.
 */

const ol = require('openlayers');

export function make(layer, dataSource, projection, zIndex) {

  const url = (dataSource.webCacheEnable ? dataSource.webCacheUrl : dataSource.serviceUrl);

  const params = {
    SERVICE: dataSource.layerType,
    VERSION: dataSource.wmsVersion,
    REQUEST: "GetMap",
    LAYERS: layer.layerName || layer.shortLayerId,
    QUERY_LAYERS: layer.layerName,
  };

  // Some WMS server require 1.1.1 parameters even when the layer has been requested as 1.3.0 (and vice versa)
  // so the easiest and more strait forward way to ensure the feature request works is to always add both set
  // of parameters.

  // For version 1.3.0
  params.CRS = projection;

  // For version 1.1.1
  params.SRS = projection;

  return new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: url,
      params: params
    }),
    zIndex: zIndex
  });

};
