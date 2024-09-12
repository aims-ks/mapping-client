/**
 * Main class for instantiating the map client.
 */
import ConfigLoader from './config/config-loader';
import DynamicLayersAPI from './layers/dynamic/dynamic-layers-api';
import LayerModelsLoader from './layers/models/models-loader';
import StaticLayersAPI from './layers/static/static-layers-api';
import StaticLayersRenderManager from './layers/static/static-layers-render-manager';
import ComponentsBuilder from './components/components-builder';

const $ = global.$ || global.jQuery || require('jquery');
const OLInteraction = (global.ol ? global.ol.interaction : require('ol/interaction').default);
const OLMap = (global.ol ? global.ol.Map : require('ol/Map').default);
const OLView = (global.ol ? global.ol.View : require('ol/View').default);
const OLControl = (global.ol ? global.ol.control : require('ol/control').default);
const OLProjection = (global.ol ? global.ol.proj : require('ol/proj').default);

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
    ).then((mapConfig) => {

      // Assign options to mapConfig
      mapConfig.host = this._options.mapConfigHost;

      // Instantiate the OpenLayers Map object.
      const projection = this._options.projection || mapConfig.projection || defaultProjection;
      this._options.centre = this._options.centre || {};
      const longitude = this._options.centre.longitude || mapConfig.startingLocation[0];
      const latitude = this._options.centre.latitude || mapConfig.startingLocation[1];

      let center = [longitude, latitude];
      if (projection !== defaultProjection) {
        center = OLProjection.fromLonLat(center, projection);
      }

      const zoom = this._options.zoom || mapConfig.startingLocation[2];
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
      const OVERLAY_LAYERS_Z_INDEX = -1;
      const overlayLayersRenderManager = new StaticLayersRenderManager(
        this._olMap,
        this._layerModelsLoader.getActiveOverlayLayersModel(),
        mapConfig,
        OVERLAY_LAYERS_Z_INDEX,
      );

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
