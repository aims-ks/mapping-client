const olPointGeom = (global.ol ? global.ol.geom.Point : require('ol/geom/point').default);
const olFeature = (global.ol ? global.ol.Feature : require('ol/feature').default);
const olStyle = (global.ol ? global.ol.style.Style : require('ol/style/style').default);
const olStyleCircle = (global.ol ? global.ol.style.Circle : require('ol/style/circle').default);
const olStyleFill = (global.ol ? global.ol.style.Fill : require('ol/style/fill').default);
const olStyleStroke = (global.ol ? global.ol.style.Stroke : require('ol/style/stroke').default);
const olVectorLayer = (global.ol ? global.ol.layer.Vector : require('ol/layer/vector').default);
const olVectorSource = (global.ol ? global.ol.source.Vector : require('ol/source/vector').default);

/**
 * Set a marker on the map where the user has clicked to get information about a feature
 */
export default class ClickMarker {

  /**
   * Constructor
   * @param olMap
   */
  constructor(olMap) {
    this._olMap = olMap;
    this._markerLayer = null;
    this._marker = null;
  }

  /**
   * Set the marker
   * @param coordinate
   */
  set(coordinate) {
    if(this._markerLayer !== null){
      this._marker.setCoordinates(coordinate);
    } else {
      this._marker = new olPointGeom(coordinate);
      const iconFeature = new olFeature({ geometry: this._marker });
      const iconStyle = new olStyle({
        image: new olStyleCircle({
          radius: 10,
          fill: new olStyleFill({color: 'rgba(0, 60, 136, 0.3)'}),
          stroke: new olStyleStroke({color: 'rgba(0, 60, 136, 1)', width: 1})
        })
      });

      iconFeature.setStyle(iconStyle);

      const vectorSource = new olVectorSource({
        features: [iconFeature]
      });
      this._markerLayer = new olVectorLayer({
        source: vectorSource
      });
      this._olMap.addLayer(this._markerLayer);
    }
  }

  /**
   * Remove the marker
   */
  remove() {
    this._olMap.removeLayer(this._markerLayer);
    this._markerLayer = null;
    this._marker = null;
  }
}
