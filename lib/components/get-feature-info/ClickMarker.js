import pinIcon from '../../images/map-pin-orange.svg';

const OlPointGeom = (global.ol ? global.ol.geom.Point : require('ol/geom/Point').default);
const OlFeature = (global.ol ? global.ol.Feature : require('ol/Feature').default);
const OlStyle = (global.ol ? global.ol.style.Style : require('ol/style/Style').default);
const OlStyleIcon = (global.ol ? global.ol.style.Icon : require('ol/style/Icon').default);
const OlVectorLayer = (global.ol ? global.ol.layer.Vector : require('ol/layer/Vector').default);
const OlVectorSource = (global.ol ? global.ol.source.Vector : require('ol/source/Vector').default);

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
    if (this._markerLayer !== null) {
      this._marker.setCoordinates(coordinate);
    } else {
      this._marker = new OlPointGeom(coordinate);
      const iconFeature = new OlFeature({ geometry: this._marker });
      const iconStyle = new OlStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: pinIcon,
          scale: 0.6,
        }),
      });

      iconFeature.setStyle(iconStyle);

      const vectorSource = new OlVectorSource({
        features: [iconFeature],
      });
      this._markerLayer = new OlVectorLayer({
        source: vectorSource,
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
