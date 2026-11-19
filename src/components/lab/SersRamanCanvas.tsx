import React, { useRef, useEffect, useState } from 'react';

export const SersRamanCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverPeak, setHoverPeak] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 480);
    const height = (canvas.height = 140);

    const render = () => {
      phase += 0.03;
      ctx.fillStyle = '#060B14';
      ctx.fillRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Raman Spectrum Waveform
      ctx.beginPath();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x += 2) {
        // Base spectrum curve
        let y = height * 0.78 - Math.sin(x * 0.015) * 8 - (Math.random() - 0.5) * 2;

        // Peak 1: Phenylalanine (1004 cm^-1)
        const peak1X = width * 0.32;
        if (Math.abs(x - peak1X) < 18) {
          y -= Math.exp(-Math.pow((x - peak1X) / 8, 2)) * 38;
        }

        // Peak 2: Interleukin-6 (1335 cm^-1) -> ELEVATED
        const peak2X = width * 0.58;
        if (Math.abs(x - peak2X) < 22) {
          y -= Math.exp(-Math.pow((x - peak2X) / 10, 2)) * (68 + Math.sin(phase) * 4);
        }

        // Peak 3: Procalcitonin (1580 cm^-1) -> ELEVATED
        const peak3X = width * 0.82;
        if (Math.abs(x - peak3X) < 20) {
          y -= Math.exp(-Math.pow((x - peak3X) / 9, 2)) * (52 + Math.cos(phase) * 3);
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Peak Labels
      ctx.fillStyle = '#f87171';
      ctx.font = '9px monospace';
      ctx.fillText('IL-6 (1335 cm⁻¹)', width * 0.52, 28);
      ctx.fillStyle = '#fb923c';
      ctx.fillText('PCT (1580 cm⁻¹)', width * 0.76, 42);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Baseline (1004 cm⁻¹)', width * 0.25, 65);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-purple-900/40 shadow-inner bg-[#060B14]">
      <canvas ref={canvasRef} className="w-full h-36 block" />
      <div className="absolute top-2 right-3 flex items-center gap-2 font-mono text-[10px]">
        <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
        <span className="text-slate-400">785nm Raman Spectrum (400–1800 cm⁻¹)</span>
      </div>
      <div className="flex items-center justify-between p-2 px-3 text-[10px] font-mono text-slate-400 bg-slate-950/60 border-t border-slate-900">
        <span>Laser Power: 45 mW</span>
        <span className="text-rose-400">Picomolar Cytokine Surge Detected</span>
      </div>
    </div>
  );
};
