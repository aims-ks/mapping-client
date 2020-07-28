import ClickMarker from './click-marker';
import GetFeatureInfoElement from './get-feature-info-element';
const $ = global.$ || global.jQuery || require('jquery');

/**
 * Component responsible for requesting the feature info from the server and displaying it
 */
export default class GetFeatureInfoComponent {

  /**
   * Constructor
   * @param olMap
   * @param layerModel
   * @param params
   * @param mapConfig
   */
  constructor(olMap, layerModel, params, mapConfig) {
    this._olMap = olMap;
    this._layerModel = layerModel;
    this._mapConfig = mapConfig;

    this._clickMarker = new ClickMarker(olMap);
    this._$featuresEl = $('<div class="aims-map-get-features"><p>Click on the map to request a feature</p></div>');
    this._coordinate = null;
    this._elementList = [];

    this._params = {
      INFO_FORMAT: 'text/html',
      BUFFER: 10,
      FEATURE_COUNT: 10
    };
    Object.assign(this._params, params);
  }

  /**
   * Return the element for rendering
   * @return {*|jQuery|HTMLElement}
   */
  render() {
    return this._$featuresEl;
  }

  /**
   * Request feature information for a coordinate
   * @param event
   */
  request(event) {
    console.log('Handling feature request');

    this._coordinate = event.coordinate;
    this.showClickMarker();

    const forceHttps = location.protocol === 'https:';

    const viewResolution = /** @type {number} */ (this._olMap.getView().getResolution());
    const projection = this._olMap.getView().getProjection().getCode();
    const pixel = this._olMap.getEventPixel(event.originalEvent);

    this._$featuresEl.empty();

    // iterate over all layers and send a request
    let firstFeatureInfoElement = null;
    this._olMap.forEachLayerAtPixel(pixel, olLayer => {
      // find layer in active layer model
      let layer = this._layerModel.findByLayerId(olLayer.get('layerId'));

      if (layer && layer.wmsQueryable === true) {
        let featureInfoElement = this._elementList.find(element => element.layerId === layer.layerId);
        if (featureInfoElement === undefined) {
          featureInfoElement = new GetFeatureInfoElement(layer);
          this._elementList.push(featureInfoElement);
        }

        let url = olLayer.getSource().getGetFeatureInfoUrl(
          this._coordinate,
          viewResolution,
          projection,
          Object.assign({'QUERY_LAYERS': layer.shortLayerId}, this._params)
        );

        if (url) {
          // when the library is used under https, all feature requests need to be https too
          if (forceHttps && url.toLowerCase().startsWith('http:')) {
            url = url.replace('http:', 'https:');
          }

          // if host differs from default, use proxy
          const protocol = url.startsWith('https') ? 'https' : 'http';
          if (!url.startsWith(protocol + '://' + this._mapConfig.host)) {
            url = protocol + '://' + this._mapConfig.host + this._mapConfig.proxyUrl + encodeURIComponent(url);
          }

          this._$featuresEl.append(featureInfoElement.render());
          featureInfoElement.sendRequest(url);

          if (firstFeatureInfoElement === null) {
            firstFeatureInfoElement = featureInfoElement;
          }
        }
      }
    });

    // no request has been sent
    if (firstFeatureInfoElement === null) {
      this._$featuresEl.html('<p>No results</p>');
    }
    // show first feature info element when all are closed
    else if (this._$featuresEl.find('.aims-map-collapsible-element-content-open').length === 0 && firstFeatureInfoElement.keepState === false) {
      firstFeatureInfoElement.show();
    }
  }

  /**
   * Hide the click marker
   */
  hideClickMarker() {
    this._clickMarker.remove();
  }

  /**
   * Show the click marker
   */
  showClickMarker() {
    if (this._coordinate) {
      this._clickMarker.set(this._coordinate);
    }
  }

}
