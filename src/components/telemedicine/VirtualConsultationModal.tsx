import React, { useState } from 'react';
import { 
  X, Video, VideoOff, Mic, MicOff, PhoneOff, Phone, 
  Stethoscope, FileText, Send, CheckCircle2, ShieldCheck, Heart, Sparkles
} from 'lucide-react';

interface VirtualConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName?: string;
  patientName?: string;
  specialty?: string;
}

export function VirtualConsultationModal({
  isOpen,
  onClose,
  doctorName = 'Dr. Marcus Vance',
  patientName = 'Kazi Mohammad Tareq',
  specialty = 'Clinical Cardiology'
}: VirtualConsultationModalProps) {
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [digitalStethActive, setDigitalStethActive] = useState<boolean>(false);
  const [inCallNotes, setInCallNotes] = useState<string>(
    'Patient reporting intermittent exertional palpitations. Advised reducing caffeine and monitoring resting pulse via wearable sensor.'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-teal-950/90 via-slate-900 to-indigo-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Virtual Doctor Telemedicine Suite</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30">
                  WebRTC P2P Encrypted Call
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {doctorName} ({specialty}) &bull; Patient: <strong className="text-white">{patientName}</strong>
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

        {/* Video Calling Screen Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Video View: Doctor + PiP Patient */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            <div className="relative w-full h-80 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl">
              
              {/* Doctor Camera Simulated Stream */}
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-teal-600/30 border-2 border-teal-400 flex items-center justify-center mx-auto text-teal-300 font-bold text-2xl">
                  👨‍⚕️
                </div>
                <div className="text-sm font-bold text-white">{doctorName}</div>
                <div className="text-xs text-teal-400 font-mono">1080p HD &bull; Latency: 24ms &bull; WebRTC Active</div>
              </div>

              {/* Patient Self View (PiP Thumbnail) */}
              <div className="absolute bottom-4 right-4 w-32 h-24 rounded-2xl bg-slate-800 border-2 border-teal-500/60 shadow-xl flex items-center justify-center overflow-hidden">
                <div className="text-center text-xs">
                  <span className="text-lg">🧑</span>
                  <div className="text-[10px] text-slate-300 font-semibold">{patientName.split(' ')[0]} (You)</div>
                </div>
              </div>

              {/* Digital Stethoscope Banner */}
              {digitalStethActive && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-teal-950/80 border border-teal-400/50 text-xs font-mono text-teal-300 flex items-center gap-2 animate-pulse">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>DIGITAL STETHOSCOPE STREAMING: S1/S2 CLEAR (74 BPM)</span>
                </div>
              )}
            </div>

            {/* In-Call Controls */}
            <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className={`p-3 rounded-2xl transition ${
                  isAudioMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className={`p-3 rounded-2xl transition ${
                  isVideoMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setDigitalStethActive(!digitalStethActive)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
                  digitalStethActive ? 'bg-teal-600 text-white' : 'bg-slate-800 text-teal-300'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>{digitalStethActive ? 'Stethoscope Active' : 'Listen with Digital Steth'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-950"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column: In-Call Prescription & Notes */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Live Tele-Consultation Notes
                </span>
                <span className="text-[10px] text-slate-400 font-mono">EHR Sync</span>
              </div>

              <textarea
                value={inCallNotes}
                onChange={e => setInCallNotes(e.target.value)}
                rows={7}
                className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-teal-400"
              />

              <button
                onClick={() => alert('Electronic e-Prescription signed and dispatched to patient mobile portal!')}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-xs text-white shadow flex items-center justify-center gap-2 transition"
              >
                <FileText className="w-4 h-4" />
                <span>Issue Instant Digital e-Prescription</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Compliant with BMDC Telemedicine Guidelines &amp; WebRTC DTLS/SRTP Encryption</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            End Consultation
          </button>
        </div>

      </div>
    </div>
  );
}
