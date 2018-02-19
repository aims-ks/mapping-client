const uuidv4 = require('uuid/v4');

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
  process: function (mapConfig) {

    mapConfig.supportedLayers = {};

    // Build a list of Base Layers.
    mapConfig.supportedLayers.baseLayers = this._transformToList(
      mapConfig.modules.Tree.config["Base layers"],
      mapConfig.defaultLayers
    );

    // Build a list of Overlay Layers.
    mapConfig.supportedLayers.overlayLayers = this._transformToList(
      mapConfig.modules.Tree.config["Overlay layers"],
      mapConfig.defaultLayers
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
  _transformToList: function(layerDefnRootNode, cachedData) {

    // Invoke the process. Note don't bother specifying 'id' for top level, as it is meaningless.
    let list = this._transformNode(layerDefnRootNode);

    // Update any layers with cached information.
    cachedData.forEach(function (_cachedInfo) {
      const layer = list.find((_layer) => {
        return _layer.layerId == _cachedInfo.layerId;
      });
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
  _transformNode(_node, _id, _parentId) {

    // Declare the list that will be built by this iteration of this method.
    let list = [];

    // Make a temp copy of the _id so it can be updated without fear of propagating the change.
    let _tempId = _id;

    // if the parent node has a 'title' property, it is an actual Layer, which also means that it
    // does not have children.
    if (_node.title) {

      // A leaf/layer, so populate the layer.
      const layer = this._makeLayer(_node, _tempId, _parentId);
      list.push(layer);

    } else {

      // Not a Layer, so treat as a parent node. Add this to the list if an `_id` is defined. This
      // ensures the root node id remains 'undefined'.
      if (_tempId) {

        // Parent, so generate a uuid.
        _tempId = uuidv4();
        const parent = this._makeParent(_node, _tempId, _id, _parentId);
        list.push(parent);
      }

      // Iteratively invoke this method for every property of the node.
      Object.keys(_node).forEach(function (_key) {
        list = list.concat(this._transformNode(_node[_key], _key, _tempId));
      }.bind(this));
    }

    return list;

  },


  /**
   * Private method to populate a single layer object.
   */
  _makeLayer(node, id, parentId) {
    let layer = {};

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
  _makeParent(node, id, title, parentId) {
    return {
      layerId: id,
      title: title,
      parentId: parentId,
      isParent: true
    }
  },

  /**
   * Private method to process each individual layer.
   */
  _processLayer(layerList, dataSources) {

    // Loop through every layer.
    layerList.forEach((_layer) => {

      const layerId = _layer['layerId'] || _layer['layerName'];
      const dataSourceSeparatorIndex = layerId.indexOf('_');
      if (dataSourceSeparatorIndex != -1) {
        _layer.dataSourceId = layerId.substring(0, dataSourceSeparatorIndex);
        _layer.shortLayerId = layerId.substring(dataSourceSeparatorIndex + 1);
      } else {
        _layer.dataSourceId = 'default';
        _layer.shortLayerId = layerId;
      }

      _layer.style = '';

      // ----
      if (!_layer['dataSourceId'] && !_layer['layerType']) {
        _layer['dataSourceId'] = 'default';
      }

      let dataSource = null;
      if (_layer['dataSourceId']) {
        dataSource = dataSources[_layer['dataSourceId']];
        if (!dataSource) {
          _layer['dataSourceId'] = 'default';
          dataSource = dataSources[_layer['dataSourceId']];
        }
      }

      _layer['hasLegend'] = (_layer['hasLegend'] !== 'false');
      if (!_layer['legendUrl'] && dataSource && dataSource['legendUrl']) {
        _layer['legendUrl'] = dataSource['legendUrl'];
      }

      if (dataSource) {
        if (!_layer['wmsFeatureRequestLayers']) {
          _layer['wmsFeatureRequestLayers'] = [{}];
          _layer['wmsFeatureRequestLayers'][0][layerId] = dataSource['featureRequestsUrl'];
        } else {
          const requestLayers = _layer['wmsFeatureRequestLayers'];
          for (let i = 0; i < requestLayers.length; i++) {
            if (typeof(requestLayers[i]) === 'string') {
              const _layerId = requestLayers[i];
              requestLayers[i] = {};
              requestLayers[i][_layerId] =
                dataSource['featureRequestsUrl'];
            }
          }
        }
      }

      // Normalize the field "description" - Make links clickable
      if (!_layer['description']) {
        _layer['description'] = _layer['title'];
      }

      // Apply all data source config to the layer, to allow easy override in the layer.
      if (dataSource) {
        for (const dataSourceProp in dataSource) {
          if (dataSource.hasOwnProperty(dataSourceProp)
            && typeof(_layer[dataSourceProp]) == 'undefined') {

            _layer[dataSourceProp] = dataSource[dataSourceProp];
          }
        }
      }

      // Add property for connecting to the ol layer when rendered
      _layer.olRenderedLayer = null;

    });
  }

};
