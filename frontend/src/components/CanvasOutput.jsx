// src/components/CanvasOutput.jsx
import { useEffect, useRef } from 'react';
import MacWindow from './MacWindow';

const SCREEN_WIDTH      = 32;
const SCREEN_HEIGHT     = 32;
const SCALE             = 10;
const FRAMEBUFFER_START = 0x400;

const colorPalette = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00',
  '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#808080', '#4B0082',
];

export default function CanvasOutput({ vmInstance, drawTrigger }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!vmInstance || !vmInstance.HEAPU8) return;

    const heap   = new Uint8Array(vmInstance.HEAPU8.buffer);
    const memPtr = vmInstance._get_memory();
    const ctx    = canvasRef.current.getContext('2d');

    // clear
    ctx.clearRect(0, 0, SCREEN_WIDTH * SCALE, SCREEN_HEIGHT * SCALE);

    // draw each pixel
    for (let y = 0; y < SCREEN_HEIGHT; y++) {
      for (let x = 0; x < SCREEN_WIDTH; x++) {
        const addr       = memPtr + FRAMEBUFFER_START + (y * SCREEN_WIDTH + x);
        const colorIndex = heap[addr] || 0;
        ctx.fillStyle    = colorPalette[colorIndex % colorPalette.length];
        ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
      }
    }
  }, [vmInstance, drawTrigger]);

  return (
    <MacWindow title="Canvas">
      <div className='flex justify-center'>
        <canvas
        ref={canvasRef}
        width={SCREEN_WIDTH * SCALE}
        height={SCREEN_HEIGHT * SCALE}
        className="border border-orange-500 rounded shadow"
      />
      </div>
      
    </MacWindow>
  );
}
