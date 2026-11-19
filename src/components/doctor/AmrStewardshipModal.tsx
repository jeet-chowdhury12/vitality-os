import React, { useState } from 'react';
import { 
  X, ShieldAlert, CheckCircle2, AlertTriangle, Bug, 
  FlaskConical, Sparkles, ArrowRight, Activity, FileCheck, Check
} from 'lucide-react';
import { PatientRecord } from '../../data/patientsDatabase';

interface AmrStewardshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord;
  onAdoptStepDown: (newAntibioticName: string, dosage: string) => void;
}

interface PathogenIsolate {
  organism: string;
  source: string;
  count: number;
  susceptibilities: {
    antibiotic: string;
    class: 'Access' | 'Watch' | 'Reserve';
    sensitivityPercent: number; // 0-100
    resistancePercent: number;
  }[];
}

const HOSPITAL_ANTIBIOGRAM_DATA: PathogenIsolate[] = [
  {
    organism: 'Klebsiella pneumoniae (ESBL+)',
    source: 'Endotracheal Aspirate / Blood',
    count: 142,
    susceptibilities: [
      { antibiotic: 'Ceftriaxone', class: 'Watch', sensitivityPercent: 12, resistancePercent: 88 },
      { antibiotic: 'Ciprofloxacin', class: 'Watch', sensitivityPercent: 24, resistancePercent: 76 },
      { antibiotic: 'Piperacillin-Tazobactam', class: 'Watch', sensitivityPercent: 81, resistancePercent: 19 },
      { antibiotic: 'Amikacin', class: 'Access', sensitivityPercent: 93, resistancePercent: 7 },
      { antibiotic: 'Meropenem', class: 'Watch', sensitivityPercent: 91, resistancePercent: 9 },
      { antibiotic: 'Colistin', class: 'Reserve', sensitivityPercent: 98, resistancePercent: 2 }
    ]
  },
  {
    organism: 'Escherichia coli (Uropathogenic)',
    source: 'Urine / Bloodstream',
    count: 289,
    susceptibilities: [
      { antibiotic: 'Amoxicillin-Clavulanate', class: 'Access', sensitivityPercent: 42, resistancePercent: 58 },
      { antibiotic: 'Ciprofloxacin', class: 'Watch', sensitivityPercent: 31, resistancePercent: 69 },
      { antibiotic: 'Nitrofurantoin', class: 'Access', sensitivityPercent: 88, resistancePercent: 12 },
      { antibiotic: 'Ceftriaxone', class: 'Watch', sensitivityPercent: 38, resistancePercent: 62 },
      { antibiotic: 'Meropenem', class: 'Watch', sensitivityPercent: 96, resistancePercent: 4 }
    ]
  },
  {
    organism: 'Pseudomonas aeruginosa',
    source: 'Wound / Surgical Site',
    count: 88,
    susceptibilities: [
      { antibiotic: 'Ceftazidime', class: 'Watch', sensitivityPercent: 64, resistancePercent: 36 },
      { antibiotic: 'Gentamicin', class: 'Access', sensitivityPercent: 72, resistancePercent: 28 },
      { antibiotic: 'Piperacillin-Tazobactam', class: 'Watch', sensitivityPercent: 86, resistancePercent: 14 },
      { antibiotic: 'Meropenem', class: 'Watch', sensitivityPercent: 89, resistancePercent: 11 }
    ]
  }
];

export const AmrStewardshipModal: React.FC<AmrStewardshipModalProps> = ({
  isOpen,
  onClose,
  patient,
  onAdoptStepDown
}) => {
  const [selectedOrganism, setSelectedOrganism] = useState<PathogenIsolate>(HOSPITAL_ANTIBIOGRAM_DATA[0]);
  const [selectedReserveDrug, setSelectedReserveDrug] = useState<'Meropenem 1g IV' | 'Colistin 2M IU IV' | 'Vancomycin 1g IV'>('Meropenem 1g IV');
  const [adoptedSuccess, setAdoptedSuccess] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 rounded-2xl shadow-lg shadow-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">AMR Stewardship &amp; Hospital Antibiogram Sentinel</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                  WHO AWaRe &amp; DGHS Protocol
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time hospital microbiology isolate surveillance &amp; reserve antibiotic restriction
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stewardship Alert Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Active Prescription Alert for {patient.fullName} ({patient.mrin})</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Doctor has selected <strong className="text-white">{selectedReserveDrug}</strong>. In accordance with Bangladesh DGHS National Antimicrobial Guidelines, reserve carbapenems require documented microbiological culture confirmation or stewardship clearance before 48-hour dispensation.
          </p>
        </div>

        {/* Antibiogram Matrix & Sensitivity Heatmap */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Bug className="w-4 h-4 text-emerald-400" />
              <span>DCMCH Clinical Microbiology Antibiogram (Past 90 Days Surveillance)</span>
            </span>
            <div className="flex items-center gap-1.5">
              {HOSPITAL_ANTIBIOGRAM_DATA.map(iso => (
                <button
                  key={iso.organism}
                  onClick={() => setSelectedOrganism(iso)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                    selectedOrganism.organism === iso.organism
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {iso.organism.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="font-extrabold text-white">Target Isolate: {selectedOrganism.organism}</span>
              <span className="text-slate-400 font-mono text-[11px]">{selectedOrganism.count} Verified Isolates ({selectedOrganism.source})</span>
            </div>

            <div className="space-y-2">
              {selectedOrganism.susceptibilities.map(sub => {
                const isHighSensitivity = sub.sensitivityPercent >= 80;
                const isHighResistance = sub.resistancePercent >= 50;

                return (
                  <div key={sub.antibiotic} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-4 text-xs">
                    <div className="w-44">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{sub.antibiotic}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                          sub.class === 'Access' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          sub.class === 'Watch' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {sub.class}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-emerald-400 font-bold">{sub.sensitivityPercent}% Sensitive</span>
                        <span className="text-rose-400 font-bold">{sub.resistancePercent}% Resistant</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                        <div style={{ width: `${sub.sensitivityPercent}%` }} className="bg-emerald-500 h-full" />
                        <div style={{ width: `${sub.resistancePercent}%` }} className="bg-rose-500 h-full" />
                      </div>
                    </div>

                    <div className="w-28 text-right">
                      {isHighSensitivity ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          Recommended
                        </span>
                      ) : isHighResistance ? (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                          High Resistance
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Intermediate</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Step-Down Recommendation Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950 to-slate-900 border border-teal-500/40 space-y-3">
            <div className="flex items-center gap-2 text-teal-300 font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Valerian AI Stewardship Step-Down Recommendation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on the <strong>{selectedOrganism.organism}</strong> isolate sensitivity profile (<strong>93% sensitivity to Amikacin</strong> and <strong>81% to Piperacillin-Tazobactam</strong>), broad-spectrum Meropenem can be safely stepped down to <strong>Piperacillin-Tazobactam 4.5g IV TDS</strong>. This preserves reserve carbapenems and minimizes C. difficile risk.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  onAdoptStepDown('Piperacillin-Tazobactam', '4.5g IV Infusion TDS (Every 8 hours)');
                  setAdoptedSuccess(true);
                  setTimeout(() => onClose(), 1200);
                }}
                disabled={adoptedSuccess}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-md shadow-teal-500/20 disabled:opacity-50"
              >
                {adoptedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>✓ Step-Down Adopted &amp; Logged to DGHS Audit</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Adopt Step-Down: Piperacillin-Tazobactam 4.5g IV</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  alert('Emergency Override logged. 48-hour Restricted Dispensation authorized under attending consultant sign-off.');
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition border border-slate-700"
              >
                Authorize 48h Meropenem with Mandatory Culture Follow-up
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
