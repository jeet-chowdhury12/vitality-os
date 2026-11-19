import React from 'react';
import { 
  UserPlus, ClipboardList, Stethoscope, FlaskConical, 
  Activity, Database, Smartphone, ShieldCheck, ArrowRight,
  Sparkles, ExternalLink, Download, Layers, Shield, Pill,
  Cpu, Dna, Brain, Zap, Droplet, Hand, Compass, MapPin,
  Calendar, FileText, MessageSquare, Navigation, Watch,
  DollarSign, ShieldAlert, Heart, TrendingUp, Video, BarChart3, Camera
} from 'lucide-react';
import { AppRoleId } from '../common/AppSidebar';
import GradientASCII from '../reactbits/GradientASCII';

interface CentralLaunchpadProps {
  onSelectRole: (role: AppRoleId) => void;
  onOpenPwaModal: () => void;
  onOpenTurjuman?: () => void;
  onOpenClinicSense?: () => void;
  onOpenGeoDispatch?: () => void;
  onOpenAiScheduler?: () => void;
  onOpenBedsideMonitor?: () => void;
  onOpenCodeBlue?: () => void;
  onOpenInteractionChecker?: () => void;
  onOpenDiagnosticScreening?: () => void;
  onOpenDischargeSummary?: () => void;
  onOpenAdvocateGpt?: () => void;
  onOpenMentalHealth?: () => void;
  onOpenAmbulanceRoute?: () => void;
  onOpenRpm?: () => void;
  onOpenSmartPill?: () => void;
  onOpenOutbreakPredictor?: () => void;
  onOpenBloodBank?: () => void;
  onOpenFraudDetection?: () => void;
  onOpenXrayDiagnostic?: () => void;
  onOpenVirtualConsultation?: () => void;
}

export function CentralLaunchpad({
  onSelectRole,
  onOpenPwaModal,
  onOpenTurjuman,
  onOpenClinicSense,
  onOpenGeoDispatch,
  onOpenAiScheduler,
  onOpenBedsideMonitor,
  onOpenCodeBlue,
  onOpenInteractionChecker,
  onOpenDiagnosticScreening,
  onOpenDischargeSummary,
  onOpenAdvocateGpt,
  onOpenMentalHealth,
  onOpenAmbulanceRoute,
  onOpenRpm,
  onOpenSmartPill,
  onOpenOutbreakPredictor,
  onOpenBloodBank,
  onOpenFraudDetection,
  onOpenXrayDiagnostic,
  onOpenVirtualConsultation
}: CentralLaunchpadProps) {
  // 8 Hospital Staff & Patient Applications
  const hospitalApps = [
    {
      role: 'receptionist' as AppRoleId,
      title: 'Reception & Admissions',
      badge: 'App 1 • Front Office',
      desc: 'Register new patients, issue hospital ID tokens, and manage outpatient clinic billing.',
      accent: '#299DAB',
      primaryColor: '#173B57',
      icon: UserPlus
    },
    {
      role: 'assistant' as AppRoleId,
      title: 'Triage & Vitals Station',
      badge: 'App 2 • Health Check',
      desc: 'Check blood pressure, pulse, oxygen, record symptoms, and route patient to the right doctor.',
      accent: '#35B69A',
      primaryColor: '#176B65',
      icon: ClipboardList
    },
    {
      role: 'doctor' as AppRoleId,
      title: "Doctor's Consultation",
      badge: 'App 3 • Consultation Chamber',
      desc: 'Review medical records, write digital prescriptions, and order lab tests directly.',
      accent: '#697FE5',
      primaryColor: '#192D46',
      icon: Stethoscope
    },
    {
      role: 'lab' as AppRoleId,
      title: 'Diagnostic & Blood Lab',
      badge: 'App 4 • Lab & Scan Results',
      desc: 'Catalog of blood tests and scans, sample barcode tracking, and urgent panic alerts.',
      accent: '#8B75D7',
      primaryColor: '#34466F',
      icon: FlaskConical
    },
    {
      role: 'patient' as AppRoleId,
      title: 'Patient Mobile Health App',
      badge: 'App 5 • Mobile Health Pocket',
      desc: 'Daily medicine schedule, prescription explainer in simple everyday words, and offline emergency pass.',
      accent: '#10B981',
      primaryColor: '#064E3B',
      icon: Smartphone
    },
    {
      role: 'maintenance' as AppRoleId,
      title: 'Hospital Beds & Operations',
      badge: 'App 6 • Operational Telemetry',
      desc: 'Live ICU and general bed capacity, oxygen supply tracking, doctor duty schedule, and ward status.',
      accent: '#E0A84C',
      primaryColor: '#101F32',
      icon: Activity
    },
    {
      role: 'pharmacy' as AppRoleId,
      title: 'Hospital Pharmacy',
      badge: 'App 9 • Medicine Store & POS',
      desc: 'Prescription medicine dispenser, pharmacy counter billing, emergency supplies, and drug inventory.',
      accent: '#059669',
      primaryColor: '#064E3B',
      icon: Pill
    },
    {
      role: 'central_hub' as AppRoleId,
      title: 'Master Patient Registry',
      badge: 'Hub 8 • Core Data Backbone',
      desc: 'Central hospital patient directory and verified health records shared across all departments.',
      accent: '#38BDF8',
      primaryColor: '#0F172A',
      icon: Database
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-slate-800 p-4 md:p-8 transition-colors relative overflow-hidden">
      {/* Background React Bits: GradientASCII */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <GradientASCII />
      </div>
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Hero Section */}
        <div className="rounded-3xl bg-gradient-to-br from-[#142B3B] via-[#173B57] to-[#168C86] text-white p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-teal-400/10 to-transparent pointer-events-none" />
          
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-teal-300 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Vitality-OS • Smart Hospital Cloud OS
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-3">
              Hospital Operations Launchpad
            </h1>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-6">
              Launch and orchestrate hospital staff applications from one unified command center. All 6 internal portals communicate in real-time over the national DGHS Bangladesh Core FHIR R4 protocol.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenPwaModal}
                className="px-5 py-3 rounded-2xl glass-btn text-slate-900 font-black text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4 text-[#168C86]" />
                Install as Browser App / PWA
              </button>
              <button
                onClick={() => onSelectRole('doctor')}
                className="px-5 py-3 rounded-2xl glass-btn-primary text-white font-black text-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/25"
              >
                <Stethoscope className="w-4 h-4" />
                Launch Doctor Cockpit
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Hospital Clinical Operations & Plant Telemetry Matrix */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-200">
                Hospital Clinical Operations &amp; Facility Matrix
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/80">
              DGHS FHIR R4 Core • Active Inter-Hub Bus
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Emergency Department */}
            <div 
              onClick={() => onSelectRole('assistant')}
              className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Emergency Triage</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-900/60 text-emerald-300">ESI 1-5 Active</span>
              </div>
              <div className="font-extrabold text-white text-xs group-hover:text-emerald-300 transition">Bay 02 • Immediate Intake</div>
              <p className="text-[10px] font-mono text-slate-400">NEWS2 Auto-Scoring • Multi-Doctor Routing</p>
            </div>

            {/* 2. Automated Diagnostic Laboratory */}
            <div 
              onClick={() => onSelectRole('lab')}
              className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-sky-500/50 cursor-pointer transition space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
                  <span>Pathology &amp; Biochemistry</span>
                </span>
                <span className="text-[9px] font-mono text-sky-300">COM4 Online</span>
              </div>
              <div className="font-extrabold text-white text-xs group-hover:text-sky-300 transition">Sysmex &amp; Roche Cobas Active</div>
              <p className="text-[10px] font-mono text-slate-400">Automated Serial Stream • Panic Alerts</p>
            </div>

            {/* 3. Inpatient Bed & ICU Matrix */}
            <div 
              onClick={() => onSelectRole('maintenance')}
              className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inpatient Bed Matrix</span>
                </span>
                <span className="text-[9px] font-mono text-amber-300">12 Available</span>
              </div>
              <div className="font-extrabold text-white text-xs group-hover:text-amber-300 transition">60 Beds • 48 Occupied (80%)</div>
              <p className="text-[10px] font-mono text-slate-400">High-Flow O2 Monitored • Negative Pressure</p>
            </div>

            {/* 4. Biomedical Plant & Oxygen Telemetry */}
            <div 
              onClick={() => onSelectRole('maintenance')}
              className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-teal-400" />
                  <span>Medical Gas Plant</span>
                </span>
                <span className="text-[9px] font-mono text-teal-300">4.2 Bar OK</span>
              </div>
              <div className="font-extrabold text-white text-xs group-hover:text-teal-300 transition">Bulk LMO Tank: 98.4% Full</div>
              <p className="text-[10px] font-mono text-slate-400">Backup Diesel Ready • 14.8 ACH HVAC</p>
            </div>
          </div>
        </div>

        {/* Strategic 6-Sector Clinical AI & Systems Architecture */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Integrated Healthcare Ecosystem • 6 Strategic Sectors
              </div>
              <h2 className="text-2xl font-black text-[#142B3B]">Next-Gen Clinical AI &amp; IoT Architecture</h2>
              <p className="text-xs text-slate-500">Autonomous clinical intelligence from pre-hospital transit to bedside robotics and population epidemiology.</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
              17 Strategic Modules Online
            </span>
          </div>

          {/* Sector 1: Emergency & Pre-Hospital Care */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Sector 1: Emergency &amp; Ambulance Services
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={onOpenAmbulanceRoute}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-rose-950 border border-rose-500/30 hover:border-rose-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">AMBULANCE GPS</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-rose-300 transition-colors">Ambulance Emergency GPS Router</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Fastest hospital route navigation with traffic signals priority for emergency ambulances.
                </p>
                <div className="mt-2 text-[10px] text-rose-400 font-bold flex items-center gap-1">
                  <span>Track Ambulance</span> &rarr;
                </div>
              </div>

              <div 
                onClick={onOpenTurjuman}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-rose-950/70 border border-rose-500/30 hover:border-rose-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">CAMERA AI</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-rose-300 transition-colors">Camera &amp; Distress AI Scanner</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Live camera scan for distressed or unresponsive patients. Identifies signs, explains clinical condition, prevents dangerous bystander mistakes (e.g. cardiac arrest vs dehydration), and gives step-by-step emergency steps.
                </p>
                <div className="mt-2 text-[10px] text-rose-400 font-bold flex items-center gap-1">
                  <span>Open Distress Scanner</span> &rarr;
                </div>
              </div>

              <div 
                onClick={onOpenClinicSense}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 border border-sky-500/30 hover:border-sky-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">URGENCY CHECK</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-sky-300 transition-colors">Emergency Urgency Checker</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Quickly checks symptoms to advise whether you need the Emergency Room or outpatient clinic.
                </p>
                <div className="mt-2 text-[10px] text-sky-400 font-bold flex items-center gap-1">
                  <span>Check Urgency</span> &rarr;
                </div>
              </div>

              <div 
                onClick={onOpenCodeBlue}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-rose-950 border border-rose-500/30 hover:border-rose-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">CPR GUIDE</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-rose-300 transition-colors">Emergency CPR &amp; Life Support Guide</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Real-time CPR metronome timer and voice guidance for medical teams during cardiac arrest.
                </p>
                <div className="mt-2 text-[10px] text-rose-400 font-bold flex items-center gap-1">
                  <span>Start CPR Guide</span> &rarr;
                </div>
              </div>
            </div>
          </div>

          {/* Sector 2: Doctor Decision Support & Inpatient Care */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Sector 2: Doctor Decision Support &amp; Patient Bedside Care
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={onOpenInteractionChecker}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950 border border-amber-500/30 hover:border-amber-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">DRUG SAFETY</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-amber-300 transition-colors">Medicine Safety &amp; Conflict Checker</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Scans prescriptions to prevent dangerous side effects when taking multiple medicines together.
                </p>
                <div className="mt-2 text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <span>Check Medicines</span> &rarr;
                </div>
              </div>

              <div 
                onClick={onOpenRpm}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950 border border-cyan-500/30 hover:border-cyan-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <Watch className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">WEARABLES</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-cyan-300 transition-colors">Wearable Health Monitor</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Monitors heart rhythm, blood oxygen, and sugar levels with instant irregular heartbeat alerts.
                </p>
                <div className="mt-2 text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                  <span>View Live Vitals</span> &rarr;
                </div>
              </div>

              <div 
                onClick={onOpenBedsideMonitor}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-500/30 hover:border-emerald-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">BEDSIDE CARE</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-emerald-300 transition-colors">Bedside Patient Health Monitor</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Watches patient vitals around the clock and immediately alerts on-duty nurses if condition drops.
                </p>
                <div className="mt-2 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span>Open Bed Monitor</span> &rarr;
                </div>
              </div>

              <div 
                onClick={onOpenDischargeSummary}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 border border-teal-500/30 hover:border-teal-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">DISCHARGE</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-teal-300 transition-colors">Hospital Discharge Instructions</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Creates clear, easy-to-read discharge directions for patients and families in plain English and বাংলা.
                </p>
                <div className="mt-2 text-[10px] text-teal-400 font-bold flex items-center gap-1">
                  <span>Generate Instructions</span> &rarr;
                </div>
              </div>
            </div>
          </div>

          {/* Sector 3: Hospital Operations & Bed Management */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Sector 3: Hospital Operations &amp; Bed Capacity Management
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div 
                onClick={onOpenAiScheduler}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/30 hover:border-indigo-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">SCHEDULER</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-indigo-300 transition-colors">Smart Doctor Appointment Scheduler</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Schedules clinic visits and reduces waiting room crowding by predicting appointment times accurately.
                </p>
                <div className="mt-2 text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                  <span>Book Appointment</span> &rarr;
                </div>
              </div>

              <div 
                onClick={onOpenGeoDispatch}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-500/30 hover:border-emerald-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">BED FINDER</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-emerald-300 transition-colors">Emergency Bed &amp; ICU Locator</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Finds available ICU, CCU, and general hospital beds nearby and reserves them before arrival.
                </p>
                <div className="mt-2 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span>Find &amp; Lock Bed</span> &rarr;
                </div>
              </div>

              <div 
                onClick={() => onSelectRole('maintenance')}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/60 hover:border-teal-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-teal-300 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">WARD ROOMS</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-teal-300 transition-colors">Hospital Ward &amp; Room Management</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Tracks hospital ward rooms, bed cleaning status, and patient bed transfers.
                </p>
                <div className="mt-2 text-[10px] text-teal-400 font-bold flex items-center gap-1">
                  <span>View Ward Rooms</span> &rarr;
                </div>
              </div>
            </div>
          </div>

          {/* Sector 4: Home Care & Family Support */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Sector 4: Outpatient &amp; Family Caregiver Support
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={onOpenMentalHealth}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 border border-teal-500/30 hover:border-teal-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">WELLNESS AI</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-teal-300 transition-colors">Mental Health Support Assistant</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Gentle conversational counseling guide for stress relief, anxiety, and everyday mental wellness.
                </p>
                <div className="mt-2 text-[10px] text-teal-400 font-bold flex items-center gap-1">
                  <span>Start Conversation</span> &rarr;
                </div>
              </div>

              <div 
                onClick={onOpenSmartPill}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/30 hover:border-indigo-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">PILL ALARM</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-indigo-300 transition-colors">Daily Medicine Box &amp; Reminder</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Tracks daily doses and sends sound alerts to help patients take their medicine on time.
                </p>
                <div className="mt-2 text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                  <span>Check Doses</span> &rarr;
                </div>
              </div>

              <div 
                onClick={onOpenAdvocateGpt}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-500/30 hover:border-emerald-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">FAMILY GUIDE</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-emerald-300 transition-colors">Family Caregiver Health Explainer</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Explains medicines and lab numbers in simple everyday words for families on WhatsApp.
                </p>
                <div className="mt-2 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span>Open Family Hub</span> &rarr;
                </div>
              </div>

              <div 
                onClick={onOpenVirtualConsultation}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 border border-teal-500/30 hover:border-teal-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">VIDEO CALL</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-teal-300 transition-colors">Virtual Doctor Video Consultation</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Secure video consultation with hospital doctors for remote health checkups and advice.
                </p>
                <div className="mt-2 text-[10px] text-teal-400 font-bold flex items-center gap-1">
                  <span>Start Video Call</span> &rarr;
                </div>
              </div>
            </div>
          </div>

          {/* Sector 5: Public Health & Blood Supply */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Sector 5: Public Health &amp; Emergency Blood Supply
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={onOpenOutbreakPredictor}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950 border border-amber-500/30 hover:border-amber-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">OUTBREAK MAP</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-amber-300 transition-colors">Community Disease Outbreak Monitor</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Tracks fever, dengue, and infection clusters across districts to stop outbreaks early.
                </p>
                <div className="mt-2 text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <span>Track Outbreaks</span> &rarr;
                </div>
              </div>

              <div 
                onClick={onOpenBloodBank}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-rose-950 border border-rose-500/30 hover:border-rose-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">BLOOD BANK</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-rose-300 transition-colors">Emergency Blood Bank &amp; Donor Finder</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Locates compatible blood donors and emergency blood units nearby in real time.
                </p>
                <div className="mt-2 text-[10px] text-rose-400 font-bold flex items-center gap-1">
                  <span>Find Blood Units</span> &rarr;
                </div>
              </div>
            </div>
          </div>

          {/* Sector 6: Medical Billing & Hospital Financial Accuracy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Sector 6: Hospital Bill &amp; Billing Accuracy Defense
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={onOpenFraudDetection}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/30 hover:border-indigo-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">BILL AUDITOR</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-indigo-300 transition-colors">Hospital Bill &amp; Billing Accuracy Auditor</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Checks hospital bills to protect patients from duplicate charges and billing mistakes.
                </p>
                <div className="mt-2 text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                  <span>Audit Bill</span> &rarr;
                </div>
              </div>

              <div 
                onClick={() => onSelectRole('central_hub')}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/60 hover:border-teal-400 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-teal-300 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">21 CFR PART 11</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-teal-300 transition-colors">Master Hub &amp; Immutable Audit Trail</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Cryptographically hashed audit log tracking every medication dispensing, doctor prescription, and EHR alteration.
                </p>
                <div className="mt-2 text-[10px] text-teal-400 font-bold flex items-center gap-1">
                  <span>Inspect Audit Ledger</span> &rarr;
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 6 Hospital Internal Apps Grid (Features 6 Block) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#142B3B]">Hospital Operational Hubs</h2>
              <p className="text-xs text-slate-500">Select an operational station to begin clinical workflow.</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">6 Connected Portals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hospitalApps.map(app => {
              const Icon = app.icon;
              return (
                <div
                  key={app.role}
                  onClick={() => onSelectRole(app.role)}
                  className="glass-card rounded-3xl p-6 border border-white/80 hover:border-teal-400/50 shadow-lg hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between hover:scale-[1.01]"
                  style={{ borderTopColor: app.accent, borderTopWidth: '4px' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        {app.badge}
                      </span>
                      <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow"
                        style={{ backgroundColor: app.primaryColor }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-teal-600 transition-colors">
                      {app.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {app.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-100/80 flex items-center justify-between">
                    <button className="glass-btn px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 group-hover:bg-white transition-all shadow-sm">
                      <span style={{ color: app.accent }}>Open Station</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
