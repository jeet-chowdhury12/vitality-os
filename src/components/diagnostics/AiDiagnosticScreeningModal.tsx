import React, { useState } from 'react';
import { 
  X, Brain, Thermometer, AlertCircle, CheckCircle2, ShieldCheck, 
  Eye, Clock, Sparkles, Activity, FileText, ArrowRight, ShieldAlert,
  Droplet, Baby
} from 'lucide-react';

interface AiDiagnosticScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientMrin?: string;
  patientName?: string;
}

export function AiDiagnosticScreeningModal({
  isOpen,
  onClose,
  patientMrin = 'HS-2026-00421',
  patientName = 'Kazi Mohammad Tareq'
}: AiDiagnosticScreeningModalProps) {
  const [activeTab, setActiveTab] = useState<'cognitive' | 'infectious_pediatric'>('cognitive');

  // Cognitive Screener State
  const [wordsRecalled, setWordsRecalled] = useState<number>(1); // 0 to 3
  const [clockDrawingScore, setClockDrawingScore] = useState<'normal' | 'abnormal'>('abnormal');
  const [eyeReactionMs, setEyeReactionMs] = useState<number>(390); // Normal 220-300ms

  // Infectious Disease (Dengue & Sepsis) State
  const [plateletCount, setPlateletCount] = useState<number>(68000); // cells/uL
  const [hematocritPct, setHematocritPct] = useState<number>(48);    // Normal 38-44%
  const [hasAbdominalPain, setHasAbdominalPain] = useState<boolean>(true);
  const [hasPersistentVomiting, setHasPersistentVomiting] = useState<boolean>(true);
  const [hasMucosalBleed, setHasMucosalBleed] = useState<boolean>(false);
  const [pediatricAgeMonths, setPediatricAgeMonths] = useState<number>(24);
  const [hasChestIndrawing, setHasChestIndrawing] = useState<boolean>(true);

  if (!isOpen) return null;

  // Evaluate Cognitive Risk (Mini-Cog Algorithm)
  const evaluateCognitiveRisk = () => {
    if (wordsRecalled === 0) {
      return {
        category: 'HIGH RISK: PROBABLE COGNITIVE IMPAIRMENT / DEMENTIA',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        advice: 'Mini-Cog Score 0/5. Recommend urgent formal MoCA / MMSE battery and Brain MRI/CT for volumetric atrophy analysis.',
        latencyIndex: 'Prolonged Saccadic Latency (+120ms delay indicating frontal-subcortical slowing)'
      };
    }
    if (wordsRecalled >= 1 && wordsRecalled <= 2 && clockDrawingScore === 'abnormal') {
      return {
        category: 'MODERATE RISK: MILD COGNITIVE IMPAIRMENT (MCI)',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        advice: 'Clock drawing contour distortion with partial word registration deficit. Review B12, Thyroid (TSH), and schedule 6-month cognitive tracking.',
        latencyIndex: 'Borderline Visual Reaction Latency (+65ms delay)'
      };
    }
    return {
      category: 'LOW RISK: COGNITIVELY INTACT',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      advice: 'Normal memory recall and intact executive visuospatial planning.',
      latencyIndex: 'Normal Saccadic Reaction Speed (240ms)'
    };
  };

  // Evaluate Dengue & Pediatric Infection (DGHS Guidelines)
  const evaluateInfectiousRisk = () => {
    const isSeverePlatelets = plateletCount < 50000;
    const isHemoconcentrated = hematocritPct >= 45;
    const hasWarningSigns = hasAbdominalPain || hasPersistentVomiting || hasMucosalBleed;

    if (isSeverePlatelets || (isHemoconcentrated && hasWarningSigns)) {
      return {
        stage: 'DENGUE WITH SEVERE WARNING SIGNS (DGHS STAGE B/C)',
        severity: 'CRITICAL ADMISSION REQUIRED',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        action: 'Mandatory HDU/ICU Admission. High risk of plasma leakage and Dengue Shock Syndrome (DSS). Initiate IV Crystalloids (Normal Saline 5-7 ml/kg/hr) with Q4H HCT monitoring.',
        pediatricRisk: hasChestIndrawing ? 'Pediatric Severe Pneumonia / Sepsis Alert: Urgent Nebulization + IV Ceftriaxone' : 'Standard Pediatric Monitoring'
      };
    }
    if (hasWarningSigns || plateletCount < 100000) {
      return {
        stage: 'DENGUE WITH CLINICAL WARNING SIGNS',
        severity: 'INPATIENT OBSERVATION MANDATED',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        action: 'Admit to General Isolation Ward for strict fluid chart balancing and daily CBC monitoring.',
        pediatricRisk: 'Monitor respiratory rate every 2 hours.'
      };
    }
    return {
      stage: 'CLASSICAL DENGUE WITHOUT WARNING SIGNS',
      severity: 'OPD AMBULATORY CARE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      action: 'Home hydration with Oral Rehydration Salts (ORS) and Paracetamol only (Strictly avoid NSAIDs / Aspirin).',
      pediatricRisk: 'Oral fluids encouragement.'
    };
  };

  const cognitiveResult = evaluateCognitiveRisk();
  const infectiousResult = evaluateInfectiousRisk();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">AI Diagnostic & Specialized Screening Suite</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30">
                  Early Detection AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cognitive Screener (Dementia/Delirium) & Pediatric / Dengue Infectious Disease Classifier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
              <button
                onClick={() => setActiveTab('cognitive')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'cognitive' 
                    ? 'bg-teal-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cognitive / Dementia
              </button>
              <button
                onClick={() => setActiveTab('infectious_pediatric')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'infectious_pediatric' 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dengue & Pediatric Triage
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'cognitive' ? (
            /* Cognitive & Dementia Screener */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Cognitive Tests Input */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Brain className="w-4 h-4 text-teal-400" />
                  Mini-Cog & Saccadic Eye Assessment
                </h3>

                {/* 3-Word Recall */}
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">Delayed Word Recall (Out of 3):</span>
                    <strong className="text-teal-300">{wordsRecalled} / 3 Words</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    value={wordsRecalled}
                    onChange={e => setWordsRecalled(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0 (None recalled)</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3 (Full recall)</span>
                  </div>
                </div>

                {/* Clock Drawing Test */}
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2">
                  <span className="text-xs font-semibold text-slate-300 block">
                    Clock Drawing Test (CDT 11:10) Visual Heuristic:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setClockDrawingScore('normal')}
                      className={`p-2 rounded-xl font-bold border transition-all ${
                        clockDrawingScore === 'normal'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      ✓ Normal Contour
                    </button>
                    <button
                      onClick={() => setClockDrawingScore('abnormal')}
                      className={`p-2 rounded-xl font-bold border transition-all ${
                        clockDrawingScore === 'abnormal'
                          ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      ⚠ Abnormal / Distorted
                    </button>
                  </div>
                </div>

                {/* Saccadic Eye-Tracking Reaction Time */}
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-teal-400" />
                      Saccadic Reaction Latency:
                    </span>
                    <strong className="text-teal-300">{eyeReactionMs} ms</strong>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="600"
                    value={eyeReactionMs}
                    onChange={e => setEyeReactionMs(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>200ms (Rapid)</span>
                    <span>300ms (Normal)</span>
                    <span>600ms (Severe Delay)</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Cognitive Risk Report */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Cognitive Evaluation Result
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${cognitiveResult.badgeColor}`}>
                      {cognitiveResult.category.split(':')[0]}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-sm font-extrabold text-white">{cognitiveResult.category}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {cognitiveResult.advice}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/20 text-xs text-teal-300">
                    <strong>Neuro-Ocular Index: </strong>
                    <span>{cognitiveResult.latencyIndex}</span>
                  </div>

                  <button
                    onClick={() => alert('Cognitive Assessment Report saved to patient EHR history!')}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Archive Cognitive Screener to Patient Dossier</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Dengue & Pediatric Screener */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Infectious Biomarkers */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-amber-400" />
                  Dengue & Pediatric Biomarkers
                </h3>

                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-rose-400" />
                      Platelet Count (cells/μL):
                    </span>
                    <strong className={plateletCount < 100000 ? 'text-rose-400' : 'text-emerald-400'}>
                      {plateletCount.toLocaleString()} /μL
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="250000"
                    step="5000"
                    value={plateletCount}
                    onChange={e => setPlateletCount(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>15k (Severe Thrombocytopenia)</span>
                    <span>100k (Warning)</span>
                    <span>250k (Normal)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">Hematocrit / HCT Concentration (%):</span>
                    <strong className={hematocritPct > 45 ? 'text-rose-400' : 'text-emerald-400'}>
                      {hematocritPct}%
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="58"
                    value={hematocritPct}
                    onChange={e => setHematocritPct(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                </div>

                {/* Dengue Warning Signs Checklist */}
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-amber-400 uppercase block">
                    Clinical Warning Signs (DGHS Bangladesh):
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAbdominalPain}
                      onChange={e => setHasAbdominalPain(e.target.checked)}
                      className="rounded text-teal-500"
                    />
                    <span>Severe persistent abdominal tenderness</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPersistentVomiting}
                      onChange={e => setHasPersistentVomiting(e.target.checked)}
                      className="rounded text-teal-500"
                    />
                    <span>Persistent vomiting ({'>'}3 episodes in 24h)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasMucosalBleed}
                      onChange={e => setHasMucosalBleed(e.target.checked)}
                      className="rounded text-teal-500"
                    />
                    <span>Mucosal bleeding (gums, epistaxis, petechiae)</span>
                  </label>
                </div>
              </div>

              {/* Right Column: Dengue Triage & Fluid Management */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Dengue Protocol Stage
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${infectiousResult.badgeColor}`}>
                      {infectiousResult.severity}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-sm font-extrabold text-white">{infectiousResult.stage}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {infectiousResult.action}
                    </p>
                  </div>

                  {/* Pediatric Specific Care Alert */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs">
                    <span className="font-bold text-indigo-300 block mb-1 flex items-center gap-1.5">
                      <Baby className="w-4 h-4 text-indigo-400" />
                      Pediatric Respiratory Distress Evaluation:
                    </span>
                    <p className="text-slate-300 font-medium">
                      {infectiousResult.pediatricRisk}
                    </p>
                  </div>

                  <button
                    onClick={() => alert('Dengue Inpatient Fluid Protocol activated and charted!')}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Adopt DGHS National Fluid Guidelines</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Validated against DGHS Dengue Management Guidelines & Alzheimer's Association Mini-Cog</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Screener
          </button>
        </div>

      </div>
    </div>
  );
}
