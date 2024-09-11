import StaticLayersLegendBuilder from './legend/static-layers-legend-builder';
import AddLayersDialog from './add-layers/add-layers-dialog';
import ShowLayersDialog from './show-layers/show-layers-dialog';
import Legend from './legend/legend-component';
import UserInterfaceComponent from './user-interface/user-interface-component';
import ActionButton from './user-interface/action-button';
import GetFeatureInfoComponent from './get-feature-info/get-feature-info-component';
import EventListenerManager from '../events/event-listener-manager';
import Metadata from './metadata/metadata-component';

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
    this._metadata = {};
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
      if (!options.disableAddLayers) {
        this._buildAddLayersComponent();
      }

      this._buildShowLayersComponent(ComponentsBuilder._isDefaultActiveComponent(options, 'showLayers'));
    }

    if (!options.disableLegend) {
      this._buildLegendComponent(ComponentsBuilder._isDefaultActiveComponent(options, 'legend'));
    }

    if (!options.disableFeatureRequests) {
      this._buildGetFeatureInfoComponent(options, ComponentsBuilder._isDefaultActiveComponent(options, 'getFeatureInfo'));
    }

    if (!options.disableMetadata) {
      this._buildMetadataComponent(ComponentsBuilder._isDefaultActiveComponent(options, 'metadata'));
    }

    // handle events for right control panel and side bar
    this._userInterfaceComponent.getRightSideBar().on(
      this._userInterfaceComponent.getRightSideBar().EVENT_CLOSED,
      () => this._userInterfaceComponent.getRightControlsPanel()
        .buttons.forEach((button) => button.deactivate()),
    );

    this._userInterfaceComponent.getRightControlsPanel().on(
      this._userInterfaceComponent.getRightControlsPanel().EVENT_ALL_DEACTIVATED,
      () => this._userInterfaceComponent.getRightSideBar().hidePanel(),
    );

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
   * Get the metadata component
   * @returns {{}|Legend}
   */
  get metadata() {
    return this._metadata;
  }

  /**
   * Check if a component should activated by default and it is not viewed on a mobile/small screen
   * @param options
   * @param componentId
   * @return {boolean}
   * @private
   */
  static _isDefaultActiveComponent(options, componentId) {
    return (options.defaultActiveComponent === componentId && window.matchMedia('(min-width: 768px)').matches);
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
      this._mapConfig,
    );
  }

  /**
   * Build the show-layers component
   * @private
   */
  _buildShowLayersComponent(activate) {
    const rightSideBar = this._userInterfaceComponent.getRightSideBar();

    this._showLayersDialog = new ShowLayersDialog(
      this._layerModelsLoader.getAvailableBaseLayersModel(),
      this._layerModelsLoader.getActiveBaseLayersModel(),
      this._layerModelsLoader.getAvailableOverlayLayersModel(),
      this._layerModelsLoader.getActiveOverlayLayersModel(),
    );

    const actionButtons = [];
    if (this._addLayersDialog.render !== undefined) {
      actionButtons.push(new ActionButton(
        'mapping-client-add-layers-button',
        'Add layers',
        'add',
        () => this._addLayersDialog.render(),
      ));
    }

    const showLayersControlButton = this._userInterfaceComponent.getRightControlsPanel()
      .createButton(
        'mapping-client-show-layers-button',
        'Layers',
        'layers',
        true,
      );

    showLayersControlButton.on(
      showLayersControlButton.EVENT_ACTIVATED,
      () => rightSideBar.showPanel('Layers', actionButtons, this._showLayersDialog.render()),
    );

    // activate instantly
    if (activate) {
      showLayersControlButton.render().click();
    }
  }

  /**
   * Build the legend component
   * @private
   */
  _buildLegendComponent(activate) {
    const rightSideBar = this._userInterfaceComponent.getRightSideBar();

    this._legend = new Legend();
    this._legend.registerStaticLayersLegendBuilder(new StaticLayersLegendBuilder(
      this._layerModelsLoader.getActiveOverlayLayersModel(),
      this._mapConfig.dataSources,
    ));

    const legendControlButton = this._userInterfaceComponent.getRightControlsPanel().createButton(
      'mapping-client-legend-icon',
      'Legend',
      'toc',
      true,
    );
    legendControlButton.on(
      legendControlButton.EVENT_ACTIVATED,
      () => rightSideBar.showPanel('Legend', [], this._legend.render()),
    );

    // activate instantly
    if (activate) {
      legendControlButton.render().click();
    }
  }

  /**
   * Build the get-feature component
   * @private
   */
  _buildGetFeatureInfoComponent(options, activate) {
    let resultPanel;
    let getFeaturesControlButton;
    switch (options.featureRequestsResultsPosition) {
      case 'top':
        resultPanel = this._userInterfaceComponent.getTopRowPanel();
        break;
      case 'bottom':
        resultPanel = this._userInterfaceComponent.getBottomRowPanel();
        break;
      case 'left':
        resultPanel = this._userInterfaceComponent.getLeftSideBar();
        getFeaturesControlButton = this._userInterfaceComponent.getLeftControlsPanel().createButton(
          'mapping-client-get-features',
          'Query features',
          'pageview',
          true,
        );
        break;
      case 'right':
      default:
        resultPanel = this._userInterfaceComponent.getRightSideBar();
        getFeaturesControlButton = this._userInterfaceComponent.getRightControlsPanel()
          .createButton(
            'mapping-client-get-features',
            'Query features',
            'pageview',
            true,
          );
        break;
    }

    this._getFeatureComponent = new GetFeatureInfoComponent(
      this._olMap,
      this._layerModelsLoader.getActiveOverlayLayersModel(),
      options.featureRequestsWmsParams !== undefined ? options.featureRequestsWmsParams : {},
      this._mapConfig,
    );

    resultPanel.on(
      resultPanel.EVENT_CLOSED,
      () => {
        this._getFeatureComponent.hideClickMarker();
      },
    );

    const clickListener = (event) => {
      this._getFeatureComponent.request(event);
      resultPanel.showPanel(
        'Query features',
        [],
        this._getFeatureComponent.render(),
      );
    };

    this._eventListenerManager.registerMapSingleClickListener((event) => {
      clickListener(event);
      if (getFeaturesControlButton) {
        getFeaturesControlButton.activate();
      }
    });

    if (getFeaturesControlButton) {
      getFeaturesControlButton.on(getFeaturesControlButton.EVENT_ACTIVATED, () => {
        resultPanel.showPanel(
          'Query features',
          [],
          this._getFeatureComponent.render(),
        );
        this._getFeatureComponent.showClickMarker();
        $(this._olMap.getViewport()).addClass('get-features-activated');
      });
      getFeaturesControlButton.on(getFeaturesControlButton.EVENT_DEACTIVATED, () => {
        $(this._olMap.getViewport()).removeClass('get-features-activated');
        this._getFeatureComponent.hideClickMarker();
      });

      // activate instantly
      if (activate) {
        getFeaturesControlButton.render().click();
      }
    }
  }

  /**
   * Build the metadata component
   * @private
   */
  _buildMetadataComponent(activate) {
    const rightSideBar = this._userInterfaceComponent.getRightSideBar();

    this._metadata = new Metadata(this._layerModelsLoader.getActiveOverlayLayersModel());

    const metadataButton = this._userInterfaceComponent.getRightControlsPanel().createButton(
      'mapping-client-metadata-icon',
      'Metadata',
      'info',
      true,
    );
    metadataButton.on(
      metadataButton.EVENT_ACTIVATED,
      () => rightSideBar.showPanel('Metadata', [], this._metadata.render()),
    );

    if (activate) {
      metadataButton.render()
        .click();
    }
  }

}
