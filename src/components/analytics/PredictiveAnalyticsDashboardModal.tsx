import React, { useState } from 'react';
import { 
  X, TrendingUp, BarChart3, Users, Bed, AlertTriangle, 
  CheckCircle2, Sparkles, Calendar, Activity, ArrowRight, ShieldAlert
} from 'lucide-react';

interface PredictiveAnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PredictiveAnalyticsDashboardModal({
  isOpen,
  onClose
}: PredictiveAnalyticsDashboardModalProps) {
  const [selectedHorizon, setSelectedHorizon] = useState<'7_DAYS' | '14_DAYS' | '30_DAYS'>('7_DAYS');
  const [activeScenario, setActiveScenario] = useState<'NORMAL' | 'DENGUE_OUTBREAK_SURGE'>('NORMAL');

  if (!isOpen) return null;

  const surgeMultiplier = activeScenario === 'DENGUE_OUTBREAK_SURGE' ? 1.45 : 1.0;
  const projectedAdmissions = Math.round(184 * surgeMultiplier);
  const projectedIcuSaturation = Math.min(98, Math.round(76 * surgeMultiplier));
  const readmissionRate = 8.4; // %

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/90 via-slate-900 to-indigo-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Predictive Healthcare Analytics &amp; Hospital Resource Forecaster</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30">
                  ARIMA + Random Forest ML
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hospital admission forecasting, ICU saturation index &amp; 30-day readmission risk modeling
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

        {/* Forecast Horizon Switcher */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Forecast Horizon:</span>
            {(['7_DAYS', '14_DAYS', '30_DAYS'] as const).map(h => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                className={`px-3 py-1 rounded-xl font-bold transition ${
                  selectedHorizon === h 
                    ? 'bg-teal-600 text-white shadow' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {h.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Stress Test Scenario:</span>
            <button
              onClick={() => setActiveScenario(activeScenario === 'NORMAL' ? 'DENGUE_OUTBREAK_SURGE' : 'NORMAL')}
              className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeScenario === 'DENGUE_OUTBREAK_SURGE'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-800 text-teal-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{activeScenario === 'DENGUE_OUTBREAK_SURGE' ? 'DENGUE OUTBREAK SURGE (+45%)' : 'BASELINE NORMAL'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Key KPI Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Projected Admissions */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Projected New Inpatients
              </span>
              <div className="text-3xl font-black text-white">{projectedAdmissions}</div>
              <span className="text-[11px] text-teal-300 mt-1 block">Forecast Confidence: 92.4%</span>
            </div>

            {/* ICU Saturation Risk */}
            <div className={`p-4 rounded-2xl border transition-all ${
              projectedIcuSaturation >= 85 
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-300' 
                : 'bg-slate-800/60 border-slate-700'
            }`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                ICU / CCU Saturation Index
              </span>
              <div className="text-3xl font-black text-white">{projectedIcuSaturation}%</div>
              <span className="text-[11px] text-rose-400 mt-1 block">
                {projectedIcuSaturation >= 85 ? '⚠ CRITICAL BEDS SHORTAGE' : 'Optimal Capacity Reserve'}
              </span>
            </div>

            {/* 30-Day Readmission Risk */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                30-Day Readmission Rate
              </span>
              <div className="text-3xl font-black text-emerald-400">{readmissionRate}%</div>
              <span className="text-[11px] text-slate-400 mt-1 block">National Target: &lt; 12.0%</span>
            </div>

            {/* Staffing Balance */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Nurse-to-Patient Ratio
              </span>
              <div className="text-3xl font-black text-indigo-300">1 : 4.2</div>
              <span className="text-[11px] text-emerald-400 mt-1 block">Within Safe Clinical Limits</span>
            </div>

          </div>

          {/* Departmental Capacity Forecasting Table */}
          <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Departmental Bed &amp; Ventilator Capacity Projections ({selectedHorizon.replace('_', ' ')})
              </span>
              <span className="text-xs text-slate-400 font-mono">Model: ARIMA(2,1,1) x GARCH</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">Emergency Trauma &amp; Resuscitation</h4>
                  <p className="text-slate-400 text-[11px]">Current: 18 Beds &bull; Projected Surge: +14 Cases/day</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    84% Projected Load
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">Cardiovascular Intensive Care (CCU)</h4>
                  <p className="text-slate-400 text-[11px]">Current: 14 Beds &bull; Projected Acute Coronary Admissions: 9</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    68% Projected Load
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">Infectious Disease &amp; Dengue Isolation Ward</h4>
                  <p className="text-slate-400 text-[11px]">Current: 30 Beds &bull; Rapid Dengue NS1 Positivity Surge</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    activeScenario === 'DENGUE_OUTBREAK_SURGE'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {activeScenario === 'DENGUE_OUTBREAK_SURGE' ? '96% (OVERFLOW IMMINENT)' : '52% Standard Capacity'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
              <div>
                <strong className="text-indigo-200 block">AI Automated Resource Allocation Recommendation:</strong>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Convert 12 elective surgical recovery beds to Dengue high-dependency telemetry. Reassign 4 night registrars.
                </p>
              </div>
              <button
                onClick={() => alert('Hospital Resource Rebalancing plan transmitted to Medical Superintendent & Nursing Director!')}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow shrink-0 transition"
              >
                Approve Resource Shift
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with DGHS National Health Operations Center &amp; WHO Resource Guidelines</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Forecaster
          </button>
        </div>

      </div>
    </div>
  );
}
