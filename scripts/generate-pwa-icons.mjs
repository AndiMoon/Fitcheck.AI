import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const toCrc = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  chunk.writeUInt32BE(crc32(toCrc), 8 + len);
  return chunk;
}

function generatePng(width, height, isMaskable = false) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.48 : 0.42);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient: sleek dark-to-violet/rose FitCheck aesthetic
      // Rose #f43f5e (244, 63, 94) to Violet #8b5cf6 (139, 92, 246)
      const t = (x + y) / (width + height);
      let r = 15;
      let g = 15;
      let b = 20;
      let a = 255;

      // Draw stylized hanger / camera badge
      const cornerR = isMaskable ? 0 : width * 0.22;
      const insideBox = (
        isMaskable || 
        (Math.abs(dx) <= cx - cornerR && Math.abs(dy) <= cy) ||
        (Math.abs(dy) <= cy - cornerR && Math.abs(dx) <= cx) ||
        Math.hypot(Math.max(0, Math.abs(dx) - (cx - cornerR)), Math.max(0, Math.abs(dy) - (cy - cornerR))) <= cornerR
      );

      if (insideBox) {
        // Gradient fill inside app badge
        const gradR = Math.round(244 * (1 - t) + 139 * t);
        const gradG = Math.round(63 * (1 - t) + 92 * t);
        const gradB = Math.round(94 * (1 - t) + 246 * t);

        // Center stylized icon emblem (FitCheck hanger + sparkle)
        const insideEmblem = (
          // Hanger hook
          (Math.abs(dx) < width * 0.04 && dy >= -cy * 0.55 && dy <= -cy * 0.2) ||
          // Hanger triangle slope
          (dy >= -cy * 0.2 && dy <= cy * 0.15 && Math.abs(dx) <= (dy + cy * 0.2) * 1.6 && Math.abs(dx) >= (dy + cy * 0.2) * 1.6 - width * 0.05) ||
          // Hanger bottom bar
          (dy >= cy * 0.12 && dy <= cy * 0.18 && Math.abs(dx) <= width * 0.32) ||
          // Sparkle diamond at top right
          (Math.abs(dx - width * 0.22) + Math.abs(dy + height * 0.22) <= width * 0.08)
        );

        if (insideEmblem) {
          r = 255;
          g = 255;
          b = 255;
          a = 255;
        } else {
          // Inner badge gradient with slight shadow vignette
          const vignette = 1 - (dist / (width * 0.7)) * 0.3;
          r = Math.min(255, Math.max(0, Math.round(gradR * vignette)));
          g = Math.min(255, Math.max(0, Math.round(gradG * vignette)));
          b = Math.min(255, Math.max(0, Math.round(gradB * vignette)));
        }
      } else {
        a = 0; // Transparent outside rounded icon
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Generate files
const png192 = generatePng(192, 192, false);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

const png512 = generatePng(512, 512, false);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

const pngMaskable512 = generatePng(512, 512, true);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable512);

// Also generate SVG icon for sharp high-DPI displays
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="fitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="50%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#fitGrad)"/>
  <!-- Hanger & Sparkle Icon -->
  <path d="M 256 120 C 235 120 220 135 220 155 C 220 172 232 184 246 188 L 246 220 L 140 290 C 130 297 130 312 142 312 L 370 312 C 382 312 382 297 372 290 L 266 220 L 266 188 C 280 184 292 172 292 155 C 292 135 277 120 256 120 Z M 256 140 C 265 140 272 147 272 155 C 272 163 265 170 256 170 C 247 170 240 163 240 155 C 240 147 247 140 256 140 Z M 172 292 L 256 236 L 340 292 Z" fill="#ffffff" filter="url(#glow)"/>
  <!-- Sparkle star -->
  <path d="M 380 130 Q 380 160 410 160 Q 380 160 380 190 Q 380 160 350 160 Q 380 160 380 130 Z" fill="#ffffff"/>
  <circle cx="160" cy="180" r="8" fill="#ffffff" opacity="0.8"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgIcon);

console.log('Successfully generated PWA icon assets in /public');
