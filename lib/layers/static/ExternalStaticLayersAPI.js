export default class ExternalStaticLayersAPI {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   */
  constructor(availableBaseLayersModel, activeBaseLayersModel, availableLayersModel, activeLayersModel) {
    // Cache the references.
    this._availableBaseLayersModel = availableBaseLayersModel;
    this._activeBaseLayersModel = activeBaseLayersModel;
    this._availableLayersModel = availableLayersModel;
    this._activeLayersModel = activeLayersModel;
  }

  /**
   * Utility method to add a layer to the list of `Available` layers. The layer must already be
   * a `Supported` layer.
   */
  addExternalLayer(originalLayerConfig) {
    return new Promise((resolve) => {
      const layerConfig = this.addLayerConfigDefaultValues(originalLayerConfig);
      if (layerConfig.baseLayer) {
        this._availableBaseLayersModel.setLayers(this._availableBaseLayersModel
          .getLayers().concat(layerConfig));
      } else {
        this._availableLayersModel.setLayers(this._availableLayersModel
          .getLayers().concat(layerConfig));
      }
      resolve();
    });
  }

  /**
   * Add layer at a certain position (index)
   * @param originalLayerConfig
   * @param index
   */
  insertExternalLayer(originalLayerConfig, index) {
    return new Promise((resolve) => {
      const layerConfig = this.addLayerConfigDefaultValues(originalLayerConfig);
      if (layerConfig.baseLayer) {
        const layers = this._availableBaseLayersModel.getLayers();
        layers.splice(index, 0, layerConfig);
        this._availableBaseLayersModel.setLayers(layers);
      } else {
        const layers = this._availableLayersModel.getLayers();
        layers.splice(index, 0, layerConfig);
        this._availableLayersModel.setLayers(layers);
      }
      resolve();
    });
  }

  /**
   * layerName
   * style
   * opacity
   * title
   * serverUrl = "https://maps.atlas.parksaustralia.gov.au/maps"
   * description
   * layerType = "WMS"
   * baseLayer = true / false
   **/
  addLayerConfigDefaultValues(layerConfig) {
    const serviceUrl = layerConfig.serverUrl + '/wms?';
    const webCacheUrl = layerConfig.serverUrl + '/gwc/service/wms';

    const baseLayer = !!layerConfig.baseLayer;

    const configDefaultValues = {
      'layerId': baseLayer ? 'extBaseLayer_' + layerConfig.layerName : 'extOverlayLayer_' + layerConfig.layerName,
      'title': 'Untitled',
      'description': '',
      'layerType': 'WMS',
      'shortLayerId': layerConfig.layerName,
      'style': '',
      'legendUrl': serviceUrl,
      'opacity': 1,
      'wmsVersion': '1.1.1',
      'serviceUrl': serviceUrl,
      'legendParameters': {
        'FORMAT': 'image/png',
        'WIDTH': '20',
        'HEIGHT': '10'
      },
      'webCacheEnable': true,
      'featureRequestsUrl': serviceUrl,
      'webCacheSupportedParameters': [
        'LAYERS',
        'TRANSPARENT',
        'SERVICE',
        'VERSION',
        'REQUEST',
        'EXCEPTIONS',
        'FORMAT',
        'CRS',
        'SRS',
        'BBOX',
        'WIDTH',
        'HEIGHT',
        'STYLES'
      ],
      'legendDpiSupport': true,
      'showInLegend': true,
      'webCacheUrl': webCacheUrl,
      'cacheWmsVersion': '1.1.1',
      'status': 'OKAY',
      'wmsQueryable': true,
      'cached': true,
      'hasLegend': true,
      'baseLayer': baseLayer,
    };

    return {
      ...configDefaultValues,
      ...layerConfig,
    };
  }

  /**
   * Utility method to add a layer to the list of `Active` layers. The layer must already be an
   * `Available` layer.
   * @param layerName
   */
  addActiveLayer(layerName) {
    const layerId = 'extOverlayLayer_' + layerName;
    const layer = this._availableLayersModel.findByLayerId(layerId);
    if (layer) {
      const layers = this._activeLayersModel.getLayers();
      layers.splice(this._availableLayersModel.getIndex(layer), 0, layer);
      this._activeLayersModel.setLayers(layers);
    } else {
      this.addActiveBaseLayer(layerName);
    }
  }

  addActiveBaseLayer(layerName) {
    const layerId = 'extBaseLayer_' + layerName;
    const layer = this._availableBaseLayersModel.findByLayerId(layerId);
    if (layer) {
      const layers = this._activeBaseLayersModel.getLayers();
      layers.splice(this._availableBaseLayersModel.getIndex(layer), 0, layer);
      this._activeBaseLayersModel.setLayers(layers);
    }
  }

}
