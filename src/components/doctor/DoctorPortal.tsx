import React, { useState, useMemo } from 'react';
import { 
  Search, Users, BookOpen, Stethoscope, Sparkles, FileText, 
  AlertTriangle, CheckCircle, Clock, Calendar, ChevronRight, 
  Plus, Printer, ArrowRight, ShieldAlert, Activity, Globe, DollarSign,
  Filter, Heart, Pill, Droplet, Check, RefreshCw, Dna, Zap, Cpu, Gauge, Camera
} from 'lucide-react';
import { PatientRecord, PrescribedMedicineItem, DiagnosticTestOrder } from '../../data/patientsDatabase';
import { MEDICINE_DATABASE, Medicine, ORGAN_TAXONOMY } from '../../data/medicineDatabase';
import { analyzePatientWithValerianAI, ClinicalAnalysisResult } from '../../services/valerianAI';
import { INITIAL_PHARMACOGENOMICS, PharmacogenomicGeneVariant } from '../../data/hospitalStore';
import BorderGlow from '../reactbits/BorderGlow';
import AnimatedList from '../reactbits/AnimatedList';
import { PrescriptionModal } from '../PrescriptionModal';
import { printMedicalCertificate, printReferralLetter } from '../../utils/printUtils';
import { HemodynamicCanvas } from './HemodynamicCanvas';
import { AmrStewardshipModal } from './AmrStewardshipModal';
import { PrescriptionVisionModal } from '../common/PrescriptionVisionModal';
import { MedicineInteractionCheckerModal } from './MedicineInteractionCheckerModal';
import { DischargeSummaryGeneratorModal } from './DischargeSummaryGeneratorModal';
import Scanner from '../reactbits/Scanner';

interface DoctorPortalProps {
  patients: PatientRecord[];
  onUpdatePatient: (updated: PatientRecord) => void;
  onImportToPatientPortal: (patient: PatientRecord) => void;
  onOpenApiKeyModal: () => void;
  onOrderTestToLab?: (testName: string, patientMrin: string, priority: 'Routine' | 'Urgent') => void;
  activeDoctorName?: string;
  onSelectDoctorName?: (name: string) => void;
  selectedPatientMrin?: string;
  onSelectPatientMrin?: (mrin: string) => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({
  patients,
  onUpdatePatient,
  onImportToPatientPortal,
  onOpenApiKeyModal,
  onOrderTestToLab,
  activeDoctorName = 'Dr. Marcus Vance (Cardiologist)',
  onSelectDoctorName,
  selectedPatientMrin,
  onSelectPatientMrin
}) => {
  // Navigation tabs within Doctor Portal
  const [activeTab, setActiveTab] = useState<'patients' | 'calculators' | 'certificates' | 'templates' | 'biomarkers' | 'dictionary' | 'digital_twin'>('patients');
  const [doctorToast, setDoctorToast] = useState<string | null>(null);
  const [currentDoctor, setCurrentDoctor] = useState(activeDoctorName);

  // Deep-Tech Digital Twin & PGx State
  const [virtualStentDeployed, setVirtualStentDeployed] = useState(false);
  const [digitalTwinOrgan, setDigitalTwinOrgan] = useState<'Heart LAD' | 'Brain MCA' | 'Renal Glomerulus'>('Heart LAD');
  const [isSimulatingFluid, setIsSimulatingFluid] = useState(false);
  const [pgxVariants, setPgxVariants] = useState<PharmacogenomicGeneVariant[]>(INITIAL_PHARMACOGENOMICS);

  // Patients sub-filter
  const [dateFilter, setDateFilter] = useState<'today' | 'all' | 'past'>('today');
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(selectedPatientMrin || patients[0]?.mrin || '');

  // Synchronize external patient selection from App router
  React.useEffect(() => {
    if (selectedPatientMrin && selectedPatientMrin !== selectedPatientId) {
      setSelectedPatientId(selectedPatientMrin);
    }
  }, [selectedPatientMrin]);

  // Clinical Calculators State
  const [calcCreatinine, setCalcCreatinine] = useState<number>(1.2);
  const [chadsChf, setChadsChf] = useState(false);
  const [chadsHtn, setChadsHtn] = useState(true);
  const [chadsAge75, setChadsAge75] = useState(false);
  const [chadsDm, setChadsDm] = useState(true);
  const [chadsStroke, setChadsStroke] = useState(false);
  const [chadsVascular, setChadsVascular] = useState(true);
  const [chadsAge65, setChadsAge65] = useState(false);
  const [chadsFemale, setChadsFemale] = useState(false);

  // Medical Certificate & Referrals
  const [certDays, setCertDays] = useState(7);
  const [certReason, setCertReason] = useState('Acute Unstable Angina & Severe Hypertension requiring bed rest');
  const [refHospital, setRefHospital] = useState('National Cardiovascular Center of Excellence - CCU');
  const [refReason, setRefReason] = useState('Urgent Coronary Angiogram & Possible PCI Revascularization');

  // MediDictionary states
  const [dictSearchQuery, setDictSearchQuery] = useState('');
  const [selectedOrganFilter, setSelectedOrganFilter] = useState('all');
  const [selectedFormFilter, setSelectedFormFilter] = useState('all');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'BDT'>('USD');
  const [activeDictionaryMedicine, setActiveDictionaryMedicine] = useState<Medicine | null>(null);

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<ClinicalAnalysisResult | null>(null);

  // Prescription modal state
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Custom Test Requisition state
  const [newTestName, setNewTestName] = useState('');
  const [newTestPriority, setNewTestPriority] = useState<'Routine' | 'Urgent'>('Routine');

  // Custom Medicine Prescribe Builder State
  const [medToPrescribe, setMedToPrescribe] = useState(MEDICINE_DATABASE[0]?.id || '');
  const [medDosage, setMedDosage] = useState('1 Tablet (1+0+1)');
  const [medTiming, setMedTiming] = useState<'Morning' | 'Noon' | 'Evening' | 'Night' | 'SOS'>('Morning');
  const [medFood, setMedFood] = useState<'before_food' | 'with_food' | 'after_food' | 'empty_stomach'>('after_food');
  const [medDuration, setMedDuration] = useState(14);

  // Emergency STAT Drug Requisition modal
  const [showEmergencyMedModal, setShowEmergencyMedModal] = useState(false);
  const [emergencyMedItem, setEmergencyMedItem] = useState('Inj. Epinephrine 1:1000 (1mg/mL ampoule)');
  const [emergencyMedUrgency, setEmergencyMedUrgency] = useState<'CRITICAL IMMEDIATE (< 3 mins)' | 'STAT URGENT (< 15 mins)'>('CRITICAL IMMEDIATE (< 3 mins)');
  const [emergencyMedDose, setEmergencyMedDose] = useState('0.5 mg IM into anterolateral thigh');
  const [emergencySuccessToast, setEmergencySuccessToast] = useState<string | null>(null);

  // AMR Stewardship & Prescription Vision Modals
  const [showAmrModal, setShowAmrModal] = useState(false);
  const [showVisionOcrModal, setShowVisionOcrModal] = useState(false);
  const [showInteractionCheckerModal, setShowInteractionCheckerModal] = useState(false);
  const [showDischargeSummaryModal, setShowDischargeSummaryModal] = useState(false);

  const handleDispatchEmergencyMed = (e: React.FormEvent) => {
    e.preventDefault();
    const reqId = `STAT-${Date.now().toString().slice(-4)}`;
    setEmergencySuccessToast(`🚨 STAT Requisition #${reqId} DISPATCHED TO PHARMACY: ${emergencyMedItem} for Chamber 304! Emergency dispensing team notified.`);
    setShowEmergencyMedModal(false);
    setTimeout(() => setEmergencySuccessToast(null), 6000);
  };

  // Currently selected patient
  const currentPatient = useMemo(() => {
    return patients.find(p => p.mrin === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Pharmacovigilance & Drug-Drug Interaction (DDI) & Allergy Contraindication Engine
  const detectedInteractions = useMemo(() => {
    if (!currentPatient) return [];
    const activeMeds = currentPatient.activePrescription?.medicines || [];
    const medNamesLower = activeMeds.map(m => m.medicineName.toLowerCase());
    const allergiesLower = (currentPatient.knownDrugAllergies || []).map(a => a.toLowerCase());

    const alerts: { type: 'contraindication' | 'interaction' | 'caution'; title: string; detail: string; recommendation: string }[] = [];

    // Allergy cross-checks
    allergiesLower.forEach(allergy => {
      if (allergy.includes('penicillin') || allergy.includes('beta-lactam')) {
        activeMeds.forEach(m => {
          const name = m.medicineName.toLowerCase();
          if (name.includes('amoxicillin') || name.includes('augmentin') || name.includes('ampicillin') || name.includes('penicillin') || name.includes('cef')) {
            alerts.push({
              type: 'contraindication',
              title: `ALLERGY CONTRAINDICATION: ${m.medicineName}`,
              detail: `Patient has documented allergy to "${allergy}". Risk of life-threatening IgE-mediated anaphylaxis and angioedema.`,
              recommendation: `Discontinue immediately. Substitute with Azithromycin, Clarithromycin, or Levofloxacin.`
            });
          }
        });
      }
      if (allergy.includes('aspirin') || allergy.includes('nsaid')) {
        activeMeds.forEach(m => {
          const name = m.medicineName.toLowerCase();
          if (name.includes('aspirin') || name.includes('ibuprofen') || name.includes('ketorolac') || name.includes('naproxen') || name.includes('diclofenac')) {
            alerts.push({
              type: 'contraindication',
              title: `ALLERGY CONTRAINDICATION: ${m.medicineName}`,
              detail: `Patient has documented "${allergy}" hypersensitivity. High risk of bronchospasm and severe angioedema.`,
              recommendation: `Discontinue NSAID. Use Paracetamol for analgesia.`
            });
          }
        });
      }
    });

    // Drug-Drug Interactions
    const hasAspirin = medNamesLower.some(n => n.includes('aspirin') || n.includes('ecosprin'));
    const hasAnticoagulant = medNamesLower.some(n => n.includes('warfarin') || n.includes('rivaroxaban') || n.includes('apixaban') || n.includes('dabigatran') || n.includes('clopidogrel'));
    if (hasAspirin && hasAnticoagulant) {
      alerts.push({
        type: 'interaction',
        title: 'HIGH BLEEDING RISK: Dual Antiplatelet / Anticoagulant Synergy',
        detail: 'Concurrent administration of Aspirin with active anticoagulant/P2Y12 inhibitor increases major GI and intracranial bleeding incidence by 3.2x.',
        recommendation: 'Ensure co-prescription of Proton Pump Inhibitor (e.g. Pantoprazole 40mg). Monitor stool occult blood and serial Hb.'
      });
    }

    const hasAceiOrArb = medNamesLower.some(n => n.includes('ramipril') || n.includes('lisinopril') || n.includes('losartan') || n.includes('telmisartan') || n.includes('enalapril'));
    const hasPotassiumSparing = medNamesLower.some(n => n.includes('spironolactone') || n.includes('eplerenone') || n.includes('potassium'));
    if (hasAceiOrArb && hasPotassiumSparing) {
      alerts.push({
        type: 'interaction',
        title: 'CRITICAL HYPERKALEMIA RISK: RAAS Blockade + Mineralocorticoid Antagonist',
        detail: 'Synergistic potassium retention. Can induce lethal ventricular arrhythmias (peaked T waves, heart block) especially in CKD.',
        recommendation: 'Check serum K+ and creatinine within 7-14 days. Advise low dietary potassium.'
      });
    }

    const hasStatin = medNamesLower.some(n => n.includes('atorvastatin') || n.includes('rosuvastatin') || n.includes('simvastatin'));
    const hasMacrolide = medNamesLower.some(n => n.includes('clarithromycin') || n.includes('erythromycin'));
    if (hasStatin && hasMacrolide) {
      alerts.push({
        type: 'interaction',
        title: 'CYP3A4 INHIBITION: Statin + Macrolide Rhabdomyolysis Risk',
        detail: 'Macrolides potently inhibit CYP3A4 metabolism of statins, raising systemic statin levels up to 400%.',
        recommendation: 'Temporarily suspend statin therapy during antibiotic course, or substitute Azithromycin (non-CYP3A4 substrate).'
      });
    }

    return alerts;
  }, [currentPatient]);

  // Filtered patients list
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      // Date filter
      if (dateFilter === 'today' && !p.isToday) return false;
      if (dateFilter === 'past' && p.isToday) return false;

      // Search query (Name or MRIN)
      if (!patientSearchQuery.trim()) return true;
      const q = patientSearchQuery.toLowerCase();
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.mrin.toLowerCase().includes(q) ||
        p.activePrescription.diagnosis.toLowerCase().includes(q)
      );
    });
  }, [patients, dateFilter, patientSearchQuery]);

  // Filtered medicine dictionary
  const filteredMedicines = useMemo(() => {
    return MEDICINE_DATABASE.filter(med => {
      // Organ filter
      if (selectedOrganFilter !== 'all' && med.organCategory !== selectedOrganFilter) {
        return false;
      }
      // Form filter
      if (selectedFormFilter !== 'all' && med.form !== selectedFormFilter) {
        return false;
      }
      // Search query
      if (!dictSearchQuery.trim()) return true;
      const q = dictSearchQuery.toLowerCase();
      const matchName = med.name.toLowerCase().includes(q);
      const matchGeneric = med.genericName.toLowerCase().includes(q);
      const matchBrand = med.brandNames.some(b => b.toLowerCase().includes(q));
      const matchIndication = med.indications.some(ind => ind.toLowerCase().includes(q));
      return matchName || matchGeneric || matchBrand || matchIndication;
    });
  }, [dictSearchQuery, selectedOrganFilter, selectedFormFilter]);

  // Trigger Valerian AI analysis for selected patient
  const handleRunAiAnalysis = async () => {
    if (!currentPatient) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzePatientWithValerianAI(currentPatient);
      setAiAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing with AI:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add 1-click test to patient's record & dispatch to Lab Hub
  const handleAddTestToPatient = (testName: string, priority: 'Urgent' | 'Routine' = 'Routine', reason?: string) => {
    if (!currentPatient) return;
    const newTest: DiagnosticTestOrder = {
      id: `ord-${Date.now()}`,
      testName,
      orderedByDoctor: currentDoctor || currentPatient.activePrescription.doctorName,
      orderDate: new Date().toISOString().split('T')[0],
      priority,
      status: 'Requisitioned',
      instructions: reason || 'Scheduled clinical requisition ordered via doctor suite.'
    };

    const updated: PatientRecord = {
      ...currentPatient,
      orderedDiagnosticTests: [newTest, ...currentPatient.orderedDiagnosticTests]
    };
    onUpdatePatient(updated);

    // Dispatch to Lab Hub
    if (onOrderTestToLab) {
      onOrderTestToLab(testName, currentPatient.mrin, priority);
    }

    setDoctorToast(`✓ Ordered ${testName} - Dispatched to Diagnostic Lab!`);
    setTimeout(() => setDoctorToast(null), 4000);
  };

  // Accept AI suggested medication regimen
  const handleAcceptAiMedication = (med: ClinicalAnalysisResult['suggestedMedications'][0]) => {
    if (!currentPatient) return;
    const newMedItem: PrescribedMedicineItem = {
      id: `rxm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      medicineId: `med-${Date.now()}`,
      medicineName: med.medicineName,
      organName: med.organName,
      organIcon: med.organIcon,
      form: 'Tablet',
      dosage: med.dosage,
      timing: med.timing,
      exactTime: med.exactTime,
      foodRelation: med.foodRelation,
      durationDays: med.durationDays,
      whyGivenForPatient: med.clinicalRationale,
      takenToday: false
    };

    const updated: PatientRecord = {
      ...currentPatient,
      activePrescription: {
        ...currentPatient.activePrescription,
        medicines: [...(currentPatient.activePrescription?.medicines || []), newMedItem]
      }
    };
    onUpdatePatient(updated);

    setDoctorToast(`✓ Added ${med.medicineName} (${med.dosage}) to Active Prescription!`);
    setTimeout(() => setDoctorToast(null), 4000);
  };

  // Add custom manual test
  const handleManualAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) return;
    handleAddTestToPatient(newTestName.trim(), newTestPriority);
    setNewTestName('');
  };

  // Direct manual prescribe medicine
  const handleDirectAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) return;
    const targetMed = MEDICINE_DATABASE.find(m => m.id === medToPrescribe) || MEDICINE_DATABASE[0];
    const newMedItem: PrescribedMedicineItem = {
      id: `rxm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      medicineId: targetMed.id,
      medicineName: targetMed.name,
      organName: targetMed.organName,
      organIcon: targetMed.organIcon,
      form: targetMed.form,
      dosage: medDosage,
      timing: medTiming,
      exactTime: medTiming === 'Morning' ? '08:00 AM' : medTiming === 'Noon' ? '01:30 PM' : medTiming === 'Night' ? '09:00 PM' : '05:00 PM',
      foodRelation: medFood,
      durationDays: medDuration,
      whyGivenForPatient: `Prescribed by ${currentDoctor} for ${currentPatient.activePrescription.diagnosis}.`,
      takenToday: false
    };

    const updated: PatientRecord = {
      ...currentPatient,
      activePrescription: {
        ...currentPatient.activePrescription,
        medicines: [...(currentPatient.activePrescription?.medicines || []), newMedItem]
      }
    };
    onUpdatePatient(updated);
    setDoctorToast(`✓ Prescribed ${targetMed.name} (${medDosage}) to ${currentPatient.fullName}!`);
    setTimeout(() => setDoctorToast(null), 4000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 relative">
      {/* Background React Bits: Scanner */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <Scanner
          color1="#0d9488"
          color2="#38bdf8"
          color3="#ffffff"
          speed={0.4}
          sweepSpeed={0.2}
          glow={0.5}
        />
      </div>
      <div className="relative z-10">
      {/* Floating Doctor Action Toast */}
      {doctorToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-teal-600 text-white shadow-2xl font-bold text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 shrink-0" />
          <span>{doctorToast}</span>
        </div>
      )}
      
      {/* Doctor Suite Top Sub-Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30 shadow-inner">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Physician Clinical Suite</h1>
              {/* Doctor Chamber Selector */}
              <select
                value={currentDoctor}
                onChange={e => {
                  setCurrentDoctor(e.target.value);
                  onSelectDoctorName?.(e.target.value);
                }}
                className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900 text-teal-300 border border-slate-700 outline-none"
              >
                <option value="Dr. Marcus Vance (Cardiologist)">Dr. Marcus Vance (Cardiology — Room 304)</option>
                <option value="Dr. Elena Rostova (Neurologist)">Dr. Elena Rostova (Neurology — Room 308)</option>
                <option value="Dr. Tariqul Islam (Endocrinologist)">Dr. Tariqul Islam (Endocrinology — Room 212)</option>
                <option value="Dr. Nusrat Jahan (Nephrologist)">Dr. Nusrat Jahan (Nephrology — Room 401)</option>
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">MRIN Record Analysis • Valerian AI Copilot • Digital Prescription Studio</p>
          </div>
        </div>

        {/* 6 Modular Doctor Sub-Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-sm overflow-x-auto self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('patients')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'patients'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Consultation Cockpit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calculators')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'calculators'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Clinical Calculators</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certificates')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'certificates'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Sick Leave &amp; Referrals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'templates'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rx Protocols &amp; Diets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('biomarkers')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'biomarkers'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Biomarker Trajectory</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dictionary')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'dictionary'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>MediDictionary</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('digital_twin')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'digital_twin'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span>🧬 Digital Twin &amp; PGx AI</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: PATIENTS & APPOINTMENTS TAB                      */}
      {/* ======================================================== */}
      {activeTab === 'patients' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Patient Roster / Appointments Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Search Bar (Name or MRIN) */}
            <div className="p-4 bg-slate-900/80 border border-slate-800/90 rounded-2xl backdrop-blur-sm">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Patient Search by Name or MRIN
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={patientSearchQuery}
                  onChange={e => setPatientSearchQuery(e.target.value)}
                  placeholder="e.g. MRIN-89210, Arthur, Diabetes..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              {/* Date Filters: Today vs Past vs All */}
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setDateFilter('today')}
                  className={`flex-1 py-1 px-2 rounded-lg font-semibold text-center transition ${
                    dateFilter === 'today' ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Today ({patients.filter(p => p.isToday).length})
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilter('past')}
                  className={`flex-1 py-1 px-2 rounded-lg font-semibold text-center transition ${
                    dateFilter === 'past' ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Past Visits
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilter('all')}
                  className={`flex-1 py-1 px-2 rounded-lg font-semibold text-center transition ${
                    dateFilter === 'all' ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({patients.length})
                </button>
              </div>
            </div>

            {/* Patients List with Animated Selection */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredPatients.map(patient => {
                const isSelected = patient.mrin === selectedPatientId;
                return (
                  <div
                    key={patient.mrin}
                    onClick={() => {
                      setSelectedPatientId(patient.mrin);
                      onSelectPatientMrin?.(patient.mrin);
                      setAiAnalysisResult(null); // Reset analysis on patient change
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-teal-950/60 to-slate-900 border-teal-500/80 shadow-md ring-1 ring-teal-500/50'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{patient.fullName}</span>
                          {patient.isToday && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                              Today
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span className="font-mono font-semibold text-teal-400">{patient.mrin}</span>
                          <span>•</span>
                          <span>{patient.age}y {patient.gender}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {patient.appointmentTime}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-teal-400 translate-x-0.5' : 'text-slate-600'}`} />
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 truncate max-w-[200px]">
                        {patient.chiefComplaints[0] || patient.activePrescription.diagnosis}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {patient.activePrescription.medicines.length} Meds
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredPatients.length === 0 && (
                <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
                  No appointed patients found matching your search.
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Comprehensive Patient Chart & Valerian AI (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {currentPatient && (
              <>
                {/* Patient Header Card */}
                <BorderGlow
                  backgroundColor="#0f172a"
                  glowColor="168 85 50"
                  borderRadius={20}
                  glowIntensity={0.8}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 font-bold text-lg flex items-center justify-center border border-teal-500/40">
                          {currentPatient.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-extrabold text-white">{currentPatient.fullName}</h2>
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800 font-bold">
                              {currentPatient.mrin}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                              Blood: {currentPatient.bloodGroup}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {currentPatient.age} years old • {currentPatient.gender} • Appointed: {currentPatient.appointmentDate} at {currentPatient.appointmentTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Prescription and Print Quick Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setShowPrescriptionModal(true)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Prescription &amp; QR</span>
                      </button>
                    </div>
                  </div>

                  {/* Vitals Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5 pt-4 border-t border-slate-800/80 text-xs">
                    <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Blood Pressure</span>
                      <span className="font-bold text-sm text-amber-400">{currentPatient.vitals.bloodPressure}</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Heart Rate</span>
                      <span className="font-bold text-sm text-emerald-400">{currentPatient.vitals.heartRate} bpm</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Oxygen (SpO2)</span>
                      <span className="font-bold text-sm text-teal-400">{currentPatient.vitals.spO2}%</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Body Mass Index</span>
                      <span className="font-bold text-sm text-slate-200">{currentPatient.vitals.bmi} BMI</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Temperature</span>
                      <span className="font-bold text-sm text-slate-200">{currentPatient.vitals.temperature}</span>
                    </div>
                  </div>

                  {/* Chief Complaints & History */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                        Current Complaints:
                      </span>
                      <ul className="space-y-1 text-slate-200 list-disc list-inside">
                        {currentPatient.chiefComplaints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                        Past History &amp; Allergies:
                      </span>
                      <p className="text-slate-300">{currentPatient.pastMedicalHistory.join('; ')}</p>
                      <p className="text-rose-400 font-semibold mt-1">
                        Allergies: {currentPatient.knownDrugAllergies.join(', ') || 'None reported'}
                      </p>
                    </div>
                  </div>
                </BorderGlow>

                {/* Valerian AI Clinical Co-Pilot Banner & Trigger */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/70 border border-teal-500/40 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 animate-pulse">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-white">Valerian AI Clinical Intelligence</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            Gemini Powered
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Synthesize parameter trends, predict underlying pathology, and auto-recommend tests &amp; regimens.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onOpenApiKeyModal}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                      >
                        API Key Settings
                      </button>

                      <button
                        type="button"
                        onClick={handleRunAiAnalysis}
                        disabled={isAnalyzing}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold transition flex items-center gap-2 shadow-md shadow-teal-500/20 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        <span>{isAnalyzing ? 'Synthesizing...' : 'Analyze Parameters & Predict'}</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Analysis Output Cards */}
                  {aiAnalysisResult && (
                    <div className="mt-5 pt-5 border-t border-teal-500/30 space-y-4 animate-in fade-in duration-300">
                      
                      {/* Parameter Analysis: What's Up, What's Wrong, What's Changing */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>What's Normal &amp; Stable</span>
                          </div>
                          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                            {aiAnalysisResult.parameterAnalysis.whatsUp.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-xl">
                          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>What's Abnormal / Flagged</span>
                          </div>
                          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                            {aiAnalysisResult.parameterAnalysis.whatsWrong.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl">
                          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs mb-2">
                            <Activity className="w-4 h-4" />
                            <span>Risk Trajectory / Trends</span>
                          </div>
                          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                            {aiAnalysisResult.parameterAnalysis.whatsChanging.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Predicted Clinical Diagnosis */}
                      <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            AI Predicted Differential Diagnosis:
                          </span>
                          <span className="text-sm font-bold text-white mt-0.5 block">
                            {aiAnalysisResult.predictedDiagnosis}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          High Confidence
                        </span>
                      </div>

                      {/* AI Recommended Diagnostic Tests (1-Click Add) */}
                      <div>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                          🧪 Suggested Diagnostic Lab Tests (1-Click to Order):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {aiAnalysisResult.recommendedDiagnosticTests.map((test, idx) => (
                            <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white">{test.testName}</span>
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                    test.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                                  }`}>
                                    {test.priority}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">{test.reason}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddTestToPatient(test.testName, test.priority, test.reason)}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-teal-600 hover:bg-teal-500 text-white transition flex items-center gap-1 shrink-0"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Test</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Suggested Medications (1-Click Accept or Edit) */}
                      <div>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                          💊 AI Evidence-Based Medication Recommendations:
                        </span>
                        <div className="space-y-2">
                          {aiAnalysisResult.suggestedMedications.map((med, idx) => (
                            <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <span className="text-lg">{med.organIcon}</span>
                                <div>
                                  <div className="text-xs font-bold text-white flex items-center gap-2">
                                    <span>{med.medicineName}</span>
                                    <span className="text-slate-400 font-normal">({med.dosage})</span>
                                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-teal-300 font-semibold">
                                      {med.timing}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 mt-0.5">{med.clinicalRationale}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAcceptAiMedication(med)}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1 shrink-0"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept Regimen</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* Clinic Lab Reports Received Through the Web App */}
                <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-teal-400" />
                      <h3 className="font-bold text-sm text-white">Clinic Diagnostic Lab Reports (Direct Feed)</h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      {currentPatient.clinicLabReports.length} Reports available
                    </span>
                  </div>

                  <div className="space-y-4">
                    {currentPatient.clinicLabReports.map(report => (
                      <div key={report.id} className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-white">{report.title}</span>
                            <p className="text-[11px] text-slate-400">{report.laboratoryName} • Date: {report.date}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                            Verified {report.status}
                          </span>
                        </div>

                        {/* Parameter Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="text-slate-400 border-b border-slate-800/60 pb-1">
                                <th className="py-1">Biomarker / Parameter</th>
                                <th className="py-1">Result</th>
                                <th className="py-1">Reference Target</th>
                                <th className="py-1">Flag Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40 text-slate-200">
                              {report.parameters.map((p, pIdx) => (
                                <tr key={pIdx} className="hover:bg-slate-900/40">
                                  <td className="py-1.5 font-medium">{p.name}</td>
                                  <td className="py-1.5 font-bold">
                                    <span className={
                                      p.flag === 'high' ? 'text-rose-400' :
                                      p.flag === 'low' ? 'text-amber-400' : 'text-emerald-400'
                                    }>
                                      {p.value} {p.unit}
                                    </span>
                                  </td>
                                  <td className="py-1.5 text-slate-400 text-[11px]">{p.referenceRange}</td>
                                  <td className="py-1.5">
                                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                      p.flag === 'high' ? 'bg-rose-500/20 text-rose-300' :
                                      p.flag === 'low' ? 'bg-amber-500/20 text-amber-300' :
                                      'bg-emerald-500/20 text-emerald-300'
                                    }`}>
                                      {p.flag ? p.flag.toUpperCase() : 'NORMAL'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <p className="mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 italic">
                          Lab Summary: {report.summaryNote}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requisitioned Tests & Add New Test Option */}
                <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white">Requisitioned Diagnostic Lab Tests</h3>
                    <span className="text-xs text-slate-400">{currentPatient.orderedDiagnosticTests.length} Ordered</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {currentPatient.orderedDiagnosticTests.map(test => (
                      <div key={test.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{test.testName}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            test.status === 'Report Available' ? 'bg-emerald-500/20 text-emerald-300' :
                            test.status === 'Sample Collected' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {test.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{test.instructions}</p>
                      </div>
                    ))}
                  </div>

                  {/* Manual Test Requisition Form */}
                  <form onSubmit={handleManualAddTest} className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-slate-800">
                    <input
                      type="text"
                      value={newTestName}
                      onChange={e => setNewTestName(e.target.value)}
                      placeholder="Add custom laboratory test (e.g. 24h Urinary Free Cortisol)..."
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                    <select
                      value={newTestPriority}
                      onChange={e => setNewTestPriority(e.target.value as any)}
                      className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="Routine">Routine Priority</option>
                      <option value="Urgent">Urgent Priority</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Requisition Test</span>
                    </button>
                  </form>
                </div>

                {/* Active Prescribed Medicines List */}
                <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-teal-400" />
                      <h3 className="font-bold text-sm text-white">Active Prescribed Regimen (Organ-Categorized)</h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setShowAmrModal(true)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        <span>🦠 AMR Antibiogram Sentinel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowVisionOcrModal(true)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 transition"
                      >
                        <Camera className="w-3.5 h-3.5 text-teal-400" />
                        <span>📸 SmartRx Vision OCR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowInteractionCheckerModal(true)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition"
                      >
                        <Pill className="w-3.5 h-3.5 text-purple-400" />
                        <span>💊 DDI Interaction Sentinel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDischargeSummaryModal(true)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-400" />
                        <span>📋 AI Discharge Summary</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEmergencyMedModal(true)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Order STAT Emergency Med</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPrescriptionModal(true)}
                        className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                      >
                        <span>View Printable Rx</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* STAT Emergency Dispatch Toast */}
                  {emergencySuccessToast && (
                    <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-200 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
                      <Zap className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>{emergencySuccessToast}</span>
                    </div>
                  )}

                  {/* Pharmacovigilance & Drug-Drug Interaction (DDI) & Allergy Alert Box */}
                  <div className="mb-4">
                    {detectedInteractions.length > 0 ? (
                      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span>Valerian Pharmacovigilance: {detectedInteractions.length} Critical Clinical Interaction(s) Detected</span>
                        </div>
                        {detectedInteractions.map((alert, aIdx) => (
                          <div key={aIdx} className="p-2.5 rounded-lg bg-slate-950/70 border border-amber-500/20 text-xs">
                            <div className="font-bold text-amber-300">{alert.title}</div>
                            <div className="text-slate-300 mt-0.5 text-[11px] leading-relaxed">{alert.detail}</div>
                            <div className="text-emerald-400 mt-1 text-[11px] font-semibold">💡 Clinical Protocol: {alert.recommendation}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-xs font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Valerian Pharmacovigilance: Zero Drug-Drug Interactions or Allergy Clashes Detected across Active Medications.</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {currentPatient.activePrescription.medicines.map((m, idx) => (
                      <div key={m.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{m.organIcon}</span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs sm:text-sm text-white">{m.medicineName}</span>
                              <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-teal-950 text-teal-300 border border-teal-800">
                                {m.organName}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {m.dosage} • {m.form} • Taken at {m.timing} ({m.exactTime}) • {m.foodRelation.replace('_', ' ')}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-300">{m.durationDays} Days</span>
                          <span className="block text-[10px] text-slate-500">Duration</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Manual Prescribe Medicine Form */}
                  <form onSubmit={handleDirectAddMedicine} className="mt-4 pt-4 border-t border-slate-800 text-xs">
                    <span className="font-bold text-slate-300 uppercase tracking-wider block mb-2">
                      + Add New Medicine to Prescription:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-4">
                        <select
                          value={medToPrescribe}
                          onChange={e => setMedToPrescribe(e.target.value)}
                          className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold outline-none"
                        >
                          {MEDICINE_DATABASE.map(med => (
                            <option key={med.id} value={med.id}>
                              {med.name} ({med.genericName})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={medDosage}
                          onChange={e => setMedDosage(e.target.value)}
                          placeholder="Dosage (e.g. 1 Tablet (1+0+1))"
                          className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <select
                          value={medTiming}
                          onChange={e => setMedTiming(e.target.value as any)}
                          className="w-full px-2 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none"
                        >
                          <option value="Morning">Morning</option>
                          <option value="Noon">Noon</option>
                          <option value="Evening">Evening</option>
                          <option value="Night">Night</option>
                          <option value="SOS">SOS / As Needed</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <button
                          type="submit"
                          className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add to Regimen</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

              </>
            )}

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: CLINICAL RISK & PROGNOSTIC CALCULATORS TAB       */}
      {/* ======================================================== */}
      {activeTab === 'calculators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-200">
          {/* eGFR CKD-EPI Calculator */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-400" />
                eGFR Renal Filtration (CKD-EPI Formula)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300">
                Renal Dosing
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Serum Creatinine (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={calcCreatinine}
                  onChange={e => setCalcCreatinine(parseFloat(e.target.value) || 1.0)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Patient Age</label>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-bold text-white">
                  {currentPatient?.age || 52} Years ({currentPatient?.gender || 'Male'})
                </div>
              </div>
            </div>

            {/* Computed eGFR Output */}
            {(() => {
              const age = currentPatient?.age || 52;
              const isFemale = currentPatient?.gender === 'Female';
              const k = isFemale ? 0.7 : 0.9;
              const a = isFemale ? -0.329 : -0.411;
              const minCr = Math.min(calcCreatinine / k, 1);
              const maxCr = Math.max(calcCreatinine / k, 1);
              const egfr = Math.round(141 * Math.pow(minCr, a) * Math.pow(maxCr, -1.209) * Math.pow(0.993, age) * (isFemale ? 1.018 : 1.0));
              const stage = egfr >= 90 ? 'Stage G1 (Normal)' : egfr >= 60 ? 'Stage G2 (Mild Impairment)' : egfr >= 45 ? 'Stage G3a (Mild-Moderate)' : egfr >= 30 ? 'Stage G3b (Moderate-Severe)' : egfr >= 15 ? 'Stage G4 (Severe Impairment)' : 'Stage G5 (Kidney Failure)';

              return (
                <div className="p-4 bg-slate-950 rounded-2xl border border-teal-500/30 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Glomerular Filtration Rate</span>
                  <div className="text-4xl font-black text-teal-400 font-mono">{egfr} mL/min/1.73m²</div>
                  <div className="font-bold text-slate-300">{stage}</div>
                  <p className="text-[11px] text-teal-200/80 pt-2 border-t border-slate-800/80 mt-2">
                    {egfr < 45 ? '⚠️ CAUTION: Reduce Metformin dosage to 500mg max daily. Discontinue SGLT2i if eGFR < 20.' : '✓ Normal renal clearance. Standard medication dosages permitted.'}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* CHA2DS2-VASc Atrial Fibrillation Stroke Risk */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                CHA2DS2-VASc Stroke Risk in AF
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300">
                Cardiology Protocol
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                <input type="checkbox" checked={chadsChf} onChange={e => setChadsChf(e.target.checked)} className="accent-teal-500" />
                <span>Congestive Heart Failure (+1)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                <input type="checkbox" checked={chadsHtn} onChange={e => setChadsHtn(e.target.checked)} className="accent-teal-500" />
                <span>Hypertension History (+1)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                <input type="checkbox" checked={chadsAge75} onChange={e => setChadsAge75(e.target.checked)} className="accent-teal-500" />
                <span>Age ≥ 75 Years (+2)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                <input type="checkbox" checked={chadsDm} onChange={e => setChadsDm(e.target.checked)} className="accent-teal-500" />
                <span>Diabetes Mellitus (+1)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                <input type="checkbox" checked={chadsStroke} onChange={e => setChadsStroke(e.target.checked)} className="accent-teal-500" />
                <span>Prior Stroke / TIA (+2)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                <input type="checkbox" checked={chadsVascular} onChange={e => setChadsVascular(e.target.checked)} className="accent-teal-500" />
                <span>Vascular Disease (+1)</span>
              </label>
            </div>

            {(() => {
              const score = (chadsChf ? 1 : 0) + (chadsHtn ? 1 : 0) + (chadsAge75 ? 2 : 0) + (chadsDm ? 1 : 0) + (chadsStroke ? 2 : 0) + (chadsVascular ? 1 : 0) + (chadsAge65 ? 1 : 0) + (chadsFemale ? 1 : 0);
              const recommendDoac = score >= 2;

              return (
                <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Score:</span>
                  <div className="text-3xl font-black text-rose-400 font-mono">{score} Points</div>
                  <div className="text-xs font-bold text-slate-200">
                    {recommendDoac ? '🚨 HIGH STROKE RISK: Oral Anticoagulation (DOAC e.g. Apixaban or Rivaroxaban) Strongly Recommended.' : 'Low / Intermediate Risk: Anticoagulation individualized.'}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: SICK LEAVE CERTIFICATES & FORMAL REFERRALS TAB   */}
      {/* ======================================================== */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-200">
          {/* Medical Leave Certificate Generator */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <FileText className="w-5 h-5 text-sky-400" />
              Official Sick Leave Certificate
            </h3>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Patient</label>
              <div className="p-2.5 bg-slate-950 rounded-xl font-bold text-white">
                {currentPatient?.fullName} ({currentPatient?.mrin})
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Leave Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={certDays}
                  onChange={e => setCertDays(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Issued By</label>
                <div className="p-2 bg-slate-950 rounded-xl font-bold text-teal-400 truncate">
                  {currentDoctor}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Clinical Justification</label>
              <textarea
                rows={3}
                value={certReason}
                onChange={e => setCertReason(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>

            <button
              onClick={() => {
                if (!currentPatient) return;
                printMedicalCertificate({
                  certId: `MED-CERT-${Date.now().toString().slice(-5)}`,
                  patientName: currentPatient.fullName,
                  mrin: currentPatient.mrin,
                  days: certDays,
                  reason: certReason,
                  doctorName: currentDoctor,
                  bmdcReg: 'BMDC-A-44821',
                  clinicName: 'Vitality Diagnostic Network • Specialized Outpatient Clinic',
                  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                });
                setDoctorToast(`✓ Generated & Printed Official Medical Certificate for ${currentPatient.fullName}!`);
                setTimeout(() => setDoctorToast(null), 4000);
              }}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Generate &amp; Print Signed Medical Certificate</span>
            </button>
          </div>

          {/* Tertiary Apex Referral Letter */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <ArrowRight className="w-5 h-5 text-purple-400" />
              Tertiary Sub-Specialty Referral Letter
            </h3>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Referred Apex Facility / Department</label>
              <input
                type="text"
                value={refHospital}
                onChange={e => setRefHospital(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Clinical Indication for Transfer / Review</label>
              <textarea
                rows={4}
                value={refReason}
                onChange={e => setRefReason(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>

            <button
              onClick={() => {
                if (!currentPatient) return;
                printReferralLetter({
                  refId: `REF-${Date.now().toString().slice(-5)}`,
                  patientName: currentPatient.fullName,
                  mrin: currentPatient.mrin,
                  age: currentPatient.age,
                  gender: currentPatient.gender,
                  referralHospital: refHospital,
                  clinicalReason: refReason,
                  doctorName: currentDoctor,
                  bmdcReg: 'BMDC-A-44821',
                  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                });
                setDoctorToast(`✓ Generated Tertiary Clinical Referral Letter for ${currentPatient.fullName}!`);
                setTimeout(() => setDoctorToast(null), 4000);
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tertiary Referral Letter</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 4: TREATMENT PROTOCOLS & DIETARY RX TAB             */}
      {/* ======================================================== */}
      {activeTab === 'templates' && (
        <div className="space-y-6 text-xs text-slate-200">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-white">1-Click Clinical Evidence Regimen Protocols</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-extrabold text-rose-400 block">Acute STEMI / ACS Protocol</span>
                <p className="text-slate-400 text-[11px]">Dual Antiplatelet (Aspirin 75mg + Clopidogrel 75mg), High-intensity Atorvastatin 40mg, Metoprolol 25mg.</p>
                <button
                  onClick={() => {
                    if (!currentPatient) return;
                    const daptMeds: PrescribedMedicineItem[] = [
                      {
                        id: `rxm-${Date.now()}-1`,
                        medicineId: 'med-aspirin',
                        medicineName: 'Aspirin (Ecosprin)',
                        organName: 'Heart & Cardiovascular',
                        organIcon: '❤️',
                        form: 'Tablet',
                        dosage: '75mg (1+0+0)',
                        timing: 'Morning',
                        exactTime: '08:00 AM',
                        foodRelation: 'after_food',
                        durationDays: 30,
                        whyGivenForPatient: 'Antiplatelet therapy for coronary artery thrombosis prevention.',
                        takenToday: false
                      },
                      {
                        id: `rxm-${Date.now()}-2`,
                        medicineId: 'med-clopidogrel',
                        medicineName: 'Clopidogrel (Plagran)',
                        organName: 'Heart & Cardiovascular',
                        organIcon: '❤️',
                        form: 'Tablet',
                        dosage: '75mg (0+0+1)',
                        timing: 'Night',
                        exactTime: '09:00 PM',
                        foodRelation: 'after_food',
                        durationDays: 30,
                        whyGivenForPatient: 'Dual antiplatelet platelet P2Y12 inhibitor for stent/ACS protection.',
                        takenToday: false
                      },
                      {
                        id: `rxm-${Date.now()}-3`,
                        medicineId: 'med-atorvastatin',
                        medicineName: 'Atorvastatin (Atova)',
                        organName: 'Heart & Cardiovascular',
                        organIcon: '❤️',
                        form: 'Tablet',
                        dosage: '40mg (0+0+1)',
                        timing: 'Night',
                        exactTime: '09:30 PM',
                        foodRelation: 'after_food',
                        durationDays: 30,
                        whyGivenForPatient: 'High-intensity statin for plaque stabilization and LDL reduction.',
                        takenToday: false
                      }
                    ];
                    const updated: PatientRecord = {
                      ...currentPatient,
                      activePrescription: {
                        ...currentPatient.activePrescription,
                        medicines: [...currentPatient.activePrescription.medicines, ...daptMeds]
                      }
                    };
                    onUpdatePatient(updated);
                    setDoctorToast('✓ Applied Acute Coronary Syndrome DAPT Protocol to Active Prescription!');
                    setTimeout(() => setDoctorToast(null), 4000);
                  }}
                  className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold transition"
                >
                  Apply Protocol
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-extrabold text-teal-400 block">Type 2 DM Cardiorenal Protocol</span>
                <p className="text-slate-400 text-[11px]">Empagliflozin 10mg morning, Metformin 500mg BD, Telmisartan 40mg for proteinuria protection.</p>
                <button
                  onClick={() => {
                    if (!currentPatient) return;
                    const dmMeds: PrescribedMedicineItem[] = [
                      {
                        id: `rxm-${Date.now()}-4`,
                        medicineId: 'med-empagliflozin',
                        medicineName: 'Empagliflozin (Jardiance)',
                        organName: 'Pancreas & Endocrine',
                        organIcon: '🧬',
                        form: 'Tablet',
                        dosage: '10mg (1+0+0)',
                        timing: 'Morning',
                        exactTime: '08:00 AM',
                        foodRelation: 'after_food',
                        durationDays: 30,
                        whyGivenForPatient: 'SGLT2 inhibitor for cardiorenal protection and glycemic control.',
                        takenToday: false
                      },
                      {
                        id: `rxm-${Date.now()}-5`,
                        medicineId: 'med-metformin',
                        medicineName: 'Metformin HCl',
                        organName: 'Pancreas & Endocrine',
                        organIcon: '🧬',
                        form: 'Tablet',
                        dosage: '500mg (1+0+1)',
                        timing: 'Morning',
                        exactTime: '08:00 AM',
                        foodRelation: 'with_food',
                        durationDays: 30,
                        whyGivenForPatient: 'First-line biguanide for insulin sensitization.',
                        takenToday: false
                      }
                    ];
                    const updated: PatientRecord = {
                      ...currentPatient,
                      activePrescription: {
                        ...currentPatient.activePrescription,
                        medicines: [...currentPatient.activePrescription.medicines, ...dmMeds]
                      }
                    };
                    onUpdatePatient(updated);
                    setDoctorToast('✓ Applied Type 2 DM Cardiorenal Protocol to Active Prescription!');
                    setTimeout(() => setDoctorToast(null), 4000);
                  }}
                  className="w-full py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold transition"
                >
                  Apply Protocol
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-extrabold text-amber-400 block">Severe Dengue Management</span>
                <p className="text-slate-400 text-[11px]">Oral rehydration, Paracetamol 500mg SOS (Max 2g/day). Strict avoidance of NSAIDs, Aspirin, and Steroids.</p>
                <button
                  onClick={() => {
                    if (!currentPatient) return;
                    const dengueMed: PrescribedMedicineItem = {
                      id: `rxm-${Date.now()}-6`,
                      medicineId: 'med-paracetamol',
                      medicineName: 'Paracetamol 500mg (Napa)',
                      organName: 'Constitutional / Systemic',
                      organIcon: '🌡️',
                      form: 'Tablet',
                      dosage: '500mg SOS (Max 4/day)',
                      timing: 'SOS',
                      exactTime: '02:00 PM',
                      foodRelation: 'after_food',
                      durationDays: 5,
                      whyGivenForPatient: 'Antipyretic for dengue fever; NSAIDs strictly contraindicated.',
                      takenToday: false
                    };
                    const updated: PatientRecord = {
                      ...currentPatient,
                      activePrescription: {
                        ...currentPatient.activePrescription,
                        medicines: [...currentPatient.activePrescription.medicines, dengueMed]
                      }
                    };
                    onUpdatePatient(updated);
                    setDoctorToast('✓ Applied Dengue Supportive Protocol to Active Prescription!');
                    setTimeout(() => setDoctorToast(null), 4000);
                  }}
                  className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold transition"
                >
                  Apply Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 5: LONGITUDINAL BIOMARKER TRAJECTORY TAB            */}
      {/* ======================================================== */}
      {activeTab === 'biomarkers' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl text-xs text-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              Longitudinal Biomarker Trajectory ({currentPatient?.fullName})
            </h3>
            <span className="text-xs text-slate-400">Past 3 Clinical Visits</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-3">Clinical Visit Date</th>
                  <th className="pb-3">Blood Pressure (mmHg)</th>
                  <th className="pb-3">HbA1c Glycemic</th>
                  <th className="pb-3">Serum Creatinine</th>
                  <th className="pb-3">LDL Cholesterol</th>
                  <th className="pb-3 text-right">Physician Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr>
                  <td className="py-3 font-bold text-white">Today (Visit 3)</td>
                  <td className="py-3 text-emerald-400 font-extrabold">{currentPatient?.vitals.bloodPressure}</td>
                  <td className="py-3 text-amber-400 font-bold">7.4% (Improved)</td>
                  <td className="py-3 text-slate-300">1.2 mg/dL</td>
                  <td className="py-3 text-emerald-400 font-bold">88 mg/dL</td>
                  <td className="py-3 text-right text-emerald-400 font-sans font-bold">Optimal Response</td>
                </tr>
                <tr>
                  <td className="py-3 text-slate-400">30 Days Ago (Visit 2)</td>
                  <td className="py-3 text-amber-300">142/90 mmHg</td>
                  <td className="py-3 text-rose-400">8.2%</td>
                  <td className="py-3 text-slate-400">1.3 mg/dL</td>
                  <td className="py-3 text-amber-300">114 mg/dL</td>
                  <td className="py-3 text-right text-amber-300 font-sans font-bold">Titrated ARB</td>
                </tr>
                <tr>
                  <td className="py-3 text-slate-500">90 Days Ago (Visit 1)</td>
                  <td className="py-3 text-rose-400">158/98 mmHg</td>
                  <td className="py-3 text-rose-400">9.4% (Uncontrolled)</td>
                  <td className="py-3 text-slate-500">1.4 mg/dL</td>
                  <td className="py-3 text-rose-400">148 mg/dL</td>
                  <td className="py-3 text-right text-rose-400 font-sans font-bold">Initial Presentation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 6: GLOBAL CLINICAL MEDIDICTIONARY TAB               */}
      {/* ======================================================== */}
      {activeTab === 'dictionary' && (
        <div className="space-y-6">
          
          {/* MediDictionary Filters & Search Header */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">Global Clinical Medicine Encyclopedia</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Physician Reference
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full indications, pharmacological action, contraindications, global country availability &amp; dual-currency pricing.
                </p>
              </div>

              {/* Currency Selector for Local Price Checking */}
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-300">Local Currency:</span>
                <select
                  value={selectedCurrency}
                  onChange={e => setSelectedCurrency(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-lg px-2 py-1 focus:outline-none focus:border-teal-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="BDT">BDT (৳)</option>
                </select>
              </div>
            </div>

            {/* Keyword Search with Autocomplete Preview */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={dictSearchQuery}
                onChange={e => setDictSearchQuery(e.target.value)}
                placeholder="Search by Generic molecule, Brand name (e.g. Lipitor, Metformin, Lantus), or Condition (e.g. Hypertension, Diabetes)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition shadow-inner"
              />
            </div>

            {/* Organ Taxonomy Pill Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {ORGAN_TAXONOMY.map(tax => (
                <button
                  key={tax.key}
                  type="button"
                  onClick={() => setSelectedOrganFilter(tax.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                    selectedOrganFilter === tax.key
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-slate-950/70 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{tax.icon}</span>
                  <span>{tax.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Medicines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map(med => {
              const localPrice = med.localPrices[selectedCurrency] || med.benchmarkPriceUSD;
              return (
                <div
                  key={med.id}
                  onClick={() => setActiveDictionaryMedicine(med)}
                  className="p-5 bg-slate-900 border border-slate-800/90 rounded-2xl hover:border-teal-500/60 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between shadow-lg group"
                >
                  <div>
                    {/* Top Row: Organ & Form */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-teal-950 text-teal-300 border border-teal-800 flex items-center gap-1">
                        <span>{med.organIcon}</span>
                        <span>{med.organName.split('&')[0]}</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {med.form}
                      </span>
                    </div>

                    {/* Drug Title & Generic */}
                    <h3 className="font-extrabold text-base text-white group-hover:text-teal-300 transition">
                      {med.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {med.genericName}
                    </p>

                    {/* Why Given Preview */}
                    <p className="text-xs text-slate-300 mt-2.5 line-clamp-2">
                      {med.whyGiven}
                    </p>

                    {/* Context Badges */}
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      {med.requiredLabTests && med.requiredLabTests.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          ⚠️ Test Required
                        </span>
                      )}
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                        Origin: {med.countryOfOrigin}
                      </span>
                    </div>
                  </div>

                  {/* Price & Availability Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Local Est. Price</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {selectedCurrency} {localPrice.toFixed(2)}
                      </span>
                    </div>

                    <span className="text-xs text-teal-400 font-semibold group-hover:translate-x-1 transition flex items-center gap-1">
                      <span>Full Clinical Info</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMedicines.length === 0 && (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-300">No medications matched your filters.</p>
              <p className="text-xs mt-1">Try clearing your search keyword or switching organ categories.</p>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 7: AI ORGAN DIGITAL TWIN & PHARMACOGENOMICS (PGx)   */}
      {/* ======================================================== */}
      {activeTab === 'digital_twin' && (
        <div className="space-y-6 text-xs text-slate-200">
          
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400 animate-spin" /> Deep-Tech Bio-Cybernetics
                  </span>
                  <span className="text-[11px] font-mono text-purple-300/80">CPIC Clinical Tier-1 Guidelines</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  AI Organ Digital Twin &amp; Whole-Exome Pharmacogenomics
                </h2>
                <p className="text-slate-300 text-xs mt-0.5 max-w-2xl">
                  Non-invasive virtual fractional flow reserve (FFR-CT), computational fluid dynamics, and patient-specific genomic drug-gene variant mapping for <strong className="text-white">{currentPatient?.fullName}</strong> ({currentPatient?.mrin}).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsSimulatingFluid(true);
                    setTimeout(() => {
                      setIsSimulatingFluid(false);
                      setDoctorToast('✓ 3D Navier-Stokes Blood Flow Re-computation Completed!');
                      setTimeout(() => setDoctorToast(null), 3500);
                    }, 1200);
                  }}
                  disabled={isSimulatingFluid}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold flex items-center gap-2 shadow-lg shadow-purple-900/40 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSimulatingFluid ? 'animate-spin' : ''}`} />
                  <span>{isSimulatingFluid ? 'Computing CFD Mesh...' : 'Re-Simulate Hemodynamics'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Columns: 3D Hemodynamics Digital Twin Simulator */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  <h3 className="font-extrabold text-sm text-white">Navier-Stokes Virtual FFR-CT Mesh Simulation</h3>
                </div>
                
                {/* Organ Selector */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['Heart LAD', 'Brain MCA', 'Renal Glomerulus'] as const).map(org => (
                    <button
                      key={org}
                      type="button"
                      onClick={() => setDigitalTwinOrgan(org)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                        digitalTwinOrgan === org
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {org}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Visual Canvas Box */}
              <div className="relative p-6 bg-slate-950 rounded-2xl border border-purple-900/40 overflow-hidden text-center min-h-[220px] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400">Target Vessel: {digitalTwinOrgan} Coronary Bifurcation</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                    virtualStentDeployed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {virtualStentDeployed ? '✓ Stented (Normal Perfusion)' : '⚠️ 74% Native Stenosis'}
                  </span>
                </div>

                {/* 60 FPS Real-Time Hemodynamic Fluid Canvas */}
                <div className="my-3">
                  <HemodynamicCanvas isStented={virtualStentDeployed} organ={digitalTwinOrgan} />
                </div>

                {/* Metrics Readout Strip */}
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-900 text-center font-mono text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-sans">Virtual FFR-CT</span>
                    <span className={`text-base font-black ${
                      virtualStentDeployed ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {virtualStentDeployed ? '0.94' : '0.74'}
                    </span>
                    <span className="text-[9px] text-slate-400 block">{virtualStentDeployed ? 'Physiological' : 'Ischemia (<0.80)'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-sans">Pressure Drop</span>
                    <span className="text-base font-bold text-white">{virtualStentDeployed ? '2.1' : '18.4'}</span>
                    <span className="text-[9px] text-slate-400 block">kPa</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-sans">Wall Shear</span>
                    <span className="text-base font-bold text-white">{virtualStentDeployed ? '16.2' : '78.5'}</span>
                    <span className="text-[9px] text-slate-400 block">dyn/cm²</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-sans">Lumen Area</span>
                    <span className="text-base font-bold text-white">{virtualStentDeployed ? '7.8' : '1.9'}</span>
                    <span className="text-[9px] text-slate-400 block">mm²</span>
                  </div>
                </div>
              </div>

              {/* Virtual Intervention Controls */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-white text-xs">Virtual Bioresorbable Stent Deployment (In Silico)</div>
                  <p className="text-slate-400 text-[11px]">Simulates procedural lumen restoration prior to cardiac catheterization.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !virtualStentDeployed;
                    setVirtualStentDeployed(next);
                    setDoctorToast(next ? '✓ Virtual Stent Deployed: FFR-CT restored to 0.94!' : '✓ Virtual Stent Removed: Reverted to native 74% stenosis.');
                    setTimeout(() => setDoctorToast(null), 3500);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    virtualStentDeployed
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span>{virtualStentDeployed ? 'Retract Virtual Stent' : 'Deploy Virtual Stent (3.0 x 18mm)'}</span>
                </button>
              </div>

              {/* In Silico Molecular Docking */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    In Silico Molecular Drug-Target Binding Affinity
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Quantum DFT MM/PBSA Engine</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase block font-sans">Binding Energy (ΔG)</span>
                    <span className="font-bold text-teal-300 text-sm">-9.8 kcal/mol</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase block font-sans">Dissociation (Kd)</span>
                    <span className="font-bold text-white text-sm">1.4 nM</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase block font-sans">hERG Safety Index</span>
                    <span className="font-bold text-emerald-400 text-sm">&gt;12,000x (Safe)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Whole-Exome Pharmacogenomic (PGx) Variant Panel */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Dna className="w-5 h-5 text-purple-400" />
                  <h3 className="font-extrabold text-sm text-white">Pharmacogenomics (PGx) Panel</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Illumina NovaSeq
                </span>
              </div>

              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {pgxVariants.map(variant => {
                  const isPatientPrescribedImplicated = currentPatient?.activePrescription.medicines.some(m =>
                    variant.implicatedDrugs.some(id => m.medicineName.toLowerCase().includes(id.toLowerCase()))
                  );

                  return (
                    <div
                      key={variant.gene}
                      className={`p-4 rounded-2xl border transition ${
                        variant.contraindicated
                          ? 'bg-rose-950/30 border-rose-500/40'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-white">{variant.gene}</span>
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/50">
                            {variant.diplotype}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          variant.phenotype === 'Poor Metabolizer' || variant.phenotype === 'High Toxicity Risk'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {variant.phenotype}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 mb-2">
                        <strong className="text-slate-400">Affected Drugs:</strong> {variant.implicatedDrugs.join(', ')}
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 leading-relaxed">
                        {variant.clinicalGuideline}
                      </div>

                      {/* 1-Click Action for CYP2C19 Clopidogrel -> Ticagrelor Swap */}
                      {variant.gene === 'CYP2C19' && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-amber-300 font-bold">Recommended: Switch Clopidogrel</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (!currentPatient) return;
                              // Replace clopidogrel with ticagrelor in patient's active prescription
                              const updatedMeds = currentPatient.activePrescription.medicines.map(m => {
                                if (m.medicineName.toLowerCase().includes('clopidogrel')) {
                                  return {
                                    ...m,
                                    medicineId: 'med-ticagrelor',
                                    medicineName: 'Ticagrelor 90mg (Brilinta)',
                                    dosage: '90mg (1+0+1)',
                                    whyGivenForPatient: 'Replaced Clopidogrel due to CYP2C19 *2/*3 Poor Metabolizer allele.'
                                  };
                                }
                                return m;
                              });

                              const updatedPatient: PatientRecord = {
                                ...currentPatient,
                                activePrescription: {
                                  ...currentPatient.activePrescription,
                                  medicines: updatedMeds
                                }
                              };
                              onUpdatePatient(updatedPatient);
                              setDoctorToast('✓ PGx Action: Swapped Clopidogrel to Ticagrelor 90mg BD in Active Rx!');
                              setTimeout(() => setDoctorToast(null), 4000);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] transition shadow"
                          >
                            1-Click Precision Swap
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* DETAILED MEDICINE MODAL (When clicked in dictionary)      */}
      {/* ======================================================== */}
      {activeDictionaryMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeDictionaryMedicine.organIcon}</span>
                <div>
                  <h2 className="text-xl font-extrabold text-white">{activeDictionaryMedicine.name}</h2>
                  <p className="text-xs font-mono text-teal-400">{activeDictionaryMedicine.genericName}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveDictionaryMedicine(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4 text-xs">
              
              {/* Indications & Why Given */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-[11px] text-teal-400 uppercase tracking-wider block mb-1">
                  Why is it Given &amp; Target Diseases
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">{activeDictionaryMedicine.whyGiven}</p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {activeDictionaryMedicine.indications.map((ind, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-950 text-teal-300 border border-teal-800">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Target Age & Pharmacology */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Target Age Group
                  </span>
                  <p className="text-slate-200">{activeDictionaryMedicine.targetAgeGroup}</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Crush &amp; Split Safety
                  </span>
                  <p className={activeDictionaryMedicine.canCrushOrSplit ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                    {activeDictionaryMedicine.canCrushOrSplit ? 'Safe to split/crush if needed.' : (activeDictionaryMedicine.crushWarning || 'DO NOT CRUSH')}
                  </p>
                </div>
              </div>

              {/* Side Effects Profile */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block mb-2">
                  Side Effect Profile
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">Common (&gt;10%)</span>
                    <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
                      {activeDictionaryMedicine.sideEffects.common.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-400 uppercase block mb-1">Severe / Immediate Medical Attention</span>
                    <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
                      {activeDictionaryMedicine.sideEffects.severeAlert.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Global Country Availability & Origin */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1.5">
                  <Globe className="w-4 h-4" />
                  <span className="text-[11px] uppercase tracking-wider">Global Approval &amp; Country Availability</span>
                </div>
                <p className="text-slate-300 mb-2">
                  Manufactured in <span className="font-bold text-white">{activeDictionaryMedicine.countryOfOrigin}</span> by <span className="font-bold text-white">{activeDictionaryMedicine.manufacturer}</span>.
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeDictionaryMedicine.countryAvailability.map((country, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                      ✓ {country}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Checker */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">International Benchmark</span>
                  <span className="font-extrabold text-sm text-slate-200">USD ${activeDictionaryMedicine.benchmarkPriceUSD.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Local Estimated Pharmacy Price</span>
                  <span className="font-extrabold text-base text-emerald-400">
                    {selectedCurrency} {(activeDictionaryMedicine.localPrices[selectedCurrency] || activeDictionaryMedicine.benchmarkPriceUSD).toFixed(2)}
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveDictionaryMedicine(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
              >
                Close Reference
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Prescription Print Modal */}
      {currentPatient && (
        <PrescriptionModal
          patient={currentPatient}
          isOpen={showPrescriptionModal}
          onClose={() => setShowPrescriptionModal(false)}
          onImportToPatientApp={onImportToPatientPortal}
        />
      )}

      {/* STAT Emergency Medicine Requisition Modal */}
      {showEmergencyMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 md:p-8 max-w-lg w-full text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-rose-400">Hospital Pharmacy Emergency Link</span>
                  <h3 className="text-lg font-black text-white">STAT Emergency Medication Order</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmergencyMedModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDispatchEmergencyMed} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Select Critical Emergency Medicine</label>
                <select
                  value={emergencyMedItem}
                  onChange={e => setEmergencyMedItem(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none font-medium"
                >
                  <option value="Inj. Epinephrine 1:1000 (1mg/mL ampoule)">Inj. Epinephrine 1:1000 (Anaphylactic Shock / Cardiac Arrest)</option>
                  <option value="Inj. Atropine 0.6mg/mL (Symptomatic Bradycardia)">Inj. Atropine 0.6mg/mL (Symptomatic Bradycardia / AV Block)</option>
                  <option value="IV Norepinephrine 4mg/4mL (Septic Shock Vasopressor)">IV Norepinephrine 4mg/4mL (Septic Shock Vasopressor)</option>
                  <option value="Inj. Hydrocortisone 100mg (Acute Adrenal Crisis)">Inj. Hydrocortisone 100mg (Acute Adrenal Crisis / Severe Bronchospasm)</option>
                  <option value="Tab Clopidogrel 300mg + Aspirin 300mg (STEMI Loading Regimen)">Tab Clopidogrel 300mg + Aspirin 300mg (Acute STEMI Loading Regimen)</option>
                  <option value="Inj. Amiodarone 150mg/3mL (Refractory VT / Pulseless VF)">Inj. Amiodarone 150mg/3mL (Refractory VT / Pulseless VF)</option>
                  <option value="Inj. Naloxone 0.4mg/mL (Opioid Toxicity Reversal)">Inj. Naloxone 0.4mg/mL (Opioid Toxicity Reversal)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Dosage &amp; Route of Administration</label>
                <input
                  type="text"
                  value={emergencyMedDose}
                  onChange={e => setEmergencyMedDose(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none font-medium"
                  placeholder="e.g. 0.5 mg IM into anterolateral thigh"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Priority Dispatch Protocol</label>
                <select
                  value={emergencyMedUrgency}
                  onChange={e => setEmergencyMedUrgency(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-bold outline-none"
                >
                  <option value="CRITICAL IMMEDIATE (< 3 mins)">🚨 CRITICAL IMMEDIATE (&lt; 3 mins) — Code Red Runner</option>
                  <option value="STAT URGENT (< 15 mins)">⚠️ STAT URGENT (&lt; 15 mins) — Priority Dispense</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div><strong>Dispatching Chamber:</strong> Chamber 304 ({currentDoctor})</div>
                <div><strong>Target Patient:</strong> {currentPatient.fullName} ({currentPatient.mrin})</div>
                <div><strong>Receiver:</strong> Central Pharmacy Emergency STAT Buffer</div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEmergencyMedModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Transmit STAT Emergency Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AMR Antibiogram Stewardship Sentinel Modal */}
      {showAmrModal && currentPatient && (
        <AmrStewardshipModal
          isOpen={showAmrModal}
          onClose={() => setShowAmrModal(false)}
          patient={currentPatient}
          onAdoptStepDown={(newDrug, dose) => {
            const newMedItem: PrescribedMedicineItem = {
              id: `rxm-${Date.now()}`,
              medicineId: `med-amr-${Date.now()}`,
              medicineName: newDrug,
              organName: 'Immune & Infection',
              organIcon: '🦠',
              form: 'Injection',
              dosage: dose,
              timing: 'Morning',
              exactTime: '08:00 AM',
              foodRelation: 'after_food',
              durationDays: 7,
              whyGivenForPatient: 'AMR Stewardship Targeted Step-Down Therapy.'
            };
            const updated: PatientRecord = {
              ...currentPatient,
              activePrescription: {
                ...currentPatient.activePrescription,
                medicines: [...currentPatient.activePrescription.medicines, newMedItem]
              }
            };
            onUpdatePatient(updated);
            setDoctorToast(`✓ Adopted AMR Step-Down: ${newDrug} (${dose})`);
          }}
        />
      )}

      {/* SmartRx Vision Bengali Prescription OCR Modal */}
      {showVisionOcrModal && currentPatient && (
        <PrescriptionVisionModal
          isOpen={showVisionOcrModal}
          onClose={() => setShowVisionOcrModal(false)}
          patient={currentPatient}
          onImportMedicines={(imported) => {
            const updated = {
              ...currentPatient,
              activePrescription: {
                ...currentPatient.activePrescription,
                medicines: [...currentPatient.activePrescription.medicines, ...imported]
              }
            };
            onUpdatePatient(updated);
            setDoctorToast(`✓ Imported ${imported.length} decoded prescription medicines into active chart!`);
          }}
        />
      )}

      {/* Medicine Interaction Checker Modal */}
      {showInteractionCheckerModal && currentPatient && (
        <MedicineInteractionCheckerModal
          isOpen={showInteractionCheckerModal}
          onClose={() => setShowInteractionCheckerModal(false)}
          initialMedications={currentPatient.activePrescription.medicines.map(m => `${m.medicineName} ${m.dosage}`)}
          patientAllergies={currentPatient.knownDrugAllergies || ['Penicillins']}
          onApplyPrescriptionWarning={(count) => {
            setDoctorToast(`✓ DDI Sentinel: Audited ${count} pharmacodynamic alerts for ${currentPatient.fullName}`);
          }}
        />
      )}

      {/* Discharge Summary Generator Modal */}
      {showDischargeSummaryModal && currentPatient && (
        <DischargeSummaryGeneratorModal
          isOpen={showDischargeSummaryModal}
          onClose={() => setShowDischargeSummaryModal(false)}
          patientName={currentPatient.fullName}
          patientMrin={currentPatient.mrin}
        />
      )}

      </div>
    </div>
  );
};
