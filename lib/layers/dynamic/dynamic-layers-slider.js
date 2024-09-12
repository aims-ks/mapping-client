/**
 * A Component that provides a swiping slider between two (2) {@link DynamicLayerRenderer}s.
 */

export default class DynamicLayersSlider {

  /**
   * Constructor to wire the sub-components together for the desired functionality.
   *
   * @param olMap Reference to the underlying OpenLayers map.
   * @param $slider JQuery reference to the slider component.
   * @param dynamicLayerRenderer1 The renderer for the data that is displayed on the left.
   * @param dynamicLayerRenderer2 The renderer for the data that is displayed on the right.
   */
  constructor(olMap, $slider, dynamicLayerRenderer1, dynamicLayerRenderer2) {

    dynamicLayerRenderer1.getVectorLayer().on('precompose', (event) => {
      const percent = $slider.val() / 100;
      const ctx = event.context;
      const width = ctx.canvas.width * percent;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width, ctx.canvas.height);
      ctx.clip();
    });

    dynamicLayerRenderer1.getVectorLayer().on('postcompose', (event) => {
      event.context.restore();
    });

    dynamicLayerRenderer2.getVectorLayer().on('precompose', (event) => {
      const percent = $slider.val() / 100;
      const ctx = event.context;
      const width = ctx.canvas.width * percent;

      ctx.save();
      ctx.beginPath();
      ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
      ctx.clip();

      // Draw a separating vertical line.
      if (percent < 100) {
        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.lineTo(width, ctx.canvas.height);
        ctx.stroke();
      }
    });

    dynamicLayerRenderer2.getVectorLayer().on('postcompose', (event) => {
      event.context.restore();
    });

    $slider.on('input change', () => {
      olMap.render();
    });

  }

}
