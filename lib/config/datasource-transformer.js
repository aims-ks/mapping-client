/**
 * Helper responsible for performing necessary in-place processing/transformation of the
 * {@code dataSources} information in the {@code MapConfig} object.
 */
module.exports = {
  process: (mapConfig) => {
    Object.keys(mapConfig.dataSources)
      .forEach((dataSourceId) => {
        const dataSource = mapConfig.dataSources[dataSourceId];
        if (!dataSource.layerType) {
          dataSource.layerType = 'WMS';
        } else {
          dataSource.layerType = dataSource.layerType.toUpperCase();
        }

        if (dataSource.layerType === 'WMS' || dataSource.layerType === 'NCWMS') {
          if (!dataSource.featureRequestsUrl && dataSource.serviceUrl) {
            dataSource.featureRequestsUrl = dataSource.serviceUrl;
          }
        }

        if (dataSource.showInLegend && !dataSource.legendUrl) {
          dataSource.legendUrl = dataSource.serviceUrl;
        }
      });
  },
};
