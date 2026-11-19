import React, { useState } from 'react';
import { 
  X, Pill, Clock, CheckCircle2, AlertTriangle, ShieldCheck, 
  Bell, Volume2, Sparkles, Calendar, Smartphone, RefreshCw, Send
} from 'lucide-react';

interface SmartPillReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

interface PillSlot {
  id: string;
  compartment: number;
  medicationName: string;
  dosage: string;
  timeSlot: string;
  exactTime: string;
  status: 'TAKEN' | 'PENDING' | 'MISSED';
  takenAt?: string;
}

export function SmartPillReminderModal({
  isOpen,
  onClose,
  patientName = 'Kazi Mohammad Tareq'
}: SmartPillReminderModalProps) {
  const [adherenceScore, setAdherenceScore] = useState<number>(94.2);
  const [buzzerTriggered, setBuzzerTriggered] = useState<boolean>(false);
  const [whatsappSent, setWhatsappSent] = useState<boolean>(false);

  const [pillSlots, setPillSlots] = useState<PillSlot[]>([
    {
      id: 'slot-1',
      compartment: 1,
      medicationName: 'Aspirin Cardio 75mg + Clopidogrel 75mg',
      dosage: '1 Tablet After Breakfast',
      timeSlot: 'Morning',
      exactTime: '08:30 AM',
      status: 'TAKEN',
      takenAt: '08:34 AM (On Time)'
    },
    {
      id: 'slot-2',
      compartment: 2,
      medicationName: 'Metformin Hydrochloride 500mg',
      dosage: '1 Tablet Mid-Day with Meal',
      timeSlot: 'Noon',
      exactTime: '01:30 PM',
      status: 'TAKEN',
      takenAt: '01:28 PM (On Time)'
    },
    {
      id: 'slot-3',
      compartment: 3,
      medicationName: 'Atorvastatin Calcium 20mg',
      dosage: '1 Tablet Bedtime for Lipid Management',
      timeSlot: 'Night',
      exactTime: '09:00 PM',
      status: 'PENDING'
    },
    {
      id: 'slot-4',
      compartment: 4,
      medicationName: 'Metoprolol Succinate 25mg',
      dosage: '1 Tablet Morning & Night',
      timeSlot: 'Night',
      exactTime: '09:00 PM',
      status: 'PENDING'
    }
  ]);

  if (!isOpen) return null;

  const handleMarkTaken = (id: string) => {
    setPillSlots(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'TAKEN',
          takenAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (Confirmed)'
        };
      }
      return s;
    }));
    setBuzzerTriggered(false);
  };

  const handleTriggerIoTAlarm = () => {
    setBuzzerTriggered(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Smart pill dispenser alert. It is time to take your evening cardiac medication.');
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/90 via-slate-900 to-indigo-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Smart IoT Pill Reminder &amp; Adherence Tracker</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30">
                  ESP32 / BLE Smart Pillbox
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Patient: <strong className="text-white">{patientName}</strong> • Real-time compartment sensing &amp; missed-dose alert
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

        {/* Adherence Score Ribbon */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">30-Day Medication Adherence:</span>
            <span className="text-lg font-black text-emerald-400">{adherenceScore}% (Gold Tier)</span>
            <span className="text-[11px] text-slate-500">28/30 Days Fully Adherent</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerIoTAlarm}
              className="px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Simulate Pillbox Chime / LED</span>
            </button>
          </div>
        </div>

        {/* Content Body: 4 Pill Slots */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          {buzzerTriggered && (
            <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/50 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Smart Pillbox Compartment #3 &amp; #4 Flashing Green!</h4>
                  <p className="text-[11px] text-amber-200">
                    Buzzer beeping at bedside. Please lift the compartment lid to dispense evening dose.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBuzzerTriggered(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
              >
                Silence Alarm
              </button>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Today's Prescribed Compartment Schedule</span>
              <span>Dispense Verification</span>
            </div>

            {pillSlots.map(slot => (
              <div
                key={slot.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                  slot.status === 'TAKEN'
                    ? 'bg-slate-800/40 border-slate-700/60'
                    : 'bg-teal-950/30 border-teal-500/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                    slot.status === 'TAKEN' 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : 'bg-teal-500/20 text-teal-300'
                  }`}>
                    #{slot.compartment}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{slot.medicationName}</h4>
                      <span className="text-xs font-mono font-bold text-teal-400">({slot.exactTime})</span>
                    </div>
                    <p className="text-xs text-slate-400">{slot.dosage}</p>
                    {slot.takenAt && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Dispensed: {slot.takenAt}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {slot.status === 'TAKEN' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ Confirmed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMarkTaken(slot.id)}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow transition"
                    >
                      Confirm Dispensed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Family Caregiver Auto-Sync */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-indigo-200 block">WhatsApp Caregiver Escort Sync</span>
              <p className="text-slate-400 text-[11px]">
                If a dose is missed by more than 45 minutes, an automated alert is sent to daughter Nusrat (+880 1711-XXXXXX).
              </p>
            </div>
            <button
              onClick={() => {
                setWhatsappSent(true);
                alert('Test adherence digest dispatched to family caregiver via WhatsApp!');
              }}
              disabled={whatsappSent}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{whatsappSent ? 'Caregiver Alerted' : 'Send Test WhatsApp Sync'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Hardware Sync: ESP32 Load-Cell Sensor &amp; Micro-switch Telemetry</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Pill Tracker
          </button>
        </div>

      </div>
    </div>
  );
}
