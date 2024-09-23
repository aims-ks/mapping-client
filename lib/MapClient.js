/**
 * Main class for instantiating the map client.
 */
import ConfigLoader from './config/config-loader';
import DynamicLayersAPI from './layers/dynamic/DynamicLayersAPI';
import LayerModelsLoader from './layers/models/LayerModelsLoader';
import StaticLayersAPI from './layers/static/StaticLayersAPI';
import StaticLayersRenderManager from './layers/static/StaticLayersRenderManager';
import ComponentsBuilder from './components/ComponentsBuilder';
import ExternalStaticLayersAPI from './layers/static/ExternalStaticLayersAPI';

const $ = (global.$ || global.jQuery ? global.$ || global.jQuery : require('jquery'));
const OLInteraction = (global.ol ? global.ol.interaction : require('ol/interaction'));
const OLMap = (global.ol ? global.ol.Map : require('ol/Map').default);
const OLView = (global.ol ? global.ol.View : require('ol/View').default);
const OLControl = (global.ol ? global.ol.control : require('ol/control'));
const OLProjection = (global.ol ? global.ol.proj : require('ol/proj'));

const defaultProjection = 'EPSG:4326';

export default class MapClient {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param target {String} The ID of the HTML element within which the Map Client is instantiated.
   * @param options
   */
  constructor(target, options) {

    // Cache the references.
    this._target = target;
    this._$target = $(this._target.startsWith('#') ? this._target : `#${this._target}`);
    this._options = options || {};
  }

  /**
   * Perform the initialisation.
   */
  init() {

    // Load the configuration.
    return ConfigLoader(
      this._options.mapConfigHost,
      this._options.mapConfigURL,
      this._options.disableDefaultOverlayLayer,
    ).then((originalMapConfig) => {
      // Assign options to mapConfig
      const mapConfig = { ...originalMapConfig, host: this._options.mapConfigHost };

      // Instantiate the OpenLayers Map object.
      const projection = this._options.projection || mapConfig.projection || defaultProjection;
      this._options.centre = this._options.centre || {};
      const longitude = parseFloat(this._options.centre.longitude || mapConfig.startingLocation[0]); // TODO: Won't work if longitude is set to 0 in options
      const latitude = parseFloat(this._options.centre.latitude || mapConfig.startingLocation[1]); // TODO: Won't work if latitude is set to 0 in options

      let center = [longitude, latitude];
      if (projection !== defaultProjection) {
        center = OLProjection.fromLonLat(center, projection);
      }

      const zoom = parseInt(this._options.zoom || mapConfig.startingLocation[2]); // TODO: Won't work if zoom is set to 0 in options
      this._olMap = new OLMap({
        target: this._target,
        view: new OLView({
          projection,
          center,
          zoom,
        }),
        interactions: OLInteraction.defaults({
          altShiftDragRotate: false,
          pinchRotate: false,
          mouseWheelZoom: false,
          doubleClickZoom: false,
        }),
        controls: OLControl.defaults({
          rotate: false,
          attributionOptions: ({
            collapsible: false,
          }),
        }),
      });

      // Load the layer models.
      this._layerModelsLoader = new LayerModelsLoader(mapConfig);
      this._baseLayersAPI = new StaticLayersAPI(
        this._layerModelsLoader.getSupportedBaseLayersModel(),
        this._layerModelsLoader.getAvailableBaseLayersModel(),
        this._layerModelsLoader.getActiveBaseLayersModel(),
        mapConfig,
      );

      this._externalLayersAPI = new ExternalStaticLayersAPI(
        this._layerModelsLoader.getAvailableBaseLayersModel(),
        this._layerModelsLoader.getActiveBaseLayersModel(),
        this._layerModelsLoader.getAvailableOverlayLayersModel(),
        this._layerModelsLoader.getActiveOverlayLayersModel(),
      );

      this._overlayLayersAPI = new StaticLayersAPI(
        this._layerModelsLoader.getSupportedOverlayLayersModel(),
        this._layerModelsLoader.getAvailableOverlayLayersModel(),
        this._layerModelsLoader.getActiveOverlayLayersModel(),
        mapConfig,
      );

      this._dynamicLayersAPI = new DynamicLayersAPI(this._olMap);

      // Wire up the map.
      const BASE_LAYERS_Z_INDEX = -2;
      const baseLayersRenderManager = new StaticLayersRenderManager(
        this._olMap,
        this._layerModelsLoader.getActiveBaseLayersModel(),
        mapConfig,
        BASE_LAYERS_Z_INDEX,
      );
      baseLayersRenderManager.init();

      const OVERLAY_LAYERS_Z_INDEX = -1;
      const overlayLayersRenderManager = new StaticLayersRenderManager(
        this._olMap,
        this._layerModelsLoader.getActiveOverlayLayersModel(),
        mapConfig,
        OVERLAY_LAYERS_Z_INDEX,
      );
      overlayLayersRenderManager.init();

      this._componentsBuilder = new ComponentsBuilder(
        mapConfig,
        this._layerModelsLoader,
        this._olMap,
      );
      this._componentsBuilder.build({
        disableLegend: this._options.disableLegend,
        disableAddLayers: this._options.disableAddLayers,
        disableShowLayers: this._options.disableShowLayers,
        disableMetadata: this._options.disableMetadata,
        disableFeatureRequests: this._options.disableFeatureRequests,
        featureRequestsResultsPosition: this._options.featureRequestsResultsPosition,
        featureRequestsWmsParams: this._options.featureRequestsWmsParams,
        defaultActiveComponent: this._options.defaultActiveComponent,
      }, this._$target);

      return mapConfig;
    });
  }

  getOlMap() {
    return this._olMap;
  }

  getBaseLayersAPI() {
    return this._baseLayersAPI;
  }

  getExternalLayersAPI() {
    return this._externalLayersAPI;
  }

  getDynamicLayersAPI() {
    return this._dynamicLayersAPI;
  }

  getOverlayLayersAPI() {
    return this._overlayLayersAPI;
  }

  getLegendAPI() {
    return this._componentsBuilder.legend;
  }

  getShowLayersDialogAPI() {
    return this._componentsBuilder.showLayersDialog;
  }

  getMetadataAPI() {
    return this._componentsBuilder.metadata;
  }

  getUserInterfaceAPI() {
    return this._componentsBuilder.userInterfaceComponent;
  }

  getEventListenerAPI() {
    return this._eventListenerManager;
  }

}
