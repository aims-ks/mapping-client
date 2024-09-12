/**
 * Factory for instantiating a WMS layer.
 */

const olTileLayer = (global.ol ? global.ol.layer.Tile : require('ol/layer/Tile').default);
const olWmsTileSource = (global.ol ? global.ol.source.TileWMS : require('ol/source/TileWMS').default);

export default function make(layer, dataSource, projection, zIndex) {

  const url = (
    dataSource.webCacheEnable && !layer.time ? dataSource.webCacheUrl : dataSource.serviceUrl
  );

  const params = {
    SERVICE: dataSource.layerType,
    VERSION: dataSource.wmsVersion,
    LAYERS: layer.layerName || layer.shortLayerId,
    QUERY_LAYERS: layer.layerName,
    STYLES: layer.style || '',
    TIME: layer.time || '',
  };

  const olLayer = new olTileLayer({
    source: new olWmsTileSource({
      url,
      projection,
      params,
      crossOrigin: 'anonymous',
    }),
    zIndex,
    opacity: layer.opacity,
  });
  olLayer.set('layerId', layer.layerId);

  return olLayer;
}
