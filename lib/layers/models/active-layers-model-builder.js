/**
 * Builder that returns a populated {@code ActiveLayersModel}. The underlying model is instantiated
 * by the specified {@code modelFactory} and populated with the first, if any, member of the
 * {@code availableLayersModel}.
 */
export default function make(modelFactory, availableLayersModel) {
  const availableLayers = availableLayersModel.getLayers();

  if (availableLayers.length > 0) {
    return modelFactory([availableLayers[0]]);
  }

  return modelFactory();
}
