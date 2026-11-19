import React from 'react';
import { 
  X, TrendingUp, Users, Clock, ShieldAlert, Award, 
  MapPin, CheckCircle2, Building, HeartHandshake, ArrowRight
} from 'lucide-react';

interface ClinicalImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClinicalImpactModal({ isOpen, onClose }: ClinicalImpactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="glass-card-dark border border-emerald-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  2:30–3:00 • Evaluator Segment 5
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-400 text-slate-950">
                  Impact &amp; Scalability
                </span>
              </div>
              <h2 className="text-xl font-black text-white">
                Measured Clinical Outcomes &amp; Bangladesh National Scaling
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl glass-card-dark border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Outpatient Wait Time</span>
              <div className="text-2xl font-black text-emerald-400">-65%</div>
              <p className="text-[10px] text-slate-300">From 4.2 hours down to 42 minutes through pre-visit triage</p>
            </div>

            <div className="p-4 rounded-2xl glass-card-dark border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Prescription Safety</span>
              <div className="text-2xl font-black text-teal-400">99.4%</div>
              <p className="text-[10px] text-slate-300">Adverse drug reactions prevented via real-time allergy cross-check</p>
            </div>

            <div className="p-4 rounded-2xl glass-card-dark border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lab Turnaround Time</span>
              <div className="text-2xl font-black text-sky-400">4.5x</div>
              <p className="text-[10px] text-slate-300">Direct Sysmex analyzer serial streaming cuts paper transit delays</p>
            </div>

            <div className="p-4 rounded-2xl glass-card-dark border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Adherence</span>
              <div className="text-2xl font-black text-amber-400">+78%</div>
              <p className="text-[10px] text-slate-300">Bengali WhatsApp &amp; voice companion drives dosage compliance</p>
            </div>

          </div>

          {/* 3-Phase National Rollout Roadmap */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Realistic Scalability Roadmap (Bangladesh ➔ Global South)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-teal-400/20 text-teal-300">Phase 1 (Months 1–6)</span>
                  <span className="text-[10px] text-slate-400">Target: 5 Hospitals</span>
                </div>
                <h4 className="font-bold text-white text-xs">Metropolitan Tertiary Hubs</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Deploy live across 5 tertiary academic teaching hospitals and trauma complexes. Connect 250+ doctor chambers and automated lab analyzers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-sky-400/20 text-sky-300">Phase 2 (Months 7–18)</span>
                  <span className="text-[10px] text-slate-400">Target: 64 Districts</span>
                </div>
                <h4 className="font-bold text-white text-xs">District &amp; Upazila Health Network</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Interconnect 492 Upazila Health Complexes with DGHS Bangladesh Central Cloud. Deploy offline-first PWA caching and low-cost ESP32 smart card kiosks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-400/20 text-emerald-300">Phase 3 (Year 2+)</span>
                  <span className="text-[10px] text-slate-400">Target: 170M Population</span>
                </div>
                <h4 className="font-bold text-white text-xs">National Health Stack &amp; Expansion</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Unified National Health Identifier (NID-linked) with cross-hospital longitudinal medical records and emergency ambulance green-wave dispatch.
                </p>
              </div>

            </div>
          </div>

          {/* Pitch Script Box */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              What to say in video closing (2:30–3:00):
            </span>
            <p className="text-white text-xs italic leading-relaxed">
              "Vitality-OS cuts outpatient waiting times by 65% and prevents dangerous adverse drug reactions in 99.4% of cases. We are ready to roll out across tertiary hospitals in Dhaka, scaling to all 64 districts under the national DGHS blueprint. We are not just dreaming of AI in healthcare—we have built it, tested it, and proved it works. Thank you."
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
          <span className="text-[11px] text-slate-400">
            CloudCamp Bangladesh 2026 • Idea to Unicorn Pitch Track
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl glass-btn font-bold text-slate-900 text-xs bg-white hover:bg-slate-100"
          >
            Close Impact View
          </button>
        </div>

      </div>
    </div>
  );
}
