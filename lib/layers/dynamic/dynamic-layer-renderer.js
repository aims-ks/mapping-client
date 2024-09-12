/**
 * A co-ordinating component that has overall responsibility for rendering a dynamic list of
 * geospatial sites via an OpenLayers map. Note that a single OpenLayers map can have multiple
 * DynamicLayerLayerRenderers operating on it.
 */

const olFeature = (global.ol ? global.ol.Feature : require('ol/Feature').default);
const olPointGeom = (global.ol ? global.ol.geom.Point : require('ol/geom/Point').default);
const olVectorLayer = (global.ol ? global.ol.layer.Vector : require('ol/layer/Vector').default);
const olVectorSource = (global.ol ? global.ol.source.Vector : require('ol/source/Vector').default);

export default class DynamicLayerRenderer {

  /**
   * Constructor to cache the references and instantiate/cache helpers.
   *
   * @param olMap {ol.Map} OpenLayers map object for manipulation.
   * @param featureStyler {AbstractDynamicLayerFeatureStyler} Reference to a concrete
   * implementation of the abstract Feature Styler to be used by this class when styling data
   * rendered on the map.
   */
  constructor(olMap, featureStyler) {

    // Cache the references.
    this._olMap = olMap;
    this._featureStyler = featureStyler;

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

  }

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
   * Render the map based on the sites identified in the hashmap. The key for the hashmap must be
   * a unique id for each site to be rendered.
   */
  renderLayer(siteHashMap) {

    // Clear the existing render.
    this._vectorSource.clear(false);

    const features = [];
    Object.keys(siteHashMap).forEach((siteId) => {
      const site = siteHashMap[siteId];

      // Identify the style to use for the feature.
      const style = this._featureStyler.identifyStyle(site);
      if (style) {

        // Instantiate the site as a feature.
        const feature = new olFeature({
          geometry: new olPointGeom([
            site.longitude || site.lon,
            site.latitude || site.lat,
          ]),
        });
        feature.setStyle(style.clone());

        // Cache the underlying data object for future use (such as when selecting sites).
        feature.set('aimsDataItem', site, true);

        // Add the feature to the temporary cache.
        features.push(feature);

      }

    }, this);

    // Add the features to the source.
    this._vectorSource.addFeatures(features);
  }

}
