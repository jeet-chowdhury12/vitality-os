import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, AlertTriangle, PhoneCall, ShieldAlert, Activity, 
  Clock, CheckCircle2, XCircle, Info, ChevronRight, Play, Square,
  Volume2, VolumeX, Shield, User, Droplet, Pill, Zap
} from 'lucide-react';
import { PatientRecord } from '../../data/patientsDatabase';

interface EmergencyFirstAidSuiteProps {
  patient: PatientRecord;
  onClose?: () => void;
  language?: 'EN' | 'BN';
}

export const EmergencyFirstAidSuite: React.FC<EmergencyFirstAidSuiteProps> = ({
  patient,
  onClose,
  language = 'EN'
}) => {
  const [activeTab, setActiveTab] = useState<'cpr' | 'stroke' | 'poison' | 'ice_card' | 'firstaid'>('cpr');
  
  // CPR Metronome State
  const [cprActive, setCprActive] = useState(false);
  const [cprMode, setCprMode] = useState<'adult' | 'infant'>('adult');
  const [compressionCount, setCompressionCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const cprIntervalRef = useRef<number | null>(null);

  // Stroke F.A.S.T. Stopwatch
  const [strokeTimerRunning, setStrokeTimerRunning] = useState(false);
  const [strokeElapsedSeconds, setStrokeElapsedSeconds] = useState(0);
  const [fastChecks, setFastChecks] = useState({ face: false, arms: false, speech: false });

  // Double Dose decision tree state
  const [selectedDrugClass, setSelectedDrugClass] = useState<'bp' | 'diabetes' | 'pain' | 'other' | null>(null);

  // CPR Sound generation (105 BPM = 571ms interval)
  const playCprClick = () => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio fallback
    }
  };

  useEffect(() => {
    if (cprActive) {
      // 105 BPM = ~571.4ms
      cprIntervalRef.current = window.setInterval(() => {
        setCompressionCount(prev => prev + 1);
        playCprClick();
        if (navigator.vibrate) {
          navigator.vibrate(40);
        }
      }, 571);
    } else {
      if (cprIntervalRef.current) {
        clearInterval(cprIntervalRef.current);
        cprIntervalRef.current = null;
      }
    }
    return () => {
      if (cprIntervalRef.current) clearInterval(cprIntervalRef.current);
    };
  }, [cprActive, audioEnabled]);

  // Stroke stopwatch timer
  useEffect(() => {
    let interval: number;
    if (strokeTimerRunning) {
      interval = window.setInterval(() => {
        setStrokeElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [strokeTimerRunning]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
      {/* Header with SOS Trigger */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border-b border-red-900/40 p-4 md:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600/20 border border-red-500/40 rounded-xl text-red-400 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-wide text-white">
                {language === 'BN' ? 'জরুরী ও প্রাথমিক চিকিৎসা সুরক্ষা স্যুট' : 'Emergency Survival & First Aid Suite'}
              </h2>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-600/30 text-red-300 border border-red-500/40">
                100% Offline Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'BN' 
                ? 'জীবন রক্ষাকারী নির্দেশিকা • সিপিআর মেট্রোনম • স্ট্রোক যাচাই • বিষক্রিয়া গাইড • আইসিই কার্ড' 
                : 'Evidence-based protocols • 105 BPM Metronome • F.A.S.T. Assessment • Double-Dose Guide'}
            </p>
          </div>
        </div>

        {/* 1-Tap 999 Call Button */}
        <div className="flex items-center gap-2">
          <a
            href="tel:999"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-sm shadow-lg shadow-red-900/50 hover:brightness-110 active:scale-95 transition-all"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>{language === 'BN' ? 'জরুরী কল (৯৯৯)' : '1-TAP EMERGENCY (999)'}</span>
          </a>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            >
              {language === 'BN' ? 'বন্ধ করুন' : 'Close Suite'}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800/80 bg-slate-900/50 px-4 scrollbar-none">
        <button
          onClick={() => setActiveTab('cpr')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-xs uppercase tracking-wider transition border-b-2 whitespace-nowrap ${
            activeTab === 'cpr'
              ? 'border-red-500 text-red-400 bg-red-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4 text-red-400" />
          <span>1. CPR Metronome (105 BPM)</span>
        </button>

        <button
          onClick={() => setActiveTab('stroke')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-xs uppercase tracking-wider transition border-b-2 whitespace-nowrap ${
            activeTab === 'stroke'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-400" />
          <span>2. Stroke F.A.S.T. Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('poison')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-xs uppercase tracking-wider transition border-b-2 whitespace-nowrap ${
            activeTab === 'poison'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pill className="w-4 h-4 text-emerald-400" />
          <span>3. Accidental Double-Dose</span>
        </button>

        <button
          onClick={() => setActiveTab('ice_card')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-xs uppercase tracking-wider transition border-b-2 whitespace-nowrap ${
            activeTab === 'ice_card'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4 text-cyan-400" />
          <span>4. 1-Tap SOS / ICE Card</span>
        </button>

        <button
          onClick={() => setActiveTab('firstaid')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-xs uppercase tracking-wider transition border-b-2 whitespace-nowrap ${
            activeTab === 'firstaid'
              ? 'border-purple-500 text-purple-400 bg-purple-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4 text-purple-400" />
          <span>5. First Aid Kit Checklist</span>
        </button>
      </div>

      {/* Tab 1: CPR Pacer & Metronome */}
      {activeTab === 'cpr' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Pulsing Heart Metronome */}
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900/90 border border-slate-800 rounded-2xl text-center relative overflow-hidden">
              <div 
                className={`w-40 h-40 rounded-full flex items-center justify-center border-4 transition-transform duration-150 ${
                  cprActive 
                    ? 'border-red-500 bg-red-600/20 scale-105 shadow-2xl shadow-red-600/40' 
                    : 'border-slate-700 bg-slate-800/40'
                }`}
                style={{
                  transform: cprActive && compressionCount % 2 === 0 ? 'scale(1.15)' : 'scale(1.0)'
                }}
              >
                <Heart className={`w-20 h-20 transition-colors ${cprActive ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} />
              </div>

              <div className="mt-4">
                <span className="text-4xl font-black font-mono text-white tracking-widest">
                  {cprActive ? compressionCount : 0}
                </span>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Compressions • Target: 105 Beats/Min
                </p>
                <p className="text-xs text-amber-400 mt-1 font-mono">
                  {cprActive ? `${Math.floor(compressionCount / 30)} cycles of 30 done • Give 2 breaths` : '30 Compressions : 2 Breaths'}
                </p>
              </div>

              {/* CPR Controls */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    if (!cprActive) {
                      setCompressionCount(0);
                      setCprActive(true);
                    } else {
                      setCprActive(false);
                    }
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all ${
                    cprActive
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50'
                  }`}
                >
                  {cprActive ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{cprActive ? 'STOP CPR PACER' : 'START 105 BPM PACER'}</span>
                </button>

                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition"
                  title="Toggle Audio Click"
                >
                  {audioEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
                </button>
              </div>

              {/* Adult vs Infant Toggle */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mt-4 text-xs font-bold">
                <button
                  onClick={() => setCprMode('adult')}
                  className={`px-4 py-1.5 rounded-lg transition ${cprMode === 'adult' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
                >
                  Adult (5-6 cm depth)
                </button>
                <button
                  onClick={() => setCprMode('infant')}
                  className={`px-4 py-1.5 rounded-lg transition ${cprMode === 'infant' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
                >
                  Infant (4 cm depth / 2 fingers)
                </button>
              </div>
            </div>

            {/* CPR Life-Saving Rules */}
            <div className="space-y-4">
              <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-xl">
                <h4 className="font-extrabold text-red-300 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  CRITICAL AHA GUIDELINES
                </h4>
                <ul className="text-xs text-slate-300 space-y-2 mt-2 leading-relaxed">
                  <li><strong>1. Hand Placement:</strong> Heel of hand in center of chest (lower half of sternum). Interlock fingers.</li>
                  <li><strong>2. Posture:</strong> Straight arms, shoulders directly over hands. Use upper body weight, not arm strength.</li>
                  <li><strong>3. Depth:</strong> Push hard and fast at least 5 cm (2 inches), allowing full chest recoil between compressions.</li>
                  <li><strong>4. Rate:</strong> 100 to 120 compressions per minute (Match the live beat above).</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  STRICT "DO NOT" WARNINGS
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  • <strong>DO NOT</strong> interrupt compressions for more than 10 seconds.<br />
                  • <strong>DO NOT</strong> lean on the victim's chest between compressions—allow complete chest expansion so blood fills the heart.<br />
                  • If untrained in rescue breathing, perform <strong>Hands-Only CPR</strong> continuously until paramedics arrive.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Stroke F.A.S.T. Assessment */}
      {activeTab === 'stroke' && (
        <div className="p-6 space-y-6">
          {/* CRITICAL WARNING: DEBUNKING EAR PUNCTURING */}
          <div className="p-4 bg-gradient-to-r from-red-950/90 via-red-900/60 to-slate-900 border-2 border-red-500 rounded-2xl flex items-start gap-4">
            <ShieldAlert className="w-7 h-7 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="font-black text-white text-base tracking-wide">
                CRITICAL WARNING: NEVER PRICK EARS OR FINGERS WITH A NEEDLE!
              </h4>
              <p className="text-xs text-red-200 mt-1 leading-relaxed">
                Dangerous internet rumors claim pricking earlobes to bleed saves stroke victims. <strong>THIS IS FATAL FALSE INFORMATION.</strong> In acute ischemic stroke, 1.9 million brain cells die every minute ('Time is Brain'). Pricking ears causes intense pain, triggering a dangerous blood pressure spike that can rupture brain vessels into a fatal hemorrhagic stroke. <strong>CALL 999 IMMEDIATELY.</strong>
              </p>
            </div>
          </div>

          {/* Aspirin Rule for Stroke vs Heart Attack */}
          <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200 leading-relaxed">
              <strong>THE ASPIRIN RULE:</strong> For suspected heart attack (crushing chest pain), chewing 300mg aspirin is recommended. <strong>FOR STROKE: NEVER GIVE ASPIRIN BEFORE A HOSPITAL CT SCAN!</strong> 20% of strokes are hemorrhagic (bleeding inside the skull). Aspirin thins the blood and will cause uncontrollable fatal brain hemorrhage.
            </div>
          </div>

          {/* Interactive F.A.S.T. Checklist with Stopwatch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-300">
                F.A.S.T. Clinical Checklist
              </h4>

              {/* F - Face */}
              <div 
                onClick={() => setFastChecks(prev => ({ ...prev, face: !prev.face }))}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  fastChecks.face ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <span className="font-black text-amber-400 text-lg mr-2">F</span>
                  <span className="font-bold">Face Drooping:</span> Ask the person to smile. Does one side of the face droop?
                </div>
                {fastChecks.face ? <CheckCircle2 className="w-5 h-5 text-amber-400" /> : <div className="w-5 h-5 rounded-full border border-slate-600" />}
              </div>

              {/* A - Arms */}
              <div 
                onClick={() => setFastChecks(prev => ({ ...prev, arms: !prev.arms }))}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  fastChecks.arms ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <span className="font-black text-amber-400 text-lg mr-2">A</span>
                  <span className="font-bold">Arm Weakness:</span> Ask them to raise both arms. Does one arm drift downward?
                </div>
                {fastChecks.arms ? <CheckCircle2 className="w-5 h-5 text-amber-400" /> : <div className="w-5 h-5 rounded-full border border-slate-600" />}
              </div>

              {/* S - Speech */}
              <div 
                onClick={() => setFastChecks(prev => ({ ...prev, speech: !prev.speech }))}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  fastChecks.speech ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <span className="font-black text-amber-400 text-lg mr-2">S</span>
                  <span className="font-bold">Speech Difficulty:</span> Is speech slurred or jumbled? Can they repeat a simple sentence?
                </div>
                {fastChecks.speech ? <CheckCircle2 className="w-5 h-5 text-amber-400" /> : <div className="w-5 h-5 rounded-full border border-slate-600" />}
              </div>
            </div>

            {/* T - Time with Stopwatch */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-red-500 text-xl">T — TIME IS BRAIN</span>
                  <span className="px-2 py-1 rounded bg-red-950 border border-red-800 text-red-300 text-xs font-mono font-bold">
                    3-4.5hr tPA Window
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Record exact symptom onset time for ER neurologists. If any of the above signs are present, call 999 immediately.
                </p>

                {/* Onset Stopwatch */}
                <div className="mt-6 text-center p-6 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-5xl font-mono font-black text-white">
                    {formatSeconds(strokeElapsedSeconds)}
                  </span>
                  <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-semibold">
                    Elapsed Since Symptom Onset
                  </p>
                  <button
                    onClick={() => setStrokeTimerRunning(!strokeTimerRunning)}
                    className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg transition"
                  >
                    {strokeTimerRunning ? 'Pause Onset Timer' : 'Start Onset Timer'}
                  </button>
                </div>
              </div>

              <a
                href="tel:999"
                className="mt-6 w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-center rounded-xl shadow-lg shadow-red-900/50 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>DISPATCH AMBULANCE (999) NOW</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Accidental Double-Dose Decision Tree */}
      {activeTab === 'poison' && (
        <div className="p-6 space-y-6">
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
            <h4 className="font-bold text-emerald-300 text-sm">
              "I took an extra pill by mistake" — Clinical Decision Navigator
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Select the medication class you accidentally double-dosed to receive tailored clinical instructions:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setSelectedDrugClass('bp')}
              className={`p-4 rounded-xl border text-left transition ${
                selectedDrugClass === 'bp' ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5 text-red-400 mb-2" />
              <div className="font-bold text-xs">Blood Pressure</div>
              <div className="text-[10px] text-slate-400">Telmisartan, Amlodipine</div>
            </button>

            <button
              onClick={() => setSelectedDrugClass('diabetes')}
              className={`p-4 rounded-xl border text-left transition ${
                selectedDrugClass === 'diabetes' ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Droplet className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="font-bold text-xs">Diabetes / Sugar</div>
              <div className="text-[10px] text-slate-400">Metformin, Glimepiride</div>
            </button>

            <button
              onClick={() => setSelectedDrugClass('pain')}
              className={`p-4 rounded-xl border text-left transition ${
                selectedDrugClass === 'pain' ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Pill className="w-5 h-5 text-purple-400 mb-2" />
              <div className="font-bold text-xs">Painkillers / NSAID</div>
              <div className="text-[10px] text-slate-400">Naproxen, Paracetamol</div>
            </button>

            <button
              onClick={() => setSelectedDrugClass('other')}
              className={`p-4 rounded-xl border text-left transition ${
                selectedDrugClass === 'other' ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-5 h-5 text-amber-400 mb-2" />
              <div className="font-bold text-xs">Other / Unknown</div>
              <div className="text-[10px] text-slate-400">Antibiotics, Statins</div>
            </button>
          </div>

          {/* Decision Tree Recommendation Output */}
          {selectedDrugClass && (
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              {selectedDrugClass === 'bp' && (
                <>
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Risk: Acute Hypotension (Sudden Drop in Blood Pressure)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. <strong>Lie flat immediately:</strong> Elevate feet on a pillow to keep blood flowing to the brain.<br />
                    2. <strong>Drink electrolyte fluids:</strong> Drink 1-2 glasses of oral rehydration saline (ORS) or plain water with a pinch of salt.<br />
                    3. <strong>Watch for Red Flags:</strong> If feeling dizzy, clammy, or fainting occurs, call 999 immediately. Do NOT take any more BP pills today or tomorrow morning without consulting your doctor.
                  </p>
                </>
              )}

              {selectedDrugClass === 'diabetes' && (
                <>
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Risk: Severe Hypoglycemia (Dangerous Low Blood Sugar)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. <strong>Eat fast-acting sugar immediately:</strong> Consume 3 teaspoons of sugar, honey, or half a cup of sweet fruit juice.<br />
                    2. <strong>Check blood glucose:</strong> If available, test capillary fingerstick sugar every 15 minutes.<br />
                    3. <strong>Follow with complex carbs:</strong> Eat bread or rice to keep sugar stable. If confusion or seizure occurs, call 999.
                  </p>
                </>
              )}

              {selectedDrugClass === 'pain' && (
                <>
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Risk: Acute Gastric Mucosal Erosion / Hepatotoxicity
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. Drink plenty of fresh water to flush renal tubules.<br />
                    2. Take an antacid (Omeprazole / Pantoprazole) if stomach burn or burning sensation occurs.<br />
                    3. If paracetamol dose exceeded 4000mg in 24 hours, go to the hospital for N-acetylcysteine liver evaluation.
                  </p>
                </>
              )}

              {selectedDrugClass === 'other' && (
                <>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Info className="w-4 h-4" />
                    General Protocol
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Do NOT induce vomiting with salt water. Keep the medicine blister pack for identification and call 999 or the National Poison Information Centre.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: 1-Tap SOS / ICE Card */}
      {activeTab === 'ice_card' && (
        <div className="p-6 space-y-6">
          <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Emergency Medical ID
            </div>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-full bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center font-black text-cyan-400 text-lg">
                {patient.bloodGroup || 'O+'}
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">{patient.fullName}</h3>
                <p className="text-xs text-slate-400">MRIN: {patient.mrin} • Age: {patient.age}y ({patient.gender})</p>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Documented Allergies:</span>
                <p className="font-bold text-rose-400 mt-0.5">
                  {patient.knownDrugAllergies.length > 0 ? patient.knownDrugAllergies.join(', ') : 'No Known Drug Allergies (NKDA)'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Active Emergency Medications:</span>
                <div className="space-y-1 mt-1">
                  {patient.activePrescription.medicines.slice(0, 3).map(m => (
                    <div key={m.id} className="p-1.5 bg-slate-950 border border-slate-800 rounded font-mono text-slate-300 flex justify-between">
                      <span>{m.medicineName}</span>
                      <span className="text-cyan-400">{m.dosage}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Emergency Kin Contact:</span>
                <p className="font-bold text-white mt-0.5">
                  {patient.emergencyContact?.name || 'Primary Guardian'} ({patient.emergencyContact?.relation || 'Spouse'}):{' '}
                  <a href={`tel:${patient.emergencyContact?.phone || '01711000000'}`} className="text-cyan-400 underline">
                    {patient.emergencyContact?.phone || '01711-000000'}
                  </a>
                </p>
              </div>
            </div>

            <button 
              onClick={() => window.print()}
              className="w-full mt-2 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs rounded-xl transition"
            >
              Export / Print Lock-Screen Card
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: First Aid Checklist */}
      {activeTab === 'firstaid' && (
        <div className="p-6 space-y-4">
          <h4 className="font-extrabold text-sm text-slate-300 uppercase tracking-wider">
            Essential Home Emergency First-Aid Kit Checklist
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { item: 'Sterile Gauze Pads & Crepe Bandages', desc: 'To control acute bleedings and sprains' },
              { item: 'Oral Rehydration Saline (ORS)', desc: 'For sudden dehydration, diarrhea or low BP' },
              { item: 'Povidone-Iodine Antiseptic Solution', desc: 'For cleansing cuts and abrasions' },
              { item: 'Digital Thermometer & Pulse Oximeter', desc: 'To monitor fever spikes and SpO2 hypoxia' },
              { item: 'Paracetamol 500mg & Antacid', desc: 'Basic emergency analgesia & heartburn relief' },
              { item: 'Scissors, Medical Tape & Clean Tweezers', desc: 'For sterile wound dressing and splinting' }
            ].map((kit, idx) => (
              <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">{kit.item}</div>
                  <div className="text-[11px] text-slate-400">{kit.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
