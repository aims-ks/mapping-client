/**
 * Main class for instantiating the map client.
 */

const $ = global.$ || global.jQuery || require('jquery');
const OLControl = (global.ol ? global.ol.control : require('ol/control').default);
const OLInteraction = (global.ol ? global.ol.interaction : require('ol/interaction').default);
const OLMap = (global.ol ? global.ol.Map : require('ol/map').default);
const OLView = (global.ol ? global.ol.View : require('ol/view').default);

import AddLayersButton from './components/add-layers/add-layers-button';
import AddLayersDialog from './components/add-layers/add-layers-dialog';
import ConfigLoader from './config/config-loader';
import LayerModelsLoader from './layers/models/models-loader';
import Legend from './components/legend/component';
import ShowLayersButton from './components/show-layers/show-layers-button';
import ShowLayersDialog from './components/show-layers/show-layers-dialog';
import StaticLayersLegendBuilder from './components/legend/static-layers-legend-builder';
import StaticLayersAPI from './layers/static/static-layers-api';
import StaticLayersRenderManager from './layers/static/static-layers-render-manager';
import EventListenerManager from './events/event-listener-manager';

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

        // Add support for the Legend.
        if (!this._options.disableLegend) {
          this._legend = new Legend(this._$target);
          this._legend.registerStaticLayersLegendBuilder(
            new StaticLayersLegendBuilder(
              this._layerModelsLoader.getActiveOverlayLayersModel(),
              mapConfig.dataSources,
            ),
          );
        }

        // Wire up the map layer selection components.
        let _showLayersDialogActionButtons = [];
        if (!this._options.disableAddLayers) {
          _showLayersDialogActionButtons.push(
            new AddLayersButton(
              new AddLayersDialog(
                this._layerModelsLoader.getSupportedBaseLayersModel(),
                this._layerModelsLoader.getAvailableBaseLayersModel(),
                this._layerModelsLoader.getActiveBaseLayersModel(),
                this._layerModelsLoader.getSupportedOverlayLayersModel(),
                this._layerModelsLoader.getAvailableOverlayLayersModel(),
                this._layerModelsLoader.getActiveOverlayLayersModel(),
                mapConfig,
              ),
            ),
          );
        }
        this._showLayersDialog = new ShowLayersDialog(
          this._$target,
          this._layerModelsLoader.getAvailableBaseLayersModel(),
          this._layerModelsLoader.getActiveBaseLayersModel(),
          this._layerModelsLoader.getAvailableOverlayLayersModel(),
          this._layerModelsLoader.getActiveOverlayLayersModel(),
          _showLayersDialogActionButtons,
        );
        new ShowLayersButton(
          this._$target,
          this._showLayersDialog,
        );

        // create event listener manager
        this._eventListenerManager = new EventListenerManager(this._olMap);

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
