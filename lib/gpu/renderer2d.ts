let devicePromise: Promise<GPUDevice | null> | null = null;

/** Minta GPUDevice sekali dan pakai bersama oleh semua demo. null kalau tidak ada WebGPU. */
export function getDevice(): Promise<GPUDevice | null> {
  if (!devicePromise) {
    devicePromise = (async () => {
      if (!navigator.gpu) return null;
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) return null;
        const device = await adapter.requestDevice();
        device.lost.then(() => { devicePromise = null; });
        return device;
      } catch {
        return null;
      }
    })();
  }
  return devicePromise;
}
