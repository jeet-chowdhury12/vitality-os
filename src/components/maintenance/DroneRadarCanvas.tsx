import React, { useRef, useEffect } from 'react';
import { AutonomousMedicalDrone } from '../../data/hospitalStore';

interface DroneRadarCanvasProps {
  drones: AutonomousMedicalDrone[];
}

export const DroneRadarCanvas: React.FC<DroneRadarCanvasProps> = ({ drones }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let sweepAngle = 0;
    const size = Math.min(canvas.parentElement?.clientWidth || 400, 340);
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;
    const maxRadius = center - 16;

    const render = () => {
      // Clear with dark navy
      ctx.fillStyle = '#060B14';
      ctx.fillRect(0, 0, size, size);

      // Draw Range Rings (Concentric Circles)
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.arc(center, center, (maxRadius / 3) * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(center, 12);
      ctx.lineTo(center, size - 12);
      ctx.moveTo(12, center);
      ctx.lineTo(size - 12, center);
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
      ctx.stroke();

      // Sweeping Radar Beam (Rotary)
      sweepAngle += 0.025;
      if (sweepAngle > Math.PI * 2) sweepAngle = 0;

      const gradient = ctx.createRadialGradient(center, center, 0, center, center, maxRadius);
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, maxRadius, sweepAngle - 0.45, sweepAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Outer Glow Rim
      ctx.beginPath();
      ctx.arc(center, center, maxRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Render Drone Blips
      drones.forEach((drone, idx) => {
        // Place active drone along angle
        const distRatio = drone.status === 'In Flight - Cruising' ? 0.62 : 0.25;
        const angle = idx === 0 ? 0.85 : 3.4;
        const x = center + Math.cos(angle) * maxRadius * distRatio;
        const y = center + Math.sin(angle) * maxRadius * distRatio;

        // Blip ring
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = drone.status === 'In Flight - Cruising' ? '#38bdf8' : '#eab308';
        ctx.fill();

        // Pulsing echo
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.strokeStyle = drone.status === 'In Flight - Cruising' ? 'rgba(56, 189, 248, 0.6)' : 'rgba(234, 179, 8, 0.4)';
        ctx.stroke();

        // Transponder Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = '9px monospace';
        ctx.fillText(drone.callsign, x + 10, y - 2);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px monospace';
        ctx.fillText(`${drone.airspeedKmh} km/h • ${drone.altitudeMeters}m`, x + 10, y + 8);
      });

      // Airspace Label
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '9px monospace';
      ctx.fillText('METROPOLITAN AIR CORRIDOR • RADAR 15KM', 16, 22);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [drones]);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-[#060B14] rounded-2xl border border-sky-900/50 shadow-inner">
      <canvas ref={canvasRef} className="block rounded-full shadow-2xl" />
      <div className="flex items-center justify-between w-full mt-3 px-3 text-[10px] font-mono text-slate-400">
        <span>Transponder: Mode-S ADS-B</span>
        <span className="text-emerald-400">LiDAR 360° Anti-Collision: ACTIVE</span>
      </div>
    </div>
  );
};
