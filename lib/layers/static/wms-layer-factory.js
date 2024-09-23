/**
 * Factory for instantiating a WMS layer.
 */

const OlTileLayer = (global.ol ? global.ol.layer.Tile : require('ol/layer/Tile').default);
const OlWmsTileSource = (global.ol ? global.ol.source.TileWMS : require('ol/source/TileWMS').default);

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

  const olLayer = new OlTileLayer({
    source: new OlWmsTileSource({
      url,
      projection,
      params,
      crossOrigin: 'anonymous',
    }),
    zIndex,
    opacity: parseFloat(layer.opacity),
  });
  olLayer.set('layerId', layer.layerId);

  return olLayer;
}
