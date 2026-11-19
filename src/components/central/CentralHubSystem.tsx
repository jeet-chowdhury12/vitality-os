import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Phone, Mail, Shield, Heart, 
  Calendar, Clock, AlertTriangle, Save, Check, Search, 
  ArrowRight, FileText, CheckCircle2, Droplet, Sparkles,
  Building, UserPlus, RefreshCw, Key
} from 'lucide-react';
import { PatientRecord } from '../../data/patientsDatabase';
import { LabOrderItem, HospitalBed, AuditLogItem } from '../../data/hospitalStore';
import ShapeGrid from '../reactbits/ShapeGrid';

interface CentralHubSystemProps {
  patients: PatientRecord[];
  labOrders: LabOrderItem[];
  beds: HospitalBed[];
  auditLogs: AuditLogItem[];
  onNavigateToLaunchpad: () => void;
  onUpdatePatient?: (updated: PatientRecord) => void;
}

export function CentralHubSystem({
  patients,
  labOrders,
  beds,
  auditLogs,
  onNavigateToLaunchpad,
  onUpdatePatient
}: CentralHubSystemProps) {
  const [selectedPatientMrin, setSelectedPatientMrin] = useState(patients[0]?.mrin || '');
  const [patientSearch, setPatientSearch] = useState('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const activePatient = patients.find(p => p.mrin === selectedPatientMrin) || patients[0];

  // Editable Form Fields
  const [fullName, setFullName] = useState(activePatient?.fullName || '');
  const [phone, setPhone] = useState(activePatient?.phone || '');
  const [email, setEmail] = useState(activePatient?.email || '');
  const [age, setAge] = useState(activePatient?.age || 45);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(activePatient?.gender || 'Male');
  const [bloodGroup, setBloodGroup] = useState(activePatient?.bloodGroup || 'O+');
  const [emergencyName, setEmergencyName] = useState(activePatient?.emergencyContact?.name || '');
  const [emergencyRelation, setEmergencyRelation] = useState(activePatient?.emergencyContact?.relation || '');
  const [emergencyPhone, setEmergencyPhone] = useState(activePatient?.emergencyContact?.phone || '');
  const [chiefComplaints, setChiefComplaints] = useState(activePatient?.chiefComplaints?.join(', ') || '');
  const [knownAllergies, setKnownAllergies] = useState(activePatient?.knownDrugAllergies?.join(', ') || '');
  const [pastHistory, setPastHistory] = useState(activePatient?.pastMedicalHistory?.join(', ') || '');
  const [bloodPressure, setBloodPressure] = useState(activePatient?.vitals?.bloodPressure || '120/80');
  const [heartRate, setHeartRate] = useState(activePatient?.vitals?.heartRate || 75);
  const [spO2, setSpO2] = useState(activePatient?.vitals?.spO2 || 98);
  const [bmi, setBmi] = useState(activePatient?.vitals?.bmi || 24.2);

  // Sync form when active patient changes
  useEffect(() => {
    if (activePatient) {
      setFullName(activePatient.fullName);
      setPhone(activePatient.phone);
      setEmail(activePatient.email || '');
      setAge(activePatient.age);
      setGender(activePatient.gender);
      setBloodGroup(activePatient.bloodGroup || 'O+');
      setEmergencyName(activePatient.emergencyContact?.name || '');
      setEmergencyRelation(activePatient.emergencyContact?.relation || '');
      setEmergencyPhone(activePatient.emergencyContact?.phone || '');
      setChiefComplaints(activePatient.chiefComplaints?.join(', ') || '');
      setKnownAllergies(activePatient.knownDrugAllergies?.join(', ') || '');
      setPastHistory(activePatient.pastMedicalHistory?.join(', ') || '');
      setBloodPressure(activePatient.vitals?.bloodPressure || '120/80');
      setHeartRate(activePatient.vitals?.heartRate || 75);
      setSpO2(activePatient.vitals?.spO2 || 98);
      setBmi(activePatient.vitals?.bmi || 24.2);
    }
  }, [activePatient]);

  // Filtered patients for selector
  const filteredPatients = patients.filter(p => {
    const q = patientSearch.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.mrin.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  });

  const handleSavePatientDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    const updatedPatient: PatientRecord = {
      ...activePatient,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      age: Number(age),
      gender,
      bloodGroup,
      emergencyContact: {
        name: emergencyName.trim(),
        relation: emergencyRelation.trim(),
        phone: emergencyPhone.trim()
      },
      chiefComplaints: chiefComplaints.split(',').map(s => s.trim()).filter(Boolean),
      knownDrugAllergies: knownAllergies.split(',').map(s => s.trim()).filter(Boolean),
      pastMedicalHistory: pastHistory.split(',').map(s => s.trim()).filter(Boolean),
      vitals: {
        ...activePatient.vitals,
        bloodPressure: bloodPressure.trim(),
        heartRate: Number(heartRate),
        spO2: Number(spO2),
        bmi: Number(bmi)
      }
    };

    if (onUpdatePatient) {
      onUpdatePatient(updatedPatient);
    }

    setSaveSuccessMessage(`✓ Patient ${updatedPatient.fullName} (${updatedPatient.mrin}) Master Records Synchronized across all 9 hospital portals!`);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8 pb-24 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      {/* Background React Bits: ShapeGrid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <ShapeGrid shape="square" speed={0.3} lineColor="#1e293b" hoverColor="#14b8a6" />
      </div>
      <div className="relative z-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-teal-500/20 to-sky-500/20 border border-teal-500/40 rounded-2xl text-teal-400 shadow-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase">
                Hub 8 • Enterprise Central Registry
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Patient Master Records
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Central repository for patient demographics, phone numbers, emergency contacts, blood groups, and baseline clinical profiles with real-time bidirectional synchronization across Reception, Triage, Doctor Chambers, Lab, and Pharmacy.
          </p>
        </div>

        <button
          onClick={onNavigateToLaunchpad}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-teal-300 font-bold text-xs flex items-center gap-2 self-start md:self-auto transition"
        >
          <span>Launchpad Overview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-xl shadow-emerald-950/40">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Main Grid: Patient Selector (Left) + Comprehensive Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Patient Search & Directory Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-teal-400" />
                <span>Select Patient to Edit ({patients.length})</span>
              </h3>
            </div>

            {/* Live Filter Search Input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={patientSearch}
                onChange={e => setPatientSearch(e.target.value)}
                placeholder="Search by name, phone, or MRIN..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>

            {/* Patient Select List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredPatients.map(p => {
                const isSelected = p.mrin === selectedPatientMrin;
                return (
                  <div
                    key={p.mrin}
                    onClick={() => setSelectedPatientMrin(p.mrin)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-950/60 border-teal-500 shadow-lg ring-1 ring-teal-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-extrabold text-xs text-white flex items-center gap-2">
                          <span>{p.fullName}</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            {p.bloodGroup || 'O+'}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-teal-400 mt-0.5">{p.mrin}</div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">{p.age}y / {p.gender}</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{p.phone}</span>
                      </span>
                      <span className="truncate max-w-[130px] text-slate-500 font-medium">
                        {p.chiefComplaints?.[0] || 'Routine Checkup'}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredPatients.length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No registered patients matching &quot;{patientSearch}&quot;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Full Master Demographics Form (8 cols) */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSavePatientDetails} className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
            
            {/* Header info strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-teal-400">Master Record Dossier</span>
                <h2 className="text-xl font-black text-white">{activePatient?.fullName}</h2>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  Universal Health MRIN: <strong className="text-teal-300">{activePatient?.mrin}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all self-start sm:self-auto"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes &amp; Sync Portals</span>
              </button>
            </div>

            {/* Section 1: Demographics & Primary Identity */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>1. Core Demographics &amp; Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">Full Patient Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-bold transition"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">Phone Number (Mobile)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-mono transition"
                      required
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 transition"
                      placeholder="patient@example.com"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">Age (Years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    min={1}
                    max={120}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-bold transition"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-bold transition"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 outline-none focus:border-teal-500 font-black transition"
                  >
                    <option value="A+">A+ (A Rh-Positive)</option>
                    <option value="A-">A- (A Rh-Negative)</option>
                    <option value="B+">B+ (B Rh-Positive)</option>
                    <option value="B-">B- (B Rh-Negative)</option>
                    <option value="AB+">AB+ (AB Rh-Positive)</option>
                    <option value="AB-">AB- (AB Rh-Negative)</option>
                    <option value="O+">O+ (O Rh-Positive)</option>
                    <option value="O-">O- (O Rh-Negative)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Emergency Contact Information */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>2. Emergency Kin Contact</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">Contact Name</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 transition"
                    placeholder="e.g. Farhana Sultana"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">Relationship</label>
                  <input
                    type="text"
                    value={emergencyRelation}
                    onChange={e => setEmergencyRelation(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 transition"
                    placeholder="e.g. Spouse, Brother, Mother"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">Emergency Mobile</label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-mono transition"
                    placeholder="+880 1711-000000"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Baseline Clinical Profile & Allergies */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>3. Baseline Clinical History &amp; Documented Allergies</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1.5">
                    Chief Complaints &amp; Onset Symptoms (Separate by commas)
                  </label>
                  <input
                    type="text"
                    value={chiefComplaints}
                    onChange={e => setChiefComplaints(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 transition font-medium"
                    placeholder="e.g. Retrosternal chest pressure, morning vertigo, palpitations"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-rose-300 block mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Documented Drug Allergies</span>
                    </label>
                    <input
                      type="text"
                      value={knownAllergies}
                      onChange={e => setKnownAllergies(e.target.value)}
                      className="w-full p-3 bg-slate-950 border border-rose-950/60 focus:border-rose-500 rounded-xl text-rose-200 outline-none transition font-semibold"
                      placeholder="e.g. Penicillin, Aspirin, Sulfa drugs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1.5">
                      Past Medical / Chronic History
                    </label>
                    <input
                      type="text"
                      value={pastHistory}
                      onChange={e => setPastHistory(e.target.value)}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 transition"
                      placeholder="e.g. Hypertension (5 yrs), Type 2 DM, Dyslipidemia"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Baseline Vitals Snapshot */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-400" />
                <span>4. Baseline Vitals Profile</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={e => setBloodPressure(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={e => setHeartRate(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={spO2}
                    onChange={e => setSpO2(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">BMI Index</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bmi}
                    onChange={e => setBmi(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                All edits immediately persist to local browser storage and broadcast to Doctor, Lab, Pharmacy, and Triage.
              </span>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-teal-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Patient Master Details</span>
              </button>
            </div>

          </form>
        </div>

      </div>
      </div>
    </div>
  );
}
