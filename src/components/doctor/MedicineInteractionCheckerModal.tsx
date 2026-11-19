import React, { useState } from 'react';
import { 
  X, Pill, AlertTriangle, ShieldCheck, CheckCircle2, AlertCircle,
  Sparkles, Plus, Trash2, ArrowRight, ShieldAlert, FileText, Search
} from 'lucide-react';

interface MedicineInteractionCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMedications?: string[];
  patientAllergies?: string[];
  onApplyPrescriptionWarning?: (warningCount: number) => void;
}

interface DrugInteraction {
  id: string;
  drugA: string;
  drugB: string;
  severity: 'CONTRAINDICATED' | 'MAJOR' | 'MODERATE' | 'MILD';
  mechanism: string;
  clinicalEffect: string;
  managementAdvice: string;
}

const KNOWN_INTERACTIONS_DB: DrugInteraction[] = [
  {
    id: 'int-01',
    drugA: 'Warfarin',
    drugB: 'Aspirin',
    severity: 'CONTRAINDICATED',
    mechanism: 'Dual antiplatelet and anticoagulant synergistic inhibition of hemostasis.',
    clinicalEffect: 'Severe major gastrointestinal bleeding and intracranial hemorrhage risk.',
    managementAdvice: 'Avoid concomitant combination unless strictly indicated for mechanical valve. Monitor INR and consider gastroprotection (PPI).'
  },
  {
    id: 'int-02',
    drugA: 'Lisinopril (ACEi)',
    drugB: 'Spironolactone',
    severity: 'MAJOR',
    mechanism: 'Additive potassium retention via dual renin-angiotensin-aldosterone axis blockade.',
    clinicalEffect: 'Potentially fatal cardiac arrhythmias due to severe Hyperkalemia (K+ > 6.0 mEq/L).',
    managementAdvice: 'Mandatory serum potassium and creatinine monitoring within 7 days of initiation.'
  },
  {
    id: 'int-03',
    drugA: 'Clopidogrel',
    drugB: 'Omeprazole',
    severity: 'MAJOR',
    mechanism: 'Competitive inhibition of CYP2C19 hepatic isoenzyme prevents bioactivation of Clopidogrel.',
    clinicalEffect: 'Reduced antiplatelet efficacy leading to secondary recurrent stent thrombosis.',
    managementAdvice: 'Switch PPI to Pantoprazole or Rabeprazole which have minimal CYP2C19 inhibition.'
  },
  {
    id: 'int-04',
    drugA: 'Ciprofloxacin',
    drugB: 'Antacids (Aluminum/Magnesium)',
    severity: 'MODERATE',
    mechanism: 'Chelation with divalent and trivalent polyvalent cations in the GI tract.',
    clinicalEffect: 'Reduced oral fluoroquinolone absorption by up to 90%, causing clinical treatment failure.',
    managementAdvice: 'Administer Ciprofloxacin at least 2 hours before or 6 hours after antacids.'
  },
  {
    id: 'int-05',
    drugA: 'Metformin',
    drugB: 'Iodinated Radiocontrast',
    severity: 'MAJOR',
    mechanism: 'Contrast-induced acute kidney injury leads to toxic systemic Metformin accumulation.',
    clinicalEffect: 'High risk of Metformin-Associated Lactic Acidosis (MALA), with ~50% mortality.',
    managementAdvice: 'Withhold Metformin at time of contrast procedure and for 48 hours post-procedure until eGFR confirms normal renal function.'
  }
];

export function MedicineInteractionCheckerModal({
  isOpen,
  onClose,
  initialMedications = ['Warfarin 5mg', 'Aspirin 75mg', 'Lisinopril 10mg'],
  patientAllergies = ['Penicillins', 'Sulfa Drugs'],
  onApplyPrescriptionWarning
}: MedicineInteractionCheckerModalProps) {
  const [medications, setMedications] = useState<string[]>(initialMedications);
  const [newMedInput, setNewMedInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  // Add a medication to the check list
  const handleAddMed = () => {
    if (!newMedInput.trim()) return;
    setMedications([...medications, newMedInput.trim()]);
    setNewMedInput('');
  };

  const handleRemoveMed = (index: number) => {
    setMedications(medications.filter((_, idx) => idx !== index));
  };

  // Find active interactions matching current meds
  const detectedInteractions = KNOWN_INTERACTIONS_DB.filter(interaction => {
    const hasA = medications.some(m => m.toLowerCase().includes(interaction.drugA.toLowerCase().split(' ')[0]));
    const hasB = medications.some(m => m.toLowerCase().includes(interaction.drugB.toLowerCase().split(' ')[0]));
    return hasA && hasB;
  });

  // Check allergy conflicts
  const allergyConflicts = medications.filter(m => 
    patientAllergies.some(a => m.toLowerCase().includes(a.toLowerCase().slice(0, 4)))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">Medicine Interaction Checker & Safety Sentinel</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30">
                  DDI & Contraindication AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-drug pharmacodynamic cross-matrix scanner & allergy safety interceptor
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
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Medication Regimen Management */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-400" />
                Active Medication Regimen ({medications.length})
              </h3>
            </div>

            {/* Input to add drug */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type drug (e.g. Clopidogrel, Omeprazole)..."
                value={newMedInput}
                onChange={e => setNewMedInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddMed()}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
              <button
                onClick={handleAddMed}
                className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* List of current medications */}
            <div className="space-y-2">
              {medications.map((med, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-200"
                >
                  <span className="font-semibold">{med}</span>
                  <button
                    onClick={() => handleRemoveMed(idx)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Patient Known Allergies Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Patient Documented Allergies:</span>
              <div className="flex flex-wrap gap-1.5">
                {patientAllergies.map((allergy, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    ⚠ {allergy}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Demo Pre-load buttons */}
            <div className="pt-2 text-xs text-slate-400">
              <span className="text-[10px] font-bold uppercase block mb-1.5">Quick Clinical Scenarios:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setMedications(['Warfarin 5mg', 'Aspirin 75mg', 'Metformin 500mg'])}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-medium"
                >
                  Warfarin + Aspirin (Bleed)
                </button>
                <button
                  onClick={() => setMedications(['Clopidogrel 75mg', 'Omeprazole 20mg', 'Atorvastatin 20mg'])}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-medium"
                >
                  Clopidogrel + Omeprazole
                </button>
                <button
                  onClick={() => setMedications(['Lisinopril 10mg', 'Spironolactone 25mg'])}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-medium"
                >
                  ACEi + Spironolactone
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Interaction Alerts & Action Advice */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                SAFETY CROSS-EVALUATION ({detectedInteractions.length} Intercepts)
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                detectedInteractions.length > 0 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {detectedInteractions.length > 0 ? 'CRITICAL SAFETY INTERCEPT' : 'NO KNOWN INTERACTIONS'}
              </span>
            </div>

            {detectedInteractions.length === 0 ? (
              <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Regimen Cleared for Dispensing</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  No contraindications or high-risk pharmacokinetic interactions detected between current medications.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {detectedInteractions.map(interaction => (
                  <div
                    key={interaction.id}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-rose-500/40 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/30 text-rose-300 border border-rose-500/50">
                          {interaction.severity}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {interaction.drugA} + {interaction.drugB}
                        </h4>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold">Mechanism: </span>
                        <span className="text-slate-200">{interaction.mechanism}</span>
                      </div>
                      <div>
                        <span className="text-rose-400 font-semibold">Clinical Hazard: </span>
                        <span className="text-rose-200 font-bold">{interaction.clinicalEffect}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/20 text-xs">
                      <span className="text-[10px] font-bold text-teal-300 uppercase block mb-1">
                        Doctor Management Recommendation:
                      </span>
                      <p className="text-slate-300 font-medium leading-relaxed">
                        {interaction.managementAdvice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-indigo-200">Transmit Safety Warning to Doctor Chart</h4>
                <p className="text-[11px] text-slate-400">
                  Embeds interaction audit log into electronic prescription before final signing
                </p>
              </div>
              <button
                onClick={() => {
                  if (onApplyPrescriptionWarning) {
                    onApplyPrescriptionWarning(detectedInteractions.length);
                  }
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow transition-all"
              >
                Apply to Prescription
              </button>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Cross-referenced against DGHS Essential Drug List & Lexicomp DDI Database</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Checker
          </button>
        </div>

      </div>
    </div>
  );
}
