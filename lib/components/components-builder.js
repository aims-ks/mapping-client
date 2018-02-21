import StaticLayersLegendBuilder from './legend/static-layers-legend-builder';

/**
 * Builds and configures the components
 */

import AddLayersButton from './add-layers/add-layers-button';
import AddLayersDialog from './add-layers/add-layers-dialog';
import ShowLayersButton from './show-layers/show-layers-button';
import ShowLayersDialog from './show-layers/show-layers-dialog';
import Legend from './legend/legend-component';

export default class ComponentsBuilder {

  /**
   * Constructor
   */
  constructor(mapConfig, layerModelsLoader) {
    this._layerModelsLoader = layerModelsLoader;
    this._mapConfig = mapConfig;
    this._showLayersDialogActionButtons = [];
  }

  build(options, $target) {
    if (!options.disableAddLayers) {
      this._buildAddLayersComponent();
    }
    this._buildShowLayersComponent($target);

    if (!options.disableLegend) {
      this._buildLegendComponent($target);
    }
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
    this._showLayersDialog = new ShowLayersDialog(
      $target,
      this._layerModelsLoader.getAvailableBaseLayersModel(),
      this._layerModelsLoader.getActiveBaseLayersModel(),
      this._layerModelsLoader.getAvailableOverlayLayersModel(),
      this._layerModelsLoader.getActiveOverlayLayersModel(),
      this._showLayersDialogActionButtons,
    );
    new ShowLayersButton(
      $target,
      this._showLayersDialog,
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
  }

}
