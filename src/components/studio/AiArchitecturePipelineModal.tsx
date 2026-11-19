import React, { useState } from 'react';
import { 
  X, Cpu, Database, Network, ShieldCheck, Sparkles, 
  ArrowRight, CheckCircle2, Zap, Layers, Binary, Activity
} from 'lucide-react';

interface AiArchitecturePipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiArchitecturePipelineModal({ isOpen, onClose }: AiArchitecturePipelineModalProps) {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'rag' | 'schema' | 'guardrails'>('pipeline');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="glass-card-dark border border-teal-400/30 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">
                  2:00–2:30 • Evaluator Segment 4
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Real AI Thinking
                </span>
              </div>
              <h2 className="text-xl font-black text-white">
                Vitality-OS AI Architecture &amp; Clinical Pipeline
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>1. End-to-End Pipeline (Input ➔ AI ➔ Output)</span>
          </button>
          <button
            onClick={() => setActiveTab('rag')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'rag'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2. Deterministic RAG &amp; Multi-Model Fallback</span>
          </button>
          <button
            onClick={() => setActiveTab('guardrails')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'guardrails'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. Zero-Hallucination Clinical Guardrails</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Binary className="w-4 h-4" />
            <span>4. Strict JSON Schema Spec</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              {/* 3-Column Architecture Graphic */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Column 1: Input Layer */}
                <div className="glass-card-dark rounded-2xl p-4 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-mono text-[10px] text-teal-400 font-bold uppercase">Layer 01</span>
                    <span className="px-2 py-0.5 rounded bg-teal-400/20 text-teal-300 text-[10px] font-bold">Input</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white">Multimodal Clinical Ingestion</h3>
                  <ul className="space-y-2 text-slate-300 text-[11px]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Vital Signs:</strong> BP, Heart Rate, SpO2, Temp, NEWS2 physiological data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Unstructured Text:</strong> Doctor notes, chief complaints, onset duration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Computer Vision:</strong> Optical contactless rPPG facial pulse + Turjuman Sign AI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Hardware Telemetry:</strong> Sysmex XN-550 auto-analyzer serial packets</span>
                    </li>
                  </ul>
                </div>

                {/* Column 2: AI Engine */}
                <div className="glass-card-dark rounded-2xl p-4 border border-teal-400/40 space-y-3 bg-teal-950/20 shadow-lg ring-1 ring-teal-400/30">
                  <div className="flex items-center justify-between pb-2 border-b border-teal-500/20">
                    <span className="font-mono text-[10px] text-teal-300 font-bold uppercase">Layer 02</span>
                    <span className="px-2 py-0.5 rounded bg-teal-400 text-slate-950 text-[10px] font-black">AI Core</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-teal-200">Hybrid AI &amp; Reasoning Core</h3>
                  <ul className="space-y-2 text-slate-200 text-[11px]">
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-teal-300 shrink-0 mt-0.5" />
                      <span><strong>Google Gemini 2.5 Flash:</strong> Multimodal clinical reasoning &amp; differential diagnosis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-teal-300 shrink-0 mt-0.5" />
                      <span><strong>0ms Local Heuristic Engine:</strong> Immediate synchronous matching preventing UI lag</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Layers className="w-3.5 h-3.5 text-teal-300 shrink-0 mt-0.5" />
                      <span><strong>Pharmacovigilance RAG:</strong> Real-time drug-allergy &amp; contraindication matrix</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Network className="w-3.5 h-3.5 text-teal-300 shrink-0 mt-0.5" />
                      <span><strong>Edge Vite Proxy:</strong> Same-origin `/api/gemini/` bypasses CORS and network blocks</span>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Output Layer */}
                <div className="glass-card-dark rounded-2xl p-4 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">Layer 03</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">Output</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white">Clinical Action &amp; Delivery</h3>
                  <ul className="space-y-2 text-slate-300 text-[11px]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Triage Routing:</strong> Automated doctor &amp; chamber assignment with acuity scoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Bilingual Delivery:</strong> 1-click real-time English ⟷ Bengali UI translation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>DGHS Interop:</strong> Structured FHIR R4 JSON clinical records across 9 hospital units</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Caregiver Alerts:</strong> Critical panic alerts, WhatsApp reminders &amp; SBAR handovers</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Pitch Delivery Cue */}
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                    What to say in video (2:00–2:15):
                  </span>
                  <p className="text-white text-xs mt-0.5 italic">
                    "Our AI architecture pairs Google Gemini 2.5 Flash with a 0ms deterministic clinical heuristic engine, ensuring sub-second response times, zero hallucinations, and full FHIR R4 interoperability."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rag' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="font-extrabold text-white text-sm">Deterministic Clinical RAG &amp; Knowledge Base</h4>
                <p className="text-slate-300 leading-relaxed">
                  Instead of allowing an LLM to freely generate medical diagnoses, Vitality-OS constrains Gemini with an authoritative Clinical Symptom Knowledge Base and the British Royal College of Physicians NEWS2 algorithm.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Fallback Strategy</span>
                  <div className="font-bold text-white text-xs">Multi-Tier Model Resilience</div>
                  <p className="text-[11px] text-slate-400">
                    Primary: <code>gemini-2.5-flash</code> (Fast deep reasoning)<br />
                    Secondary: <code>gemini-1.5-flash</code> (Low-latency backup)<br />
                    Tertiary: <code>Local Heuristic Rules</code> (100% offline uptime)
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Throughput</span>
                  <div className="font-bold text-white text-xs">Zero CORS &amp; Thinking Budget Config</div>
                  <p className="text-[11px] text-slate-400">
                    Vite reverse-proxy routes `/api/gemini/` securely.<br />
                    <code>thinkingBudget: 0</code> ensures token budget is fully allocated to structured clinical JSON output.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guardrails' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <h4 className="font-extrabold text-rose-300 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Clinical Safety &amp; Non-Hallucination Policy</span>
                </h4>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Clinical safety is non-negotiable. Vitality-OS implements 4 hard boundary checks:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <strong className="text-white block mb-1">1. Symptom Boundary Enforcement</strong>
                  <span>Cardiology is strictly barred unless explicit chest pain, palpitations, or cardiac symptoms exist in the user's reported complaints.</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <strong className="text-white block mb-1">2. Pharmacovigilance Lock</strong>
                  <span>Prescriptions containing known patient drug allergies (e.g. Penicillin/Amoxicillin) trigger an unbypassable modal freeze.</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <strong className="text-white block mb-1">3. Antimicrobial Stewardship</strong>
                  <span>Reserve carbapenems require documented microbiological culture confirmation per DGHS national guidelines.</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <strong className="text-white block mb-1">4. Emergency Red-Flag Override</strong>
                  <span>Severe pain / acute hypotension instantly triggers an ESI-1/2 Resuscitation Protocol overriding standard queues.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-teal-300 overflow-x-auto">
                <pre>{`{
  "identifiedDiseases": [
    {
      "diseaseName": "Type 2 Diabetes Mellitus with Osmotic Dysregulation",
      "specialty": "Endocrinology & Diabetology",
      "confidenceScore": 96,
      "acuityTier": "Urgent",
      "clinicalRationale": "Polydipsia, polyuria, and osmotic symptoms indicate hyperglycemia requiring immediate HbA1c screening."
    }
  ],
  "overallAcuity": "Urgent (Within 1 hr)",
  "esiLevel": 2,
  "triageNotes": "Hemodynamic workup indicated. Re-evaluate fasting plasma glucose."
}`}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
          <span className="text-[11px] text-slate-400">
            Complies with DGHS Bangladesh Digital Health Blueprint 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl glass-btn font-bold text-slate-900 text-xs bg-white hover:bg-slate-100"
          >
            Close Pipeline View
          </button>
        </div>

      </div>
    </div>
  );
}
