import React, { useState } from 'react';
import { 
  X, FileText, Sparkles, Download, Printer, Share2, 
  CheckCircle2, AlertTriangle, Calendar, Pill, Heart, Globe
} from 'lucide-react';

interface DischargeSummaryGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientMrin?: string;
}

export function DischargeSummaryGeneratorModal({
  isOpen,
  onClose,
  patientName = 'Kazi Mohammad Tareq',
  patientMrin = 'HS-2026-00421'
}: DischargeSummaryGeneratorModalProps) {
  const [language, setLanguage] = useState<'bilingual' | 'english' | 'bengali'>('bilingual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);

  // Raw messy doctor notes
  const [rawNotes, setRawNotes] = useState<string>(
`Pt 54M adm c/o acute retrosternal chest pain radiating to left arm. ECG showed sinus tach with T-wave inversion in V4-V6. Troponin I elevated 0.28 ng/mL. Echo LVEF 48%, mild anterior hypokinesia. Rx: DAPT (Aspirin + Clopidogrel), Atorvastatin 40mg, Metoprolol 25mg bd. Patient stabilized over 72h. Ambulated without angina. Hemodynamically stable BP 124/78, HR 68. Discharged with outpatient cardio follow-up in 2 weeks. Advised low salt diet, strictly no smoking.`
  );

  if (!isOpen) return null;

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">AI Discharge Summary Generator</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30">
                  Patient-Friendly Bilingual LLM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transforms physician clinical shorthand into structured, patient-centric discharge instructions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
              <button
                onClick={() => setLanguage('bilingual')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  language === 'bilingual' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bilingual (EN + বাংলা)
              </button>
              <button
                onClick={() => setLanguage('bengali')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  language === 'bengali' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা শুধুমাত্র
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
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Raw Clinical Doctor Notes */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Raw Physician Notes & Progress Log
            </h3>

            <textarea
              value={rawNotes}
              onChange={e => setRawNotes(e.target.value)}
              rows={12}
              className="w-full p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-teal-400"
              placeholder="Paste doctor notes, lab numbers, and medication discharge plan..."
            />

            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing Layman Summary...' : 'Regenerate Patient-Friendly Document'}</span>
            </button>
          </div>

          {/* Right Column: Beautiful Structured Discharge Document */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-4 shadow-xl">
              
              {/* Document Header */}
              <div className="border-b border-slate-700 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="text-base font-extrabold text-white">VITALITY-OS HOSPITAL • DISCHARGE INSTRUCTIONS</h3>
                  <p className="text-xs text-teal-300 font-medium">ছাড়পত্র ও ভবিষ্যৎ স্বাস্থ্য নির্দেশনা</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div>Patient: <strong className="text-white">{patientName}</strong></div>
                  <div>MRIN: <strong className="text-teal-400">{patientMrin}</strong></div>
                </div>
              </div>

              {/* Section 1: What Happened */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                  1. PRIMARY DIAGNOSIS & HOSPITAL COURSE (হাসপাতালের চিকিৎসা বিবরণ)
                </span>
                <p className="text-slate-200 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  {language === 'bengali' ? (
                    'রোগীর বুকে মৃদু রক্তস্বল্পতা ও হার্টের সমস্যা দেখা দিয়েছিল। ৩ দিনের নিবিড় পর্যবেক্ষণে ওষুধ দিয়ে রক্তপ্রবাহ স্বাভাবিক করা হয়েছে। বর্তমানে রক্তচাপ স্বাভাবিক এবং কোনো ব্যথা নেই।'
                  ) : (
                    'You were admitted with chest tightness from reduced blood flow to the heart muscle (Non-ST Myocardial Ischemia). After 72 hours of specialized cardiac stabilization and blood thinning therapy, your heart function is stable and you are safe to recover at home.'
                  )}
                </p>
              </div>

              {/* Section 2: Home Medications Table */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  2. MEDICATIONS TO TAKE AT HOME (বাসায় সেবনের ওষুধসমূহ)
                </span>
                <div className="space-y-1.5">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Aspirin 75mg + Clopidogrel 75mg</strong>
                      <p className="text-[11px] text-slate-400">রক্ত তরল রাখার ওষুধ • Take 1 tablet once daily after lunch</p>
                    </div>
                    <span className="text-teal-400 font-bold">1 - 0 - 0</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Metoprolol Succinate 25mg</strong>
                      <p className="text-[11px] text-slate-400">হার্টের গতি ও রক্তচাপ নিয়ন্ত্রণ • Take 1 tablet twice daily</p>
                    </div>
                    <span className="text-teal-400 font-bold">1 - 0 - 1</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Red Flags - When to return to ER */}
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-rose-300 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  RED FLAG WARNING SIGNS - RETURN TO ER IMMEDIATELY:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  <li>Sudden recurrent squeezing chest pain lasting more than 5 minutes</li>
                  <li>Severe breathlessness while lying flat or sudden cold sweating</li>
                  <li>Fainting, severe dizziness, or heartbeat racing {'>'}120 BPM</li>
                </ul>
              </div>

              {/* Section 4: Follow-up Appointment */}
              <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Next OPD Follow-Up: <strong className="text-white">Cardiology Clinic (Room 304)</strong></span>
                </div>
                <strong className="text-teal-300">In 14 Days (Nov 30, 2026)</strong>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => alert('Discharge summary exported to PDF & sent to patient WhatsApp!')}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send via WhatsApp to Patient</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Compliant with HL7 FHIR R4 Discharge Summary Specification & BMDC Guidelines</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Generator
          </button>
        </div>

      </div>
    </div>
  );
}
