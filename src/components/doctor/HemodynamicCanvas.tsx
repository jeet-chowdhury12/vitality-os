import React, { useRef, useEffect } from 'react';

interface HemodynamicCanvasProps {
  isStented: boolean;
  organ: 'Heart LAD' | 'Brain MCA' | 'Renal Glomerulus';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export const HemodynamicCanvas: React.FC<HemodynamicCanvasProps> = ({ isStented, organ }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 560);
    const height = (canvas.height = 140);

    // Initialize 65 blood cell particles
    const particles: Particle[] = [];
    for (let i = 0; i < 65; i++) {
      particles.push({
        x: Math.random() * width,
        y: height / 2 + (Math.random() - 0.5) * (height * 0.45),
        vx: 1.5 + Math.random() * 2,
        vy: (Math.random() - 0.5) * 0.5,
        size: 2.2 + Math.random() * 2.5,
        color: isStented ? '#2dd4bf' : '#f43f5e'
      });
    }

    const render = () => {
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Draw vessel walls
      const midY = height / 2;
      const stenosisX = width * 0.5;
      const stenosisWidth = width * 0.22;

      ctx.beginPath();
      // Upper Wall
      ctx.moveTo(0, 18);
      for (let x = 0; x <= width; x += 10) {
        let y = 18;
        if (!isStented && Math.abs(x - stenosisX) < stenosisWidth / 2) {
          const factor = Math.cos(((x - stenosisX) / (stenosisWidth / 2)) * (Math.PI / 2));
          y = 18 + factor * 32; // Inward stenosis bulge
        }
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Lower Wall
      ctx.beginPath();
      ctx.moveTo(0, height - 18);
      for (let x = 0; x <= width; x += 10) {
        let y = height - 18;
        if (!isStented && Math.abs(x - stenosisX) < stenosisWidth / 2) {
          const factor = Math.cos(((x - stenosisX) / (stenosisWidth / 2)) * (Math.PI / 2));
          y = height - 18 - factor * 32; // Inward stenosis bulge
        }
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw Stent Lattice if deployed
      if (isStented) {
        ctx.save();
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
        ctx.lineWidth = 1;
        const stentLeft = stenosisX - stenosisWidth / 1.8;
        const stentRight = stenosisX + stenosisWidth / 1.8;
        for (let x = stentLeft; x < stentRight; x += 12) {
          ctx.beginPath();
          ctx.moveTo(x, 22);
          ctx.lineTo(x + 12, height - 22);
          ctx.moveTo(x + 12, 22);
          ctx.lineTo(x, height - 22);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Update & Render Blood Particles
      particles.forEach(p => {
        const inStenosis = !isStented && Math.abs(p.x - stenosisX) < stenosisWidth / 2;
        
        // Velocity acceleration in stenosis (Bernoulli constriction)
        const currentSpeed = inStenosis ? p.vx * 2.8 : p.vx;
        p.x += currentSpeed;

        // Bounding constriction inside stenosis
        let topBound = 22;
        let bottomBound = height - 22;
        if (inStenosis) {
          const factor = Math.cos(((p.x - stenosisX) / (stenosisWidth / 2)) * (Math.PI / 2));
          topBound = 22 + factor * 30;
          bottomBound = height - 22 - factor * 30;
        }

        if (p.y < topBound) {
          p.y = topBound + 1;
          p.vy = Math.abs(p.vy);
        } else if (p.y > bottomBound) {
          p.y = bottomBound - 1;
          p.vy = -Math.abs(p.vy);
        }
        p.y += p.vy;

        // Wrap around
        if (p.x > width) {
          p.x = 0;
          p.y = height / 2 + (Math.random() - 0.5) * (height * 0.4);
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isStented 
          ? 'rgba(45, 212, 191, 0.85)' 
          : inStenosis 
            ? 'rgba(251, 146, 60, 0.95)' 
            : 'rgba(244, 63, 94, 0.85)';
        ctx.shadowColor = isStented ? '#2dd4bf' : inStenosis ? '#ea580c' : '#e11d48';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Flow Vector Direction Indicator
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.font = '10px monospace';
      ctx.fillText(`Navier-Stokes Flow Vectors • Re: ${isStented ? '980 (Laminar)' : '3420 (Turbulent Eddy)'}`, 12, height - 6);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isStented, organ]);

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-[#060A12]">
      <canvas ref={canvasRef} className="w-full h-36 block" />
      <div className="absolute top-2 right-3 flex items-center gap-2 font-mono text-[10px]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-slate-400">{organ} Virtual Doppler (60 FPS)</span>
      </div>
    </div>
  );
};
