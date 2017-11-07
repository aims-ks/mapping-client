/**
 * Helper responsible for performing necessary in-place processing/transformation of the
 * {@code dataSources} information in the {@code MapConfig} object.
 */
module.exports = {
  process: function (mapConfig) {

    Object.keys(mapConfig.dataSources).forEach((_dataSourceId) => {
      const _dataSource = mapConfig.dataSources[_dataSourceId];
      if (!_dataSource.layerType) {
        _dataSource.layerType = "WMS";
      } else {
        _dataSource.layerType = _dataSource.layerType.toUpperCase();
      }

      if (_dataSource.layerType == 'WMS' || _dataSource.layerType == 'NCWMS') {
        if (!_dataSource.featureRequestsUrl && _dataSource.serviceUrl) {
          _dataSource.featureRequestsUrl = _dataSource.serviceUrl;
        }
      }
    });
  }
}