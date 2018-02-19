/**
 * Component responsible for requesting the feature info from the server and displaying it
 */
export default class GetFeatureInfoComponent {

  /**
   * Constructor
   * @param mapClient
   */
  constructor(mapClient) {
    this._olMap = mapClient.getOlMap();
    // this._overlayLayersRenderManager = overlayLayersRenderManager;
    this._overlayLayersAPI = mapClient.getOverlayLayersAPI();

    this._panel = document.createElement('div');
    this._panel.id = 'aims-map-info-panel';

    mapClient._$target.append(this._panel);
  }

  requestForCoordinate(coordinate) {
    console.log('Handling feature request');
    const self = this;
    const viewResolution = /** @type {number} */ (this._olMap.getView().getResolution());
    const projection = this._olMap.getView().getProjection().getCode();

    this._panel.innerHTML = '';

    this._overlayLayersAPI.getActiveLayers().forEach(function(layer) {
      const url = layer.olRenderedLayer.getSource().getGetFeatureInfoUrl(
        coordinate,
        viewResolution,
        projection,
        {
          'INFO_FORMAT': 'text/html'
        }
      );

      if (url) {
        self._panel.innerHTML += '<iframe seamless src="' + url + '"></iframe>';
      }
    });
  }
}
