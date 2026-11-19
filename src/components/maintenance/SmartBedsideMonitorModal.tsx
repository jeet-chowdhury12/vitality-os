import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Activity, AlertCircle, Heart, Bell, ShieldAlert, 
  Volume2, VolumeX, Sparkles, CheckCircle2, RefreshCw, Send,
  Cpu, Thermometer, Radio
} from 'lucide-react';

interface SmartBedsideMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  bedId?: string;
  patientName?: string;
}

export function SmartBedsideMonitorModal({
  isOpen,
  onClose,
  bedId = 'ICU-BED-04',
  patientName = 'Al-Amin Hossain (58M)'
}: SmartBedsideMonitorModalProps) {
  const [heartRate, setHeartRate] = useState<number>(84);
  const [spo2, setSpo2] = useState<number>(97);
  const [systolicBP, setSystolicBP] = useState<number>(128);
  const [diastolicBP, setDiastolicBP] = useState<number>(82);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(18);
  const [tempCelsius, setTempCelsius] = useState<number>(37.2);
  
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(true);
  const [nurseAlertSent, setNurseAlertSent] = useState<boolean>(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  // Calculate National Early Warning Score (NEWS2)
  const calculateNews2 = () => {
    let score = 0;
    if (respiratoryRate <= 8 || respiratoryRate >= 25) score += 3;
    else if (respiratoryRate >= 21) score += 2;
    else if (respiratoryRate <= 11) score += 1;

    if (spo2 <= 91) score += 3;
    else if (spo2 <= 93) score += 2;
    else if (spo2 <= 95) score += 1;

    if (systolicBP <= 90 || systolicBP >= 220) score += 3;
    else if (systolicBP <= 100) score += 2;
    else if (systolicBP <= 110) score += 1;

    if (heartRate <= 40 || heartRate >= 131) score += 3;
    else if (heartRate >= 111) score += 2;
    else if (heartRate <= 50 || heartRate >= 91) score += 1;

    if (tempCelsius <= 35.0) score += 3;
    else if (tempCelsius >= 39.1) score += 2;
    else if (tempCelsius <= 36.0 || tempCelsius >= 38.1) score += 1;

    return score;
  };

  const news2Score = calculateNews2();

  // ECG Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    let prevY = 60;
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';

    const drawEcg = () => {
      // Fade trail
      ctx.fillRect(x, 0, 8, canvas.height);

      let y = 60;
      const phase = x % 100;
      if (phase > 40 && phase < 45) y = 55;        // P wave
      else if (phase >= 45 && phase < 48) y = 65;   // Q dip
      else if (phase >= 48 && phase < 52) y = 15;   // R spike
      else if (phase >= 52 && phase < 56) y = 78;   // S dip
      else if (phase >= 65 && phase < 75) y = 50;   // T wave
      else y = 60 + (Math.random() * 2 - 1);

      ctx.beginPath();
      ctx.moveTo(x, prevY);
      ctx.lineTo(x + 1, y);
      ctx.stroke();

      prevY = y;
      x = (x + 1) % canvas.width;
      animationFrameId = requestAnimationFrame(drawEcg);
    };

    drawEcg();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Trigger Deterioration Simulation
  const handleSimulateDeterioration = () => {
    setHeartRate(124);
    setSpo2(89);
    setSystolicBP(88);
    setRespiratoryRate(28);
    setTempCelsius(38.8);
    setIsAlerting(true);
  };

  const handleResetVitals = () => {
    setHeartRate(82);
    setSpo2(98);
    setSystolicBP(122);
    setDiastolicBP(80);
    setRespiratoryRate(16);
    setTempCelsius(37.1);
    setIsAlerting(false);
    setNurseAlertSent(false);
  };

  const handleSendNurseAlert = () => {
    setNurseAlertSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">Smart Bedside Telemetry Robot (Medit Track)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  24/7 IoT SENSORS ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Bed: <strong className="text-white">{bedId}</strong> • Patient: <strong className="text-white">{patientName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={isSoundMuted ? 'Unmute Alarm' : 'Mute Alarm'}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Oscilloscope Waveform */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Heart className="w-4 h-4 text-rose-500 animate-ping" />
            <span>ECG LEAD II • 25 mm/s • 10 mm/mV</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            NIBP Auto Cycle: Q15M
          </div>
        </div>

        <div className="bg-slate-950 px-6 py-2">
          <canvas
            ref={canvasRef}
            width={720}
            height={120}
            className="w-full h-24 bg-slate-950 rounded-xl border border-emerald-950"
          />
        </div>

        {/* Content: Vitals Telemetry Grid */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* Heart Rate */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              heartRate > 110 || heartRate < 50
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-300 animate-pulse'
                : 'bg-slate-800/40 border-slate-700'
            }`}>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Heart Rate (BPM)</span>
              <div className="text-3xl font-black text-white">{heartRate}</div>
              <span className="text-[10px] text-slate-400">Normal: 60-100</span>
            </div>

            {/* SpO2 */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              spo2 < 92
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-300 animate-pulse'
                : 'bg-slate-800/40 border-slate-700'
            }`}>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">SpO2 Oxygen (%)</span>
              <div className="text-3xl font-black text-cyan-300">{spo2}%</div>
              <span className="text-[10px] text-slate-400">Normal: 95-100%</span>
            </div>

            {/* Blood Pressure */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              systolicBP < 90 || systolicBP > 160
                ? 'bg-amber-950/40 border-amber-500/60 text-amber-300'
                : 'bg-slate-800/40 border-slate-700'
            }`}>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">NIBP (mmHg)</span>
              <div className="text-2xl font-black text-emerald-400">{systolicBP}/{diastolicBP}</div>
              <span className="text-[10px] text-slate-400">MAP: {Math.round((2*diastolicBP + systolicBP)/3)}</span>
            </div>

            {/* Respiratory Rate */}
            <div className="p-4 rounded-2xl border bg-slate-800/40 border-slate-700 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Resp Rate (/min)</span>
              <div className="text-3xl font-black text-indigo-300">{respiratoryRate}</div>
              <span className="text-[10px] text-slate-400">Normal: 12-20</span>
            </div>

            {/* Core Temp */}
            <div className="p-4 rounded-2xl border bg-slate-800/40 border-slate-700 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Core Temp (°C)</span>
              <div className="text-3xl font-black text-amber-300">{tempCelsius}°C</div>
              <span className="text-[10px] text-slate-400">Normal: 36.5-37.5</span>
            </div>

          </div>

          {/* NEWS2 Clinical Score Banner */}
          <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase">National Early Warning Score (NEWS2):</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                  news2Score >= 7
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : news2Score >= 5
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  NEWS2: {news2Score} • {news2Score >= 7 ? 'CRITICAL RISK' : news2Score >= 5 ? 'MEDIUM RISK' : 'LOW RISK'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {news2Score >= 7 
                  ? 'Urgent escalation: Trigger Code Blue or Medical Emergency Team (MET) review immediately.'
                  : news2Score >= 5
                  ? 'Urgent bedside nurse review and continuous pulse oximetry mandated.'
                  : 'Patient stable. Continuous bedside IoT monitoring active.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateDeterioration}
                className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-xs font-bold text-rose-200 transition-all"
              >
                Simulate Deterioration
              </button>
              <button
                onClick={handleResetVitals}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all"
              >
                Reset Vitals
              </button>
              <button
                onClick={handleSendNurseAlert}
                disabled={nurseAlertSent}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{nurseAlertSent ? 'Nurse Pager Beamed!' : 'Dispatch Nurse Pager'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Bedside Unit ID: MEDIT-ROBOT-04 • BLE & MQTT Mesh Network</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Monitor
          </button>
        </div>

      </div>
    </div>
  );
}
