import AbstractLegendBuilder from './abstract-legend-builder';

/**
 * Component responsible for rendering a legend of static layers.
 */
export default class StaticLayersLegendBuilder extends AbstractLegendBuilder {

  /**
   * Constructor to cache the references, instantiate/cache the helpers, and inject itself into the
   * DOM.
   *
   * @param $parent {JQueryObject} A JQuery object representing the parent element into which this
   * component should insert itself.
   * @param activeLayersModel {SimpleLayerModel} A model for maintaining the list of active layers.
   * @param dataSources {array} An array of datasources for retrieving information regarding a
   * layer.
   */
  constructor(activeLayersModel, dataSources) {
    super();

    // Cache the references.
    this._activeLayersModel = activeLayersModel;
    this._dataSources = dataSources;

    // Register for notification of changes to the active layers model.
    this._activeLayersModel.on(this._activeLayersModel.EVENT_CHANGED, this._handleOnChange.bind(this));

  };

  _handleOnChange() {
    this._emitOnChangeEvent();
  }

  /**
   * Concrete implementation of the `buildHtml()` method for static layers.
   */
  buildHtml() {

    let html = '';

    // Loop through the layers to populate the panel.
    this._activeLayersModel.getLayers().reverse().forEach((_layer) => {

      // Find the matching datasource.
      const dataSource = this._dataSources[_layer.dataSourceId];

      // Are legends displayed for this datasource?
      if (dataSource && dataSource.showInLegend && dataSource.legendUrl && _layer.hasLegend === true) {

        // Build the legend url.
        let url = dataSource.legendUrl +
          'TRANSPARENT=TRUE&REQUEST=GetLegendGraphic&' +
          'LAYER=' + _layer.shortLayerId + '&' +
          'SCALE=3466743.325731736';

        // Add standard parameters.
        Object.keys(dataSource.legendParameters).forEach((key) => {
          url = url + '&' + key + '=' + dataSource.legendParameters[key];
        });

        if (_layer.style !== "") {
          url = url + '&STYLE=' + _layer.style;
        }

        html += `
          <div class="legend-item">
            <div class="legend-title">${_layer.title}</div>
            <div class="legend-image"><img src="${url}" /></div>
          </div>
        `;

      }
    }, this);

    return html;

  }

};
