/**
 * Factory for instantiating a WMS layer.
 */

const olTileLayer = (global.ol ? global.ol.layer.Tile : require('ol/layer/tile').default);
const olWmsTileSource = (global.ol ? global.ol.source.TileWMS : require('ol/source/tilewms').default);

export default function make(layer, dataSource, projection, zIndex) {

  const url = (dataSource.webCacheEnable ? dataSource.webCacheUrl : dataSource.serviceUrl);

  const params = {
    SERVICE: dataSource.layerType,
    VERSION: dataSource.wmsVersion,
    LAYERS: layer.layerName || layer.shortLayerId,
    QUERY_LAYERS: layer.layerName,
    STYLES: layer.style || ''
  };

  return new olTileLayer({
    source: new olWmsTileSource({
      url: url,
      projection: projection,
      params: params,
      crossOrigin: 'anonymous'
    }),
    zIndex: zIndex,
    opacity: layer.opacity
  });

};
