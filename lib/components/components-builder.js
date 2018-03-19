/**
 * Builds and configures the components
 */

import StaticLayersLegendBuilder from './legend/static-layers-legend-builder';
import AddLayersButton from './add-layers/add-layers-button';
import AddLayersDialog from './add-layers/add-layers-dialog';
import ShowLayersDialog from './show-layers/show-layers-dialog';
import Legend from './legend/legend-component';
import UserInterfaceComponent from './user-interface/user-interface-component';

export default class ComponentsBuilder {

  /**
   * Constructor
   */
  constructor(mapConfig, layerModelsLoader) {
    this._layerModelsLoader = layerModelsLoader;
    this._mapConfig = mapConfig;
    this._showLayersDialogActionButtons = [];
    this._userInterfaceComponent = {};
  }

  build(options, $target) {
    this._userInterfaceComponent = new UserInterfaceComponent();

    // add zoom controls to left side bar
    const zoomControls = $target.find('.ol-zoom.ol-unselectable.ol-control');
    this._userInterfaceComponent.getLeftControlsPanel().addOLControl(zoomControls);

    if (!options.disableAddLayers) {
      this._buildAddLayersComponent();
    }
    this._buildShowLayersComponent($target);

    if (!options.disableLegend) {
      this._buildLegendComponent($target);
    }

    $target.append(this._userInterfaceComponent.render());
  }

  _buildAddLayersComponent() {
    this._showLayersDialogActionButtons.push(
      new AddLayersButton(
        new AddLayersDialog(
          this._layerModelsLoader.getSupportedBaseLayersModel(),
          this._layerModelsLoader.getAvailableBaseLayersModel(),
          this._layerModelsLoader.getActiveBaseLayersModel(),
          this._layerModelsLoader.getSupportedOverlayLayersModel(),
          this._layerModelsLoader.getAvailableOverlayLayersModel(),
          this._layerModelsLoader.getActiveOverlayLayersModel(),
          this._mapConfig,
        ),
      ),
    );
  }

  _buildShowLayersComponent($target) {
    const self = this;

    this._showLayersDialog = new ShowLayersDialog(
      $target,
      this._layerModelsLoader.getAvailableBaseLayersModel(),
      this._layerModelsLoader.getActiveBaseLayersModel(),
      this._layerModelsLoader.getAvailableOverlayLayersModel(),
      this._layerModelsLoader.getActiveOverlayLayersModel(),
      this._showLayersDialogActionButtons,
    );
    this._userInterfaceComponent.getLeftControlsPanel().addButton(
      'aims-map-show-layers-button',
      'Layers',
      'layers',
      function() {
        self._showLayersDialog.toggle();
      }
    );

  }

  _buildLegendComponent($target) {
    this._legend = new Legend($target);
    this._legend.registerStaticLayersLegendBuilder(
      new StaticLayersLegendBuilder(
        this._layerModelsLoader.getActiveOverlayLayersModel(),
        this._mapConfig.dataSources,
      ),
    );

    this._userInterfaceComponent.getRightSideBar().addTab(
      'aims-map-legend-icon',
      'Legend',
      'toc',
      this._legend.render.bind(this._legend)
    );
  }

}
