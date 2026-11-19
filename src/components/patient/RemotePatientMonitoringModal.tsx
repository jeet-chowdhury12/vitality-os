import React, { useState, useEffect } from 'react';
import { 
  X, Activity, Heart, AlertTriangle, ShieldCheck, CheckCircle2,
  Watch, Radio, TrendingUp, Bell, Zap, Droplet, ArrowRight, RefreshCw
} from 'lucide-react';

interface RemotePatientMonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientMrin?: string;
}

interface WearableAnomaly {
  id: string;
  timestamp: string;
  sensor: string;
  metric: string;
  severity: 'CRITICAL' | 'WARNING' | 'RESOLVED';
  description: string;
}

export function RemotePatientMonitoringModal({
  isOpen,
  onClose,
  patientName = 'Kazi Mohammad Tareq (54M)',
  patientMrin = 'HS-2026-00421'
}: RemotePatientMonitoringModalProps) {
  const [livePulse, setLivePulse] = useState<number>(76);
  const [liveSpo2, setLiveSpo2] = useState<number>(98);
  const [liveGlucose, setLiveGlucose] = useState<number>(112);
  const [stepCount, setStepCount] = useState<number>(6420);
  const [mqttConnected, setMqttConnected] = useState<boolean>(true);
  const [alertTriggered, setAlertTriggered] = useState<boolean>(false);

  const [anomalies, setAnomalies] = useState<WearableAnomaly[]>([
    {
      id: 'anom-1',
      timestamp: '03:14 AM Today',
      sensor: 'Continuous ECG Patch (BioSensor X3)',
      metric: 'Heart Rate Spike (138 BPM)',
      severity: 'WARNING',
      description: 'Paroxysmal Supraventricular Tachycardia (SVT) episode lasting 4 minutes during sleep.'
    },
    {
      id: 'anom-2',
      timestamp: 'Yesterday 11:30 PM',
      sensor: 'Continuous Glucose Monitor (CGM)',
      metric: 'Hypoglycemia Dip (62 mg/dL)',
      severity: 'CRITICAL',
      description: 'Blood sugar dropped below safety threshold. Caregiver received automated push alarm.'
    }
  ]);

  if (!isOpen) return null;

  const handleSimulateArrhythmia = () => {
    setLivePulse(134);
    setLiveSpo2(91);
    setAlertTriggered(true);
    const newAnom: WearableAnomaly = {
      id: `anom-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      sensor: 'Smartwatch Lead-I Rhythm Sensor',
      metric: 'Tachycardia & Hypoxia (134 BPM / 91% SpO2)',
      severity: 'CRITICAL',
      description: 'Acute telemetry desaturation detected. Tele-nurse review triggered.'
    };
    setAnomalies(prev => [newAnom, ...prev]);
  };

  const handleResetVitals = () => {
    setLivePulse(74);
    setLiveSpo2(98);
    setAlertTriggered(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/90 via-slate-900 to-indigo-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Remote Patient Monitoring &amp; Wearable Telemetry</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-teal-400 animate-pulse" />
                  MQTT BROKER CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Patient: <strong className="text-white">{patientName}</strong> ({patientMrin}) • 24/7 Wearable Anomaly Surveillance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Heart Rate */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              livePulse > 110 
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-300 animate-pulse'
                : 'bg-slate-800/40 border-slate-700'
            }`}>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                <span className="font-bold uppercase">Resting Pulse</span>
                <Heart className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-3xl font-black text-white">{livePulse} <span className="text-sm font-normal text-slate-400">BPM</span></div>
              <span className="text-[10px] text-emerald-400 mt-1 block">Normal Range: 60-90</span>
            </div>

            {/* SpO2 */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              liveSpo2 < 93 
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-300 animate-pulse'
                : 'bg-slate-800/40 border-slate-700'
            }`}>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                <span className="font-bold uppercase">SpO2 Oxygen</span>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-cyan-300">{liveSpo2}%</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Continuous Oximetry</span>
            </div>

            {/* Continuous Glucose */}
            <div className="p-4 rounded-2xl border bg-slate-800/40 border-slate-700 text-center">
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                <span className="font-bold uppercase">CGM Glucose</span>
                <Droplet className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-300">{liveGlucose} <span className="text-sm font-normal text-slate-400">mg/dL</span></div>
              <span className="text-[10px] text-emerald-400 mt-1 block">Euglycemic Baseline</span>
            </div>

            {/* Daily Physical Activity */}
            <div className="p-4 rounded-2xl border bg-slate-800/40 border-slate-700 text-center">
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                <span className="font-bold uppercase">Daily Steps</span>
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-indigo-300">{stepCount.toLocaleString()}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Target: 8,000 Steps</span>
            </div>

          </div>

          {/* Anomaly Simulation Controls */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Wearable Bio-Sensor Simulation Engine</span>
              <p className="text-[11px] text-slate-400">
                Simulate sudden cardiac arrhythmia or nocturnal hypoxia to verify automated tele-nurse alert dispatch.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateArrhythmia}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition"
              >
                Simulate Tachycardia (134 BPM)
              </button>
              <button
                onClick={handleResetVitals}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Reset Vitals
              </button>
            </div>
          </div>

          {/* Anomaly Log List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Biometric Anomaly Log (Past 48 Hours)</span>
              <span>{anomalies.length} Flagged Events</span>
            </div>

            {anomalies.map(anom => (
              <div
                key={anom.id}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all ${
                  anom.severity === 'CRITICAL'
                    ? 'bg-rose-950/30 border-rose-500/40'
                    : 'bg-slate-800/40 border-slate-700/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                      anom.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {anom.severity}
                    </span>
                    <h4 className="text-xs font-bold text-white">{anom.metric}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">({anom.sensor})</span>
                  </div>
                  <p className="text-xs text-slate-300">{anom.description}</p>
                </div>

                <div className="text-right text-[11px] text-slate-400 shrink-0 font-mono">
                  {anom.timestamp}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Compliant with IEEE 11073 Point-of-Care Medical Device Communication Standard</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Telemetry
          </button>
        </div>

      </div>
    </div>
  );
}
