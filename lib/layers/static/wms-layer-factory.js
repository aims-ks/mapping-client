/**
 * Factory for instantiating a WMS layer.
 */

const olTileLayer = (global.ol ? global.ol.layer.Tile : require('ol/layer/tile'));
const olWmsTileSource = (global.ol ? global.ol.source.TileWMS : require('ol/source/tilewms'));

export default function make(layer, dataSource, projection, zIndex) {

  const url = (dataSource.webCacheEnable ? dataSource.webCacheUrl : dataSource.serviceUrl);

  const params = {
    SERVICE: dataSource.layerType,
    VERSION: dataSource.wmsVersion,
    REQUEST: "GetMap",
    LAYERS: layer.layerName || layer.shortLayerId,
    QUERY_LAYERS: layer.layerName,
  };

  return new olTileLayer({
    source: new olWmsTileSource({
      url: url,
      projection: projection,
      params: params
    }),
    zIndex: zIndex
  });

};
