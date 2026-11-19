import React, { useRef, useEffect, useState } from 'react';

interface BciOscilloscopeCanvasProps {
  bisScore: number;
}

export const BciOscilloscopeCanvas: React.FC<BciOscilloscopeCanvasProps> = ({ bisScore }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [spikeInjected, setSpikeInjected] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    const height = (canvas.height = 130);

    const channels = [
      { name: 'Fp1-F3 (Frontal)', color: '#38bdf8', yBase: 25, freq: 1.2, amp: 8 },
      { name: 'C3-P3 (Central)', color: '#2dd4bf', yBase: 65, freq: 2.1, amp: 10 },
      { name: 'O1-O2 (Occipital)', color: '#a855f7', yBase: 105, freq: 3.5, amp: 6 }
    ];

    const render = () => {
      time += 0.05;
      ctx.fillStyle = '#060B14';
      ctx.fillRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 35) {
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

      // Draw each EEG wave stream
      channels.forEach(ch => {
        ctx.beginPath();
        ctx.strokeStyle = spikeInjected ? '#f43f5e' : ch.color;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < width; x += 3) {
          const t = time + x * 0.03;
          let wave = Math.sin(t * ch.freq) * ch.amp + Math.cos(t * ch.freq * 1.8) * (ch.amp * 0.4);
          
          // Simulated epileptiform spike burst
          if (spikeInjected && x > width * 0.45 && x < width * 0.55) {
            wave += (Math.random() - 0.5) * 45;
          }

          const y = ch.yBase + wave;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Channel Label
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.font = '9px monospace';
        ctx.fillText(ch.name, 8, ch.yBase - 8);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [spikeInjected, bisScore]);

  return (
    <div className="space-y-2">
      <div className="w-full relative rounded-2xl overflow-hidden border border-purple-900/50 shadow-inner bg-[#060B14]">
        <canvas ref={canvasRef} className="w-full h-32 block" />
        <div className="absolute top-2 right-3 flex items-center gap-2 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-400">Sampling: 512 Hz • 16 Channels</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] px-1">
        <span className="text-slate-500 font-mono">
          Montage: International 10–20 System
        </span>
        <button
          type="button"
          onClick={() => {
            setSpikeInjected(true);
            setTimeout(() => setSpikeInjected(false), 2200);
          }}
          className={`px-3 py-1 rounded-lg text-[10px] font-bold font-mono transition ${
            spikeInjected
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/60 border border-purple-800'
          }`}
        >
          {spikeInjected ? '🚨 FOCAL SPIKE BURST DETECTED!' : 'Test Micro-Spike Discharge'}
        </button>
      </div>
    </div>
  );
};
