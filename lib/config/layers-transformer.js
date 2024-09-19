const { v4: uuidv4 } = require('uuid');

/**
 * Helper responsible for transforming tree-structured layer data in the {@code MapConfig} object
 * to a list, while also performing any necessary processing/transformation to the layer data
 * itself. This process transforms {@code mapConfig.modules.Tree.config['Base layers']} to
 * {@code mapConfig.supportedLayers.baseLayers} and
 * {@code mapConfig.modules.Tree.config['Overlay layers']} to
 * {@code mapConfig.supportedLayers.overlayLayers}.
 */
module.exports = {

  /**
   * Co-ordinate the processing of the {@code mapConfig} object.
   */
  process(mapConfig) {

    mapConfig.supportedLayers = {};

    // Build a list of Base Layers.
    mapConfig.supportedLayers.baseLayers = this._transformToList(
      mapConfig.modules.Tree.config['Base layers'],
      mapConfig.defaultLayers,
    );

    // Build a list of Overlay Layers.
    mapConfig.supportedLayers.overlayLayers = this._transformToList(
      mapConfig.modules.Tree.config['Overlay layers'],
      mapConfig.defaultLayers,
    );

    // Remove the original data.
    delete mapConfig.modules.Tree.config['Base layers'];
    delete mapConfig.modules.Tree.config['Overlay layers'];

    // Process each layer in-place.
    this._processLayer(mapConfig.supportedLayers.baseLayers, mapConfig.dataSources);
    this._processLayer(mapConfig.supportedLayers.overlayLayers, mapConfig.dataSources);

  },

  /**
   * Private method that converts a {@code Tree} of layers into a list of layers.
   */
  _transformToList(layerDefnRootNode, cachedData) {

    // Invoke the process. Note don't bother specifying 'id' for top level, as it is meaningless.
    const list = this._transformNode(layerDefnRootNode);

    // Update any layers with cached information.
    cachedData.forEach((_cachedInfo) => {
      const layer = list.find((_layer) => _layer.layerId === _cachedInfo.layerId);
      if (layer) {
        layer.cached = true;
        layer.description = _cachedInfo.description;
        layer.hasLegend = _cachedInfo.hasLegend;
        layer.dataSourceId = _cachedInfo.dataSourceId;
        layer.layerName = _cachedInfo.layerName;
      }
    });

    // Sort alphabetically with parents first.
    list.sort((a, b) => {

      // Parents first.
      if (a.isParent && !b.isParent) {
        return -1;
      }
      if (!a.isParent && b.isParent) {
        return 1;
      }

      // Sort alphabetically.
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }

      // They match.
      return 0;

    });

    return list;

  },

  /**
   * Private method invoked iteratively to process a single node from the tree.
   */
  _transformNode(node, id, parentId) {

    // Declare the list that will be built by this iteration of this method.
    let list = [];

    // Make a temp copy of the id so it can be updated without fear of propagating the change.
    let tempId = id;

    // if the parent node has a 'title' property, it is an actual Layer, which also means that it
    // does not have children.
    if (node.title) {

      // A leaf/layer, so populate the layer.
      const layer = this._makeLayer(node, tempId, parentId);
      list.push(layer);

    } else {

      // Not a Layer, so treat as a parent node. Add this to the list if an `id` is defined. This
      // ensures the root node id remains 'undefined'.
      if (tempId) {

        // Parent, so generate a uuid.
        tempId = uuidv4();
        const parent = this._makeParent(node, tempId, id, parentId);
        list.push(parent);
      }

      // Iteratively invoke this method for every property of the node.
      Object.keys(node).forEach((key) => {
        list = list.concat(this._transformNode(node[key], key, tempId));
      });
    }

    return list;
  },

  /**
   * Private method to populate a single layer object.
   */
  _makeLayer(node, id, parentId) {
    const layer = {};

    layer.layerId = id;
    layer.title = node.title;
    if (node.bbox) {
      layer.bbox = node.bbox;
    }
    layer.parentId = parentId;

    return layer;
  },

  /**
   * Private method to populate a single parent object.
   */
  _makeParent(node, layerId, title, parentId) {
    return {
      layerId,
      title,
      parentId,
      isParent: true,
    };
  },

  /**
   * Private method to process each individual layer.
   */
  _processLayer(layerList, dataSources) {

    // Loop through every layer.
    layerList.forEach((layer) => {

      const layerId = layer.layerId || layer.layerName;
      const dataSourceSeparatorIndex = layerId.indexOf('_');
      if (dataSourceSeparatorIndex !== -1) {
        layer.dataSourceId = layerId.substring(0, dataSourceSeparatorIndex);
        layer.shortLayerId = layerId.substring(dataSourceSeparatorIndex + 1);
      } else {
        layer.dataSourceId = 'default';
        layer.shortLayerId = layerId;
      }

      layer.style = '';

      // ----
      if (!layer.dataSourceId && !layer.layerType) {
        layer.dataSourceId = 'default';
      }

      let dataSource = null;
      if (layer.dataSourceId) {
        dataSource = dataSources[layer.dataSourceId];
        if (!dataSource) {
          layer.dataSourceId = 'default';
          dataSource = dataSources[layer.dataSourceId];
        }
      }

      if (!layer.legendUrl && dataSource && dataSource.legendUrl) {
        layer.legendUrl = dataSource.legendUrl;
      }

      if (!layer.opacity) {
        layer.opacity = 1;
      }

      if (dataSource) {
        if (!layer.wmsFeatureRequestLayers) {
          layer.wmsFeatureRequestLayers = [{}];
          layer.wmsFeatureRequestLayers[0][layerId] = dataSource.featureRequestsUrl;
        } else {
          const requestLayers = layer.wmsFeatureRequestLayers;
          for (let i = 0; i < requestLayers.length; i += 1) {
            if (typeof requestLayers[i] === 'string') {
              const requestLayerId = requestLayers[i];
              requestLayers[i] = {};
              requestLayers[i][requestLayerId] = dataSource.featureRequestsUrl;
            }
          }
        }
      }

      // Normalize the field "description" - Make links clickable
      if (!layer.description) {
        layer.description = layer.title;
      }

      // Apply all data source config to the layer, to allow easy override in the layer.
      if (dataSource) {
        Object.keys(dataSource).forEach((dataSourceProp) => {
          if (typeof layer[dataSourceProp] === 'undefined') {
            layer[dataSourceProp] = dataSource[dataSourceProp];
          }
        });
      }
    });
  },

};
