/**
 * A co-ordinating component that has overall responsibility for monitoring a
 * {@code DataModel} (a model which contains geospatial data to be rendered), and the
 * rendering/destruction of the corresponding {@code layer} via an OpenLayers map.
 * Note that a single OpenLayers Map can have multiple DynamicLayerLayersRenderManager components
 * operating on it.
 */

const olFeature = (global.ol ? global.ol.Feature : require('ol/feature').default);
const olPointGeom = (global.ol ? global.ol.geom.Point : require('ol/geom/point').default);
const olVectorLayer = (global.ol ? global.ol.layer.Vector : require('ol/layer/vector').default);
const olVectorSource = (global.ol ? global.ol.source.Vector : require('ol/source/vector').default);

export default class DynamicLayersRenderManager {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param olMap {ol.Map} OpenLayers map object for manipulation.
   * @param dataModel {aims-model.BasicModel} Reference to the Model containing the data to be
   * rendered.
   * @param styleSelector {AbstractDynamicLayerStyleSelector} Reference to a concrete
   * implementation of the abstract Style Selector to be used by this class when styling data
   * rendered on the map.
   */
  constructor(olMap, dataModel, styleSelector) {

    // Cache the references.
    this._olMap = olMap;
    this._dataModel = dataModel;
    this._styleSelector = styleSelector;

    // Data will be displayed via a VectorLayer which is bound to a VectorSource. To render a data
    // point on the map, add it to the VectorSource. To clear the data layer, clear the
    // VectorSource.
    this._vectorSource = new olVectorSource({
      // Empty/no data.
    });
    this._vectorLayer = new olVectorLayer({
      source: this._vectorSource,
    });
    this._olMap.addLayer(this._vectorLayer);

    // Register for events.
    this._dataModel.on(this._dataModel.EVENT_DATA_CHANGED, this._renderLayer.bind(this));

  };

  /**
   * Specialised getter that exposes the underlying 'VectorLayer'. This is made available for any
   * special post-processing, otherwise should not be updated directly.
   */
  getVectorLayer() {
    return this._vectorLayer;
  }

  /**
   * Specialised getter that exposes the underlying 'VectorSource'. This is made available for any
   * special post-processing, otherwise should not be updated directly.
   */
  getVectorSource() {
    return this._vectorSource;
  }

  /**
   * Public API method to show (render) the dynamic layer.
   */
  show() {
    this._vectorLayer.setVisible(true);
  }

  /**
   * Public API method to hide the dynamic layer.
   */
  hide() {
    this._vectorLayer.setVisible(false);
  }

  /**
   * Private event handler invoked when the underlying data changes. Where a single location (as
   * identified by the `locationId` property) is represented multiple times, only the first
   * representation of that location will be rendered.
   */
  _renderLayer() {

    // Clear the existing render.
    this._vectorSource.clear(false);

    // Loop through the data, adding each point with appropriate styling.
    let locationIds = [];
    this._dataModel.getData().forEach(function (_dataItem) {

      // Check if the location has already been rendered. Ignore if so, otherwise render and record
      // that the location has been rendered.
      const locationId = _dataItem.locationId;
      if (!locationIds.includes(locationId)) {
        locationIds.push(locationId);
        const _style = this._styleSelector.identifyStyle(_dataItem);
        if (_style) {
          const feature = new olFeature({
            geometry: new olPointGeom([
              _dataItem.longitude,
              _dataItem.latitude
            ])
          });
          feature.set('aimsDataItem', _dataItem, true);
          feature.setStyle(_style.clone());
          this._vectorSource.addFeature(feature);
        }
      }
    }, this);

  };

}
