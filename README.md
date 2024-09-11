# Mapping client

This component implements an event-driven, Open Layers map for the AIMS eAtlas mapping client, with
configuration provided by the AIMS AtlasMapper service.

## Nomenclature

### Layer types
The system supports the following layer types:

- `Dynamic`: rendered by the system from a geospatial datasource, often a CSV file.
- `Static`: rendered by another system, most likely a GeoServer instance. There are the following
    types of `Static` layers:
    - `Base layers`: the bottom layer of the map (lowest z-index), providing map details (eg: 
        countries, cities, reefs, etc). The system supports only a single active base layer at any 
        one time.
    - `Overlay layers`: middle layers of the map showing data provided by an external service, such 
        as WMS. The system supports multiple active overlay layers at once.

For `Base` and `Overlay` layers, the system supports the following states:

- `Supported`: A cache of all layers that are supported by the system. This list is populated from 
        the AtlasMapper configuration object. Overlay layers used the SimpleLayerModel, while Base 
        layers use the SingleLayerModel.
- `Available`: A subset of references to Supported layers. The user will choose which layers to 
        actually render from this list, so this list is essentially a selection list.
- `Active`: A subset of references to Available layers, Active layers are those which are currently
        being rendered by the system.

## API

The following system interface references are available from the `MapClient`:

- BaseLayers
- OverlayLayers
- Legend

### BaseLayers API / OverlayLayers API

These two (2) sub-systems are identical, differing only by whether they impact `Base` layers or 
`Overlay` layers.

- getSupportedLayers
- getAvailableLayers
- addAvailableLayer
- removeAvailableLayer
- getActiveLayers
- addActiveLayer
- removeActiveLayer

## Compile

```
$ cd development-env
$ docker compose up
$ docker exec -it mapping_client bash
# npm run build-alldeps
```

## Deploy

???
