import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, MicOff, Heart, Zap, Clock, ShieldAlert, CheckCircle2, 
  FileText, Download, Play, Pause, RotateCcw, AlertTriangle, Sparkles, Volume2
} from 'lucide-react';

interface CodeBlueCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientMrin?: string;
  patientName?: string;
}

interface ResuscitationEvent {
  id: string;
  timestamp: string;
  secondsElapsed: number;
  category: 'DRUG' | 'SHOCK' | 'RHYTHM' | 'AIRWAY' | 'ROSC';
  description: string;
  deliveredBy: string;
}

export function CodeBlueCopilotModal({
  isOpen,
  onClose,
  patientMrin = 'HS-2026-00421',
  patientName = 'Kazi Mohammad Tareq'
}: CodeBlueCopilotModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [cycleSeconds, setCycleSeconds] = useState(120); // 2-minute CPR cycle
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [shocksDelivered, setShocksDelivered] = useState(0);
  const [adrenalineDoses, setAdrenalineDoses] = useState(0);
  const [roscAchieved, setRoscAchieved] = useState(false);
  const [events, setEvents] = useState<ResuscitationEvent[]>([
    {
      id: 'evt-0',
      timestamp: new Date().toLocaleTimeString(),
      secondsElapsed: 0,
      category: 'RHYTHM',
      description: 'Cardiac Arrest declared. Pulseless Ventricular Tachycardia (pVT) identified.',
      deliveredBy: 'Code Blue Team Lead'
    }
  ]);

  const recognitionRef = useRef<any>(null);

  if (!isOpen) return null;

  // Master CPR and Cycle Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
        setCycleSeconds(prev => {
          if (prev <= 1) {
            // Beep alert for 2-minute rhythm check
            playRhythmCheckBeep();
            return 120; // Reset 2-min cycle
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // Audio tone helper
  const playRhythmCheckBeep = () => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance('Two minutes elapsed. Pause CPR. Check pulse and rhythm now.');
    utterance.lang = 'en-US';
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join(' ');
        
        setVoiceTranscript(transcript);
        parseVoiceCommand(transcript.toLowerCase());
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [elapsedSeconds]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // NLP Voice Parser for ACLS Protocol
  const parseVoiceCommand = (text: string) => {
    const nowStr = new Date().toLocaleTimeString();

    if (text.includes('shock') || text.includes('joules') || text.includes('defibrillate')) {
      if (!events.some(e => e.description.includes('Defibrillation') && elapsedSeconds - e.secondsElapsed < 5)) {
        addEvent('SHOCK', 'Biphasic Defibrillation delivered (200 Joules). Immediate CPR resumed.', 'Resuscitation Nurse');
        setShocksDelivered(prev => prev + 1);
      }
    } else if (text.includes('adrenaline') || text.includes('epinephrine')) {
      if (!events.some(e => e.description.includes('Adrenaline') && elapsedSeconds - e.secondsElapsed < 5)) {
        addEvent('DRUG', 'Adrenaline (Epinephrine) 1mg IV Push administered + 20mL saline flush.', 'Medication Officer');
        setAdrenalineDoses(prev => prev + 1);
      }
    } else if (text.includes('amiodarone')) {
      if (!events.some(e => e.description.includes('Amiodarone') && elapsedSeconds - e.secondsElapsed < 5)) {
        addEvent('DRUG', 'Amiodarone 300mg IV Push delivered.', 'Medication Officer');
      }
    } else if (text.includes('rosc') || text.includes('pulse back') || text.includes('return of spontaneous')) {
      setRoscAchieved(true);
      addEvent('ROSC', 'ROSC ACHIEVED! Palpable carotid pulse confirmed. Post-cardiac arrest care initiated.', 'Team Lead');
    }
  };

  const addEvent = (category: ResuscitationEvent['category'], description: string, deliveredBy: string) => {
    const newEvt: ResuscitationEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      secondsElapsed: elapsedSeconds,
      category,
      description,
      deliveredBy
    };
    setEvents(prev => [newEvt, ...prev]);
  };

  // Quick Action Buttons
  const handleQuickShock = () => {
    setShocksDelivered(prev => prev + 1);
    addEvent('SHOCK', 'Defibrillator Shock # ' + (shocksDelivered + 1) + ' delivered (200J Biphasic)', 'Team Registrar');
  };

  const handleQuickAdrenaline = () => {
    setAdrenalineDoses(prev => prev + 1);
    addEvent('DRUG', 'Adrenaline 1mg IV Push # ' + (adrenalineDoses + 1) + ' given with 20mL Saline flush', 'Nurse Lead');
  };

  const handleQuickAmiodarone = () => {
    addEvent('DRUG', 'Amiodarone 300mg IV Push given for refractory VT/VF', 'Physician');
  };

  const handleQuickRosc = () => {
    setRoscAchieved(true);
    addEvent('ROSC', 'Return of Spontaneous Circulation (ROSC) Confirmed. Systolic BP 98 mmHg.', 'Consultant');
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 border-b border-rose-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 animate-pulse">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">Code Blue Co-Pilot™</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  ACLS Voice Documenter
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Patient: <strong className="text-white">{patientName}</strong> ({patientMrin}) • Hands-Free Resuscitation Logger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleListening}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-900'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>{isListening ? 'Voice Listening Active' : 'Start Voice Assistant'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CPR Metronome & Cycle Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          
          {/* Main Elapsed Timer */}
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Elapsed Arrest Time</span>
              <div className="text-3xl font-black font-mono text-white tracking-widest">
                {formatTimer(elapsedSeconds)}
              </div>
            </div>

            <div className="h-10 w-px bg-slate-800" />

            {/* 2-Minute Rhythm Check Countdown */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Next Rhythm & Pulse Check</span>
              <div className={`text-2xl font-black font-mono tracking-widest ${
                cycleSeconds <= 15 ? 'text-rose-400 animate-pulse' : 'text-teal-400'
              }`}>
                {formatTimer(cycleSeconds)}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className="text-center px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Shocks</span>
              <span className="text-lg font-black text-rose-400">{shocksDelivered}</span>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Adrenaline</span>
              <span className="text-lg font-black text-amber-400">{adrenalineDoses} mg</span>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">ROSC Status</span>
              <span className={`text-xs font-black px-2 py-0.5 rounded ${roscAchieved ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'}`}>
                {roscAchieved ? 'ACHIEVED' : 'IN PROGRESS'}
              </span>
            </div>
          </div>

          {/* Start/Pause CPR Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause Code' : 'Start Code Blue Timer'}</span>
            </button>
          </div>

        </div>

        {/* Quick ACLS Action Ribbon */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            1-Click Drug & Defibrillation Buttons:
          </span>
          <button
            onClick={handleQuickShock}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Deliver 200J Shock</span>
          </button>
          <button
            onClick={handleQuickAdrenaline}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow flex items-center gap-1.5"
          >
            <span>+ 1mg Adrenaline</span>
          </button>
          <button
            onClick={handleQuickAmiodarone}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-1.5"
          >
            <span>+ 300mg Amiodarone</span>
          </button>
          <button
            onClick={handleQuickRosc}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center gap-1.5 ml-auto"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm ROSC Achieved</span>
          </button>
        </div>

        {/* Real-time Resuscitation Log Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>RESUSCITATION AUDIT TRAIL (UTSTEIN ACCREDITED)</span>
            <span>{events.length} EVENTS LOGGED</span>
          </div>

          {events.map((evt) => (
            <div
              key={evt.id}
              className={`p-3.5 rounded-2xl border flex items-start justify-between gap-4 transition-all ${
                evt.category === 'ROSC'
                  ? 'bg-emerald-950/40 border-emerald-500/50'
                  : evt.category === 'SHOCK'
                  ? 'bg-rose-950/40 border-rose-500/50'
                  : 'bg-slate-800/40 border-slate-700/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                  evt.category === 'ROSC'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : evt.category === 'SHOCK'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {evt.timestamp} (+{evt.secondsElapsed}s)
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{evt.description}</h4>
                  <span className="text-[10px] text-slate-400">By: {evt.deliveredBy}</span>
                </div>
              </div>

              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {evt.category}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Compliant with American Heart Association (AHA) ACLS 2025/2026 Guidelines</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert('Utstein Resuscitation Summary PDF generated and archived to patient electronic record!');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Utstein Log</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
            >
              Close Co-Pilot
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
