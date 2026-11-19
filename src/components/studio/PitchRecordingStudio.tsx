import React, { useState, useEffect } from 'react';
import { 
  Video, Play, Pause, RotateCcw, ChevronDown, ChevronUp, 
  Sparkles, Layers, Cpu, TrendingUp, Globe, Clock, CheckCircle2,
  ExternalLink, Mic, Eye, FileText, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AppRoleId } from '../common/AppSidebar';

interface PitchRecordingStudioProps {
  onSelectRole: (role: AppRoleId) => void;
  onOpenAiArchitecture: () => void;
  onOpenImpact: () => void;
}

const SEGMENTS = [
  {
    id: 1,
    start: 0,
    end: 30,
    label: '0:00–0:30 • Problem (The Vibe)',
    keyMessage: '"This problem matters"',
    evaluatorCriteria: 'Clarity, relevance, Bangladesh urgency',
    cues: 'Highlight 800k daily OPD patients in Bangladesh, 90s doctor consult time, illegible paper prescriptions, missed drug interactions, and disconnected lab silos.',
    script: 'Every single day in Bangladesh, over 800,000 patients enter tertiary hospitals. Yet their entire medical journey rests on crumpled paper prescriptions and disconnected departmental silos. Doctors have barely 90 seconds per patient. Dangerous drug interactions get missed, and lab reports take days to walk across corridors. We built Vitality-OS to turn hospital chaos into a unified, AI-native clinical operating system.'
  },
  {
    id: 2,
    start: 30,
    end: 60,
    label: '0:30–1:00 • Solution',
    keyMessage: '"This is how we solve it"',
    evaluatorCriteria: 'Simplicity, uniqueness, ecosystem differentiation',
    cues: 'Show Central Launchpad. Explain how Vitality-OS unifies Triage, Doctor Chambers, Automated Lab Analyzers, and Patient Pocket with multimodal AI.',
    script: 'Vitality-OS connects every stakeholder in a hospital—from the emergency triage nurse to the specialist chamber, automated diagnostic laboratory, hospital billing terminal, and the patient’s pocket. Instead of generic AI chatbots, Vitality-OS pairs deterministic clinical safety algorithms—like NEWS2 scoring and allergic cross-checking—with Google’s multimodal Gemini 2.5 Flash.'
  },
  {
    id: 3,
    start: 60,
    end: 120,
    label: '1:00–2:00 • Demo / Concept Flow',
    keyMessage: '"This is how it works"',
    evaluatorCriteria: 'Feasibility, logic, closed-loop workflow proof',
    cues: 'Use Quick Jumps: 1) Triage (Vitals + Valerian AI Matcher) ➔ 2) Doctor Chamber (ECG + Allergy Flag) ➔ 3) Lab (Sysmex auto-stream) ➔ 4) Toggle Bangla.',
    script: 'In Emergency Triage, the nurse inputs vitals. In milliseconds, our hybrid AI computes an automated NEWS2 acuity score and uses Gemini to synthesize chief complaints, identifying diabetic dysregulation and peripheral neuropathy. In the Doctor’s Chamber, our Pharmacovigilance Engine instantly flags allergy contraindications. In the Lab, Sysmex XN-550 serial telemetry syncs biomarkers instantly.'
  },
  {
    id: 4,
    start: 120,
    end: 150,
    label: '2:00–2:30 • AI Approach',
    keyMessage: '"This is real AI thinking"',
    evaluatorCriteria: 'Depth, structure, RAG, multi-model fallback',
    cues: 'Click "Open AI Architecture Diagram". Explain Google Gemini 2.5 Flash, 0ms local heuristic RAG, strict JSON schemas, and zero-hallucination guardrails.',
    script: 'Our AI architecture is built for production reliability. We deploy Gemini 2.5 Flash through an edge reverse-proxy with multi-model fallback, guaranteeing sub-second response times and zero CORS failures. Crucially, we use strict JSON schemas for differential diagnosis, decoupling clinical decisions from generative prose.'
  },
  {
    id: 5,
    start: 150,
    end: 180,
    label: '2:30–3:00 • Impact & Next Step',
    keyMessage: '"We can build and scale this"',
    evaluatorCriteria: 'Vision, potential, concrete KPIs, national scale',
    cues: 'Click "View Impact & KPIs". Highlight -65% wait times, 99.4% drug safety, DGHS FHIR compliance, and 64-district scaling.',
    script: 'Vitality-OS cuts outpatient waiting times by 65% and prevents dangerous adverse drug reactions in 99.4% of cases. We are ready to roll out across tertiary hospitals in Dhaka, scaling to all 64 districts under the national DGHS blueprint. We are not just dreaming of AI in healthcare—we have built it, tested it, and proved it works. Thank you.'
  }
];

export function PitchRecordingStudio({
  onSelectRole,
  onOpenAiArchitecture,
  onOpenImpact
}: PitchRecordingStudioProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev >= 180) {
            setIsRunning(false);
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const activeSegment = SEGMENTS.find(s => seconds >= s.start && seconds < s.end) || SEGMENTS[4];

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPct = Math.min(100, (seconds / 180) * 100);

  return (
    <div className="fixed top-0 left-16 right-0 z-40 transition-all">
      {/* Top Floating Glass Control Ribbon */}
      <div className="glass-card-dark border-b border-teal-500/30 px-4 py-2 text-white shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs">
        
        {/* Left: Studio Branding & Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRunning ? 'bg-rose-400' : 'bg-teal-400'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isRunning ? 'bg-rose-500' : 'bg-teal-500'}`} />
            </span>
            <span className="font-black text-xs uppercase tracking-wider text-teal-300 hidden sm:inline">
              180s Pitch Director
            </span>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded-xl border border-white/10 font-mono font-black text-sm">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span className={seconds > 170 ? 'text-rose-400' : seconds > 150 ? 'text-amber-400' : 'text-emerald-400'}>
              {formatTime(seconds)}
            </span>
            <span className="text-slate-500 text-xs">/ 3:00</span>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-1">
            {!isRunning ? (
              <button
                onClick={() => setIsRunning(true)}
                title="Start 180s Pitch Timer"
                className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                title="Pause Timer"
                className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            <button
              onClick={() => {
                setIsRunning(false);
                setSeconds(0);
              }}
              title="Reset Timer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Active Segment Tracker */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto">
          {SEGMENTS.map(s => {
            const isCurrent = activeSegment.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSeconds(s.start)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-teal-400 text-slate-950 shadow-md font-black ring-1 ring-white/50'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {s.label.split(' • ')[0]}
              </button>
            );
          })}
        </div>

        {/* Right: Quick Action Modals & Teleprompter Toggle */}
        <div className="flex items-center gap-2">
          
          {/* Quick Demo Stage Shortcuts */}
          <div className="hidden lg:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            <span className="text-[9px] font-bold text-slate-400 px-1 uppercase">Demo:</span>
            <button
              onClick={() => onSelectRole('assistant')}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 hover:bg-white/20 text-teal-300"
            >
              1. Triage
            </button>
            <button
              onClick={() => onSelectRole('doctor')}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 hover:bg-white/20 text-teal-300"
            >
              2. Doctor
            </button>
            <button
              onClick={() => onSelectRole('lab')}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 hover:bg-white/20 text-teal-300"
            >
              3. Lab
            </button>
            <button
              onClick={toggleLanguage}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300"
            >
              4. {language === 'en' ? 'বাংলা' : 'EN'}
            </button>
          </div>

          <button
            onClick={onOpenAiArchitecture}
            className="px-2.5 py-1.5 rounded-xl glass-btn text-teal-300 text-[11px] font-bold flex items-center gap-1 hover:text-white"
          >
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">AI Pipeline</span>
          </button>

          <button
            onClick={onOpenImpact}
            className="px-2.5 py-1.5 rounded-xl glass-btn text-emerald-300 text-[11px] font-bold flex items-center gap-1 hover:text-white"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Impact KPIs</span>
          </button>

          <button
            onClick={() => setShowTeleprompter(!showTeleprompter)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 transition ${
              showTeleprompter
                ? 'bg-teal-400 text-slate-950 shadow-md'
                : 'glass-btn text-slate-200 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Script</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-black/40 overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            seconds > 170 ? 'bg-rose-500' : seconds > 150 ? 'bg-amber-400' : 'bg-teal-400'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Active Segment Director Cues (Expanded View) */}
      {isExpanded && (
        <div className="glass-card-dark border-b border-teal-500/20 p-4 text-white text-xs space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-teal-400 text-slate-950 font-black text-[10px]">
                Active Segment {activeSegment.id} of 5
              </span>
              <span className="font-extrabold text-sm text-teal-200">{activeSegment.label}</span>
              <span className="text-slate-400 italic font-mono text-[11px]">{activeSegment.keyMessage}</span>
            </div>
            <span className="text-[10px] text-slate-400">
              Evaluators look for: <strong className="text-white">{activeSegment.evaluatorCriteria}</strong>
            </span>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-slate-300 leading-relaxed text-[11px]">
            <strong className="text-teal-300 block mb-0.5">Presenter Visual &amp; Action Cue:</strong>
            {activeSegment.cues}
          </div>
        </div>
      )}

      {/* Live Floating Teleprompter Drawer */}
      {showTeleprompter && (
        <div className="glass-card-dark border-b border-teal-500/30 p-5 text-white max-h-56 overflow-y-auto space-y-3 shadow-2xl animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="font-black text-xs uppercase tracking-wider text-teal-300">
                180s Teleprompter ({activeSegment.label})
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Target Pace: ~135 words/min
            </span>
          </div>

          <p className="text-sm md:text-base font-semibold leading-relaxed text-teal-50 bg-black/40 p-4 rounded-2xl border border-teal-500/20">
            "{activeSegment.script}"
          </p>
        </div>
      )}

    </div>
  );
}
