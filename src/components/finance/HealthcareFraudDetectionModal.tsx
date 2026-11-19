import React, { useState } from 'react';
import { 
  X, ShieldAlert, DollarSign, AlertTriangle, CheckCircle2, 
  FileText, TrendingUp, Sparkles, Filter, Lock, Eye
} from 'lucide-react';

interface HealthcareFraudDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuditedClaim {
  id: string;
  claimNumber: string;
  patientName: string;
  provider: string;
  amountBDT: number;
  fraudRiskScore: number; // 0 - 100
  fraudCategory: 'UPCODING' | 'UNBUNDLING' | 'PHANTOM BILLING' | 'DUPLICATE CLAIM' | 'LEGITIMATE';
  evidenceSummary: string;
  status: 'FLAGGED' | 'FROZEN' | 'CLEARED';
}

const AUDITED_CLAIMS: AuditedClaim[] = [
  {
    id: 'clm-01',
    claimNumber: 'CLM-2026-9042',
    patientName: 'Kazi Mohammad Tareq',
    provider: 'Apex Quaternary Hospital (Cardiology Ward)',
    amountBDT: 185000,
    fraudRiskScore: 89,
    fraudCategory: 'UPCODING',
    evidenceSummary: 'Billed for Level 5 Critical Care (CPT 99291) + Continuous Arterial Cannulation, but nursing flow-sheet documents standard floor bed telemetry and routine vitals.',
    status: 'FLAGGED'
  },
  {
    id: 'clm-02',
    claimNumber: 'CLM-2026-8812',
    patientName: 'Begum Rokeya Sultana',
    provider: 'Metro Diagnostic Lab Center',
    amountBDT: 42000,
    fraudRiskScore: 94,
    fraudCategory: 'PHANTOM BILLING',
    evidenceSummary: 'Claim includes 6x Vials of IV Meropenem 1g and Chest CT with contrast; zero corresponding pharmacy dispensing logs or RIS imaging DICOM files exist.',
    status: 'FLAGGED'
  },
  {
    id: 'clm-03',
    claimNumber: 'CLM-2026-7731',
    patientName: 'Rafiqul Islam',
    provider: 'Horizon Multispecialty Surgical OT',
    amountBDT: 125000,
    fraudRiskScore: 78,
    fraudCategory: 'UNBUNDLING',
    evidenceSummary: 'Single Laparoscopic Cholecystectomy unbundled into 4 separate line items (pneumoperitoneum, trocar insertion, ligation) to exceed insurer cap.',
    status: 'FLAGGED'
  },
  {
    id: 'clm-04',
    claimNumber: 'CLM-2026-4402',
    patientName: 'Nusrat Jahan',
    provider: 'National Heart Foundation',
    amountBDT: 24500,
    fraudRiskScore: 12,
    fraudCategory: 'LEGITIMATE',
    evidenceSummary: 'Routine 2D Echo + Holter Monitor. Documentation, timestamps, and doctor clinical rationale perfectly match standard billing codes.',
    status: 'CLEARED'
  }
];

export function HealthcareFraudDetectionModal({
  isOpen,
  onClose
}: HealthcareFraudDetectionModalProps) {
  const [claims, setClaims] = useState<AuditedClaim[]>(AUDITED_CLAIMS);
  const [selectedClaim, setSelectedClaim] = useState<AuditedClaim>(AUDITED_CLAIMS[0]);

  if (!isOpen) return null;

  const handleFreezeClaim = (id: string) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'FROZEN' } : c));
    alert(`Claim #${selectedClaim.claimNumber} has been FROZEN! Dispatched to Insurance Anti-Fraud Special Investigation Unit (SIU).`);
  };

  const handleClearClaim = (id: string) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'CLEARED' } : c));
  };

  const totalFlaggedSavings = claims
    .filter(c => c.status === 'FLAGGED' || c.status === 'FROZEN')
    .reduce((sum, c) => sum + c.amountBDT, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-rose-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Healthcare Fraud, Waste &amp; Abuse (FWA) Sentinel</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  ML Claims Audit Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated detection of upcoding, unbundling, phantom billing &amp; duplicate insurance claims
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

        {/* Stats Bar */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Total Claims Audited Today: <strong className="text-white">{claims.length}</strong></span>
            <span>•</span>
            <span className="text-rose-400 font-bold">Suspicious High-Risk Claims: 3</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">Protected Insurer Savings: BDT {totalFlaggedSavings.toLocaleString()}</span>
          </div>

          <span className="text-[11px] font-mono text-indigo-400 font-bold">
            99.1% Model Precision on ICD-10 &amp; CPT Codes
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Table: Audited Claims */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span>Audited Claim Registry</span>
              <span>AI Fraud Probability</span>
            </div>

            {claims.map(claim => {
              const isSelected = selectedClaim.id === claim.id;
              return (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-xl'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-teal-400">{claim.claimNumber}</span>
                        <h4 className="text-sm font-bold text-white">{claim.patientName}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{claim.provider}</p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                        claim.fraudRiskScore >= 75
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : claim.fraudRiskScore >= 40
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {claim.fraudRiskScore}% Fraud Risk
                      </span>
                      <div className="text-xs font-black text-white mt-1">
                        BDT {claim.amountBDT.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-400">{claim.fraudCategory}</span>
                    <span className={`font-bold ${
                      claim.status === 'FROZEN' ? 'text-rose-400' : claim.status === 'FLAGGED' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      Status: {claim.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Evidence & Adjudication Desk */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Claim Investigation Dossier
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {selectedClaim.claimNumber}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{selectedClaim.patientName}</h3>
                <p className="text-xs text-slate-400">{selectedClaim.provider}</p>
                <div className="text-sm font-black text-teal-300 pt-1">
                  Claimed Amount: BDT {selectedClaim.amountBDT.toLocaleString()}
                </div>
              </div>

              {/* Fraud Gauge */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase">Fraud Risk Index</span>
                  <span className="text-lg font-black text-rose-400">{selectedClaim.fraudRiskScore}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-2 rounded-full"
                    style={{ width: `${selectedClaim.fraudRiskScore}%` }}
                  />
                </div>
                <div className="text-[11px] text-amber-300 font-semibold pt-1">
                  Violation Category: {selectedClaim.fraudCategory}
                </div>
              </div>

              {/* Detailed evidence */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Clinical Evidence Trail:</span>
                <p className="text-slate-300 leading-relaxed font-medium">
                  {selectedClaim.evidenceSummary}
                </p>
              </div>

              {/* Adjudication actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleFreezeClaim(selectedClaim.id)}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition"
                >
                  <Lock className="w-4 h-4" />
                  <span>Freeze Claim &amp; Open Investigation</span>
                </button>
                <button
                  onClick={() => handleClearClaim(selectedClaim.id)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Mark as Reviewed &amp; Approved</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with Insurance Development &amp; Regulatory Authority (IDRA) Bangladesh</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Fraud Sentinel
          </button>
        </div>

      </div>
    </div>
  );
}
