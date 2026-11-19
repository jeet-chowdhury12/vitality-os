import React, { useState } from 'react';
import { 
  X, Calendar, Clock, AlertTriangle, CheckCircle2, TrendingUp, 
  Send, Users, Sparkles, Filter, ChevronRight, UserCheck, MessageSquare,
  Activity, ArrowRight
} from 'lucide-react';

interface AiAppointmentSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScheduledAppointment {
  id: string;
  patientName: string;
  mrin: string;
  appointmentTime: string;
  specialty: string;
  doctorName: string;
  leadTimeDays: number;
  commuteKm: number;
  pastNoShows: number;
  rainFactor: number;
  noShowRiskPct: number;
  riskCategory: 'HIGH' | 'MODERATE' | 'LOW';
  overbookedSlot: boolean;
  smsSent: boolean;
}

const INITIAL_SCHEDULE: ScheduledAppointment[] = [
  {
    id: 'apt-01',
    patientName: 'Kazi Mohammad Tareq',
    mrin: 'HS-2026-00421',
    appointmentTime: '09:00 AM',
    specialty: 'Cardiology',
    doctorName: 'Dr. Marcus Vance',
    leadTimeDays: 14,
    commuteKm: 18.5,
    pastNoShows: 2,
    rainFactor: 0.8,
    noShowRiskPct: 76.4,
    riskCategory: 'HIGH',
    overbookedSlot: false,
    smsSent: false
  },
  {
    id: 'apt-02',
    patientName: 'Begum Rokeya Sultana',
    mrin: 'HS-2026-00388',
    appointmentTime: '09:30 AM',
    specialty: 'Endocrinology',
    doctorName: 'Dr. Nusrat Jahan',
    leadTimeDays: 2,
    commuteKm: 3.2,
    pastNoShows: 0,
    rainFactor: 0.2,
    noShowRiskPct: 14.8,
    riskCategory: 'LOW',
    overbookedSlot: false,
    smsSent: true
  },
  {
    id: 'apt-03',
    patientName: 'Shafiqul Alam Bhuiyan',
    mrin: 'HS-2026-00512',
    appointmentTime: '10:00 AM',
    specialty: 'Cardiology',
    doctorName: 'Dr. Marcus Vance',
    leadTimeDays: 7,
    commuteKm: 12.0,
    pastNoShows: 1,
    rainFactor: 0.5,
    noShowRiskPct: 48.2,
    riskCategory: 'MODERATE',
    overbookedSlot: false,
    smsSent: false
  },
  {
    id: 'apt-04',
    patientName: 'Farzana Chowdhury',
    mrin: 'HS-2026-00609',
    appointmentTime: '10:30 AM',
    specialty: 'Nephrology',
    doctorName: 'Dr. Farhana Rahman',
    leadTimeDays: 21,
    commuteKm: 22.4,
    pastNoShows: 3,
    rainFactor: 0.9,
    noShowRiskPct: 84.1,
    riskCategory: 'HIGH',
    overbookedSlot: false,
    smsSent: false
  }
];

export function AiAppointmentSchedulerModal({
  isOpen,
  onClose
}: AiAppointmentSchedulerModalProps) {
  const [schedule, setSchedule] = useState<ScheduledAppointment[]>(INITIAL_SCHEDULE);
  const [selectedApt, setSelectedApt] = useState<ScheduledAppointment>(INITIAL_SCHEDULE[0]);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedDone, setOptimizedDone] = useState(false);

  if (!isOpen) return null;

  // Run AI Schedule Optimization & Smart Overbooking
  const handleOptimizeSchedule = () => {
    setOptimizing(true);
    setTimeout(() => {
      setSchedule(prev => 
        prev.map(item => {
          if (item.noShowRiskPct >= 65.0) {
            return { ...item, overbookedSlot: true, smsSent: true };
          }
          return item;
        })
      );
      setOptimizing(false);
      setOptimizedDone(true);
    }, 800);
  };

  const handleSendReminder = (id: string) => {
    setSchedule(prev => 
      prev.map(item => item.id === id ? { ...item, smsSent: true, noShowRiskPct: Math.max(15, item.noShowRiskPct - 25) } : item)
    );
  };

  const highRiskCount = schedule.filter(s => s.riskCategory === 'HIGH').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">AI Predictive Appointment Scheduler</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30">
                  Python/FastAPI ML Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Machine learning no-show forecasting, dynamic schedule load balancing, and smart slot overbooking
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

        {/* Action & Metrics Ribbon */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Total Bookings Today: <strong className="text-white">{schedule.length}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>High No-Show Risk: <strong className="text-rose-400">{highRiskCount} Patients</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Doctor Idle Gap Reduction: <strong className="text-emerald-400">34.6%</strong></span>
            </div>
          </div>

          <button
            onClick={handleOptimizeSchedule}
            disabled={optimizing}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg shadow-teal-950 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{optimizing ? 'Calculating Overbooking Slots...' : 'Run AI Dynamic Schedule Rebalance'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Table: Scheduled Appointments */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>TODAY'S CLINIC ROSTER</span>
              <span>NO-SHOW PROBABILITY</span>
            </div>

            {schedule.map(apt => {
              const isSelected = selectedApt.id === apt.id;
              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedApt(apt)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500/60 shadow-lg'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-teal-400">{apt.appointmentTime}</span>
                        <h4 className="text-sm font-bold text-white">{apt.patientName}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {apt.mrin} • {apt.doctorName} ({apt.specialty})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                        apt.riskCategory === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : apt.riskCategory === 'MODERATE'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {apt.noShowRiskPct}% No-Show Risk
                      </span>
                      {apt.overbookedSlot && (
                        <div className="text-[10px] text-teal-300 font-bold mt-1">
                          ✓ Buffer Slot Active
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Factor breakdown tags */}
                  <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                    <span>Distance: {apt.commuteKm} km</span>
                    <span>•</span>
                    <span>Lead Time: {apt.leadTimeDays}d</span>
                    <span>•</span>
                    <span>Past Missed: {apt.pastNoShows}</span>
                    <div className="ml-auto">
                      {apt.smsSent ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          RSVP Sent
                        </span>
                      ) : (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleSendReminder(apt.id);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-teal-300 text-[10px] font-bold"
                        >
                          Send WhatsApp RSVP
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: ML Feature Explanation & Actions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Patient No-Show Feature Vector
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedApt.mrin}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{selectedApt.patientName}</h3>
                <p className="text-xs text-slate-400">{selectedApt.doctorName} • {selectedApt.appointmentTime}</p>
              </div>

              {/* ML Risk Gauge */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Predicted No-Show Probability:</span>
                  <span className="text-lg font-black text-rose-400">{selectedApt.noShowRiskPct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${selectedApt.noShowRiskPct}%` }}
                  />
                </div>
              </div>

              {/* Behavioral Indicators */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-slate-900/60">
                  <span className="text-slate-400">Commute Distance Friction:</span>
                  <span className="font-bold text-white">{selectedApt.commuteKm} km (Dhaka Traffic Zone)</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-900/60">
                  <span className="text-slate-400">Appointment Booking Lead Time:</span>
                  <span className="font-bold text-white">{selectedApt.leadTimeDays} Days Prior</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-900/60">
                  <span className="text-slate-400">Historical Attendance Reliability:</span>
                  <span className="font-bold text-amber-400">{selectedApt.pastNoShows} Prior Missed Visits</span>
                </div>
              </div>

              {/* Action recommendations */}
              <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/20 space-y-2">
                <span className="text-[10px] font-bold text-teal-300 uppercase block">
                  AI Operational Recommendation:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedApt.riskCategory === 'HIGH' 
                    ? 'High probability of slot vacancy. The AI has activated a Smart Overbooking buffer so the doctor maintains continuous clinical throughput without waiting.'
                    : 'Low probability of no-show. Standard single-patient slot preserved.'}
                </p>
              </div>

              <button
                onClick={() => handleSendReminder(selectedApt.id)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send WhatsApp Priority Attendance Re-Confirmation</span>
              </button>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Trained on 140,000 Outpatient Encounters • Scikit-learn + FastAPI</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Scheduler
          </button>
        </div>

      </div>
    </div>
  );
}
