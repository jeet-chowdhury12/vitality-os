import React, { useState } from 'react';
import { 
  Heart, Pill, ShieldCheck, Languages, AlertOctagon, 
  PhoneCall, Clock, CheckCircle2, FileText, Sparkles, 
  Send, User, Droplet, ArrowRight, Activity, Calendar
} from 'lucide-react';
import { INITIAL_PATIENTS, PatientRecord } from '../../src/data/patientsDatabase';
import { askValerianPatientCompanion } from '../../src/services/valerianAI';
import { EmergencyFirstAidSuite } from '../../src/components/emergency/EmergencyFirstAidSuite';
import confetti from 'canvas-confetti';

export function PatientApp() {
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [selectedMrin, setSelectedMrin] = useState<string>(INITIAL_PATIENTS[0].mrin);
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'labs' | 'valerian_chat' | 'emergency'>('prescriptions');
  const [showEmergencySuite, setShowEmergencySuite] = useState(false);

  const activePatient = patients.find(p => p.mrin === selectedMrin) || patients[0];

  // Valerian AI chat
  const [chatInput, setChatInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: 'patient' | 'valerian'; text: string; time: string }[]>([
    {
      sender: 'valerian',
      text: `Hello ${activePatient.fullName}! I am Valerian AI, your personal clinical companion. You can ask me anytime when to take your medicines with food, what your lab numbers mean, or how to avoid missed doses!`,
      time: 'Just now'
    }
  ]);

  const handleMarkTaken = (medId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.mrin === activePatient.mrin) {
        return {
          ...p,
          activePrescription: {
            ...p.activePrescription,
            medicines: p.activePrescription.medicines.map(m => {
              if (m.id === medId) {
                return {
                  ...m,
                  takenToday: true,
                  takenTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
              }
              return m;
            })
          }
        };
      }
      return p;
    }));

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleAskValerian = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAsking) return;

    const questionText = chatInput;
    setChatInput('');
    setChatHistory(prev => [
      ...prev,
      { sender: 'patient', text: questionText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    setIsAsking(true);
    try {
      const response = await askValerianPatientCompanion(questionText, activePatient, language);
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'valerian',
          text: response.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'valerian',
          text: language === 'BN' 
            ? 'ওষুধ গ্রহণের সময় নির্দেশিকা অনুযায়ী সঠিকভাবে মেনে চলুন এবং পর্যাপ্ত পানি পান করুন।'
            : 'Please adhere to your doctor-prescribed schedule with water. If you experience discomfort, notify your doctor.',
          time: 'Just now'
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9F8] text-slate-800 font-sans pb-16">
      {/* Top Patient Header Bar */}
      <header className="bg-gradient-to-r from-[#176B65] via-[#125550] to-[#0c3e3a] text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Pill className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight">Vitality Patient Portal</h1>
              <p className="text-[11px] text-teal-200">Dhaka Central Medical College &amp; Hospital</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(l => l === 'EN' ? 'BN' : 'EN')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Languages className="w-3.5 h-3.5 text-teal-300" />
              <span>{language === 'EN' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setShowEmergencySuite(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md animate-pulse"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS (999)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Patient Profile Card & Patient Switcher */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#176B65]/10 text-[#176B65] font-black text-base flex items-center justify-center border border-[#176B65]/20">
              {activePatient.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">{activePatient.fullName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-[#176B65]">
                  {activePatient.bloodGroup}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                MRIN: <span className="font-mono font-bold text-slate-700">{activePatient.mrin}</span> • {activePatient.age}y / {activePatient.gender} • Mobile: {activePatient.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Switch Patient:</span>
            <select
              value={selectedMrin}
              onChange={e => setSelectedMrin(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#176B65]"
            >
              {patients.map(p => (
                <option key={p.mrin} value={p.mrin}>
                  {p.fullName} ({p.mrin})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'prescriptions'
                ? 'bg-[#176B65] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>{language === 'BN' ? 'দৈনিক ওষুধ ও প্রেসক্রিপশন' : 'Daily Medicines & Schedule'}</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'labs'
                ? 'bg-[#176B65] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'BN' ? 'ল্যাব রিপোর্ট ও টেস্ট' : 'Hospital Lab Reports'}</span>
            {activePatient.clinicLabReports && activePatient.clinicLabReports.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal-200 text-teal-900 font-bold">
                {activePatient.clinicLabReports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('valerian_chat')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'valerian_chat'
                ? 'bg-[#176B65] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Valerian AI Companion</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <main className="max-w-5xl mx-auto px-4 mt-4">
        {/* TAB 1: PRESCRIPTIONS */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs text-teal-900">
              <span className="font-bold">
                {language === 'BN' 
                  ? '⚠️ সতর্কতা: কখনও ওষুধের ডাবল ডোজ (Double-Dose) গ্রহণ করবেন না।'
                  : '⚠️ Anti-Overdose Rule: Never double-dose if you missed your morning pill.'}
              </span>
              <span className="text-[11px] font-mono font-bold text-teal-700">Adherence Locked</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePatient.activePrescription.medicines.map(med => (
                <div 
                  key={med.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    med.takenToday 
                      ? 'bg-emerald-50/60 border-emerald-300' 
                      : 'bg-white border-slate-200 shadow-sm hover:border-[#176B65]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {med.organCategory} Care
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-1">{med.medicineName}</h3>
                      <p className="text-xs text-slate-500 font-medium">{med.genericName} • {med.dosage}</p>
                    </div>

                    {med.takenToday ? (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Taken at {med.takenTime}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkTaken(med.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#176B65] hover:bg-[#125550] text-white text-xs font-bold shadow-sm transition"
                      >
                        Mark as Taken
                      </button>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Timing</span>
                      <span className="font-bold text-slate-700">{med.timing}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Meal Instructions</span>
                      <span className="font-bold text-slate-700">{med.foodRelation}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100">
                    <strong className="text-slate-700">Clinical Purpose: </strong>
                    {med.whyGivenForPatient}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LAB REPORTS */}
        {activeTab === 'labs' && (
          <div className="space-y-4">
            {activePatient.clinicLabReports && activePatient.clinicLabReports.length > 0 ? (
              activePatient.clinicLabReports.map(report => (
                <div key={report.id} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        Official Verified Diagnostic Report
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-1">{report.title}</h3>
                      <p className="text-xs text-slate-500">{report.laboratoryName} • Date: {report.performedDate}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold">
                      ✓ Validated
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong>Laboratory Clinical Note: </strong>{report.summaryNote}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-xs font-extrabold text-slate-700">Parameters:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {report.parameters.map((p, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-800">{p.name}</div>
                            <div className="text-[10px] text-slate-500">Ref: {p.referenceRange}</div>
                          </div>
                          <div className="text-right">
                            <span className={`font-mono font-black text-sm ${p.status.includes('critical') ? 'text-rose-600' : 'text-slate-900'}`}>
                              {p.value} {p.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-sm">No Diagnostic Lab Reports Yet</p>
                <p className="text-xs mt-1">When your doctor orders a test and the hospital lab verifies results, your report will appear here automatically.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VALERIAN AI COMPANION */}
        {activeTab === 'valerian_chat' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 bg-gradient-to-r from-teal-900 to-[#125550] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-teal-300" />
                <div>
                  <h3 className="font-bold text-sm">Valerian AI Clinical Explainer</h3>
                  <p className="text-[11px] text-teal-200">Powered by Gemini 2.5 Flash • Contextual to your active medicines</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono text-teal-200">
                Live Companion
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {chatHistory.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'patient'
                        ? 'bg-[#176B65] text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`block text-[9px] mt-1 ${msg.sender === 'patient' ? 'text-teal-200 text-right' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {isAsking && (
                <div className="flex justify-start">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                    <span>Valerian AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleAskValerian} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={language === 'BN' ? 'আপনার ওষুধ বা রিপোর্ট নিয়ে প্রশ্ন লিখুন...' : 'Ask about your medicines, breakfast timing, or missed dose...'}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#176B65]"
              />
              <button
                type="submit"
                disabled={isAsking || !chatInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#176B65] hover:bg-[#125550] text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Emergency First Aid & CPR Modal */}
      <EmergencyFirstAidSuite
        isOpen={showEmergencySuite}
        onClose={() => setShowEmergencySuite(false)}
        patientName={activePatient.fullName}
        emergencyContacts={[
          { label: 'Emergency Hotline', phone: '999' },
          { label: 'Hospital Emergency Bay', phone: '+880-2-8901234' },
          { label: 'Primary Doctor', phone: '+880-1711-000000' }
        ]}
      />
    </div>
  );
}
