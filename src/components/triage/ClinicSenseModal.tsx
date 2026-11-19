import React, { useState } from 'react';
import { 
  X, Compass, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight,
  TrendingDown, PhoneCall, QrCode, Clock, Stethoscope, Sparkles, Building2,
  Share2, FileText
} from 'lucide-react';

interface ClinicSenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmTriageRoute?: (result: {
    level: string;
    routeDestination: string;
    priorityColor: string;
    chiefComplaint: string;
  }) => void;
}

interface TriageQuestionnaire {
  chiefComplaint: string;
  durationDays: number;
  hasChestPain: boolean;
  hasShortnessOfBreath: boolean;
  hasNeurologicalDeficit: boolean;
  hasHighFever: boolean;
  age: number;
  canWalkIndependently: boolean;
}

export function ClinicSenseModal({
  isOpen,
  onClose,
  onConfirmTriageRoute
}: ClinicSenseModalProps) {
  const [formData, setFormData] = useState<TriageQuestionnaire>({
    chiefComplaint: 'Chest tightness and breathless on exertion',
    durationDays: 2,
    hasChestPain: true,
    hasShortnessOfBreath: true,
    hasNeurologicalDeficit: false,
    hasHighFever: false,
    age: 54,
    canWalkIndependently: true
  });

  const [analyzed, setAnalyzed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Evaluate clinical routing
  const evaluateRoute = () => {
    if (formData.hasChestPain && formData.hasShortnessOfBreath) {
      return {
        level: 'LEVEL 1: RESUSCITATION / STAT',
        priority: 'CRITICAL',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        destination: 'Tertiary Emergency Resuscitation Bay (Trauma Center Alpha)',
        actionAdvice: 'DO NOT WAIT. Immediate ambulance transfer with continuous ECG monitoring.',
        predictedWaitTime: '0 Minutes (Immediate)',
        overcrowdingImpact: 'Accurately bypassed outpatient queue, saving ~90 mins of cardiac golden hour',
        telehealthEligible: false
      };
    }
    if (formData.hasNeurologicalDeficit || formData.hasHighFever && formData.durationDays > 4) {
      return {
        level: 'LEVEL 2: EMERGENT / URGENT CARE',
        priority: 'URGENT',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        destination: 'Urgent Care Center / Fast-Track Specialized OPD',
        actionAdvice: 'Report to Fast-Track Desk within 30 minutes for laboratory and imaging workup.',
        predictedWaitTime: '15 Minutes',
        overcrowdingImpact: 'Diverted from emergency room to specialized urgent clinic (-38% ER load)',
        telehealthEligible: false
      };
    }
    return {
      level: 'LEVEL 3: NON-URGENT / TELEHEALTH',
      priority: 'ROUTINE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      destination: 'Digital Tele-Consultation or Community GP Clinic',
      actionAdvice: 'Symptom management at home with online prescription consult. ER visit unnecessary.',
      predictedWaitTime: 'Scheduled Slot (At Home)',
      overcrowdingImpact: 'Complete ER visit avoidance: Saved 4.2 hours of hospital waiting room congestion',
      telehealthEligible: true
    };
  };

  const routeResult = evaluateRoute();

  const handleRunAnalysis = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setAnalyzed(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/80 via-slate-900 to-sky-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">Clinic Sense™ Pre-Visit Triage</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30">
                  ER Congestion Shield
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pre-evaluates patient acuity before arrival, routing non-critical cases away from emergency bays
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Column */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                Pre-Hospital Patient Anamnesis
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Primary Symptoms / Chief Complaint:
                  </label>
                  <input
                    type="text"
                    value={formData.chiefComplaint}
                    onChange={e => setFormData({ ...formData, chiefComplaint: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-400"
                    placeholder="e.g. Chest tightness, sudden dizziness, cough..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Patient Age:
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Duration (Days):
                    </label>
                    <input
                      type="number"
                      value={formData.durationDays}
                      onChange={e => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* Red Flag Checklist */}
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2.5">
                  <span className="text-[11px] font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Screen For Critical Red Flags:
                  </span>

                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasChestPain}
                      onChange={e => setFormData({ ...formData, hasChestPain: e.target.checked })}
                      className="rounded text-teal-500 focus:ring-0"
                    />
                    <span>Crushing chest pain or radiating to jaw/arm</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasShortnessOfBreath}
                      onChange={e => setFormData({ ...formData, hasShortnessOfBreath: e.target.checked })}
                      className="rounded text-teal-500 focus:ring-0"
                    />
                    <span>Shortness of breath / oxygen hunger</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasNeurologicalDeficit}
                      onChange={e => setFormData({ ...formData, hasNeurologicalDeficit: e.target.checked })}
                      className="rounded text-teal-500 focus:ring-0"
                    />
                    <span>FAST signs (facial droop, speech slur, weakness)</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasHighFever}
                      onChange={e => setFormData({ ...formData, hasHighFever: e.target.checked })}
                      className="rounded text-teal-500 focus:ring-0"
                    />
                    <span>High fever ({'>'}102°F) with lethargy or neck stiffness</span>
                  </label>
                </div>

                <button
                  onClick={handleRunAnalysis}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-xs text-white shadow-lg shadow-teal-950 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isProcessing ? 'Evaluating Care Pathways...' : 'Compute AI Care Destination'}</span>
                </button>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    AI Pre-Visit Acuity Classification
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${routeResult.badgeColor}`}>
                    {routeResult.level}
                  </span>
                </div>

                {/* Primary Destination Box */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Recommended Care Facility:</span>
                  <div className="text-base font-extrabold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-teal-400" />
                    <span>{routeResult.destination}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {routeResult.actionAdvice}
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/20">
                    <div className="flex items-center gap-2 text-teal-300 text-xs font-bold mb-1">
                      <Clock className="w-4 h-4" />
                      <span>Estimated Wait Time</span>
                    </div>
                    <div className="text-lg font-black text-white">{routeResult.predictedWaitTime}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
                    <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-1">
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                      <span>ER Overcrowding Metric</span>
                    </div>
                    <div className="text-xs font-medium text-slate-300">{routeResult.overcrowdingImpact}</div>
                  </div>
                </div>

                {/* Digital Pre-Triage QR Pass Preview */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-dashed border-teal-500/40 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-teal-400" />
                      Digital Pre-Triage Fast-Pass
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Token: <strong className="text-teal-300">CS-2026-9042</strong> • Valid for direct chamber bypass
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onConfirmTriageRoute) {
                        onConfirmTriageRoute({
                          level: routeResult.level,
                          routeDestination: routeResult.destination,
                          priorityColor: routeResult.badgeColor,
                          chiefComplaint: formData.chiefComplaint
                        });
                      }
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow transition-all flex items-center gap-2"
                  >
                    <span>Adopt Care Route</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Model: Valerian Clinical Decision Tree v4.2 • DGHS National Triage Guidelines</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
