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

  return new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: url,
      projection: projection,
      params: params
    }),
    zIndex: zIndex
  });

};
