// src/components/CanvasOutput.jsx
import { useEffect, useRef } from 'react';
import MacWindow from './MacWindow';
import {
  FRAMEBUFFER_START,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  formatVmAddress,
} from '../vmLayout';

const SCALE = 10;

const colorPalette = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00',
  '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#808080', '#4B0082',
];

export default function CanvasOutput({ memorySnapshot, drawTrigger }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx    = canvasRef.current.getContext('2d');

    ctx.imageSmoothingEnabled = false;

    // clear
    ctx.fillStyle = colorPalette[0];
    ctx.clearRect(0, 0, SCREEN_WIDTH * SCALE, SCREEN_HEIGHT * SCALE);
    ctx.fillRect(0, 0, SCREEN_WIDTH * SCALE, SCREEN_HEIGHT * SCALE);

    // draw each pixel
    for (let y = 0; y < SCREEN_HEIGHT; y++) {
      for (let x = 0; x < SCREEN_WIDTH; x++) {
        const addr       = FRAMEBUFFER_START + (y * SCREEN_WIDTH + x);
        const colorIndex = memorySnapshot[addr] || 0;
        ctx.fillStyle    = colorPalette[colorIndex % colorPalette.length];
        ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
      }
    }
  }, [drawTrigger, memorySnapshot]);

  return (
    <MacWindow title="Canvas">
      <p className="mb-3 text-center text-xs text-[var(--text-muted)]">
        Reads colors from framebuffer memory at {formatVmAddress(FRAMEBUFFER_START)}.
      </p>
      <div className='flex justify-center'>
        <canvas
          ref={canvasRef}
          width={SCREEN_WIDTH * SCALE}
          height={SCREEN_HEIGHT * SCALE}
          className="rounded-[6px] border border-orange-500 shadow [image-rendering:pixelated]"
        />
      </div>
    </MacWindow>
  );
}
