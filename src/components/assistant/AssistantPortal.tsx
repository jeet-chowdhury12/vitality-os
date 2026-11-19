import React, { useState, useEffect, useRef } from 'react';
import { 
  ClipboardList, HeartPulse, Activity, User, ArrowRight, 
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Thermometer,
  Stethoscope, Send, RefreshCw, Search, Plus, X, Calculator,
  Brain, ShieldAlert, Droplet, Wind, FileText, Check, AlertCircle,
  Clock, Zap, Gauge, Printer, CheckSquare, Square, Camera, Hand, Compass
} from 'lucide-react';
import { TriageDossier, VitalsRecord, calculateNEWS2Score } from '../../data/hospitalStore';
import { PatientRecord } from '../../data/patientsDatabase';
import { printSbarHandover } from '../../utils/printUtils';
import { evaluateChiefComplaintsWithGemini, evaluateChiefComplaintsLocal, TriageEvaluationResult } from '../../services/valerianAI';
import { ContactlessVitalsModal } from '../common/ContactlessVitalsModal';
import { EmergencyTurjumanModal } from '../emergency/EmergencyTurjumanModal';
import { ClinicSenseModal } from '../triage/ClinicSenseModal';
import GhostFibers from '../reactbits/GhostFibers';

interface AssistantPortalProps {
  triageQueue: TriageDossier[];
  onCompleteTriage: (dossier: TriageDossier) => void;
  onNavigateToDoctor: () => void;
}

// Common clinical symptoms / conditions for autocomplete
const CLINICAL_SYMPTOM_DICTIONARY = [
  { name: 'Frequent Thirst (Polydipsia) & Polyuria', specialty: 'Endocrinology & Diabetology', doctor: 'Dr. Tariqul Islam (Endocrinologist)', reason: 'Classic osmotic diabetic symptoms requiring HbA1c and glycemic evaluation.' },
  { name: 'Unexplained Weight Loss & Fatigue', specialty: 'Endocrinology & Diabetology', doctor: 'Dr. Tariqul Islam (Endocrinologist)', reason: 'Metabolic or endocrine dysregulation (Thyroid / Diabetes Mellitus).' },
  { name: 'Leg Pain / Calf Muscle Cramps', specialty: 'Orthopedics & Trauma Surgery', doctor: 'Dr. Mahfuzur Rahman (Orthopedic Surgeon)', reason: 'Lower extremity musculoskeletal strain, deep tissue pain, or claudication.' },
  { name: 'Knee & Joint Pain (Arthralgia)', specialty: 'Orthopedics & Trauma Surgery', doctor: 'Dr. Mahfuzur Rahman (Orthopedic Surgeon)', reason: 'Osteoarthritis or inflammatory synovitis evaluation.' },
  { name: 'Lower Back Pain / Lumbago', specialty: 'Orthopedics & Trauma Surgery', doctor: 'Dr. Shafiqul Alam (Orthopedic Surgeon)', reason: 'Lumbar disc herniation or mechanical spinal strain workup.' },
  { name: 'Chest Pain / Angina', specialty: 'Cardiology', doctor: 'Dr. Marcus Vance (Cardiologist)', reason: 'High suspicion of cardiovascular ischemia / angina; urgent ECG and Troponin advised.' },
  { name: 'Palpitations / Tachycardia', specialty: 'Cardiology', doctor: 'Dr. Marcus Vance (Cardiologist)', reason: 'Cardiac arrhythmia / rhythm disturbance indicated.' },
  { name: 'High Blood Pressure (>140/90)', specialty: 'Cardiology', doctor: 'Dr. Marcus Vance (Cardiologist)', reason: 'Stage 1-2 Hypertension requiring antihypertensive titration.' },
  { name: 'Severe Throbbing Headache / Migraine', specialty: 'Neurology & Stroke Care', doctor: 'Dr. Asif Mahmud (Neurologist)', reason: 'Unilateral pulsatile headache with photophobia/aura indicates neurovascular migraine.' },
  { name: 'Morning Dizziness & Vertigo', specialty: 'Neurology & Stroke Care', doctor: 'Dr. Asif Mahmud (Neurologist)', reason: 'Vestibular dysfunction or cerebral hypoperfusion workup advised.' },
  { name: 'Bilateral Leg Swelling (Pedal Edema)', specialty: 'Nephrology & Renal Medicine', doctor: 'Dr. Nusrat Jahan (Nephrologist)', reason: 'Fluid retention, proteinuria or renal insufficiency; Serum Creatinine & eGFR required.' },
  { name: 'Shortness of Breath / Wheezing', specialty: 'Pulmonology & Respiratory Medicine', doctor: 'Dr. Zillur Rahman (Pulmonologist)', reason: 'Bronchial asthma, COPD, or cardiac asthma; PFT and Chest X-Ray indicated.' },
  { name: 'Burning Epigastric Pain / Acid Reflux', specialty: 'Gastroenterology & Hepatology', doctor: 'Dr. Shirin Akhtar (Gastroenterologist)', reason: 'GERD or peptic ulcer disease; Upper GI endoscopy considered.' }
];

// Specialty and Doctor matching types
export interface DoctorChamberOption {
  id: string;
  name: string;
  designation: string;
  room: string;
  fee: number;
  queueCount: number;
}

export interface RecommendedSpecialtyOption {
  specialty: string;
  matchPercentage: number;
  priorityTier: 'Primary Match' | 'Secondary Rule-Out' | 'Tertiary Consult';
  clinicalPresentation: string;
  doctors: DoctorChamberOption[];
}

export const ALL_HOSPITAL_DOCTORS: Record<string, DoctorChamberOption[]> = {
  'Cardiology': [
    { id: 'doc-vance', name: 'Dr. Marcus Vance (Cardiologist)', designation: 'Senior Interventional Cardiologist', room: 'Room 304', fee: 1200, queueCount: 3 },
    { id: 'doc-farhana', name: 'Dr. Farhana Rahman (Cardiologist)', designation: 'Consultant Clinical Cardiologist & Echo Fellow', room: 'Room 305', fee: 1200, queueCount: 1 }
  ],
  'Pulmonology & Respiratory Medicine': [
    { id: 'doc-zillur', name: 'Dr. Zillur Rahman (Pulmonologist)', designation: 'Senior Pulmonologist & Chest Specialist', room: 'Room 210', fee: 1100, queueCount: 2 },
    { id: 'doc-adnan', name: 'Dr. Adnan Kabir (Pulmonologist)', designation: 'Interventional Pulmonology & Critical Care', room: 'Room 211', fee: 1300, queueCount: 0 }
  ],
  'Internal Medicine & Critical Care': [
    { id: 'doc-elena', name: 'Dr. Elena Rostova (Neurologist & Intensivist)', designation: 'Consultant Physician & Intensivist', room: 'Room 308', fee: 1500, queueCount: 1 },
    { id: 'doc-kazi', name: 'Dr. Kazi Anisul Haque (Medicine Specialist)', designation: 'Associate Professor, Internal Medicine', room: 'Room 309', fee: 1000, queueCount: 4 }
  ],
  'Endocrinology & Diabetology': [
    { id: 'doc-tariqul', name: 'Dr. Tariqul Islam (Endocrinologist)', designation: 'Diabetologist & Clinical Endocrinologist', room: 'Room 212', fee: 1000, queueCount: 2 },
    { id: 'doc-shahnaz', name: 'Dr. Shahnaz Begum (Endocrinologist)', designation: 'Consultant Metabolic & Thyroid Specialist', room: 'Room 214', fee: 1200, queueCount: 1 }
  ],
  'Nephrology & Renal Medicine': [
    { id: 'doc-nusrat', name: 'Dr. Nusrat Jahan (Nephrologist)', designation: 'Consultant Nephrologist & Transplant Physician', room: 'Room 401', fee: 1300, queueCount: 0 },
    { id: 'doc-samad', name: 'Dr. M. A. Samad (Nephrologist)', designation: 'Senior Renal Care & Dialysis Director', room: 'Room 402', fee: 1400, queueCount: 3 }
  ],
  'Neurology & Stroke Care': [
    { id: 'doc-asif', name: 'Dr. Asif Mahmud (Neurologist)', designation: 'Consultant Neurologist & Neurophysiologist', room: 'Room 315', fee: 1400, queueCount: 1 },
    { id: 'doc-rehana', name: 'Dr. Rehana Parveen (Neurologist)', designation: 'Specialist Stroke & Movement Disorders', room: 'Room 316', fee: 1300, queueCount: 2 }
  ],
  'Gastroenterology & Hepatology': [
    { id: 'doc-shirin', name: 'Dr. Shirin Akhtar (Gastroenterologist)', designation: 'Senior Gastroenterologist & Hepatologist', room: 'Room 204', fee: 1200, queueCount: 1 },
    { id: 'doc-tanvir', name: 'Dr. Tanvir Ahmed (Gastroenterologist)', designation: 'Advanced Therapeutic Endoscopy Specialist', room: 'Room 205', fee: 1500, queueCount: 2 }
  ],
  'Orthopedics & Trauma Surgery': [
    { id: 'doc-mahfuz', name: 'Dr. Mahfuzur Rahman (Orthopedic Surgeon)', designation: 'Orthopedic & Joint Replacement Surgeon', room: 'Room 102', fee: 1100, queueCount: 3 },
    { id: 'doc-shafiq', name: 'Dr. Shafiqul Alam (Orthopedic Surgeon)', designation: 'Consultant Spine & Arthroscopic Surgeon', room: 'Room 103', fee: 1300, queueCount: 1 }
  ]
};

export function AssistantPortal({
  triageQueue,
  onCompleteTriage,
  onNavigateToDoctor
}: AssistantPortalProps) {
  // Navigation tabs within Clinical Assistant (Options 2, 3, 5 removed per clinical direction)
  const [activeTab, setActiveTab] = useState<'triage' | 'sbar'>('triage');

  // Currently selected patient from triage queue
  const [selectedDossierId, setSelectedDossierId] = useState<string>(
    triageQueue[0]?.id || ''
  );

  const activeDossier = triageQueue.find(d => d.id === selectedDossierId) || triageQueue[0];

  // Request cancellation tracker to prevent race conditions during rapid typing
  const activeRequestIdRef = useRef<number>(0);

  // Editable Vitals Form State
  const [bpSys, setBpSys] = useState<number>(activeDossier?.vitals.bloodPressureSys || 142);
  const [bpDia, setBpDia] = useState<number>(activeDossier?.vitals.bloodPressureDia || 92);
  const [pulse, setPulse] = useState<number>(activeDossier?.vitals.pulseRate || 84);
  const [tempF, setTempF] = useState<number>(activeDossier?.vitals.temperatureF || 98.4);
  const [spo2, setSpo2] = useState<number>(activeDossier?.vitals.spo2 || 98);
  const [weightKg, setWeightKg] = useState<number>(activeDossier?.vitals.weightKg || 78);
  const [heightCm, setHeightCm] = useState<number>(activeDossier?.vitals.heightCm || 172);
  const [showOpticalVitalsModal, setShowOpticalVitalsModal] = useState<boolean>(false);
  const [showTurjumanModal, setShowTurjumanModal] = useState<boolean>(false);
  const [showClinicSenseModal, setShowClinicSenseModal] = useState<boolean>(false);

  // Chief complaints & symptoms (Dynamically tied to active patient dossier)
  const [complaintText, setComplaintText] = useState<string>(
    activeDossier?.chiefComplaints || ''
  );
  const [queueSearch, setQueueSearch] = useState('');
  const [symptomSearch, setSymptomSearch] = useState('');
  const [selectedSymptomTags, setSelectedSymptomTags] = useState<string[]>(
    activeDossier?.symptoms && activeDossier.symptoms.length > 0 
      ? activeDossier.symptoms 
      : ['Frequent Thirst (Polydipsia) & Polyuria']
  );

  // Sync state whenever activeDossier changes
  useEffect(() => {
    if (activeDossier) {
      setBpSys(activeDossier.vitals.bloodPressureSys);
      setBpDia(activeDossier.vitals.bloodPressureDia);
      setPulse(activeDossier.vitals.pulseRate);
      setTempF(activeDossier.vitals.temperatureF);
      setSpo2(activeDossier.vitals.spo2);
      setWeightKg(activeDossier.vitals.weightKg);
      setHeightCm(activeDossier.vitals.heightCm);
      setComplaintText(activeDossier.chiefComplaints || '');
      setSelectedSymptomTags(
        activeDossier.symptoms && activeDossier.symptoms.length > 0 
          ? activeDossier.symptoms 
          : []
      );
    }
  }, [selectedDossierId]);

  // AI Specialty Recommendation & Multi-Doctor Selection State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSpecialty, setAiSpecialty] = useState<string>('Endocrinology & Diabetology');
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>(['Dr. Tariqul Islam (Endocrinologist)']);
  const [assignedDoctor, setAssignedDoctor] = useState<string>('Dr. Tariqul Islam (Endocrinologist)');
  const [assignedChamberRoom, setAssignedChamberRoom] = useState<string>('Room 212');
  const [aiReasoning, setAiReasoning] = useState<string>('Evaluating chief complaints...');
  const [liveEvaluation, setLiveEvaluation] = useState<TriageEvaluationResult | null>(null);

  const [recommendedSpecialties, setRecommendedSpecialties] = useState<RecommendedSpecialtyOption[]>([]);

  // Multi-Doctor Toggle Handler
  const handleToggleDoctor = (doc: DoctorChamberOption, specialty: string) => {
    setSelectedDoctors(prev => {
      const exists = prev.includes(doc.name);
      if (exists) {
        return prev.length > 1 ? prev.filter(d => d !== doc.name) : prev;
      } else {
        return [...prev, doc.name];
      }
    });
    setAssignedDoctor(doc.name);
    setAssignedChamberRoom(doc.room);
    setAiSpecialty(specialty);
  };

  // Apply evaluation result helper
  const applyEvaluationResult = (evalResult: TriageEvaluationResult) => {
    setLiveEvaluation(evalResult);

    const specs: RecommendedSpecialtyOption[] = evalResult.identifiedDiseases.map((dis, idx) => ({
      specialty: dis.specialty,
      matchPercentage: dis.confidenceScore,
      priorityTier: idx === 0 ? 'Primary Match' : idx === 1 ? 'Secondary Rule-Out' : 'Tertiary Consult',
      clinicalPresentation: `Probable Condition: ${dis.diseaseName} (${dis.acuityTier} Priority). ${dis.clinicalRationale}`,
      doctors: ALL_HOSPITAL_DOCTORS[dis.specialty] || ALL_HOSPITAL_DOCTORS['Internal Medicine & Critical Care']
    }));

    setRecommendedSpecialties(specs);
    if (specs.length > 0 && specs[0]?.doctors?.[0]) {
      setSelectedDoctors([specs[0].doctors[0].name]);
      setAssignedDoctor(specs[0].doctors[0].name);
      setAssignedChamberRoom(specs[0].doctors[0].room);
      setAiSpecialty(specs[0].specialty);
      setAiReasoning(specs[0].clinicalPresentation);
    }
  };

  // Run Real Live Gemini 2.5 Flash Disease & Specialty Evaluation
  const handleRunAiMatch = async (overrideSymptoms?: string[]) => {
    const currentReq = ++activeRequestIdRef.current;
    setIsAiAnalyzing(true);
    const symptoms = overrideSymptoms || [...selectedSymptomTags, complaintText].filter(Boolean);
    if (symptoms.length === 0) {
      setIsAiAnalyzing(false);
      return;
    }
    try {
      const evalResult = await evaluateChiefComplaintsWithGemini(symptoms, {
        bloodPressure: `${bpSys}/${bpDia} mmHg`,
        heartRate: pulse,
        spO2: spo2,
        temperature: `${tempF} °F`,
        age: activeDossier?.age || 45
      });

      // Discard stale in-flight responses if a newer request was dispatched while awaiting
      if (currentReq !== activeRequestIdRef.current) return;
      applyEvaluationResult(evalResult);
    } catch (e) {
      console.warn('Evaluation failed:', e);
    } finally {
      if (currentReq === activeRequestIdRef.current) {
        setIsAiAnalyzing(false);
      }
    }
  };

  // 1. Instant Synchronous Deterministic Clinical Matching (0ms latency, zero lag on typing/chips)
  useEffect(() => {
    const symptoms = [...selectedSymptomTags, complaintText].filter(Boolean);
    if (symptoms.length === 0) return;

    const instant = evaluateChiefComplaintsLocal(symptoms, {
      bloodPressure: `${bpSys}/${bpDia} mmHg`,
      heartRate: pulse,
      spO2: spo2,
      temperature: `${tempF} °F`,
      age: activeDossier?.age || 45
    });
    applyEvaluationResult(instant);
  }, [selectedSymptomTags, complaintText, bpSys, bpDia, selectedDossierId]);

  // 2. Debounced Live Gemini API Deep Analysis (refines reasoning with LLM)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRunAiMatch();
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedSymptomTags, complaintText]);

  const handleSelectDoctor = (doc: DoctorChamberOption, specialty: string) => {
    handleToggleDoctor(doc, specialty);
  };


  // Clinical Calculators State
  const [gcsEye, setGcsEye] = useState<number>(4);
  const [gcsVerbal, setGcsVerbal] = useState<number>(5);
  const [gcsMotor, setGcsMotor] = useState<number>(6);

  const [painScore, setPainScore] = useState<number>(6);
  const [painSite, setPainSite] = useState<string>('Retrosternal / Left Chest');
  const [painCharacter, setPainCharacter] = useState<string>('Crushing Pressure / Tightness');

  const [fallHistory, setFallHistory] = useState<boolean>(false);
  const [fallSecondaryDx, setFallSecondaryDx] = useState<boolean>(true);
  const [fallAmbulatoryAid, setFallAmbulatoryAid] = useState<'None / Bedrest' | 'Crutches / Cane' | 'Furniture'>('None / Bedrest');
  const [fallIvAccess, setFallIvAccess] = useState<boolean>(true);
  const [fallGait, setFallGait] = useState<'Normal' | 'Weak' | 'Impaired'>('Normal');
  const [fallMentalStatus, setFallMentalStatus] = useState<'Oriented' | 'Overestimates'>('Oriented');

  // Bedside Nursing Diagnostics State
  const [rbsValue, setRbsValue] = useState<string>('8.6 mmol/L (155 mg/dL)');
  const [urineKetones, setUrineKetones] = useState<'Negative' | 'Trace' | 'Moderate (2+)' | 'Large (3+)'>('Negative');
  const [cannulaGauge, setCannulaGauge] = useState<'18G Green' | '20G Pink' | '22G Blue'>('20G Pink');
  const [cannulaSite, setCannulaSite] = useState<'Right Forearm' | 'Left Dorsum Hand' | 'Right Antecubital'>('Right Forearm');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['Penicillin / Amoxicillin', 'Contrast Dye']);
  const [isolationProtocol, setIsolationProtocol] = useState<'Standard Precautions' | 'Airborne (N95)' | 'Contact Precautions' | 'Droplet (Mask)'>('Standard Precautions');

  // Calculate BMI
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? parseFloat((weightKg / (heightM * heightM)).toFixed(1)) : 26.4;

  // Compute NEWS2 Score
  const news2Result = calculateNEWS2Score({
    respiratoryRate: 18,
    spo2,
    onOxygen: spo2 < 95,
    systolicBp: bpSys,
    pulseRate: pulse,
    consciousness: 'Alert',
    temperatureF: tempF
  });

  // Compute GCS Score
  const totalGcs = gcsEye + gcsVerbal + gcsMotor;
  const gcsSeverity = totalGcs <= 8 ? 'Severe Head/Brain Injury (Coma)' : totalGcs <= 12 ? 'Moderate Neurological Deficit' : 'Mild / Normal Sensorium (GCS 13-15)';

  // Compute Morse Fall Score
  const morseScore = (fallHistory ? 25 : 0) + (fallSecondaryDx ? 15 : 0) + (fallAmbulatoryAid === 'Furniture' ? 30 : fallAmbulatoryAid === 'Crutches / Cane' ? 15 : 0) + (fallIvAccess ? 20 : 0) + (fallGait === 'Impaired' ? 20 : fallGait === 'Weak' ? 10 : 0) + (fallMentalStatus === 'Overestimates' ? 15 : 0);
  const morseRisk = morseScore >= 45 ? 'High Fall Risk (Yellow Alert Wristband Required)' : morseScore >= 25 ? 'Moderate Fall Risk' : 'Low Fall Risk';



  const handleAddSymptomTag = (sym: typeof CLINICAL_SYMPTOM_DICTIONARY[0]) => {
    if (!selectedSymptomTags.includes(sym.name)) {
      setSelectedSymptomTags(prev => [...prev, sym.name]);
    }
    setAiSpecialty(sym.specialty);
    setAssignedDoctor(sym.doctor);
    setAiReasoning(`Matched from symptom "${sym.name}": ${sym.reason}`);
    setSymptomSearch('');
  };

  const handleRemoveSymptomTag = (tag: string) => {
    setSelectedSymptomTags(prev => prev.filter(t => t !== tag));
  };

  const handleDispatchToDoctor = () => {
    if (!activeDossier) return;

    const updatedVitals: VitalsRecord = {
      bloodPressureSys: bpSys,
      bloodPressureDia: bpDia,
      pulseRate: pulse,
      respiratoryRate: 18,
      temperatureF: tempF,
      spo2,
      weightKg,
      heightCm,
      bmi,
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const finalSymptoms = selectedSymptomTags.length > 0 ? selectedSymptomTags : [complaintText];

    const completedDossier: TriageDossier = {
      ...activeDossier,
      chiefComplaints: complaintText,
      symptoms: finalSymptoms,
      vitals: updatedVitals,
      aiRecommendedSpecialty: aiSpecialty,
      aiSpecialistReason: aiReasoning,
      assignedDoctorName: assignedDoctor,
      status: 'triage_completed'
    };

    onCompleteTriage(completedDossier);
    alert(`✓ Triage Dossier successfully finalized and dispatched to ${assignedDoctor}.`);
    onNavigateToDoctor();
  };

  // Filtered symptoms for autocomplete search
  const filteredSymptoms = symptomSearch.trim() === ''
    ? []
    : CLINICAL_SYMPTOM_DICTIONARY.filter(s =>
        s.name.toLowerCase().includes(symptomSearch.toLowerCase()) ||
        s.specialty.toLowerCase().includes(symptomSearch.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-[#F4F9F8] text-slate-800 p-4 md:p-8 transition-colors relative overflow-hidden">
      {/* Background React Bits: GhostFibers */}
      <div className="fixed inset-0 pointer-events-none opacity-25 z-0">
        <GhostFibers glowColor="#35B69A" speed={0.4} />
      </div>
      <div className="relative z-10">
        {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#176B65] text-white">
                App 2 • Clinical Assistant
              </span>
              <span className="text-xs font-semibold text-[#35B69A]">
                Anteroom Triage &amp; Clinical Anamnesis
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#176B65]">
              Patient Triage, Anamnesis &amp; Nursing Station
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Capture biometrics, evaluate early warning scores (NEWS2, GCS, Morse), rapid glucose tests, and dispatch to assigned doctor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToDoctor}
              className="px-5 py-3 glass-btn-primary font-black text-xs rounded-2xl shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Consultation Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2 Streamlined Triage Sub-Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 border-b border-slate-200/70">
          <button
            onClick={() => setActiveTab('triage')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === 'triage'
                ? 'glass-btn-primary shadow-md text-white'
                : 'glass-btn text-slate-700 hover:text-slate-950'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-[#35B69A]" />
            <span>1. Vitals Intake &amp; Gemini Multi-Specialist Intake</span>
          </button>

          <button
            onClick={() => setActiveTab('sbar')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === 'sbar'
                ? 'glass-btn-primary shadow-md text-white'
                : 'glass-btn text-slate-700 hover:text-slate-950'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-500" />
            <span>2. SBAR Clinical Handover Protocol</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ======================================================== */}
        {/* TAB 1: VITALS INTAKE & VALERIAN AI TRIAGE                */}
        {/* ======================================================== */}
        {activeTab === 'triage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 4 Columns: Live Waiting Triage Queue */}
            <div className="lg:col-span-4 glass-card rounded-3xl p-6 shadow-xl border border-white/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#35B69A]" />
                  <h2 className="text-sm font-extrabold text-[#176B65]">Anteroom Triage Queue</h2>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {triageQueue.length} Waiting
                </span>
              </div>

              {/* Instant Alphabet & MRIN Search Filter */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={queueSearch}
                  onChange={e => setQueueSearch(e.target.value)}
                  placeholder="Filter queue by name, alphabet, or MRIN..."
                  className="w-full pl-8 pr-7 py-2 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
                {queueSearch && (
                  <button onClick={() => setQueueSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                {triageQueue
                  .filter(item => {
                    const q = queueSearch.toLowerCase().trim();
                    if (!q) return true;
                    return item.patientName.toLowerCase().includes(q) ||
                           item.patientMrin.toLowerCase().includes(q) ||
                           item.tokenNumber.toLowerCase().includes(q);
                  })
                  .map(item => {
                  const isSelected = item.id === selectedDossierId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedDossierId(item.id);
                        setComplaintText(item.chiefComplaints || '');
                        setSelectedSymptomTags(item.symptoms && item.symptoms.length > 0 ? item.symptoms : []);
                        setBpSys(item.vitals.bloodPressureSys);
                        setBpDia(item.vitals.bloodPressureDia);
                        setPulse(item.vitals.pulseRate);
                        setTempF(item.vitals.temperatureF);
                        setSpo2(item.vitals.spo2);
                        setWeightKg(item.vitals.weightKg);
                        setHeightCm(item.vitals.heightCm);
                      }}
                      className={`p-4 rounded-2xl cursor-pointer transition text-left ${
                        isSelected 
                          ? 'glass-btn-primary text-white shadow-lg border-teal-300/40' 
                          : 'glass-btn hover:bg-white/90 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-lg ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                        }`}>
                          {item.tokenNumber}
                        </span>
                        <span className={`text-[11px] font-bold ${
                          item.status === 'triage_completed' ? (isSelected ? 'text-teal-200' : 'text-emerald-700') : (isSelected ? 'text-amber-200' : 'text-amber-600')
                        }`}>
                          {item.status === 'triage_completed' ? '✓ Ready for Doctor' : 'Awaiting Vitals'}
                        </span>
                      </div>

                      <div className="font-extrabold text-sm">{item.patientName}</div>
                      <div className={`text-xs font-mono mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                        {item.patientMrin} • {item.gender} ({item.age}y)
                      </div>

                      <div className={`text-xs mt-2 line-clamp-1 italic ${isSelected ? 'text-white/90' : 'text-slate-600'}`}>
                        "{item.chiefComplaints}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 8 Columns: Comprehensive Vitals & Symptom Evaluation */}
            <div className="lg:col-span-8 glass-card rounded-3xl p-6 md:p-8 shadow-xl border border-white/80">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100/80">
                <div>
                  <span className="text-xs font-mono font-bold text-[#35B69A]">Token: {activeDossier?.tokenNumber}</span>
                  <h2 className="text-xl font-black text-[#176B65]">
                    {activeDossier?.patientName} ({activeDossier?.gender}, {activeDossier?.age} Years)
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">MRIN Identifier</span>
                  <span className="font-mono font-bold text-xs text-slate-700">{activeDossier?.patientMrin}</span>
                </div>
              </div>

              {/* Vitals Input Grid */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#35B69A]" />
                    <span>Physical Vitals &amp; Biometrics Intake</span>
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowTurjumanModal(true)}
                      className="px-3.5 py-2 rounded-2xl glass-btn text-purple-900 text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Hand className="w-3.5 h-3.5 text-purple-600" />
                      <span>🖐️ Turjuman Sign AI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClinicSenseModal(true)}
                      className="px-3.5 py-2 rounded-2xl glass-btn text-sky-900 text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Compass className="w-3.5 h-3.5 text-sky-600" />
                      <span>🧭 Clinic Sense</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOpticalVitalsModal(true)}
                      className="px-3.5 py-2 rounded-2xl glass-btn text-teal-900 text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Camera className="w-3.5 h-3.5 text-teal-600" />
                      <span>📸 Optical rPPG Vitals</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Blood Pressure</span>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        value={bpSys}
                        onChange={e => setBpSys(parseInt(e.target.value, 10) || 0)}
                        className="w-14 px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm font-extrabold text-[#176B65]"
                      />
                      <span className="text-slate-400 font-bold">/</span>
                      <input
                        type="number"
                        value={bpDia}
                        onChange={e => setBpDia(parseInt(e.target.value, 10) || 0)}
                        className="w-14 px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm font-extrabold text-[#176B65]"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">mmHg</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Pulse Rate</span>
                    <input
                      type="number"
                      value={pulse}
                      onChange={e => setPulse(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm font-extrabold text-[#176B65] mt-1"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">BPM (Radial)</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">SpO2 Saturation</span>
                    <input
                      type="number"
                      value={spo2}
                      onChange={e => setSpo2(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm font-extrabold text-[#176B65] mt-1"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">% on Room Air</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Temperature</span>
                    <input
                      type="number"
                      step="0.1"
                      value={tempF}
                      onChange={e => setTempF(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm font-extrabold text-[#176B65] mt-1"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">°F (Axillary)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] text-slate-500 block font-bold">Weight (kg)</span>
                    <input
                      type="number"
                      value={weightKg}
                      onChange={e => setWeightKg(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-bold"
                    />
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] text-slate-500 block font-bold">Height (cm)</span>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={e => setHeightCm(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-bold"
                    />
                  </div>
                  <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200 text-xs text-center flex flex-col justify-center">
                    <span className="text-[10px] text-teal-700 block font-bold">Calculated BMI</span>
                    <span className="text-sm font-black text-teal-900">{bmi} kg/m²</span>
                  </div>
                </div>
              </div>

              {/* Chief Complaints & Interactive Symptom Search */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Chief Complaints &amp; Onset Duration
                  </label>
                  <span className="text-[11px] text-[#35B69A] font-bold">Type below for nearby disease auto-match</span>
                </div>

                {/* Symptom Autocomplete Search Input */}
                <div className="relative mb-2">
                  <div className="flex items-center glass-card rounded-2xl px-3.5 py-2.5 border border-white/80 shadow-sm focus-within:ring-2 focus-within:ring-teal-500/30">
                    <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={symptomSearch}
                      onChange={e => setSymptomSearch(e.target.value)}
                      placeholder="Search symptom dictionary (e.g. 'chest pain', 'vertigo', 'thirst')..."
                      className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                    />
                    {symptomSearch && (
                      <button onClick={() => setSymptomSearch('')} className="text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {filteredSymptoms.length > 0 && (
                    <div className="absolute left-0 right-0 z-30 mt-1 glass-card border border-white/90 rounded-2xl shadow-2xl max-h-52 overflow-y-auto divide-y divide-slate-100">
                      {filteredSymptoms.map(sym => (
                        <div
                          key={sym.name}
                          onClick={() => handleAddSymptomTag(sym)}
                          className="p-3 hover:bg-emerald-50/80 cursor-pointer transition flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{sym.name}</span>
                            <span className="text-[10px] text-slate-500 ml-2">({sym.specialty})</span>
                          </div>
                          <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Add to File
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Symptom Chips */}
                {selectedSymptomTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedSymptomTags.map(tag => (
                      <span
                        key={tag}
                        className="glass-btn px-3.5 py-1.5 rounded-full text-emerald-950 text-xs font-bold flex items-center gap-2 border border-emerald-300/60 shadow-sm"
                      >
                        <span>{tag}</span>
                        <button onClick={() => handleRemoveSymptomTag(tag)} className="hover:text-rose-600 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <textarea
                  rows={2}
                  value={complaintText}
                  onChange={e => setComplaintText(e.target.value)}
                  placeholder="e.g. persistent morning dizziness, sudden knee swelling, thirst and fatigue..."
                  className="w-full p-3.5 rounded-2xl glass-card border border-white/80 text-xs focus:ring-2 focus:ring-[#35B69A]/30 outline-none leading-relaxed font-medium placeholder-slate-400 shadow-sm"
                />
              </div>

              {/* Valerian AI Multiple Specialist Matcher & Doctor Directory */}
              <div className="glass-card-dark rounded-3xl p-6 md:p-7 text-white shadow-2xl mb-6 border border-emerald-400/30 relative overflow-hidden backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-300 block">
                        Valerian AI Multi-Specialty Clinical Matcher
                      </span>
                      <span className="text-[11px] text-emerald-100/70">
                        Differential diagnoses &amp; assigned doctors mapped to chief complaints
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRunAiMatch()}
                    disabled={isAiAnalyzing}
                    className="glass-btn text-slate-900 bg-white/90 hover:bg-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
                    {isAiAnalyzing ? 'Evaluating...' : 'Re-evaluate Symptoms'}
                  </button>
                </div>

                {/* Multiple Recommended Specialties with Doctors for Every Single Specialty */}
                <div className="space-y-4">
                  {recommendedSpecialties.map((spec, sIdx) => (
                    <div 
                      key={sIdx} 
                      className={`p-4 rounded-2xl border transition-all ${
                        aiSpecialty === spec.specialty
                          ? 'glass-card-dark border-[#35B69A] shadow-lg ring-1 ring-emerald-400/30'
                          : 'bg-black/30 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            spec.priorityTier === 'Primary Match'
                              ? 'bg-emerald-400 text-slate-950'
                              : spec.priorityTier === 'Secondary Rule-Out'
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-sky-400 text-slate-950'
                          }`}>
                            {spec.priorityTier} ({spec.matchPercentage}% Match)
                          </span>
                          <span className="font-extrabold text-sm text-white">{spec.specialty}</span>
                        </div>
                      </div>

                      <p className="text-xs text-emerald-100/90 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5 mb-3">
                        {spec.clinicalPresentation}
                      </p>

                      {/* Doctors for this single specialty */}
                      <div>
                        <span className="text-[11px] uppercase font-bold text-emerald-300/80 tracking-wider block mb-2">
                          Available Specialists in {spec.specialty}:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {spec.doctors.map((doc) => {
                            const isSelected = assignedDoctor === doc.name;
                            return (
                              <div
                                key={doc.id}
                                onClick={() => handleSelectDoctor(doc, spec.specialty)}
                                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                  isSelected
                                    ? 'glass-btn-primary border-emerald-300 shadow-lg text-white ring-2 ring-emerald-400/40'
                                    : 'glass-btn-dark hover:border-emerald-400/60'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-extrabold text-xs text-white">{doc.name}</div>
                                    <div className="text-[10px] text-slate-300 mt-0.5">{doc.designation}</div>
                                  </div>
                                  {isSelected && (
                                    <span className="p-1 rounded-full bg-white text-emerald-800 shadow">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-white/10 text-emerald-200">
                                  <span className="font-mono font-bold text-amber-300">{doc.room}</span>
                                  <span>৳{doc.fee} BDT</span>
                                  <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-emerald-300">
                                    {doc.queueCount} in queue
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold">
                  <span>Active Chamber Assignment: <strong className="text-white">{assignedDoctor}</strong></span>
                  <span className="px-3 py-1 rounded-xl glass-btn text-slate-950 font-black bg-emerald-400">{assignedChamberRoom}</span>
                </div>
              </div>

              {/* Dispatch Action Button */}
              <button
                onClick={handleDispatchToDoctor}
                className="w-full py-4 rounded-2xl glass-btn-primary font-black text-sm shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] text-white"
              >
                <Send className="w-4 h-4" />
                <span>Complete Triage &amp; Dispatch Dossier to {assignedDoctor}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SBAR NURSING HANDOVER GENERATOR                   */}
        {/* ======================================================== */}
        {activeTab === 'sbar' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-extrabold text-[#176B65]">SBAR Nurse-to-Nurse Shift Handover Protocol</h3>
              </div>
              <button
                onClick={() => {
                  if (!activeDossier) return;
                  printSbarHandover({
                    patientName: activeDossier.patientName,
                    mrin: activeDossier.patientMrin,
                    age: activeDossier.age,
                    gender: activeDossier.gender,
                    bed: 'Triage Anteroom Bay 2',
                    situation: `Patient ${activeDossier.patientName} (${activeDossier.patientMrin}), ${activeDossier.age}y ${activeDossier.gender}, presented with: ${complaintText}. Token: ${activeDossier.tokenNumber}.`,
                    background: `Known allergies: ${selectedAllergies.join(', ') || 'NKDA'}. Vitals: BP ${bpSys}/${bpDia} mmHg, HR ${pulse} bpm, SpO2 ${spo2}%, Temp ${tempF}°F, BMI ${bmi} kg/m².`,
                    assessment: `NEWS2 Early Warning Score: ${news2Result.score} (${news2Result.riskLevel}). GCS Score: ${totalGcs}/15. Fall Risk: ${morseScore} (${morseRisk}). Pain Scale: ${painScore}/10 (${painSite}).`,
                    recommendation: `Recommended Specialty: ${aiSpecialty} (${assignedDoctor}). Immediate action: ${news2Result.clinicalAction}. Cannula: ${cannulaGauge} in ${cannulaSite}. Isolation: ${isolationProtocol}.`,
                    timestamp: new Date().toLocaleString(),
                    handoverNurse: 'Sr. Nurse Poly (Triage Desk)'
                  });
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print SBAR Handover Slip</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-[#176B65] text-sm block">S - Situation</span>
                <p className="text-slate-700">Patient <strong>{activeDossier?.patientName}</strong> ({activeDossier?.patientMrin}), {activeDossier?.age}y {activeDossier?.gender}, presented with {complaintText}.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-[#176B65] text-sm block">B - Background</span>
                <p className="text-slate-700">Known allergies: {selectedAllergies.join(', ')}. Admitted via Triage. Assigned to {assignedDoctor}.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-[#176B65] text-sm block">A - Assessment</span>
                <p className="text-slate-700">Vitals: BP {bpSys}/{bpDia} mmHg, HR {pulse} bpm, SpO2 {spo2}%, Temp {tempF}°F. NEWS2 score {news2Result.score} ({news2Result.riskLevel} risk). GCS {totalGcs}/15.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-[#176B65] text-sm block">R - Recommendation</span>
                <p className="text-slate-700">Escort to {assignedDoctor} chamber room 304. Maintain {cannulaGauge} IV line at {cannulaSite}. Monitor for chest pain escalation.</p>
              </div>
            </div>
          </div>
        )}

        {showOpticalVitalsModal && (
          <ContactlessVitalsModal
            isOpen={showOpticalVitalsModal}
            onClose={() => setShowOpticalVitalsModal(false)}
            onApplyVitals={({ heartRate, spO2 }) => {
              setPulse(heartRate);
              setSpo2(spO2);
            }}
          />
        )}

        {showTurjumanModal && (
          <EmergencyTurjumanModal
            isOpen={showTurjumanModal}
            onClose={() => setShowTurjumanModal(false)}
            onTranslateToTriage={(complaint) => {
              setComplaintText(complaint);
            }}
          />
        )}

        {showClinicSenseModal && (
          <ClinicSenseModal
            isOpen={showClinicSenseModal}
            onClose={() => setShowClinicSenseModal(false)}
            onConfirmTriageRoute={(result) => {
              setComplaintText(result.chiefComplaint);
            }}
          />
        )}

        </div>
      </div>
    </div>
  );
}
