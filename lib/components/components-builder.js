import StaticLayersLegendBuilder from './legend/static-layers-legend-builder';
import AddLayersDialog from './add-layers/add-layers-dialog';
import ShowLayersDialog from './show-layers/show-layers-dialog';
import Legend from './legend/legend-component';
import UserInterfaceComponent from './user-interface/user-interface-component';
import ActionButton from './user-interface/action-button';
import ControlButton from './user-interface/control-button';
import GetFeatureInfoComponent from './get-feature-info/get-feature-info-component';
import EventListenerManager from '../events/event-listener-manager';

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

    // add zoom controls to left side bar
    const zoomControls = $target.find('.ol-zoom.ol-unselectable.ol-control');
    this._userInterfaceComponent.getLeftControlsPanel()
      .addOLControl(zoomControls);

    if (!options.disableShowLayers) {
      this._buildShowLayersComponent();

      if (!options.disableAddLayers) {
        this._buildAddLayersComponent();
      }
    }

    if (!options.disableLegend) {
      this._buildLegendComponent();
    }

    this._buildGetFeatureComponent();

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

    const showLayersControlButton = this._userInterfaceComponent.getRightControlsPanel().createButton('aims-map-show-layers-button',
      'Layers',
      'layers',
      () => rightSideBar.showPanel('Layers', actionButtons, this._showLayersDialog.render()),
      () => rightSideBar.hidePanel()
    );
    rightSideBar.on(rightSideBar.EVENT_CLOSED, showLayersControlButton.deactivate.bind(showLayersControlButton));
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
      () => rightSideBar.showPanel('Legend', [], this._legend.render()),
      () => rightSideBar.hidePanel()
    );
    rightSideBar.on(rightSideBar.EVENT_CLOSED, legendControlButton.deactivate.bind(legendControlButton));
  }

  /**
   * Build the get-feature component
   * @private
   */
  _buildGetFeatureComponent() {
    let self = this;
    this._getFeatureComponent = new GetFeatureInfoComponent(this._olMap);

    this._userInterfaceComponent.getRightControlsPanel().createButton(
      'aims-map-get-features',
      'Query features',
      'pageview',
      function(){
        self._eventListenerManager.registerMapSingleClickListener(function() {
          self._getFeatureComponent.requestForCoordinate(this.coordinate);
          self._userInterfaceComponent.getRightSideBar().showPanel(
            'Feature-Requests',
            [],
            self._getFeatureComponent.render()
          );
        });
      }
    );
  }
}
