import React, { useState } from 'react';
import { 
  UserPlus, Ticket, CreditCard, Clock, Calendar, 
  Search, CheckCircle2, User, Phone, Shield, ArrowRight,
  Printer, DollarSign, Building2, AlertCircle, QrCode,
  Ambulance, FileText, BadgePercent, AlertTriangle, Key,
  Sparkles, Check, Activity, Bed, ChevronRight, Stethoscope,
  Edit2, Trash2, ShieldCheck, Mail, Send
} from 'lucide-react';
import { PatientRecord } from '../../data/patientsDatabase';
import { 
  TriageDossier, VisitorGatePass, CashierDepositSlip, 
  DoctorDutySchedule, INITIAL_VISITOR_PASSES, 
  INITIAL_CASHIER_DEPOSITS, INITIAL_DOCTOR_SCHEDULES 
} from '../../data/hospitalStore';
import { printThermalSlip, printDepositVoucher } from '../../utils/printUtils';
import { HospitalPaymentModal, PaymentItem } from '../common/HospitalPaymentModal';

interface ReceptionistPortalProps {
  patients: PatientRecord[];
  onRegisterPatient: (newPatient: PatientRecord, initialDossier: TriageDossier) => void;
  onNavigateToAssistant: () => void;
  onUpdatePatient?: (updated: PatientRecord) => void;
  onDeletePatient?: (mrin: string) => void;
}

export function ReceptionistPortal({
  patients,
  onRegisterPatient,
  onNavigateToAssistant,
  onUpdatePatient,
  onDeletePatient
}: ReceptionistPortalProps) {
  // Navigation tabs within Receptionist Desk
  const [activeTab, setActiveTab] = useState<'registration' | 'cashier' | 'visitors' | 'doctors' | 'emergency'>('registration');

  // Wizard 1 registration form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [patientTariffCategory, setPatientTariffCategory] = useState<'General OPD' | 'Senior Citizen (20% Off)' | 'SSK Govt Scheme' | 'Corporate Partner'>('General OPD');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Card'>('bKash');
  const [consultationFee, setConsultationFee] = useState(1200);

  // Success state for newly registered token
  const [issuedToken, setIssuedToken] = useState<{
    mrin: string;
    token: string;
    name: string;
    phone: string;
    age: number;
    gender: string;
    bloodGroup: string;
    tariffScheme: string;
    paymentMethod: string;
    fee: number;
    time: string;
    date: string;
  } | null>(null);

  // Search filter for existing patients (character-by-character)
  const [searchQuery, setSearchQuery] = useState('');

  // Cashier & Deposits State
  const [deposits, setDeposits] = useState<CashierDepositSlip[]>(INITIAL_CASHIER_DEPOSITS);
  const [depositMrin, setDepositMrin] = useState(patients[0]?.mrin || 'HS-2026-00421');
  const [depositAmount, setDepositAmount] = useState('15000');
  const [depositPurpose, setDepositPurpose] = useState<CashierDepositSlip['purpose']>('IPD Admission Advance');
  const [depositPaymentMode, setDepositPaymentMode] = useState<CashierDepositSlip['paymentMode']>('bKash');
  const [depositSuccessReceipt, setDepositSuccessReceipt] = useState<CashierDepositSlip | null>(null);

  // Visitor Passes State
  const [visitorPasses, setVisitorPasses] = useState<VisitorGatePass[]>(INITIAL_VISITOR_PASSES);
  const [newVisitorName, setNewVisitorName] = useState('');
  const [newVisitorPhone, setNewVisitorPhone] = useState('');
  const [visitorPatientMrin, setVisitorPatientMrin] = useState(patients[0]?.mrin || 'HS-2026-00421');
  const [visitorWard, setVisitorWard] = useState('General Ward (Male)');
  const [visitorBed, setVisitorBed] = useState('GWM-101');
  const [visitorPassType, setVisitorPassType] = useState<VisitorGatePass['passType']>('Standard Day Visitor');
  const [newVisitorBadge, setNewVisitorBadge] = useState<VisitorGatePass | null>(null);

  // Doctor Duty Schedules
  const [doctorSchedules] = useState<DoctorDutySchedule[]>(INITIAL_DOCTOR_SCHEDULES);

  // Ambulance Bay Emergency Inflow State
  const [ambulancePatientName, setAmbulancePatientName] = useState('');
  const [ambulanceCondition, setAmbulanceCondition] = useState<'Acute STEMI' | 'Acute Ischemic Stroke' | 'Major Polytrauma' | 'Severe Septic Shock'>('Acute STEMI');
  const [ambulanceBayAllocated, setAmbulanceBayAllocated] = useState('Trauma Bay 01 (Red Alert)');

  // Patient Edit & Delete & Payment State
  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(null);
  const [deleteConfirmMrin, setDeleteConfirmMrin] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentTargetPatient, setPaymentTargetPatient] = useState<PatientRecord | null>(null);
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>([]);

  const handleOpenEditModal = (patient: PatientRecord) => {
    setEditingPatient({ ...patient });
  };

  const handleSaveEditPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient && onUpdatePatient) {
      onUpdatePatient(editingPatient);
      setEditingPatient(null);
    }
  };

  const handleDeletePatientConfirm = (mrin: string) => {
    if (onDeletePatient) {
      onDeletePatient(mrin);
      setDeleteConfirmMrin(null);
    }
  };

  const handleOpenPayment = (patient: PatientRecord, fee: number = 1200) => {
    setPaymentTargetPatient(patient);
    setPaymentItems([
      {
        id: `fee-${Date.now()}`,
        description: 'OPD Specialist Consultation Fee & Registration',
        department: 'Outpatient Department (OPD)',
        amountBDT: fee
      }
    ]);
    setPaymentModalOpen(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !age) {
      alert('Please fill out patient name, phone number, and age.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newMrin = `HS-2026-${randomSuffix}`;
    const tokenNumber = `TK-${Math.floor(100 + Math.random() * 899)}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    let finalFee = consultationFee;
    if (patientTariffCategory === 'Senior Citizen (20% Off)') finalFee = Math.round(consultationFee * 0.8);
    if (patientTariffCategory === 'SSK Govt Scheme') finalFee = 0;

    const newPatient: PatientRecord = {
      mrin: newMrin,
      fullName,
      age: parseInt(age, 10),
      gender,
      bloodGroup,
      phone,
      email: `${fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      emergencyContact: {
        name: 'Family Member',
        relation: 'Primary Contact',
        phone: '01711-000000'
      },
      appointmentDate: new Date().toISOString().slice(0, 10),
      appointmentTime: currentTime,
      isToday: true,
      vitals: {
        bloodPressure: '120/80 mmHg',
        heartRate: 72,
        spO2: 99,
        bmi: 23.5,
        temperature: '98.6 F'
      },
      chiefComplaints: ['Initial OPD Registration - Awaiting Triage Assessment'],
      pastMedicalHistory: ['Baseline assessment on file'],
      knownDrugAllergies: ['None documented'],
      clinicLabReports: [],
      activePrescription: {
        prescriptionId: `RX-${Date.now().toString().slice(-5)}`,
        prescribedDate: new Date().toISOString().slice(0, 10),
        doctorName: 'Pending Triage Allocation',
        licenseNumber: 'BMDC-REG-A48291',
        clinicName: 'Vitality-OS Smart Hospital',
        diagnosis: 'Consultation Pending',
        medicines: [],
        clinicalAdvice: ['Awaiting physician consultation']
      },
      orderedDiagnosticTests: []
    };

    const initialDossier: TriageDossier = {
      id: `tr-${Date.now()}`,
      patientMrin: newMrin,
      patientName: fullName,
      age: parseInt(age, 10),
      gender,
      tokenNumber,
      chiefComplaints: 'New OPD Registration - Dispatched to Assistant for vitals & symptom logging.',
      symptoms: ['Registration Complete'],
      vitals: {
        bloodPressureSys: 120,
        bloodPressureDia: 80,
        pulseRate: 72,
        respiratoryRate: 16,
        temperatureF: 98.6,
        spo2: 99,
        weightKg: 65,
        heightCm: 170,
        bmi: 22.5,
        recordedAt: currentTime
      },
      aiRecommendedSpecialty: 'General Medicine / Pending Triage',
      aiSpecialistReason: 'Initial patient intake registered at reception counter.',
      assignedDoctorName: 'To be assigned after Anteroom vitals triage',
      intakeTimestamp: currentTime,
      status: 'waiting_triage'
    };

    onRegisterPatient(newPatient, initialDossier);

    setIssuedToken({
      mrin: newMrin,
      token: tokenNumber,
      name: fullName,
      phone,
      age: parseInt(age, 10),
      gender,
      bloodGroup,
      tariffScheme: patientTariffCategory,
      paymentMethod,
      fee: finalFee,
      time: currentTime,
      date: currentDate
    });

    // Reset form fields
    setFullName('');
    setPhone('');
    setNationalId('');
    setAge('');
  };

  // Cashier Advance Deposit handler
  const handleCreateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPatient = patients.find(p => p.mrin === depositMrin) || patients[0];
    const newReceipt: CashierDepositSlip = {
      receiptNo: `CSH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientMrin: targetPatient.mrin,
      patientName: targetPatient.fullName,
      amountBDT: parseFloat(depositAmount) || 5000,
      purpose: depositPurpose,
      paymentMode: depositPaymentMode,
      cashierStaff: 'Shamim Ahmed (Cashier Desk 1)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      balanceDueBDT: 0
    };
    setDeposits(prev => [newReceipt, ...prev]);
    setDepositSuccessReceipt(newReceipt);
  };

  // Visitor Gate Pass Generator handler
  const handleIssueVisitorPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitorName || !newVisitorPhone) {
      alert('Please fill out visitor name and phone number.');
      return;
    }
    const targetPatient = patients.find(p => p.mrin === visitorPatientMrin) || patients[0];
    const newPass: VisitorGatePass = {
      id: `VP-${Math.floor(1000 + Math.random() * 9000)}`,
      visitorName: newVisitorName,
      visitorPhone: newVisitorPhone,
      patientMrin: targetPatient.mrin,
      patientName: targetPatient.fullName,
      ward: visitorWard,
      bedNumber: visitorBed,
      passType: visitorPassType,
      validUntil: visitorPassType === 'Standard Day Visitor' ? '08:00 PM Today' : 'Tomorrow 10:00 AM',
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active'
    };
    setVisitorPasses(prev => [newPass, ...prev]);
    setNewVisitorBadge(newPass);
    setNewVisitorName('');
    setNewVisitorPhone('');
  };

  // Emergency Inflow Registration handler
  const handleAmbulanceIntake = (e: React.FormEvent) => {
    e.preventDefault();
    const emergencyName = ambulancePatientName || 'Unknown Trauma Patient (Code Red)';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newMrin = `HS-EMERG-${randomSuffix}`;
    const tokenNumber = `EMG-${Math.floor(10 + Math.random() * 89)}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const emergencyPatient: PatientRecord = {
      mrin: newMrin,
      fullName: emergencyName,
      age: 45,
      gender: 'Male',
      bloodGroup: 'O+',
      phone: 'Ambulance Unit +880 1900-000000',
      email: 'emergency@vitality.health',
      emergencyContact: {
        name: 'EMS Paramedic',
        relation: 'First Responder',
        phone: '16263'
      },
      appointmentDate: new Date().toISOString().slice(0, 10),
      appointmentTime: currentTime,
      isToday: true,
      vitals: {
        bloodPressure: '85/55 mmHg',
        heartRate: 128,
        spO2: 91,
        bmi: 24.0,
        temperature: '97.8 F'
      },
      chiefComplaints: [`CODE RED EMERGENCY: ${ambulanceCondition} - Incoming Ambulance`],
      pastMedicalHistory: ['STAT Trauma Evaluation'],
      knownDrugAllergies: ['Pending Resuscitation'],
      clinicLabReports: [],
      activePrescription: {
        prescriptionId: `RX-EMG-${Date.now().toString().slice(-4)}`,
        prescribedDate: new Date().toISOString().slice(0, 10),
        doctorName: 'Emergency Trauma Consultant',
        licenseNumber: 'BMDC-EMG-01',
        clinicName: 'Vitality Emergency Bay',
        diagnosis: ambulanceCondition,
        medicines: [],
        clinicalAdvice: ['STAT IV Access', 'Oxygen Titration', 'Notify Cath Lab / OT']
      },
      orderedDiagnosticTests: []
    };

    const emergencyDossier: TriageDossier = {
      id: `tr-emg-${Date.now()}`,
      patientMrin: newMrin,
      patientName: emergencyName,
      age: 45,
      gender: 'Male',
      tokenNumber,
      chiefComplaints: `CRITICAL INCOMING AMBULANCE: ${ambulanceCondition} -> Allocated to ${ambulanceBayAllocated}`,
      symptoms: ['Altered Sensorium', 'Tachycardia', 'Hypotension'],
      vitals: {
        bloodPressureSys: 85,
        bloodPressureDia: 55,
        pulseRate: 128,
        respiratoryRate: 28,
        temperatureF: 97.8,
        spo2: 91,
        weightKg: 70,
        heightCm: 172,
        bmi: 23.6,
        recordedAt: currentTime
      },
      aiRecommendedSpecialty: 'Emergency Critical Care',
      aiSpecialistReason: `Fast-track protocol for ${ambulanceCondition}. Bypass standard queue straight to ${ambulanceBayAllocated}.`,
      assignedDoctorName: 'Dr. Marcus Vance (Emergency Team)',
      intakeTimestamp: currentTime,
      status: 'waiting_triage'
    };

    onRegisterPatient(emergencyPatient, emergencyDossier);
    alert(`🚨 CODE RED DISPATCHED: Patient assigned to ${ambulanceBayAllocated} with priority token ${tokenNumber}.`);
    setAmbulancePatientName('');
  };

  const handlePrintSlip = () => {
    if (!issuedToken) return;
    printThermalSlip({
      token: issuedToken.token,
      name: issuedToken.name,
      mrin: issuedToken.mrin,
      age: issuedToken.age,
      gender: issuedToken.gender,
      bloodGroup: issuedToken.bloodGroup,
      phone: issuedToken.phone,
      tariffScheme: issuedToken.tariffScheme,
      fee: issuedToken.fee,
      paymentMethod: issuedToken.paymentMethod,
      chamberRoom: 'Chamber 304 / Anteroom 2',
      date: issuedToken.date,
      time: issuedToken.time
    });
  };

  // Real-time character-by-character search
  const q = searchQuery.toLowerCase().trim();
  const filteredPatients = q === '' 
    ? patients 
    : patients.filter(p => 
        p.fullName.toLowerCase().includes(q) ||
        p.mrin.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.bloodGroup.toLowerCase().includes(q)
      );

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-slate-800 p-4 md:p-8 transition-colors">
      {/* App Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#173B57] text-white">
                App 1 • Front Office &amp; Cashier
              </span>
              <span className="text-xs font-semibold text-[#299DAB]">
                Vitality-OS Reception Center
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#173B57]">
              Patient Registration &amp; Hospital Front Desk
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Complete front-office suite: Patient intake, thermal slips, advance cashier deposits, visitor passes, OPD chamber schedules, and ambulance bay triage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToAssistant}
              className="px-4 py-2.5 bg-[#299DAB] hover:bg-[#238b97] text-white font-bold text-sm rounded-xl shadow-md shadow-[#299DAB]/20 flex items-center gap-2 transition-all"
            >
              <span>Go to Assistant Triage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 Modular Front-Office Sub-Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('registration')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'registration'
                ? 'bg-[#173B57] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4 text-[#299DAB]" />
            <span>1. Patient Intake &amp; Queue Slips</span>
          </button>

          <button
            onClick={() => setActiveTab('cashier')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'cashier'
                ? 'bg-[#173B57] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>2. Cashier &amp; Advance Deposits ({deposits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'visitors'
                ? 'bg-[#173B57] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4 text-purple-600" />
            <span>3. Visitor Passes &amp; Badges ({visitorPasses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'doctors'
                ? 'bg-[#173B57] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <span>4. Doctor OPD Chambers ({doctorSchedules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'emergency'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <Ambulance className="w-4 h-4 text-rose-600" />
            <span>5. Emergency Ambulance Bay</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ======================================================== */}
        {/* TAB 1: PATIENT INTAKE & REGISTRATION                     */}
        {/* ======================================================== */}
        {activeTab === 'registration' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: Registration Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#299DAB]/10 text-[#299DAB] flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#173B57]">New Patient Intake</h2>
                    <p className="text-xs text-slate-500">Auto-generates official MRIN &amp; Anteroom Token</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 rounded-lg text-slate-600">
                  MRIN Prefix: HS-2026
                </span>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Mohammad Rafiqul Islam"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#299DAB] bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+880 1700-000000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#299DAB] bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Age, Gender & Blood Group */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Age (Years) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="125"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      placeholder="e.g. 52"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#299DAB] bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#299DAB] bg-slate-50/50"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#299DAB] bg-slate-50/50 font-mono"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                {/* Tariff / Beneficiary Scheme */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tariff Category &amp; Beneficiary Scheme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['General OPD', 'Senior Citizen (20% Off)', 'SSK Govt Scheme', 'Corporate Partner'] as const).map(sch => (
                      <button
                        type="button"
                        key={sch}
                        onClick={() => setPatientTariffCategory(sch)}
                        className={`p-2 rounded-xl text-[11px] font-bold text-left border transition ${
                          patientTariffCategory === sch
                            ? 'bg-[#173B57] text-white border-[#173B57]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* National ID / Birth Cert */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    National ID (NID) / Smart Card / Birth Certificate Number
                  </label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={e => setNationalId(e.target.value)}
                    placeholder="e.g. 1982 4598 1234 00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#299DAB] bg-slate-50/50 font-mono"
                  />
                </div>

                {/* Payment & Cashier */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">Consultation Registration Fee</span>
                    <span className="text-base font-extrabold text-[#173B57]">
                      {patientTariffCategory === 'SSK Govt Scheme' ? '৳0 BDT (Free Scheme)' : patientTariffCategory === 'Senior Citizen (20% Off)' ? '৳960 BDT' : '৳1,200 BDT'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {(['bKash', 'Nagad', 'Cash', 'Card'] as const).map(m => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          paymentMethod === m 
                            ? 'bg-[#299DAB] text-white border-[#299DAB]' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#173B57] to-[#299DAB] hover:from-[#132c42] hover:to-[#228490] text-white font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Issue MRIN &amp; Queue Token</span>
                </button>
              </form>
            </div>

            {/* Right 5 Columns: Thermal Token Preview & Patient Directory */}
            <div className="lg:col-span-5 space-y-6">
              {/* Thermal Token Preview Card */}
              {issuedToken ? (
                <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-[#299DAB]/30 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-[#299DAB]" />
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Token Issued &amp; Dispatched
                  </div>

                  <div className="text-xs uppercase tracking-widest text-slate-400 font-mono">Queue Token Serial</div>
                  <div className="text-5xl font-black text-[#173B57] tracking-tight my-1">
                    {issuedToken.token}
                  </div>
                  <div className="text-xs font-mono text-teal-700 font-bold bg-teal-50 inline-block px-3 py-1 rounded-lg">
                    MRIN: {issuedToken.mrin}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-left space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Patient Name:</span>
                      <span className="font-bold text-slate-800">{issuedToken.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Age / Gender / Blood:</span>
                      <span className="font-bold text-slate-800">{issuedToken.age}y / {issuedToken.gender} ({issuedToken.bloodGroup})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mobile Phone:</span>
                      <span className="font-bold text-slate-800">{issuedToken.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fee Paid:</span>
                      <span className="font-bold text-emerald-600">৳{issuedToken.fee} BDT via {issuedToken.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Issued Timestamp:</span>
                      <span className="font-mono text-slate-600">{issuedToken.date} • {issuedToken.time}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePrintSlip}
                    className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Printer className="w-4 h-4 text-[#299DAB]" /> Print Thermal Slip (80mm)
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center text-slate-400 py-10">
                  <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-600">Ready to issue queue tokens</p>
                  <p className="text-xs mt-1">Fill out patient intake on left to generate official hospital token.</p>
                </div>
              )}

              {/* Patient Directory Search */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#173B57]">Registered Patients Directory</h3>
                    <p className="text-[11px] text-slate-500">Instant lookup by name, MRIN or phone</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {filteredPatients.length} Matches
                  </span>
                </div>

                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Type name, phone or MRIN..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#299DAB] bg-slate-50/50"
                  />
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredPatients.slice(0, 10).map(patient => (
                    <div
                      key={patient.mrin}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span>{patient.fullName}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-mono">
                            {patient.bloodGroup}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {patient.mrin} • {patient.phone} • {patient.age}y ({patient.gender})
                        </div>
                      </div>

                      {/* Action Buttons: Pay, Edit, Delete */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleOpenPayment(patient, 1200)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition"
                          title="Open RFID / bKash / Cash Payment Gateway"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Pay Fee</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(patient)}
                          className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
                          title="Edit Patient Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmMrin(patient.mrin)}
                          className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition"
                          title="Delete Patient Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CASHIER COUNTER & ADVANCE DEPOSITS                */}
        {/* ======================================================== */}
        {activeTab === 'cashier' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
              <h2 className="text-base font-extrabold text-[#173B57] mb-1 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Issue Cashier Deposit Slip
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Record advance deposit payments for inpatient admission, cath lab packages, or dialysis cycles.
              </p>

              <form onSubmit={handleCreateDeposit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient</label>
                  <select
                    value={depositMrin}
                    onChange={e => setDepositMrin(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-bold"
                  >
                    {patients.map(p => (
                      <option key={p.mrin} value={p.mrin}>
                        {p.fullName} ({p.mrin})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deposit Purpose</label>
                  <select
                    value={depositPurpose}
                    onChange={e => setDepositPurpose(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-semibold"
                  >
                    <option value="IPD Admission Advance">IPD Admission Advance</option>
                    <option value="Cath Lab Package">Cath Lab Angiogram/PCI Package</option>
                    <option value="Dialysis 5-Cycle Deposit">Dialysis 5-Cycle Deposit</option>
                    <option value="OPD Consultation & Tests">OPD Multi-Specialty Consultation &amp; Tests</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deposit Amount (৳ BDT)</label>
                    <input
                      type="number"
                      required
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-[#173B57] bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Payment Channel</label>
                    <select
                      value={depositPaymentMode}
                      onChange={e => setDepositPaymentMode(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-bold"
                    >
                      <option value="bKash">bKash Merchant Pay</option>
                      <option value="Nagad">Nagad Direct</option>
                      <option value="Cash">Cash Counter</option>
                      <option value="Credit Card">Credit Card POS</option>
                      <option value="SSK Govt Scheme">SSK Govt Health Protection</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition"
                >
                  Generate Official Deposit Receipt
                </button>
              </form>

              {depositSuccessReceipt && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                  <div className="font-bold text-emerald-800 flex items-center justify-between">
                    <span>Receipt: {depositSuccessReceipt.receiptNo}</span>
                    <span className="font-mono">৳{depositSuccessReceipt.amountBDT} BDT</span>
                  </div>
                  <div className="text-slate-600">Patient: {depositSuccessReceipt.patientName} ({depositSuccessReceipt.patientMrin})</div>
                  <div className="text-slate-500">Purpose: {depositSuccessReceipt.purpose} via {depositSuccessReceipt.paymentMode}</div>
                  <button
                    onClick={() => {
                      if (!depositSuccessReceipt) return;
                      printDepositVoucher({
                        voucherNo: depositSuccessReceipt.receiptNo,
                        patientName: depositSuccessReceipt.patientName,
                        mrin: depositSuccessReceipt.patientMrin,
                        amount: depositSuccessReceipt.amountBDT,
                        scheme: depositSuccessReceipt.purpose,
                        method: depositSuccessReceipt.paymentMode,
                        cashierName: depositSuccessReceipt.cashierStaff,
                        timestamp: depositSuccessReceipt.timestamp
                      });
                    }}
                    className="mt-2 w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] transition shadow"
                  >
                    Print Deposit Voucher
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
              <h3 className="text-sm font-extrabold text-[#173B57] mb-3">Recent Cashier Transactions Ledger</h3>
              <div className="space-y-2.5 overflow-y-auto max-h-[460px]">
                {deposits.map(dep => (
                  <div
                    key={dep.receiptNo}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-[#173B57]">{dep.receiptNo}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {dep.paymentMode}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-1">{dep.patientName} ({dep.patientMrin})</div>
                      <div className="text-[11px] text-slate-500">{dep.purpose} • {dep.cashierStaff} • {dep.timestamp}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-700">৳{dep.amountBDT.toLocaleString()} BDT</div>
                      <span className="text-[10px] font-bold text-slate-400">Paid in Full</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: VISITOR PASSES & GATE BADGES                      */}
        {/* ======================================================== */}
        {activeTab === 'visitors' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
              <h2 className="text-base font-extrabold text-[#173B57] mb-1 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-purple-600" />
                Issue Visitor Gate Badge
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Generate security badge with ward access permissions and automatic visiting hour expiry.
              </p>

              <form onSubmit={handleIssueVisitorPass} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Visitor Full Name</label>
                  <input
                    type="text"
                    required
                    value={newVisitorName}
                    onChange={e => setNewVisitorName(e.target.value)}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Visitor Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={newVisitorPhone}
                    onChange={e => setNewVisitorPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Visiting Patient</label>
                  <select
                    value={visitorPatientMrin}
                    onChange={e => setVisitorPatientMrin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-bold"
                  >
                    {patients.map(p => (
                      <option key={p.mrin} value={p.mrin}>
                        {p.fullName} ({p.mrin})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ward Destination</label>
                    <input
                      type="text"
                      value={visitorWard}
                      onChange={e => setVisitorWard(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Bed Number</label>
                    <input
                      type="text"
                      value={visitorBed}
                      onChange={e => setVisitorBed(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pass Category</label>
                  <select
                    value={visitorPassType}
                    onChange={e => setVisitorPassType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-bold"
                  >
                    <option value="Standard Day Visitor">Standard Day Visitor (Valid until 08:00 PM)</option>
                    <option value="Attendant 24H Pass">Attendant 24H Overnight Pass</option>
                    <option value="VIP ICU Visitor">VIP ICU Specialist Visitor</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow transition"
                >
                  Generate QR Gate Pass Badge
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
              <h3 className="text-sm font-extrabold text-[#173B57] mb-3">Active Inpatient Visitor Passes</h3>
              <div className="space-y-2.5 overflow-y-auto max-h-[460px]">
                {visitorPasses.map(vp => (
                  <div
                    key={vp.id}
                    className="p-3.5 rounded-2xl bg-purple-50/40 hover:bg-purple-50 transition border border-purple-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-purple-900">{vp.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-900">
                          {vp.passType}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1">{vp.visitorName} ({vp.visitorPhone})</div>
                      <div className="text-[11px] text-slate-600">
                        Visiting: <span className="font-bold">{vp.patientName}</span> • {vp.ward} (Bed {vp.bedNumber})
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full block mb-1">
                        ✓ ACTIVE PASS
                      </span>
                      <span className="text-[10px] text-slate-500 block">Valid until {vp.validUntil}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: DOCTOR OPD CHAMBERS SCHEDULE                      */}
        {/* ======================================================== */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#173B57]">Live Doctor OPD Chamber Matrix</h2>
                <p className="text-xs text-slate-500">Monitor consultant presence, active queue count, and BMDC registration credentials</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● 4 Doctors In Chamber / Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctorSchedules.map(doc => (
                <div
                  key={doc.doctorId}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#173B57]">{doc.doctorName}</h3>
                      <p className="text-xs font-semibold text-teal-600">{doc.specialty}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.status === 'In Chamber' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.status === 'In Cath Lab'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-bold text-slate-800">{doc.chamberRoom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Schedule:</span>
                      <span className="font-bold text-slate-800">{doc.timing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">BMDC Reg:</span>
                      <span className="font-mono text-slate-700">{doc.bmdcRegNo}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Queue Progress</span>
                      <span className="font-extrabold text-slate-800">{doc.tokensServed} / {doc.tokensIssued} Served</span>
                    </div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                      {doc.tokensIssued - doc.tokensServed} In Waiting
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: EMERGENCY AMBULANCE BAY (CODE RED)                */}
        {/* ======================================================== */}
        {activeTab === 'emergency' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-100">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center animate-pulse">
                <Ambulance className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-rose-900">Emergency Ambulance Bay &amp; Trauma Inflow</h2>
                <p className="text-xs text-rose-600">Immediate Code Red patient intake with pre-allocated trauma bays and priority triage bypass.</p>
              </div>
            </div>

            <form onSubmit={handleAmbulanceIntake} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name or Unknown Code</label>
                <input
                  type="text"
                  value={ambulancePatientName}
                  onChange={e => setAmbulancePatientName(e.target.value)}
                  placeholder="e.g. Unknown Trauma Male #41"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Clinical Condition</label>
                <select
                  value={ambulanceCondition}
                  onChange={e => setAmbulanceCondition(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 text-xs bg-rose-50/50 font-bold text-rose-900"
                >
                  <option value="Acute STEMI">Acute STEMI (Heart Attack - Golden Hour)</option>
                  <option value="Acute Ischemic Stroke">Acute Ischemic Stroke (Code Stroke - Thrombectomy Window)</option>
                  <option value="Major Polytrauma">Major Polytrauma / Hemorrhagic Shock</option>
                  <option value="Severe Septic Shock">Severe Septic Shock / Inotropic Failure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trauma Bay Bay Allocation</label>
                <select
                  value={ambulanceBayAllocated}
                  onChange={e => setAmbulanceBayAllocated(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-bold"
                >
                  <option value="Trauma Bay 01 (Red Alert)">Trauma Bay 01 (Red Alert - Ready)</option>
                  <option value="Trauma Bay 02 (Resuscitation)">Trauma Bay 02 (Resuscitation - Ready)</option>
                  <option value="Cath Lab Direct (STEMI)">Cath Lab Direct (Door-to-Balloon)</option>
                </select>
              </div>

              <div className="md:col-span-3 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5 text-amber-300" />
                  <span>Dispatch CODE RED Emergency Intake &amp; Alarm Trauma Team</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* EDIT PATIENT MASTER RECORD MODAL */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#299DAB]" />
                <h3 className="font-extrabold text-base text-[#173B57]">Edit Patient Master Record</h3>
              </div>
              <button onClick={() => setEditingPatient(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditPatient} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={editingPatient.fullName}
                    onChange={e => setEditingPatient({ ...editingPatient, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={editingPatient.phone}
                    onChange={e => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    required
                    value={editingPatient.age}
                    onChange={e => setEditingPatient({ ...editingPatient, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={editingPatient.gender}
                    onChange={e => setEditingPatient({ ...editingPatient, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={editingPatient.bloodGroup}
                    onChange={e => setEditingPatient({ ...editingPatient, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Documented Drug Allergies (Comma separated)</label>
                <input
                  type="text"
                  value={editingPatient.knownDrugAllergies.join(', ')}
                  onChange={e => setEditingPatient({ 
                    ...editingPatient, 
                    knownDrugAllergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-rose-700 font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#173B57] hover:bg-[#132c42] text-white font-bold rounded-xl transition"
                >
                  Save Changes &amp; Sync Master EHR
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmMrin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Permanently Delete Patient Record?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove MRIN <strong className="font-mono text-slate-800">{deleteConfirmMrin}</strong> from the active hospital registry? This action will remove associated triage queue and pending lab orders.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDeletePatientConfirm(deleteConfirmMrin)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition"
              >
                Yes, Delete Record
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmMrin(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOSPITAL PAYMENT GATEWAY MODAL (With 3D React Bits Pro Card) */}
      {paymentTargetPatient && (
        <HospitalPaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          patientName={paymentTargetPatient.fullName}
          patientMrin={paymentTargetPatient.mrin}
          patientPhone={paymentTargetPatient.phone}
          items={paymentItems}
          onPaymentSuccess={receipt => {
            console.log('Payment registered:', receipt);
          }}
        />
      )}
      {/* Printable OPD Slip */}
      {issuedToken && (
        <div id="printable-slip">
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>VITALITY-OS HOSPITAL</h2>
            <p style={{ fontSize: '11px', margin: '0' }}>OPD REGISTRATION &amp; TOKEN SLIP</p>
            <p style={{ fontSize: '10px', margin: '2px 0 0 0' }}>Date: {issuedToken.date} | Time: {issuedToken.time}</p>
          </div>

          <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '12px 0', textAlign: 'center', margin: '10px 0' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>QUEUE TOKEN NUMBER</div>
            <div style={{ fontSize: '38px', fontWeight: '900', margin: '4px 0' }}>{issuedToken.token}</div>
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>NEXT: TRIAGE ANTEROOM 2</div>
          </div>

          <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
            <div><strong>Patient:</strong> {issuedToken.name}</div>
            <div><strong>MRIN:</strong> {issuedToken.mrin}</div>
            <div><strong>Age/Sex:</strong> {issuedToken.age}y / {issuedToken.gender} ({issuedToken.bloodGroup})</div>
            <div><strong>Mobile:</strong> {issuedToken.phone}</div>
            <div style={{ borderTop: '1px dashed #000', marginTop: '8px', paddingTop: '6px' }}>
              <strong>Fee Paid:</strong> ৳{issuedToken.fee} BDT ({issuedToken.paymentMethod})
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '9px' }}>
            <p style={{ margin: '0' }}>* Please wait for your token to be called *</p>
            <p style={{ margin: '2px 0 0 0' }}>Vitality-OS Smart Hospital Cloud</p>
          </div>
        </div>
      )}
    </div>
  );
}