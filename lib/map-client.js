/**
 * Main class for instantiating the map client.
 */
import GetFeatureInfoComponent from './components/get-feature-info/get-feature-info-component';

const $ = global.$ || global.jQuery || require('jquery');
const OLInteraction = (global.ol ? global.ol.interaction : require('ol/interaction').default);
const OLMap = (global.ol ? global.ol.Map : require('ol/map').default);
const OLView = (global.ol ? global.ol.View : require('ol/view').default);
const OLControl = (global.ol ? global.ol.control : require('ol/control').default);

import ConfigLoader from './config/config-loader';
import LayerModelsLoader from './layers/models/models-loader';
import StaticLayersLegendBuilder from './components/legend/static-layers-legend-builder';
import StaticLayersAPI from './layers/static/static-layers-api';
import StaticLayersRenderManager from './layers/static/static-layers-render-manager';
import EventListenerManager from './events/event-listener-manager';
import ComponentsBuilder from './components/components-builder';

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
    return ConfigLoader(this._options.mapConfigHost, this._options.mapConfigURL)
      .then((mapConfig) => {

        // Instantiate the OpenLayers Map object.
        const projection = this._options.projection || mapConfig.projection || 'EPSG:4326';
        this._options.centre = this._options.centre || {};
        const longitude = this._options.centre.longitude || mapConfig.startingLocation[0];
        const latitude = this._options.centre.latitude || mapConfig.startingLocation[1];
        const zoom = this._options.zoom || mapConfig.startingLocation[2];
        this._olMap = new OLMap({
          target: this._target,
          view: new OLView({
            projection,
            center: [longitude, latitude],
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
        );
        this._overlayLayersAPI = new StaticLayersAPI(
          this._layerModelsLoader.getSupportedOverlayLayersModel(),
          this._layerModelsLoader.getAvailableOverlayLayersModel(),
          this._layerModelsLoader.getActiveOverlayLayersModel(),
        );

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

        const componentsBuilder = new ComponentsBuilder(mapConfig, this._layerModelsLoader);
        componentsBuilder.build({
          'disableLegend': this._options.disableLegend,
          'disableAddLayers': this._options.disableAddLayers,
        }, this._$target);

        // create event listener manager
        this._eventListenerManager = new EventListenerManager(this._olMap);

        // default event handlers
        const getFeatureComponent = new GetFeatureInfoComponent(
          this._olMap,
          this._overlayLayersAPI,
          this._$target
        );
        this._eventListenerManager.registerMapSingleClickListener(function() {
          getFeatureComponent.requestForCoordinate(this.coordinate);
        });

        return mapConfig;
      });
  }

  getOlMap() {
    return this._olMap;
  }

  getBaseLayersAPI() {
    return this._baseLayersAPI;
  }

  getOverlayLayersAPI() {
    return this._overlayLayersAPI;
  }

  getLegendAPI() {
    return this._legend;
  }

  getShowLayersDialogAPI() {
    return this._showLayersDialog;
  }

  getEventListenerAPI() {
    return this._eventListenerManager;
  }
};
