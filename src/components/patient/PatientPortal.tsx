import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Bell, CheckCircle2, Clock, AlertCircle, Calendar, FileText, 
  Sparkles, Heart, ShieldAlert, Check, RefreshCw, Send,
  ChevronDown, ChevronUp, Droplet, Pill, Box, Lock, ShieldCheck,
  PhoneCall, AlertOctagon, Languages, Globe, Smartphone, Monitor,
  QrCode, User, Flame, Activity, Zap, Info, Share2, Volume2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PatientRecord, PrescribedMedicineItem } from '../../data/patientsDatabase';
import { askValerianPatientCompanion } from '../../services/valerianAI';
import { EmergencyFirstAidSuite } from '../emergency/EmergencyFirstAidSuite';
import BorderGlow from '../reactbits/BorderGlow';
import Plasma from '../reactbits/Plasma';

interface PatientPortalProps {
  patient: PatientRecord;
  onUpdatePatient: (updated: PatientRecord) => void;
  onOpenApiKeyModal: () => void;
}

type PatientTab = 'doses' | 'ai_companion' | 'explainer' | 'vitals' | 'pass';

export const PatientPortal: React.FC<PatientPortalProps> = ({
  patient,
  onUpdatePatient,
  onOpenApiKeyModal
}) => {
  // Device Simulation Mode: 'phone' (iPhone 16 Pro mockup) or 'kiosk' (Full dashboard)
  const [deviceMode, setDeviceMode] = useState<'phone' | 'kiosk'>('phone');
  const [activeTab, setActiveTab] = useState<PatientTab>('doses');
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');

  // Emergency Modal
  const [showEmergencySuite, setShowEmergencySuite] = useState(false);
  const [criticalEmergencyModal, setCriticalEmergencyModal] = useState<{ active: boolean; alertText: string } | null>(null);

  // 7-day pillbox expand toggle
  const [showPillboxLoader, setShowPillboxLoader] = useState(false);

  // Vitals Tracker Form State
  const [glucoseInput, setGlucoseInput] = useState('6.4');
  const [glucoseType, setGlucoseType] = useState<'Fasting' | '2h Post-Meal'>('Fasting');
  const [bpSystolic, setBpSystolic] = useState('124');
  const [bpDiastolic, setBpDiastolic] = useState('78');
  const [vitalsAiAssessment, setVitalsAiAssessment] = useState<string | null>(null);

  // Appointment booking
  const [bookedDate, setBookedDate] = useState('');
  const [bookedTime, setBookedTime] = useState('10:00 AM');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Valerian AI chat state
  const [patientQuestion, setPatientQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiAnswers, setAiAnswers] = useState<{ sender: 'patient' | 'valerian'; text: string; time: string; isEmergency?: boolean }[]>([
    {
      sender: 'valerian',
      text: language === 'BN' 
        ? `আসসালামু আলাইকুম ${patient.fullName}! আমি ভ্যালেরিয়ান এআই। আপনার ওষুধ কখন খাবারের সাথে বা খালি পেটে সেবন করতে হবে, তা জানতে যেকোনো প্রশ্ন করতে পারেন।`
        : `Hello ${patient.fullName}! I'm Valerian AI, your clinical medication companion. I can explain why your medicines were prescribed, when to take them with meals in English or বাংলা, and answer daily health questions!`,
      time: 'Just now'
    }
  ]);

  // AdvocateGPT Prescription Explainer State
  const [explainingRx, setExplainingRx] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

  // Adherence Calculations
  const medicines = patient.activePrescription.medicines;
  const totalDoses = medicines.length;
  const takenDoses = medicines.filter(m => m.takenToday).length;
  const adherencePercent = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;
  const currentStreakDays = 7; // Gamified streak counter

  // Mark medication as Taken
  const handleMarkTaken = (medId: string) => {
    const updatedMedicines = patient.activePrescription.medicines.map(m => {
      if (m.id === medId) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          ...m,
          takenToday: true,
          takenTime: timeNow,
          snoozed: false,
          skipped: false
        };
      }
      return m;
    });

    const updated: PatientRecord = {
      ...patient,
      activePrescription: {
        ...patient.activePrescription,
        medicines: updatedMedicines
      }
    };

    onUpdatePatient(updated);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#14b8a6', '#06b6d4', '#10b981']
    });
  };

  // Snooze medication
  const handleSnooze = (medId: string) => {
    const updatedMedicines = patient.activePrescription.medicines.map(m => {
      if (m.id === medId) {
        return { ...m, snoozed: true };
      }
      return m;
    });

    onUpdatePatient({
      ...patient,
      activePrescription: {
        ...patient.activePrescription,
        medicines: updatedMedicines
      }
    });
  };

  // Ask Valerian AI (Gemini 2.5 Flash API)
  const handleAskValerian = async (e?: React.FormEvent, customQuestion?: string) => {
    if (e) e.preventDefault();
    const query = customQuestion || patientQuestion;
    if (!query.trim() || isAsking) return;

    const userText = query.trim();
    setPatientQuestion('');

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAiAnswers(prev => [...prev, { sender: 'patient', text: userText, time: timeNow }]);
    setIsAsking(true);

    try {
      const response = await askValerianPatientCompanion(userText, patient, language);
      
      if (response.isEmergencyAlert) {
        setCriticalEmergencyModal({
          active: true,
          alertText: response.text
        });
      }

      setAiAnswers(prev => [
        ...prev, 
        { 
          sender: 'valerian', 
          text: response.text, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEmergency: response.isEmergencyAlert
        }
      ]);
    } catch (err) {
      setAiAnswers(prev => [
        ...prev, 
        { 
          sender: 'valerian', 
          text: language === 'BN'
            ? 'সার্ভারে সাময়িক সংযোগ বিচ্ছিন্ন। অনুগ্রহ করে ডাক্তারের প্রেসক্রিপশন অনুযায়ী সঠিক সময়ে ওষুধ সেবন করুন।'
            : "I'm having trouble connecting right now, but please take your medicines as Dr. Vance instructed on your prescription bottle!", 
          time: timeNow 
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  // AI Vitals Evaluation
  const handleEvaluateVitals = () => {
    const gluc = parseFloat(glucoseInput);
    const sys = parseInt(bpSystolic);
    const dia = parseInt(bpDiastolic);

    let msg = '';
    if (gluc >= 4.0 && gluc <= 7.0 && sys <= 130 && dia <= 85) {
      msg = language === 'BN'
        ? `✅ রক্তে গ্লুকোজ (${gluc} mmol/L) এবং রক্তচাপ (${sys}/${dia} mmHg) উভয়ই নিয়ন্ত্রণে রয়েছে। আপনার মেটফরমিন ও প্রেসার ওষুধের ডোজ নিখুঁত কাজ করছে।`
        : `✅ Fasting Glucose (${gluc} mmol/L) and Blood Pressure (${sys}/${dia} mmHg) are optimal! Your current anti-hypertensive and Metformin regimen is therapeutically controlled.`;
    } else if (gluc > 7.0) {
      msg = language === 'BN'
        ? `⚠️ গ্লুকোজ কিছুটা বেশি (${gluc} mmol/L)। দুপুর ও রাতের খাবারের পর হালকা হাঁটুন এবং চিনিযুক্ত পানীয় পরিহার করুন।`
        : `⚠️ Elevated glucose (${gluc} mmol/L). Ensure taking your Metformin with meals and limit high-glycemic carbohydrates today.`;
    } else {
      msg = language === 'BN'
        ? `ℹ️ আপনার রক্তচাপ (${sys}/${dia} mmHg)। ডাক্তারের পরামর্শ অনুযায়ী নিয়মিত লবণ কম গ্রহণ করুন।`
        : `ℹ️ BP recorded at ${sys}/${dia} mmHg. Stable, continue your morning medication schedule with plenty of hydration.`;
    }
    setVitalsAiAssessment(msg);
  };

  // Handle appointment submit
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookedDate) return;
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setAppointmentReason('');
      setBookedDate('');
    }, 4000);
  };

  // Speak AI Audio simulation
  const handlePlayAudio = (medName: string, text: string) => {
    if (audioPlaying === medName) {
      setAudioPlaying(null);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }
    setAudioPlaying(medName);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setAudioPlaying(null);
      utterance.onerror = () => setAudioPlaying(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setAudioPlaying(null), 3500);
    }
  };

  // Group medications by organ
  const medicinesByOrgan = medicines.reduce((acc, med) => {
    const organ = med.organName || 'General Health';
    if (!acc[organ]) acc[organ] = [];
    acc[organ].push(med);
    return acc;
  }, {} as Record<string, PrescribedMedicineItem[]>);

  // Quick prompt chips
  const quickPrompts = language === 'BN' ? [
    'মেটফরমিন কি ভরা পেটে খাব?',
    'একটি ডোজ ভুলে গেলে কি করব?',
    'আমার রক্তচাপ কি স্বাভাবিক?'
  ] : [
    'Can I take Metformin with morning coffee?',
    'What should I do if I missed my evening dose?',
    'Is my fasting glucose in the safe range?'
  ];

  // RENDER PATIENT CORE CONTENT (Reusable across Phone Frame and Kiosk View)
  const renderPatientCoreContent = () => {
    return (
      <div className="space-y-4">
        {/* ======================================================== */}
        {/* TAB 1: TODAY'S DOSES & MEDICATION SCHEDULE               */}
        {/* ======================================================== */}
        {activeTab === 'doses' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Adherence Streak & Progress Pill */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-current animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-black text-white text-xs">
                    <span>{currentStreakDays}-Day Adherence Streak!</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Top 5%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {takenDoses} of {totalDoses} doses taken today ({adherencePercent}%)
                  </p>
                </div>
              </div>

              {/* Progress Circle Ring */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 transition-all duration-500"
                    strokeDasharray={`${adherencePercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-white">{adherencePercent}%</span>
              </div>
            </div>

            {/* Pillbox 7-Day Quick Toggle */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                {language === 'BN' ? 'আজকের প্রেসক্রিপশন ডোজ' : "Today's Active Doses"}
              </span>
              <button
                onClick={() => setShowPillboxLoader(!showPillboxLoader)}
                className="text-[11px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 transition"
              >
                <Box className="w-3.5 h-3.5" />
                <span>{showPillboxLoader ? 'Hide 7-Day Box' : 'Weekly Pillbox'}</span>
              </button>
            </div>

            {/* 7-Day Pillbox Drawer */}
            {showPillboxLoader && (
              <div className="p-3 bg-slate-900/90 border border-teal-500/30 rounded-2xl space-y-2 animate-in fade-in duration-200">
                <div className="text-[11px] font-bold text-teal-300 flex items-center justify-between">
                  <span>Weekly Pill Sorting Guide</span>
                  <span className="text-[10px] text-slate-400">Sunday Prep</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                    <div key={i} className={`p-1.5 rounded-xl border ${i === 2 ? 'bg-teal-500/20 border-teal-500/40 text-teal-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                      <span className="font-bold block">{d}</span>
                      <span className="text-[8px] text-emerald-400 block mt-0.5">3 Pills</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medicine Items List */}
            <div className="space-y-3">
              {medicines.map((med, idx) => {
                const isTaken = med.takenToday;
                const isDueNow = idx === 0 && !isTaken;

                return (
                  <div
                    key={med.id}
                    className={`relative p-4 rounded-2xl border transition-all ${
                      isTaken 
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : isDueNow
                        ? 'bg-gradient-to-r from-teal-950/40 to-slate-900 border-teal-500/60 shadow-lg ring-1 ring-teal-500/30'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Status Top Tag */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{med.organIcon || '💊'}</span>
                        <span className="text-xs font-black text-white">{med.medicineName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 font-mono">
                          {med.dosage}
                        </span>
                      </div>

                      {isTaken ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Taken at {med.takenTime}</span>
                        </span>
                      ) : isDueNow ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>DUE NOW</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                          {med.timing}
                        </span>
                      )}
                    </div>

                    {/* Meal & Clinical Rationale Instruction */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      <strong className="text-teal-400">Instruction: </strong>
                      {med.foodRelation === 'before_food' ? 'Take 30 mins before meal with water' :
                       med.foodRelation === 'with_food' ? 'Take with food/meal' : 'Take after meal'}
                      {' — '}<span className="text-slate-400">{med.whyGivenForPatient}</span>
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      {!isTaken ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleMarkTaken(med.id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition active:scale-95"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Mark as Taken</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSnooze(med.id)}
                            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                            title="Snooze 30 minutes"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-between text-xs text-emerald-400 font-bold py-1">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            Dose verified &amp; logged to EHR
                          </span>
                          <span className="text-[10px] text-slate-500">Next: Tomorrow 08:00 AM</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handlePlayAudio(med.medicineName, `${med.medicineName}. ${med.whyGivenForPatient}. Take ${med.foodRelation === 'before_food' ? 'before meal' : 'after meal'}.`)}
                        className={`p-2 rounded-xl transition ${
                          audioPlaying === med.medicineName ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Listen to AI voice explanation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: VALERIAN AI CLINICAL COMPANION                    */}
        {/* ======================================================== */}
        {activeTab === 'ai_companion' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-teal-950/60 border border-teal-500/30 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-xs">
                <h4 className="font-extrabold text-white">Valerian AI Clinical Companion</h4>
                <p className="text-[11px] text-slate-400">Trained on your medicines, allergies &amp; blood tests</p>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {quickPrompts.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskValerian(undefined, chip)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 whitespace-nowrap font-medium transition"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Transcript */}
            <div className="h-[280px] overflow-y-auto space-y-2.5 p-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs">
              {aiAnswers.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed text-xs ${
                      msg.sender === 'patient'
                        ? 'bg-teal-600 text-white rounded-br-none shadow-md font-medium'
                        : msg.isEmergency
                        ? 'bg-rose-950/90 border border-rose-500 text-rose-200 rounded-bl-none font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-bold">
                      <span>{msg.sender === 'patient' ? 'You' : 'Valerian AI'}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isAsking && (
                <div className="flex items-center gap-2 text-xs text-teal-400 font-bold p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Valerian is analyzing your prescription &amp; labs...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleAskValerian} className="flex gap-2">
              <input
                type="text"
                value={patientQuestion}
                onChange={e => setPatientQuestion(e.target.value)}
                placeholder={language === 'BN' ? 'ওষুধ বা স্বাস্থ্য সম্পর্কিত প্রশ্ন লিখুন...' : 'Ask about your medicines, food timing...'}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
              <button
                type="submit"
                disabled={!patientQuestion.trim() || isAsking}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold transition shadow"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ADVOCATE-GPT PRESCRIPTION DECODER                 */}
        {/* ======================================================== */}
        {activeTab === 'explainer' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-teal-500/30 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>AdvocateGPT Plain-Language Prescription</span>
                </h4>
                <p className="text-[11px] text-slate-400">Translates complex medical Latin into simple English &amp; বাংলা</p>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                Gemini 2.5 Flash
              </span>
            </div>

            <div className="space-y-2.5">
              {medicines.map((med, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      {med.medicineName} ({med.dosage})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {med.timing}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 text-[11px]">
                    <p className="text-slate-300">
                      <strong>🎯 Primary Purpose: </strong>
                      {med.whyGivenForPatient}
                    </p>
                    <p className="text-amber-300">
                      <strong>🍽️ Meal Safety: </strong>
                      {med.foodRelation === 'before_food' ? 'Must be taken on an empty stomach or 30m before breakfast.' :
                       med.foodRelation === 'with_food' ? 'Always take halfway through your meal with water to avoid gastric irritation.' :
                       'Take within 15 minutes after food.'}
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      <strong>⚠️ Missed Dose: </strong>
                      Take as soon as you remember, but skip if it is almost time for your next scheduled dose. Never double up.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: DAILY VITALS & LAB REPORTS                        */}
        {/* ======================================================== */}
        {activeTab === 'vitals' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Quick Daily Glucose & BP Logger */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-white text-xs flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span>Log Home Vitals (Blood Sugar &amp; BP)</span>
                </span>
                <span className="text-[10px] text-teal-400 font-bold">Auto AI Evaluator</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Blood Sugar (mmol/L)</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="0.1"
                      value={glucoseInput}
                      onChange={e => setGlucoseInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-teal-400"
                    />
                    <select
                      value={glucoseType}
                      onChange={e => setGlucoseType(e.target.value as any)}
                      className="px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-[10px] text-slate-300"
                    >
                      <option value="Fasting">Fast</option>
                      <option value="2h Post-Meal">Post</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Blood Pressure (Sys / Dia)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={bpSystolic}
                      onChange={e => setBpSystolic(e.target.value)}
                      className="w-14 px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs text-center"
                    />
                    <span className="text-slate-500 font-bold">/</span>
                    <input
                      type="number"
                      value={bpDiastolic}
                      onChange={e => setBpDiastolic(e.target.value)}
                      className="w-14 px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs text-center"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleEvaluateVitals}
                className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evaluate with Gemini Health Engine</span>
              </button>

              {vitalsAiAssessment && (
                <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/40 text-teal-200 text-[11px] leading-relaxed animate-in fade-in">
                  {vitalsAiAssessment}
                </div>
              )}
            </div>

            {/* Longitudinal Hospital Lab Reports */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider block px-1">
                Hospital Diagnostic Reports ({patient.clinicLabReports.length})
              </span>

              {patient.clinicLabReports.map(rep => (
                <div key={rep.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{rep.title}</h4>
                      <p className="text-[10px] text-slate-400">{rep.date} • {rep.laboratoryName}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {rep.parameters.slice(0, 4).map((p, pIdx) => (
                      <div key={pIdx} className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{p.name}</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className={`font-mono font-bold ${p.flag === 'high' ? 'text-rose-400' : p.flag === 'low' ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {p.value}
                          </span>
                          <span className="text-[9px] text-slate-500">{p.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: OFFLINE MEDICAL QR PASS & HEALTH CARD             */}
        {/* ======================================================== */}
        {activeTab === 'pass' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Digital Health Identity Card */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/80 border border-teal-500/40 shadow-xl space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-black text-sm">
                    {patient.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">{patient.fullName}</h3>
                    <span className="font-mono text-[10px] text-slate-400">MRIN: {patient.mrin}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 block">
                    Blood: {patient.bloodGroup}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{patient.age}y • {patient.gender}</span>
                </div>
              </div>

              {/* Scannable SVG QR Code */}
              <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center space-y-2 shadow-inner">
                <QRCodeSVG
                  value={`VITALITY-HEALTH-PASS:${patient.mrin}:${patient.fullName}:${patient.bloodGroup}:${patient.knownDrugAllergies.join(',')}`}
                  size={140}
                  level="H"
                  includeMargin={false}
                />
                <span className="text-[10px] font-mono text-slate-700 font-bold uppercase tracking-wider">
                  Scan at Pharmacy / ER Triage
                </span>
              </div>

              {/* Allergies & Emergency Contacts */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-semibold">Known Drug Allergies:</span>
                  <span className="text-rose-400 font-bold">{patient.knownDrugAllergies.join(', ') || 'NKDA'}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-semibold">Emergency Relative:</span>
                  <span className="text-teal-300 font-bold">{patient.emergencyContact?.name || 'Primary Contact'} ({patient.emergencyContact?.phone || '+880 1700-000000'})</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Medical Health Pass for ${patient.fullName} exported to offline device wallet!`)}
                  className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Save to Offline Apple/Google Wallet</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <Plasma color="#14b8a6" speed={0.6} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        
        {/* Top Control Bar: Device Mode Switcher, Language & Emergency */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-card-dark border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center">
              <Pill className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white">Vitality Patient Health Pocket</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  PWA Mobile-First
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Patient: <strong className="text-white">{patient.fullName}</strong> • MRIN: <span className="font-mono text-teal-300">{patient.mrin}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Device Mode Toggle: Phone vs Kiosk */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDeviceMode('phone')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  deviceMode === 'phone'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View in Smartphone PWA Simulator"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile App</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceMode('kiosk')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  deviceMode === 'kiosk'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View in Wide Kiosk Mode"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Kiosk Mode</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('EN')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  language === 'EN' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('BN')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  language === 'BN' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                বাং
              </button>
            </div>

            {/* SOS Emergency Button */}
            <button
              type="button"
              onClick={() => setShowEmergencySuite(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-900/40 transition active:scale-95"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>{language === 'BN' ? 'জরুরী ৯৯৯' : '🚨 SOS (999)'}</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LAYOUT CHOICE A: SMARTPHONE PWA SIMULATOR (IPHONE 16 PRO)*/}
        {/* ======================================================== */}
        {deviceMode === 'phone' ? (
          <div className="flex justify-center py-4">
            {/* Outer Titanium Phone Bezel */}
            <div className="relative w-full max-w-[400px] h-[820px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-[6px] border-slate-800 ring-1 ring-white/10 flex flex-col overflow-hidden">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-28 h-7 bg-black rounded-full flex items-center justify-between px-3 border border-white/10 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-teal-400">Pill due</span>
              </div>

              {/* Mobile Status Bar */}
              <div className="px-4 pt-3 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-300 select-none z-30">
                <span>09:41</span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="text-[10px]">5G</span>
                  <Zap className="w-3 h-3 text-amber-400 fill-current" />
                  <span className="text-[10px] font-mono text-emerald-400">94%</span>
                </div>
              </div>

              {/* Scrollable Mobile App Body */}
              <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 no-scrollbar">
                {renderPatientCoreContent()}
              </div>

              {/* Bottom Mobile Tab Bar (Thumb-Docked Ergonomics) */}
              <div className="pt-2 pb-1 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-lg flex items-center justify-around text-[10px] font-bold z-30">
                <button
                  type="button"
                  onClick={() => setActiveTab('doses')}
                  className={`flex flex-col items-center gap-1 transition ${
                    activeTab === 'doses' ? 'text-teal-400 scale-105' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Pill className="w-4 h-4" />
                  <span>Doses</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ai_companion')}
                  className={`flex flex-col items-center gap-1 transition ${
                    activeTab === 'ai_companion' ? 'text-teal-400 scale-105' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Valerian</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('explainer')}
                  className={`flex flex-col items-center gap-1 transition ${
                    activeTab === 'explainer' ? 'text-teal-400 scale-105' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Advocate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('vitals')}
                  className={`flex flex-col items-center gap-1 transition ${
                    activeTab === 'vitals' ? 'text-teal-400 scale-105' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Vitals</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pass')}
                  className={`flex flex-col items-center gap-1 transition ${
                    activeTab === 'pass' ? 'text-teal-400 scale-105' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Pass</span>
                </button>
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="w-28 h-1 bg-white/30 rounded-full mx-auto my-1" />
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* LAYOUT CHOICE B: FULL CLINIC KIOSK / EXPANDED DASHBOARD  */
          /* ======================================================== */
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            {/* Top Navigation Tabs for Kiosk */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-4 border-b border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('doses')}
                className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'doses' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Pill className="w-4 h-4" />
                <span>Today's Doses</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ai_companion')}
                className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'ai_companion' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Valerian AI Companion</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('explainer')}
                className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'explainer' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>AdvocateGPT Rx Decoder</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vitals')}
                className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'vitals' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Home Vitals &amp; Labs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pass')}
                className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'pass' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Digital QR Pass</span>
              </button>
            </div>

            {/* Core Kiosk Content Area */}
            <div className="max-w-4xl mx-auto">
              {renderPatientCoreContent()}
            </div>
          </div>
        )}

      </div>

      {/* Emergency First Aid Suite Overlay */}
      {showEmergencySuite && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-8">
            <EmergencyFirstAidSuite 
              patient={patient} 
              onClose={() => setShowEmergencySuite(false)} 
              language={language} 
            />
          </div>
        </div>
      )}

      {/* Critical Red Flag Modal */}
      {criticalEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-rose-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center mx-auto animate-pulse">
              <AlertOctagon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-white">Clinical Red Flag Detected!</h3>
            <p className="text-xs text-rose-200 leading-relaxed font-semibold">
              {criticalEmergencyModal.alertText}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowEmergencySuite(true)}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg animate-pulse"
              >
                Launch Emergency SOS
              </button>
              <button
                onClick={() => setCriticalEmergencyModal(null)}
                className="px-4 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
