/**
 * Main class for instantiating the map client.
 */

import ol from 'openlayers';
const ConfigLoader = require('./config/config-loader');

const LayerModelsLoader = require('./layers/models/models-loader');

const AddLayersButton = require('./components/add-layers/add-layers-button');
const AddLayersDialog = require('./components/add-layers/add-layers-dialog');

const Legend = require('./components/legend/component');
const StaticLayersLegendBuilder = require('./components/legend/static-layers-legend-builder');

const ShowLayersButton = require('./components/show-layers/show-layers-button');
const ShowLayersDialog = require('./components/show-layers/show-layers-dialog');

const StaticLayersAPI = require('./layers/static/static-layers-api');
const StaticLayersRenderManager = require('./layers/static/static-layers-render-manager');

module.exports = class MapClient {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param target {String} The ID of the HTML element within which the Map Client is instantiated.
   */
  constructor(target, options) {

    // Cache the references.
    this._target = target;
    this._$target = $(this._target.startsWith('#') ? this._target : '#' + this._target);
    this._options = options || {};

  };

  /**
   * Perform the initialisation.
   */
  init() {

    // Load the configuration.
    return ConfigLoader.load(this._options.configUrl)
      .then((mapConfig) => {

        // Instantiate the OpenLayers Map object.
        const projection = this._options.projection || 'EPSG:4326';
        const latitude = this._options.latitude || mapConfig.startingLocation[0];
        const longitude = this._options.longitude || mapConfig.startingLocation[1];
        const zoom = this._options.zoom || mapConfig.startingLocation[2];
        this._olMap = new ol.Map({
          target: this._target,
          view: new ol.View({
            projection: projection,
            center: [latitude, longitude],
            zoom: zoom
          }),
          interactions: ol.interaction.defaults({
            altShiftDragRotate: false,
            pinchRotate: false,
            mouseWheelZoom: false,
            doubleClickZoom: false
          }),
          controls: ol.control.defaults({
            rotate: false,
            attributionOptions: ({
              collapsible: false
            })
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
        new StaticLayersRenderManager(
          this._olMap,
          this._layerModelsLoader.getActiveBaseLayersModel(),
          mapConfig,
          BASE_LAYERS_Z_INDEX
        );
        const OVERLAY_LAYERS_Z_INDEX = -1;
        new StaticLayersRenderManager(
          this._olMap,
          this._layerModelsLoader.getActiveOverlayLayersModel(),
          mapConfig,
          OVERLAY_LAYERS_Z_INDEX
        );

        // Add support for the Legend.
        if (!this._options.disableLegend) {
          this._legend = new Legend(this._$target);
          this._legend.registerStaticLayersLegendBuilder(
            new StaticLayersLegendBuilder(
              this._layerModelsLoader.getActiveOverlayLayersModel(),
              mapConfig.dataSources
            )
          );
        }

        // Wire up the map layer selection components.
        let _showLayersDialogActionButtons = [];
        if (!this._options.disableAddLayers) {
          _showLayersDialogActionButtons.push(
            new AddLayersButton(
              new AddLayersDialog(
                this._layerModelsLoader.getAvailableBaseLayersModel(),
                this._layerModelsLoader.getSupportedBaseLayersModel(),
                this._layerModelsLoader.getAvailableOverlayLayersModel(),
                this._layerModelsLoader.getSupportedOverlayLayersModel(),
                mapConfig
              )
            )
          );
        }
        const _showLayersDialog = new ShowLayersDialog(
          this._$target,
          this._layerModelsLoader.getAvailableBaseLayersModel(),
          this._layerModelsLoader.getActiveBaseLayersModel(),
          this._layerModelsLoader.getAvailableOverlayLayersModel(),
          this._layerModelsLoader.getActiveOverlayLayersModel(),
          _showLayersDialogActionButtons
        );
        new ShowLayersButton(
          this._$target,
          _showLayersDialog
        );

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

};
