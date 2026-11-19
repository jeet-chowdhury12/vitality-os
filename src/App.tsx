import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Users, Pill, Bell, FileText, Sparkles, 
  Calendar, Key, ShieldCheck, Heart, ArrowRightLeft, QrCode, LogIn,
  Smartphone, ExternalLink
} from 'lucide-react';
import { AppSidebar, AppRoleId } from './components/common/AppSidebar';
import { CommandMenu } from './components/common/CommandMenu';
import { NotificationsPopover } from './components/common/NotificationsPopover';
import { PwaExtensionBanner } from './components/common/PwaExtensionBanner';
import { CentralLaunchpad } from './components/launchpad/CentralLaunchpad';
import { ReceptionistPortal } from './components/receptionist/ReceptionistPortal';
import { AssistantPortal } from './components/assistant/AssistantPortal';
import { DoctorPortal } from './components/doctor/DoctorPortal';
import { DiagnosticLabPortal } from './components/lab/DiagnosticLabPortal';
import { PatientPortal } from './components/patient/PatientPortal';
import { MaintenancePortal } from './components/maintenance/MaintenancePortal';
import { CentralHubSystem } from './components/central/CentralHubSystem';
import { PharmacyPortal } from './components/pharmacy/PharmacyPortal';
import { AuthModal } from './components/common/AuthModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { EmergencyFirstAidSuite } from './components/emergency/EmergencyFirstAidSuite';
import { EmergencyTurjumanModal } from './components/emergency/EmergencyTurjumanModal';
import { ClinicSenseModal } from './components/triage/ClinicSenseModal';
import { HospitalBedGeoDispatchModal } from './components/dispatch/HospitalBedGeoDispatchModal';
import { AiAppointmentSchedulerModal } from './components/operations/AiAppointmentSchedulerModal';
import { SmartBedsideMonitorModal } from './components/maintenance/SmartBedsideMonitorModal';
import { CodeBlueCopilotModal } from './components/emergency/CodeBlueCopilotModal';
import { MedicineInteractionCheckerModal } from './components/doctor/MedicineInteractionCheckerModal';
import { AiDiagnosticScreeningModal } from './components/diagnostics/AiDiagnosticScreeningModal';
import { DischargeSummaryGeneratorModal } from './components/doctor/DischargeSummaryGeneratorModal';
import { AdvocateGptCaregiverModal } from './components/patient/AdvocateGptCaregiverModal';
import { MentalHealthChatbotModal } from './components/mental/MentalHealthChatbotModal';
import { AmbulanceRouteOptimizerModal } from './components/emergency/AmbulanceRouteOptimizerModal';
import { RemotePatientMonitoringModal } from './components/patient/RemotePatientMonitoringModal';
import { SmartPillReminderModal } from './components/patient/SmartPillReminderModal';
import { DiseaseOutbreakPredictorModal } from './components/epidemiology/DiseaseOutbreakPredictorModal';
import { BloodBankConnectorModal } from './components/blood/BloodBankConnectorModal';
import { HealthcareFraudDetectionModal } from './components/finance/HealthcareFraudDetectionModal';
import { LanguageSwitcher } from './components/common/LanguageSwitcher';
import { AiXrayDiagnosticModal } from './components/lab/AiXrayDiagnosticModal';
import { VirtualConsultationModal } from './components/telemedicine/VirtualConsultationModal';
import { AiArchitecturePipelineModal } from './components/studio/AiArchitecturePipelineModal';
import { ClinicalImpactModal } from './components/studio/ClinicalImpactModal';

import { INITIAL_PATIENTS, PatientRecord, ClinicLabReport } from './data/patientsDatabase';
import { 
  INITIAL_TRIAGE_DOSSIERS, TriageDossier,
  INITIAL_LAB_ORDERS, LabOrderItem,
  INITIAL_BEDS, HospitalBed,
  INITIAL_NOTIFICATIONS, HospitalNotification,
  INITIAL_AUDIT_LOGS, AuditLogItem,
  loadStoredData, saveStoredData
} from './data/hospitalStore';
import { DiagnosticTestItem } from './data/diagnosticTestDatabase';
import { getGeminiApiKey } from './services/valerianAI';

export function App() {
  // Current active role across the Vitality-OS portals
  const [activeRole, setActiveRole] = useState<AppRoleId>('launchpad');
  const [activeDoctorName, setActiveDoctorName] = useState<string>('Dr. Marcus Vance (Cardiologist)');

  // Master Data State with LocalStorage Persistence
  const [patients, setPatients] = useState<PatientRecord[]>(() => 
    loadStoredData('vitality_patients', INITIAL_PATIENTS)
  );
  const [activePatientMrin, setActivePatientMrin] = useState<string>(() => {
    const pts = loadStoredData('vitality_patients', INITIAL_PATIENTS);
    return pts[0]?.mrin || 'HS-2026-00421';
  });
  const [triageQueue, setTriageQueue] = useState<TriageDossier[]>(() => 
    loadStoredData('vitality_triage_queue', INITIAL_TRIAGE_DOSSIERS)
  );
  const [labOrders, setLabOrders] = useState<LabOrderItem[]>(() => 
    loadStoredData('vitality_lab_orders', INITIAL_LAB_ORDERS)
  );
  const [beds, setBeds] = useState<HospitalBed[]>(() => 
    loadStoredData('vitality_beds', INITIAL_BEDS)
  );
  const [notifications, setNotifications] = useState<HospitalNotification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => 
    loadStoredData('vitality_audit_logs', INITIAL_AUDIT_LOGS)
  );

  // Sync state changes to LocalStorage
  useEffect(() => {
    saveStoredData('vitality_patients', patients);
  }, [patients]);

  useEffect(() => {
    saveStoredData('vitality_triage_queue', triageQueue);
  }, [triageQueue]);

  useEffect(() => {
    saveStoredData('vitality_lab_orders', labOrders);
  }, [labOrders]);

  useEffect(() => {
    saveStoredData('vitality_beds', beds);
  }, [beds]);

  useEffect(() => {
    saveStoredData('vitality_audit_logs', auditLogs);
  }, [auditLogs]);

  // Modals & Overlays
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEmergencySuiteOpen, setIsEmergencySuiteOpen] = useState(false);
  
  // Next-Gen Strategic Clinical AI Modals (4 Pillars)
  const [isTurjumanOpen, setIsTurjumanOpen] = useState(false);
  const [isClinicSenseOpen, setIsClinicSenseOpen] = useState(false);
  const [isGeoDispatchOpen, setIsGeoDispatchOpen] = useState(false);
  const [isAiSchedulerOpen, setIsAiSchedulerOpen] = useState(false);
  const [isBedsideMonitorOpen, setIsBedsideMonitorOpen] = useState(false);
  const [isCodeBlueOpen, setIsCodeBlueOpen] = useState(false);
  const [isInteractionCheckerOpen, setIsInteractionCheckerOpen] = useState(false);
  const [isDiagnosticScreeningOpen, setIsDiagnosticScreeningOpen] = useState(false);
  const [isDischargeSummaryOpen, setIsDischargeSummaryOpen] = useState(false);
  const [isAdvocateGptOpen, setIsAdvocateGptOpen] = useState(false);
  const [isMentalHealthOpen, setIsMentalHealthOpen] = useState(false);
  const [isAmbulanceRouteOpen, setIsAmbulanceRouteOpen] = useState(false);
  const [isRpmOpen, setIsRpmOpen] = useState(false);
  const [isSmartPillOpen, setIsSmartPillOpen] = useState(false);
  const [isOutbreakPredictorOpen, setIsOutbreakPredictorOpen] = useState(false);
  const [isBloodBankOpen, setIsBloodBankOpen] = useState(false);
  const [isFraudDetectionOpen, setIsFraudDetectionOpen] = useState(false);
  const [isXrayOpen, setIsXrayOpen] = useState(false);
  const [isVirtualConsultationOpen, setIsVirtualConsultationOpen] = useState(false);
  const [isAiArchitectureOpen, setIsAiArchitectureOpen] = useState(false);
  const [isClinicalImpactOpen, setIsClinicalImpactOpen] = useState(false);
  
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  const activePatient = patients.find(p => p.mrin === activePatientMrin) || patients[0];

  // 1. Receptionist Registers Patient -> adds to patients and queues in Assistant Triage
  const handleRegisterPatient = (newPatient: PatientRecord, initialDossier: TriageDossier) => {
    setPatients(prev => [newPatient, ...prev]);
    setTriageQueue(prev => [initialDossier, ...prev]);
    setActivePatientMrin(newPatient.mrin);

    // Broadcast notification to Assistant
    const newNotif: HospitalNotification = {
      id: `notif-${Date.now()}`,
      title: `New Patient Registered: ${newPatient.fullName}`,
      message: `Token ${initialDossier.tokenNumber} waiting for vitals intake in Anteroom.`,
      type: 'triage',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRole: 'assistant'
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Add Audit Log
    const log: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'Receptionist Desk',
      role: 'Admissions Officer',
      action: 'REGISTERED_NEW_PATIENT',
      details: `Issued token ${initialDossier.tokenNumber} for ${newPatient.fullName}`,
      mrin: newPatient.mrin
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // 2. Assistant Completes Triage -> updates dossier and dispatches to Doctor Chamber
  const handleCompleteTriage = (completedDossier: TriageDossier) => {
    setTriageQueue(prev => prev.map(d => d.id === completedDossier.id ? completedDossier : d));

    // Sync newly measured physical vitals directly into the patient's record
    setPatients(prev => prev.map(p => {
      if (p.mrin === completedDossier.patientMrin) {
        return {
          ...p,
          vitals: {
            ...p.vitals,
            bloodPressure: `${completedDossier.vitals.bloodPressureSys}/${completedDossier.vitals.bloodPressureDia} mmHg`,
            heartRate: completedDossier.vitals.pulseRate,
            temperature: `${completedDossier.vitals.temperatureF} °F`,
            spO2: completedDossier.vitals.spo2,
            weightKg: completedDossier.vitals.weightKg,
            heightCm: completedDossier.vitals.heightCm,
            bmi: completedDossier.vitals.bmi
          }
        };
      }
      return p;
    }));

    setActivePatientMrin(completedDossier.patientMrin);
    if (completedDossier.assignedDoctorName) {
      setActiveDoctorName(completedDossier.assignedDoctorName);
    }

    const newNotif: HospitalNotification = {
      id: `notif-${Date.now()}`,
      title: `Triage Dossier Dispatched: ${completedDossier.patientName}`,
      message: `Vitals recorded (BP ${completedDossier.vitals.bloodPressureSys}/${completedDossier.vitals.bloodPressureDia}). Ready for ${completedDossier.assignedDoctorName}.`,
      type: 'triage',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRole: 'doctor'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 3. Doctor updates patient record
  const handleUpdatePatient = (updated: PatientRecord) => {
    setPatients(prev => prev.map(p => (p.mrin === updated.mrin ? updated : p)));
  };

  // Delete patient record
  const handleDeletePatient = (mrin: string) => {
    setPatients(prev => prev.filter(p => p.mrin !== mrin));
    setTriageQueue(prev => prev.filter(d => d.patientMrin !== mrin));
    setLabOrders(prev => prev.filter(o => o.patientMrin !== mrin));
    setNotificationBanner(`Patient record ${mrin} deleted from hospital registry.`);
    setTimeout(() => setNotificationBanner(null), 3000);
  };

  // 4. Lab orders new test or updates test status
  const handleOrderNewTest = (test: DiagnosticTestItem, patientMrin: string) => {
    const targetPatient = patients.find(p => p.mrin === patientMrin) || activePatient;
    const newOrder: LabOrderItem = {
      orderId: `ORD-${Date.now().toString().slice(-4)}`,
      testId: test.id,
      testCode: test.code,
      testName: test.name,
      department: test.department,
      patientMrin: targetPatient.mrin,
      patientName: targetPatient.fullName,
      doctorName: 'Dr. Marcus Vance (Cardiologist)',
      priority: 'urgent',
      orderedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ordered',
      priceBDT: test.priceBDT
    };
    setLabOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateLabOrderStatus = (
    orderId: string, 
    status: LabOrderItem['status'], 
    results?: any, 
    isPanic?: boolean
  ) => {
    const targetOrder = labOrders.find(o => o.orderId === orderId);

    setLabOrders(prev => prev.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          status,
          results,
          isCriticalPanic: isPanic,
          criticalAlertMessage: isPanic ? `CRITICAL PANIC: Abnormal value detected on ${o.testName}` : undefined,
          verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return o;
    }));

    // If verified, sync official lab report directly into Patient's medical records
    if (status === 'verified' && targetOrder) {
      const newReport: ClinicLabReport = {
        id: `rep-${Date.now()}`,
        title: targetOrder.testName,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        laboratoryName: 'Vitality Diagnostic Network • ISO 15189 Certified Reference Lab',
        status: 'completed',
        summaryNote: isPanic ? 'CRITICAL PANIC: Value outside biological reference limits.' : 'Specimen verified. Values within physiological baseline.',
        parameters: results && Array.isArray(results) ? results.map((r: any) => ({
          name: r.parameter,
          value: r.value,
          unit: r.unit,
          referenceRange: r.normalRange,
          status: r.isFlagged ? 'critical_high' : 'normal'
        })) : [
          { name: 'Primary Index', value: '7.6', unit: 'U/L', referenceRange: 'Normal', status: 'normal' }
        ]
      };

      setPatients(prev => prev.map(p => {
        if (p.mrin === targetOrder.patientMrin) {
          return {
            ...p,
            clinicLabReports: [newReport, ...(p.clinicLabReports || [])]
          };
        }
        return p;
      }));
    }

    if (isPanic) {
      const panicNotif: HospitalNotification = {
        id: `notif-${Date.now()}`,
        title: `CRITICAL PANIC VALUE: Order ${orderId}`,
        message: `High risk values flagged on test results. Immediate doctor review required.`,
        type: 'lab_panic',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        targetRole: 'doctor'
      };
      setNotifications(prev => [panicNotif, ...prev]);
    }
  };

  // 5. Maintenance Bed Admission and Discharge
  const handleAdmitPatientToBed = (bedId: string, patient: PatientRecord, diagnosis: string, oxygenMode: HospitalBed['oxygenMode']) => {
    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status: 'occupied',
          patientName: patient.fullName,
          patientMrin: patient.mrin,
          diagnosis,
          admittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          oxygenMode
        };
      }
      return b;
    }));

    const admitNotif: HospitalNotification = {
      id: `notif-${Date.now()}`,
      title: `Bed Admission: ${bedId}`,
      message: `${patient.fullName} admitted with diagnosis "${diagnosis}". O2 mode: ${oxygenMode}.`,
      type: 'bed',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRole: 'maintenance'
    };
    setNotifications(prev => [admitNotif, ...prev]);
  };

  const handleDischargeBed = (bedId: string) => {
    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status: 'available',
          patientName: undefined,
          patientMrin: undefined,
          diagnosis: undefined,
          admittedAt: undefined,
          oxygenMode: 'Room Air'
        };
      }
      return b;
    }));
  };

  // 6. Doctor Orders Test Directly to Lab
  const handleDoctorOrderTestToLab = (testName: string, patientMrin: string, priority: 'Routine' | 'Urgent') => {
    const targetPatient = patients.find(p => p.mrin === patientMrin) || activePatient;
    const newOrder: LabOrderItem = {
      orderId: `ORD-${Date.now().toString().slice(-4)}`,
      testId: `TEST-${Date.now().toString().slice(-4)}`,
      testCode: 'VTL-LAB',
      testName,
      department: 'Clinical Pathology & Diagnostics',
      patientMrin: targetPatient.mrin,
      patientName: targetPatient.fullName,
      doctorName: activeDoctorName,
      priority: priority === 'Urgent' ? 'stat' : 'routine',
      orderedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ordered',
      priceBDT: 850
    };
    setLabOrders(prev => [newOrder, ...prev]);
  };

  // 7. Role Authentication / Switching
  const handleLoginAsRole = (role: AppRoleId, doctorName?: string, patientMrin?: string) => {
    if (patientMrin) {
      setActivePatientMrin(patientMrin);
    }
    if (doctorName) {
      setActiveDoctorName(doctorName);
    }
    setActiveRole(role);
    setIsAuthModalOpen(false);
    setNotificationBanner(`✓ Direct Login: Active as ${role.toUpperCase()} (${role === 'patient' ? patientMrin : role === 'doctor' ? (doctorName || activeDoctorName) : role})`);
    setTimeout(() => setNotificationBanner(null), 4000);
  };

  // 8. Import Prescription from Doctor to Patient Portal
  const handleImportToPatientPortal = (patient: PatientRecord) => {
    setActivePatientMrin(patient.mrin);
    setActiveRole('patient');
    setNotificationBanner(`✓ Scanned & Loaded Prescription for ${patient.fullName} (${patient.mrin})! All reminders populated.`);
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* App Sidebar 2 Block (Fixed on left) */}
      <AppSidebar
        currentRole={activeRole}
        onSelectRole={role => setActiveRole(role)}
        unreadCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
        onOpenPwaInstall={() => setIsPwaModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Quick Notification Toast Banner */}
      {notificationBanner && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{notificationBanner}</span>
        </div>
      )}

      {/* Top Clinical Integrity & Hospital Navigation Ribbon */}
      <div className="pl-16 bg-slate-950/95 backdrop-blur border-b border-slate-800/80 px-6 py-2.5 flex items-center justify-between text-xs text-slate-300 z-30 relative">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-white text-sm tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Dhaka Central Medical College &amp; Hospital (DCMCH)
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-emerald-400 font-mono text-[11px] font-bold">
            Hospital Information System (HIS) v3.4
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveRole('patient')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] transition shadow-sm ${
              activeRole === 'patient'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                : 'bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300'
            }`}
            title="Open Patient Mobile PWA & Smartphone Simulator"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>📱 Patient Mobile App</span>
          </button>

          <LanguageSwitcher variant="ribbon" />

          <button
            onClick={() => setIsEmergencySuiteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 font-bold text-[11px] transition shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Emergency CPR &amp; 999</span>
          </button>
        </div>
      </div>

      {/* Main View Router for all 9 Portals (pl-16 guarantees zero overlap with 64px fixed sidebar) */}
      <main className="flex-1 w-full pl-16">
        {/* App 7: Central Launchpad */}
        {activeRole === 'launchpad' && (
          <CentralLaunchpad
            onSelectRole={setActiveRole}
            onOpenPwaModal={() => setIsPwaModalOpen(true)}
            onOpenTurjuman={() => setIsTurjumanOpen(true)}
            onOpenClinicSense={() => setIsClinicSenseOpen(true)}
            onOpenGeoDispatch={() => setIsGeoDispatchOpen(true)}
            onOpenAiScheduler={() => setIsAiSchedulerOpen(true)}
            onOpenBedsideMonitor={() => setIsBedsideMonitorOpen(true)}
            onOpenCodeBlue={() => setIsCodeBlueOpen(true)}
            onOpenInteractionChecker={() => setIsInteractionCheckerOpen(true)}
            onOpenDiagnosticScreening={() => setIsDiagnosticScreeningOpen(true)}
            onOpenDischargeSummary={() => setIsDischargeSummaryOpen(true)}
            onOpenAdvocateGpt={() => setIsAdvocateGptOpen(true)}
            onOpenMentalHealth={() => setIsMentalHealthOpen(true)}
            onOpenAmbulanceRoute={() => setIsAmbulanceRouteOpen(true)}
            onOpenRpm={() => setIsRpmOpen(true)}
            onOpenSmartPill={() => setIsSmartPillOpen(true)}
            onOpenOutbreakPredictor={() => setIsOutbreakPredictorOpen(true)}
            onOpenBloodBank={() => setIsBloodBankOpen(true)}
            onOpenFraudDetection={() => setIsFraudDetectionOpen(true)}
          />
        )}

        {/* App 1: Receptionist Desk */}
        {activeRole === 'receptionist' && (
          <ReceptionistPortal
            patients={patients}
            onRegisterPatient={handleRegisterPatient}
            onNavigateToAssistant={() => setActiveRole('assistant')}
            onUpdatePatient={handleUpdatePatient}
            onDeletePatient={handleDeletePatient}
          />
        )}

        {/* App 2: Clinical Assistant (Triage) */}
        {activeRole === 'assistant' && (
          <AssistantPortal
            triageQueue={triageQueue}
            onCompleteTriage={handleCompleteTriage}
            onNavigateToDoctor={() => setActiveRole('doctor')}
          />
        )}

        {/* App 3: Doctor's Chamber */}
        {activeRole === 'doctor' && (
          <div>
            <DoctorPortal
              patients={patients}
              onUpdatePatient={handleUpdatePatient}
              onImportToPatientPortal={handleImportToPatientPortal}
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              onOrderTestToLab={handleDoctorOrderTestToLab}
              activeDoctorName={activeDoctorName}
              onSelectDoctorName={setActiveDoctorName}
              selectedPatientMrin={activePatientMrin}
              onSelectPatientMrin={setActivePatientMrin}
            />
          </div>
        )}

        {/* App 4: Diagnostic Lab Hub */}
        {activeRole === 'lab' && (
          <DiagnosticLabPortal
            labOrders={labOrders}
            onUpdateOrderStatus={handleUpdateLabOrderStatus}
            onOrderNewTest={handleOrderNewTest}
            patients={patients}
            onNavigateToDoctor={() => setActiveRole('doctor')}
          />
        )}

        {/* App 5: Patient Health SuperApp (Isolated Standalone Application) */}
        {activeRole === 'patient' && (
          <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center mx-auto border border-teal-500/30">
                <Smartphone className="w-7 h-7 text-teal-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
                  Consumer Mobile PWA Experience
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                  Vitality Patient Health Pocket (Standalone PWA)
                </h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                  Patient medication adherence, AdvocateGPT plain-language prescription explainer, and offline QR medical pass.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <a
                  href="/patient-portal-app/index.html"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-lg shadow-teal-950 flex items-center gap-2 transition hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Standalone Patient WebApp Tab</span>
                </a>

                <button
                  onClick={() => setActiveRole('launchpad')}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Return to Staff Launchpad
                </button>
              </div>
            </div>

            {/* Embedded Patient Preview */}
            <div className="rounded-3xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-950">
              <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  In-Portal Live Mobile Preview ({activePatient.fullName})
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">Synchronized Patient Record (Live FHIR)</span>
              </div>
              <PatientPortal
                patient={activePatient}
                onUpdatePatient={handleUpdatePatient}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              />
            </div>
          </div>
        )}

        {/* App 6: Hospital Operational Command Center (Maintenance) */}
        {activeRole === 'maintenance' && (
          <MaintenancePortal
            beds={beds}
            patients={patients}
            onAdmitPatientToBed={handleAdmitPatientToBed}
            onDischargeBed={handleDischargeBed}
            onNavigateToHub={() => setActiveRole('central_hub')}
          />
        )}

        {/* App 9: Vitality Pharmacy & Hospital Medical Store Hub */}
        {activeRole === 'pharmacy' && (
          <PharmacyPortal
            patients={patients}
            onNavigateToLaunchpad={() => setActiveRole('launchpad')}
            onNavigateToDoctor={() => setActiveRole('doctor')}
          />
        )}

        {/* Hub 8: Master Data Backbone & Patient Registry */}
        {activeRole === 'central_hub' && (
          <CentralHubSystem
            patients={patients}
            labOrders={labOrders}
            beds={beds}
            auditLogs={auditLogs}
            onNavigateToLaunchpad={() => setActiveRole('launchpad')}
            onUpdatePatient={handleUpdatePatient}
          />
        )}
      </main>

      {/* 1-Click Role Login & Identity Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginAsRole={handleLoginAsRole}
        patients={patients}
      />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        patients={patients}
        onSelectPatient={mrin => setActivePatientMrin(mrin)}
        onNavigateApp={role => setActiveRole(role)}
        onSelectTest={test => {
          handleOrderNewTest(test, activePatientMrin);
          setActiveRole('lab');
        }}
      />

      {/* Notifications Popover */}
      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onSelectNotification={notif => {
          if (notif.type === 'lab_panic' || notif.type === 'triage') {
            setActiveRole('doctor');
          } else if (notif.type === 'bed') {
            setActiveRole('maintenance');
          }
          setIsNotificationsOpen(false);
        }}
        onNavigateApp={role => setActiveRole(role)}
      />

      {/* PWA & Browser Extension Download Hero */}
      <PwaExtensionBanner
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />

      {/* Gemini API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Emergency First Aid & CPR Suite Global Modal */}
      {isEmergencySuiteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-8">
            <EmergencyFirstAidSuite 
              patient={activePatient} 
              onClose={() => setIsEmergencySuiteOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* 10 Next-Gen Strategic Clinical AI Modals (4 Pillars) */}
      <EmergencyTurjumanModal
        isOpen={isTurjumanOpen}
        onClose={() => setIsTurjumanOpen(false)}
        onTranslateToTriage={(complaint, pain) => {
          setActiveRole('assistant');
          setNotificationBanner(`Emergency Turjuman: "${complaint}" (Pain: ${pain}/10) routed to Triage!`);
          setTimeout(() => setNotificationBanner(null), 4000);
        }}
      />

      <ClinicSenseModal
        isOpen={isClinicSenseOpen}
        onClose={() => setIsClinicSenseOpen(false)}
        onConfirmTriageRoute={(result) => {
          setActiveRole('assistant');
          setNotificationBanner(`Clinic Sense: ${result.level} -> ${result.routeDestination}`);
          setTimeout(() => setNotificationBanner(null), 4000);
        }}
      />

      <HospitalBedGeoDispatchModal
        isOpen={isGeoDispatchOpen}
        onClose={() => setIsGeoDispatchOpen(false)}
        onBedReserved={(hospital, bed) => {
          setNotificationBanner(`Emergency Geo-Dispatch: ${bed} locked at ${hospital}!`);
          setTimeout(() => setNotificationBanner(null), 5000);
        }}
      />

      <AiAppointmentSchedulerModal
        isOpen={isAiSchedulerOpen}
        onClose={() => setIsAiSchedulerOpen(false)}
      />

      <SmartBedsideMonitorModal
        isOpen={isBedsideMonitorOpen}
        onClose={() => setIsBedsideMonitorOpen(false)}
        patientName={activePatient?.fullName}
      />

      <CodeBlueCopilotModal
        isOpen={isCodeBlueOpen}
        onClose={() => setIsCodeBlueOpen(false)}
        patientName={activePatient?.fullName}
        patientMrin={activePatient?.mrin}
      />

      <MedicineInteractionCheckerModal
        isOpen={isInteractionCheckerOpen}
        onClose={() => setIsInteractionCheckerOpen(false)}
        patientAllergies={activePatient?.knownDrugAllergies || ['Penicillins']}
        onApplyPrescriptionWarning={(count) => {
          setNotificationBanner(`Pharmacological Sentinel: ${count} potential interactions audited.`);
          setTimeout(() => setNotificationBanner(null), 4000);
        }}
      />

      <AiDiagnosticScreeningModal
        isOpen={isDiagnosticScreeningOpen}
        onClose={() => setIsDiagnosticScreeningOpen(false)}
        patientName={activePatient?.fullName}
        patientMrin={activePatient?.mrin}
      />

      <DischargeSummaryGeneratorModal
        isOpen={isDischargeSummaryOpen}
        onClose={() => setIsDischargeSummaryOpen(false)}
        patientName={activePatient?.fullName}
        patientMrin={activePatient?.mrin}
      />

      <AdvocateGptCaregiverModal
        isOpen={isAdvocateGptOpen}
        onClose={() => setIsAdvocateGptOpen(false)}
        patientName={activePatient?.fullName}
      />

      <MentalHealthChatbotModal
        isOpen={isMentalHealthOpen}
        onClose={() => setIsMentalHealthOpen(false)}
        patientName={activePatient?.fullName}
      />

      <AmbulanceRouteOptimizerModal
        isOpen={isAmbulanceRouteOpen}
        onClose={() => setIsAmbulanceRouteOpen(false)}
        patientName={activePatient?.fullName}
      />

      <RemotePatientMonitoringModal
        isOpen={isRpmOpen}
        onClose={() => setIsRpmOpen(false)}
        patientName={activePatient?.fullName}
        patientMrin={activePatient?.mrin}
      />

      <SmartPillReminderModal
        isOpen={isSmartPillOpen}
        onClose={() => setIsSmartPillOpen(false)}
        patientName={activePatient?.fullName}
      />

      <DiseaseOutbreakPredictorModal
        isOpen={isOutbreakPredictorOpen}
        onClose={() => setIsOutbreakPredictorOpen(false)}
      />

      <BloodBankConnectorModal
        isOpen={isBloodBankOpen}
        onClose={() => setIsBloodBankOpen(false)}
        patientName={activePatient?.fullName}
      />

      <HealthcareFraudDetectionModal
        isOpen={isFraudDetectionOpen}
        onClose={() => setIsFraudDetectionOpen(false)}
      />

      {/* 180s Pitch Video Architecture & Impact Overlays */}
      <AiArchitecturePipelineModal
        isOpen={isAiArchitectureOpen}
        onClose={() => setIsAiArchitectureOpen(false)}
      />

      <ClinicalImpactModal
        isOpen={isClinicalImpactOpen}
        onClose={() => setIsClinicalImpactOpen(false)}
      />

      {/* Global Quick Floating Language Switcher */}
      <LanguageSwitcher variant="floating" />
    </div>
  );
}

export default App;
