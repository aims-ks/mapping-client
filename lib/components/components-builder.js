import StaticLayersLegendBuilder from './legend/static-layers-legend-builder';
import AddLayersDialog from './add-layers/add-layers-dialog';
import ShowLayersDialog from './show-layers/show-layers-dialog';
import Legend from './legend/legend-component';
import UserInterfaceComponent from './user-interface/user-interface-component';
import ActionButton from './user-interface/action-button';

/**
 * Builds and configures the components
 */
export default class ComponentsBuilder {

  /**
   * Constructor
   */
  constructor(mapConfig, layerModelsLoader) {
    this._layerModelsLoader = layerModelsLoader;
    this._mapConfig = mapConfig;
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

    if (!options.disableAddLayers) {
      this._buildAddLayersComponent();
    }
    this._buildShowLayersComponent($target);

    if (!options.disableLegend) {
      this._buildLegendComponent($target);
    }

    $target.append(this._userInterfaceComponent.render());
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
   * @param $target
   * @private
   */
  _buildShowLayersComponent($target) {
    const self = this;

    this._showLayersDialog = new ShowLayersDialog(
      $target,
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
        function () {
          self._addLayersDialog.render();
        }
      )
    ];

    this._userInterfaceComponent.getRightControlsPanel()
      .addButton(
        'aims-map-show-layers-button',
        'Layers',
        'layers',
        function () {
          self._userInterfaceComponent.getRightSideBar()
            .showPanel(
              'Legend',
              actionButtons,
              self._showLayersDialog.render()
            );
        }
      );

  }

  /**
   * Build the legend component
   * @param $target
   * @private
   */
  _buildLegendComponent($target) {
    const self = this;
    this._legend = new Legend($target);
    this._legend.registerStaticLayersLegendBuilder(
      new StaticLayersLegendBuilder(
        this._layerModelsLoader.getActiveOverlayLayersModel(),
        this._mapConfig.dataSources,
      ),
    );

    this._userInterfaceComponent.getRightControlsPanel()
      .addButton(
        'aims-map-legend-icon',
        'Legend',
        'toc',
        function () {
          self._userInterfaceComponent.getRightSideBar()
            .showPanel(
              'Legend',
              [],
              self._legend.render()
            );
        }
      );
  }

}
