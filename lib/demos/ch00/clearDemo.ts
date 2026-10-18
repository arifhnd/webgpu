export function clearToColor(device: GPUDevice, ctx: GPUCanvasContext, r: number, g: number, b: number): void {
  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: ctx.getCurrentTexture().createView(),
      clearValue: {r, g, b, a:1},
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });
  pass.end();
  device.queue.submit([encoder.finish()]);
}
