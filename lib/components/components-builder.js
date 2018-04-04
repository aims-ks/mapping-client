import StaticLayersLegendBuilder from './legend/static-layers-legend-builder';
import AddLayersDialog from './add-layers/add-layers-dialog';
import ShowLayersDialog from './show-layers/show-layers-dialog';
import Legend from './legend/legend-component';
import UserInterfaceComponent from './user-interface/user-interface-component';
import ActionButton from './user-interface/action-button';
import GetFeatureInfoComponent from './get-feature-info/get-feature-info-component';
import EventListenerManager from '../events/event-listener-manager';
const $ = global.$ || global.jQuery || require('jquery');

/**
 * Builds and configures the components
 */
export default class ComponentsBuilder {

  /**
   * Constructor
   */
  constructor(mapConfig, layerModelsLoader, olMap) {
    this._layerModelsLoader = layerModelsLoader;
    this._mapConfig = mapConfig;
    this._olMap = olMap;

    // create event listener manager
    this._eventListenerManager = new EventListenerManager(this._olMap);

    this._userInterfaceComponent = {};
    this._addLayersDialog = {};
    this._showLayersDialog = {};
    this._legend = {};
  }

  /**
   * Build the components
   * @param options
   * @param $target
   */
  build(options, $target) {
    this._userInterfaceComponent = new UserInterfaceComponent();

    // add zoom controls to left control panel
    const zoomControls = $target.find('.ol-zoom.ol-unselectable.ol-control');
    this._userInterfaceComponent.getLeftControlsPanel()
      .addOLControl(zoomControls);

    // build components for right control panel
    if (!options.disableShowLayers) {
      this._buildShowLayersComponent();

      if (!options.disableAddLayers) {
        this._buildAddLayersComponent();
      }
    }

    if (!options.disableLegend) {
      this._buildLegendComponent();
    }

    if (!options.disableGetFeatures) {
      this._buildGetFeatureComponent();
    }

    // handle events for right control panel and side bar
    this._userInterfaceComponent.getRightSideBar()
      .on(this._userInterfaceComponent.getRightSideBar().EVENT_CLOSED, () =>
        this._userInterfaceComponent.getRightControlsPanel().buttons.forEach(button =>
          button.deactivate()));
    this._userInterfaceComponent.getRightControlsPanel()
      .on(this._userInterfaceComponent.getRightControlsPanel().EVENT_ALL_DEACTIVATED, () =>
        this._userInterfaceComponent.getRightSideBar().hidePanel());

    // add user-interface component to target container
    $target.append(this._userInterfaceComponent.render());
  }

  /**
   * Get the user-interface component
   * @returns {{}|UserInterfaceComponent}
   */
  get userInterfaceComponent() {
    return this._userInterfaceComponent;
  }

  /**
   * Get the add-layers-dialog component
   * @returns {{}|AddLayersDialog}
   */
  get addLayersDialog() {
    return this._addLayersDialog;
  }

  /**
   * Get the show-layers-dialog component
   * @returns {{}|ShowLayersDialog}
   */
  get showLayersDialog() {
    return this._showLayersDialog;
  }

  /**
   * Get the legend component
   * @returns {{}|Legend}
   */
  get legend() {
    return this._legend;
  }

  /**
   * Build the add-layers component
   * @private
   */
  _buildAddLayersComponent() {
    this._addLayersDialog = new AddLayersDialog(
      this._layerModelsLoader.getSupportedBaseLayersModel(),
      this._layerModelsLoader.getAvailableBaseLayersModel(),
      this._layerModelsLoader.getActiveBaseLayersModel(),
      this._layerModelsLoader.getSupportedOverlayLayersModel(),
      this._layerModelsLoader.getAvailableOverlayLayersModel(),
      this._layerModelsLoader.getActiveOverlayLayersModel(),
      this._mapConfig
    );
  }

  /**
   * Build the show-layers component
   * @private
   */
  _buildShowLayersComponent() {
    const rightSideBar = this._userInterfaceComponent.getRightSideBar();

    this._showLayersDialog = new ShowLayersDialog(
      this._layerModelsLoader.getAvailableBaseLayersModel(),
      this._layerModelsLoader.getActiveBaseLayersModel(),
      this._layerModelsLoader.getAvailableOverlayLayersModel(),
      this._layerModelsLoader.getActiveOverlayLayersModel()
    );

    const actionButtons = [
      new ActionButton(
        'aims-map-add-layers-button',
        'Add layers',
        'add',
        () => this._addLayersDialog.render()
      )
    ];

    const showLayersControlButton = this._userInterfaceComponent.getRightControlsPanel().createButton(
      'aims-map-show-layers-button',
      'Layers',
      'layers',
      true
    );
    showLayersControlButton.on(showLayersControlButton.EVENT_ACTIVATED,
      () => rightSideBar.showPanel('Layers', actionButtons, this._showLayersDialog.render()));
  }

  /**
   * Build the legend component
   * @private
   */
  _buildLegendComponent() {
    const rightSideBar = this._userInterfaceComponent.getRightSideBar();

    this._legend = new Legend();
    this._legend.registerStaticLayersLegendBuilder(
      new StaticLayersLegendBuilder(
        this._layerModelsLoader.getActiveOverlayLayersModel(),
        this._mapConfig.dataSources,
      ),
    );

    const legendControlButton = this._userInterfaceComponent.getRightControlsPanel().createButton(
      'aims-map-legend-icon',
      'Legend',
      'toc',
      true
    );
    legendControlButton.on(legendControlButton.EVENT_ACTIVATED,
      () => rightSideBar.showPanel('Legend', [], this._legend.render()));
  }

  /**
   * Build the get-feature component
   * @private
   */
  _buildGetFeatureComponent() {
    const rightSideBar = this._userInterfaceComponent.getRightSideBar();
    this._getFeatureComponent = new GetFeatureInfoComponent(
      this._olMap,
      this._layerModelsLoader.getActiveOverlayLayersModel()
    );

    const clickListener = event => {
      this._getFeatureComponent.requestForCoordinate(event.coordinate);
      rightSideBar.showPanel(
        'Query features',
        [],
        this._getFeatureComponent.render()
      );
    };

    const getFeaturesControlButton = this._userInterfaceComponent.getRightControlsPanel().createButton(
      'aims-map-get-features',
      'Query features',
      'pageview',
      true
    );
    getFeaturesControlButton.on(getFeaturesControlButton.EVENT_ACTIVATED, () => {
      $(this._olMap.getViewport()).addClass('get-features-activated');
      this._eventListenerManager.registerMapSingleClickListener(clickListener);
    });
    getFeaturesControlButton.on(getFeaturesControlButton.EVENT_DEACTIVATED, () => {
      $(this._olMap.getViewport()).removeClass('get-features-activated');
      this._eventListenerManager.unregisterMapSingleClickListener(clickListener);
    });
  }
}
