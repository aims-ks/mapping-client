/**
 * Component responsible for requesting the feature info from the server and displaying it
 */
export default class GetFeatureInfoComponent {

  /**
   * Constructor
   * @param olMap
   */
  constructor(olMap) {
    this._olMap = olMap;

    this._$featuresEl = $('<div class="aims-map-get-features"></div>');
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
   * @param coordinate
   */
  requestForCoordinate(coordinate) {
    console.log('Handling feature request');
    const self = this;
    const viewResolution = /** @type {number} */ (this._olMap.getView().getResolution());
    const projection = this._olMap.getView().getProjection().getCode();

    this._$featuresEl.html('');

    this._olMap.getLayers().forEach(function(layer) {
      const url = layer.getSource().getGetFeatureInfoUrl(
        coordinate,
        viewResolution,
        projection,
        {
          'INFO_FORMAT': 'text/html'
        }
      );

      if (url) {
        self._$featuresEl.append('<iframe src="' + url + '"></iframe>');
      }
    });
  }
}
