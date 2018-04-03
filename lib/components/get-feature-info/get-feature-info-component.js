import loaderIcon from './../../images/loader.svg';
const $ = global.$ || global.jQuery || require('jquery');

/**
 * Component responsible for requesting the feature info from the server and displaying it
 */
export default class GetFeatureInfoComponent {

  /**
   * Constructor
   * @param olMap
   * @param layerModel
   */
  constructor(olMap, layerModel) {
    this._olMap = olMap;
    this._layerModel = layerModel;

    this._$featuresEl = $('<div class="aims-map-get-features"><p>Click on the map to request a feature</p></div>');
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

    const viewResolution = /** @type {number} */ (this._olMap.getView().getResolution());
    const projection = this._olMap.getView().getProjection().getCode();

    this._$featuresEl.html('');

    // iterate over all layers and send a request
    this._olMap.getLayers().forEach(olLayer => {
      // find layer in active layer model
      let layer = this._layerModel.findByLayerId(olLayer.get('layerId'));

      if (layer) {
        const url = olLayer.getSource().getGetFeatureInfoUrl(
          coordinate,
          viewResolution,
          projection,
          {
            'INFO_FORMAT': 'text/html'
          }
        );

        if (url) {
          let $containerEl = $('<div class="aims-map-get-features-container"></div>');
          let $collapseButtonEl = $(`<button type="button" class="btn btn-link get-feature-collapse-button" title="Open"><i class="material-icons">keyboard_arrow_down</i>${layer.title}</button>`);

          let $headerEl = $('<div class="aims-map-get-feature-info-title"></div>');
          $headerEl.append($collapseButtonEl);

          let $contentEl = $('<div class="aims-map-get-feature-info-content loading"></div>');
          $contentEl.append(`<img src="${loaderIcon}">`);
          $contentEl.hide();

          // add click handler for opening and closing feature-request information
          $collapseButtonEl.click(function() {
            $collapseButtonEl = $(this);
            $contentEl.toggle();
            if ($contentEl.is(':visible')) {
              $collapseButtonEl.prop('title', 'Close');
              $collapseButtonEl.find('i').html('keyboard_arrow_up');
            } else {
              $collapseButtonEl.prop('title', 'Open');
              $collapseButtonEl.find('i').html('keyboard_arrow_down');
            }
          });

          // add all elements to the feature element container
          $containerEl.append($headerEl);
          $containerEl.append($contentEl);
          this._$featuresEl.prepend($containerEl);

          // send ajax request to get the feature request information
          $.ajax({
            url: url
          }).done((featureContent) => {
            $contentEl.removeClass('loading');
            if (featureContent !== '') {
              $contentEl.html(featureContent);
            } else {
              $contentEl.html('<p>No results</p>');
            }
          });
        }
      }
    });
  }
}
