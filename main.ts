import { getDevice } from './lib/gpu/renderer2d';
import { clearToColor } from './lib/demos/ch00/clearDemo';

async function main() {
  const statusEl = document.getElementById('status')!;
  const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement | null;

  // Elemen-elemen Live Monitor
  const valTEl = document.getElementById('val-t')!;
  const valSinEl = document.getElementById('val-sin')!;
  const valVEl = document.getElementById('val-v')!;
  const colorBarEl = document.getElementById('color-bar')!;

  if (!canvas) {
    statusEl.textContent = 'Elemen canvas tidak ditemukan!';
    statusEl.className = 'error';
    return;
  }

  // 1. Minta GPUDevice
  const device = await getDevice();
  if (!device) {
    statusEl.innerHTML = '❌ <b>WebGPU tidak didukung</b> di browser atau perangkat ini.<br>Gunakan browser modern seperti Google Chrome atau Microsoft Edge.';
    statusEl.className = 'error';
    return;
  }

  // 2. Dapatkan context WebGPU dari canvas
  const ctx = canvas.getContext('webgpu') as GPUCanvasContext | null;
  if (!ctx) {
    statusEl.textContent = 'Gagal mendapatkan context WebGPU dari canvas.';
    statusEl.className = 'error';
    return;
  }

  // 3. Konfigurasi context
  const format = navigator.gpu.getPreferredCanvasFormat();
  ctx.configure({
    device,
    format,
    alphaMode: 'opaque',
  });

  statusEl.textContent = '✅ WebGPU aktif! Mengamati perubahan angka trigonometri & warna...';
  statusEl.className = 'success';

  // 4. Render loop
  function render(time: number) {
    // -------------------------------------------------------------
    // LANGKAH 1: Membaca Waktu (t) dalam detik
    // Kita kalikan 0.001 agar milidetik menjadi detik,
    // lalu kita kalikan 1.2 untuk mengatur kecepatan animasi.
    // -------------------------------------------------------------
    const t = time * 0.001 * 1.2;

    // -------------------------------------------------------------
    // LANGKAH 2: Menggunakan Math.sin(t)
    // Nilai ini selalu berayun bolak-balik:
    // Paling rendah = -1.0
    // Paling tinggi  = +1.0
    // -------------------------------------------------------------
    const sinVal = Math.sin(t);

    // -------------------------------------------------------------
    // LANGKAH 3: Normalisasi ke Rentang [0.0 s/d 1.0]
    // - (sinVal + 1) mengubah rentang [-1 s/d +1] menjadi [0 s/d 2]
    // - Dibagi 2     mengubah rentang [0 s/d 2]   menjadi [0 s/d 1]
    // -------------------------------------------------------------
    const v = (sinVal + 1) / 2;

    // -------------------------------------------------------------
    // LANGKAH 4: Masukkan ke WebGPU
    // Jika r = g = b = v:
    // v = 0.0 => Hitam pekat
    // v = 0.5 => Abu-abu sedang
    // v = 1.0 => Putih bersih
    // -------------------------------------------------------------
    clearToColor(device!, ctx!, v, v, v);

    // -------------------------------------------------------------
    // LANGKAH 5: Tampilkan angka-angka ke Live Monitor di layar
    // -------------------------------------------------------------
    valTEl.textContent = t.toFixed(2);
    valSinEl.textContent = (sinVal >= 0 ? '+' : '') + sinVal.toFixed(3);
    valVEl.textContent = v.toFixed(3);
    colorBarEl.style.width = `${(v * 100).toFixed(1)}%`;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main().catch((err) => {
  console.error('Terjadi error saat inisialisasi WebGPU:', err);
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = 'Error: ' + err.message;
    statusEl.className = 'error';
  }
});
