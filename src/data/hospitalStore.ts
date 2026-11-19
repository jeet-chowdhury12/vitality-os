// Vitality-OS Central Hospital Data Store & Event Bus
// Connects all 9 operational hubs in real-time with LocalStorage Persistence

import { INITIAL_PATIENTS, PatientRecord, ClinicLabReport } from './patientsDatabase';
import { DiagnosticTestItem, DIAGNOSTIC_TEST_CATALOG } from './diagnosticTestDatabase';

export interface VitalsRecord {
  bloodPressureSys: number;
  bloodPressureDia: number;
  pulseRate: number;
  respiratoryRate: number;
  temperatureF: number;
  spo2: number;
  weightKg: number;
  heightCm: number;
  bmi: number;
  recordedAt: string;
}

export interface TriageDossier {
  id: string;
  patientMrin: string;
  patientName: string;
  age: number;
  gender: string;
  tokenNumber: string;
  chiefComplaints: string;
  symptoms: string[];
  vitals: VitalsRecord;
  aiRecommendedSpecialty: string;
  aiSpecialistReason: string;
  assignedDoctorName: string;
  intakeTimestamp: string;
  status: 'waiting_triage' | 'triage_completed' | 'with_doctor' | 'completed';
}

export interface LabOrderItem {
  orderId: string;
  testId: string;
  testCode: string;
  testName: string;
  department: string;
  patientMrin: string;
  patientName: string;
  doctorName: string;
  priority: 'routine' | 'urgent' | 'stat';
  orderedAt: string;
  status: 'ordered' | 'sample_collected' | 'processing' | 'verified';
  priceBDT: number;
  results?: {
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    isFlagged: boolean;
  }[];
  isCriticalPanic?: boolean;
  criticalAlertMessage?: string;
  verifiedAt?: string;
}

export interface HospitalBed {
  id: string;
  wardName: 'ICU' | 'CCU' | 'HDU' | 'General Ward (Male)' | 'General Ward (Female)' | 'Post-Op';
  bedNumber: string;
  status: 'occupied' | 'available' | 'cleaning' | 'reserved';
  patientMrin?: string;
  patientName?: string;
  diagnosis?: string;
  assignedNurse?: string;
  oxygenSupported: boolean;
  oxygenMode?: 'High-flow Nasal' | 'BiPAP' | 'Ventilator' | 'Room Air';
  admittedAt?: string;
}

export interface HospitalNotification {
  id: string;
  title: string;
  message: string;
  type: 'triage' | 'lab_panic' | 'prescription' | 'bed' | 'pharmacy' | 'system';
  timestamp: string;
  read: boolean;
  targetRole?: 'receptionist' | 'assistant' | 'doctor' | 'lab' | 'maintenance' | 'pharmacy' | 'all';
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  mrin?: string;
}

// Pharmacy & Medication Store Models
export interface PharmacyMedicineItem {
  id: string;
  brandName: string;
  genericName: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Gel' | 'Eye Drop' | 'Insulin';
  strength: string;
  manufacturer: string;
  unitPriceBDT: number;
  stockUnits: number;
  batchNumber: string;
  expiryDate: string;
  category: 'Cardiovascular' | 'Diabetes & Endocrine' | 'Antibiotic' | 'Respiratory' | 'GI & Antacid' | 'Emergency STAT' | 'Analgesic';
}

export interface StatMedicationRequest {
  id: string;
  patientMrin: string;
  patientName: string;
  orderedByDoctor: string;
  wardOrChamber: string;
  medicineName: string;
  dosage: string;
  priority: 'STAT' | 'Urgent';
  status: 'pending' | 'dispensed';
  orderedAt: string;
}

export interface PharmacyInvoice {
  invoiceId: string;
  patientMrin?: string;
  buyerName: string;
  items: {
    medicineName: string;
    form: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Card';
  timestamp: string;
}

// Initial Beds for Hospital Operations
export const INITIAL_BEDS: HospitalBed[] = [
  { id: 'b-icu-1', wardName: 'ICU', bedNumber: 'ICU-01', status: 'occupied', patientMrin: 'HS-2026-00421', patientName: 'Mohammad Rafiqul Islam', diagnosis: 'Acute Heart Failure & HTN', assignedNurse: 'Sr. Fahmida', oxygenSupported: true, oxygenMode: 'BiPAP', admittedAt: 'Today 08:30 AM' },
  { id: 'b-icu-2', wardName: 'ICU', bedNumber: 'ICU-02', status: 'available', oxygenSupported: true },
  { id: 'b-icu-3', wardName: 'ICU', bedNumber: 'ICU-03', status: 'occupied', patientMrin: 'HS-2026-00892', patientName: 'Nasreen Begum', diagnosis: 'Complicated Migraine / Status Epilepticus', assignedNurse: 'Sr. Fahmida', oxygenSupported: true, oxygenMode: 'Room Air', admittedAt: 'Today 09:15 AM' },
  { id: 'b-ccu-1', wardName: 'CCU', bedNumber: 'CCU-01', status: 'occupied', patientMrin: 'HS-2026-00318', patientName: 'Abdur Rahman', diagnosis: 'Acute Myocardial Infarction (STEMI)', assignedNurse: 'Sr. Ananya', oxygenSupported: true, oxygenMode: 'High-flow Nasal', admittedAt: 'Today 11:20 AM' },
  { id: 'b-ccu-2', wardName: 'CCU', bedNumber: 'CCU-02', status: 'available', oxygenSupported: true },
  { id: 'b-hdu-1', wardName: 'HDU', bedNumber: 'HDU-01', status: 'available', oxygenSupported: true },
  { id: 'b-hdu-2', wardName: 'HDU', bedNumber: 'HDU-02', status: 'occupied', patientMrin: 'HS-2026-00714', patientName: 'Tamanna Akhter', diagnosis: 'Severe Dengue Shock Syndrome', assignedNurse: 'Sr. Bristy', oxygenSupported: true, oxygenMode: 'Room Air', admittedAt: 'Yesterday' },
  { id: 'b-genm-1', wardName: 'General Ward (Male)', bedNumber: 'GWM-101', status: 'occupied', patientMrin: 'HS-2026-00955', patientName: 'Kazi Farhan', diagnosis: 'Type 2 Diabetes Mellitus with Nephropathy', assignedNurse: 'Staff Kamal', oxygenSupported: false },
  { id: 'b-genm-2', wardName: 'General Ward (Male)', bedNumber: 'GWM-102', status: 'available', oxygenSupported: false },
  { id: 'b-genm-3', wardName: 'General Ward (Male)', bedNumber: 'GWM-103', status: 'available', oxygenSupported: false },
  { id: 'b-genf-1', wardName: 'General Ward (Female)', bedNumber: 'GWF-201', status: 'occupied', patientMrin: 'HS-2026-00109', patientName: 'Rehana Parvin', diagnosis: 'Post-Cholecystectomy Recovery', assignedNurse: 'Staff Shathi', oxygenSupported: false },
  { id: 'b-genf-2', wardName: 'General Ward (Female)', bedNumber: 'GWF-202', status: 'available', oxygenSupported: false },
  { id: 'b-post-1', wardName: 'Post-Op', bedNumber: 'POP-01', status: 'occupied', patientMrin: 'HS-2026-00563', patientName: 'Zubair Hossain', diagnosis: 'Coronary Artery Bypass Post-Op', assignedNurse: 'Sr. Tanya', oxygenSupported: true, oxygenMode: 'High-flow Nasal', admittedAt: 'Today 07:00 AM' }
];

// Initial Active Lab Orders
export const INITIAL_LAB_ORDERS: LabOrderItem[] = [
  {
    orderId: 'ORD-2026-8801',
    testId: 'test-bio-001',
    testCode: 'LAB-BIO-HBA1C',
    testName: 'HbA1c (Glycated Hemoglobin) by HPLC',
    department: 'Biochemistry',
    patientMrin: 'HS-2026-00421',
    patientName: 'Mohammad Rafiqul Islam',
    doctorName: 'Dr. Marcus Vance (Cardiologist)',
    priority: 'urgent',
    orderedAt: '10:15 AM',
    status: 'verified',
    priceBDT: 850,
    results: [
      { parameter: 'HbA1c Concentration', value: '7.8', unit: '%', normalRange: '4.0 - 5.6', isFlagged: true },
      { parameter: 'Estimated Avg Glucose', value: '177', unit: 'mg/dL', normalRange: '70 - 114', isFlagged: true }
    ],
    verifiedAt: '11:45 AM'
  },
  {
    orderId: 'ORD-2026-8802',
    testId: 'test-bio-004',
    testCode: 'LAB-BIO-LYTES',
    testName: 'Serum Electrolytes (Na+, K+, Cl-, HCO3-)',
    department: 'Biochemistry',
    patientMrin: 'HS-2026-00421',
    patientName: 'Mohammad Rafiqul Islam',
    doctorName: 'Dr. Marcus Vance (Cardiologist)',
    priority: 'stat',
    orderedAt: '10:16 AM',
    status: 'verified',
    priceBDT: 750,
    results: [
      { parameter: 'Serum Potassium (K+)', value: '5.4', unit: 'mmol/L', normalRange: '3.5 - 5.1', isFlagged: true },
      { parameter: 'Serum Sodium (Na+)', value: '139', unit: 'mmol/L', normalRange: '136 - 145', isFlagged: false }
    ],
    verifiedAt: '11:05 AM'
  },
  {
    orderId: 'ORD-2026-8803',
    testId: 'test-card-003',
    testCode: 'CARD-LAB-TROP',
    testName: 'High-Sensitivity Troponin-I (hs-cTnI)',
    department: 'Biochemistry',
    patientMrin: 'HS-2026-00318',
    patientName: 'Abdur Rahman',
    doctorName: 'Dr. Marcus Vance (Cardiologist)',
    priority: 'stat',
    orderedAt: '11:30 AM',
    status: 'verified',
    priceBDT: 1400,
    isCriticalPanic: true,
    criticalAlertMessage: 'CRITICAL VALUE: hs-cTnI is 0.082 ng/mL (Threshold: > 0.04 ng/mL - Acute Myocardial Infarction Flag)',
    results: [
      { parameter: 'hs-cTnI Quantitative', value: '0.082', unit: 'ng/mL', normalRange: '< 0.04', isFlagged: true }
    ],
    verifiedAt: '12:02 PM'
  },
  {
    orderId: 'ORD-2026-8804',
    testId: 'test-rad-001',
    testCode: 'RAD-XRAY-CHEST',
    testName: 'Digital Chest X-Ray (PA View)',
    department: 'Radiology',
    patientMrin: 'HS-2026-00892',
    patientName: 'Nasreen Begum',
    doctorName: 'Dr. Elena Rostova (Neurologist)',
    priority: 'routine',
    orderedAt: '11:45 AM',
    status: 'processing',
    priceBDT: 600
  }
];

// Initial Triage Queue
export const INITIAL_TRIAGE_DOSSIERS: TriageDossier[] = [
  {
    id: 'tr-001',
    patientMrin: 'HS-2026-00421',
    patientName: 'Mohammad Rafiqul Islam',
    age: 58,
    gender: 'Male',
    tokenNumber: 'TK-101',
    chiefComplaints: 'Persistent morning dizziness, unsteadiness when standing, mild chest heaviness on stairs.',
    symptoms: ['Morning Dizziness', 'Exertional Chest Tightness', 'Frequent Thirst (Polydipsia)'],
    vitals: {
      bloodPressureSys: 142,
      bloodPressureDia: 92,
      pulseRate: 84,
      respiratoryRate: 18,
      temperatureF: 98.4,
      spo2: 98,
      weightKg: 78,
      heightCm: 172,
      bmi: 26.4,
      recordedAt: '09:45 AM'
    },
    aiRecommendedSpecialty: 'Cardiology',
    aiSpecialistReason: 'Hypertensive reading (142/92) with exertional chest heaviness indicates cardiovascular evaluation.',
    assignedDoctorName: 'Dr. Marcus Vance (Cardiologist)',
    intakeTimestamp: '09:45 AM',
    status: 'with_doctor'
  },
  {
    id: 'tr-002',
    patientMrin: 'HS-2026-00892',
    patientName: 'Nasreen Begum',
    age: 46,
    gender: 'Female',
    tokenNumber: 'TK-102',
    chiefComplaints: 'Severe throbbing right temporal headache lasting 48 hours, accompanied by photophobia and nausea.',
    symptoms: ['Unilateral Throbbing Headache', 'Visual Aura / Sensitivity to Light', 'Nausea'],
    vitals: {
      bloodPressureSys: 124,
      bloodPressureDia: 80,
      pulseRate: 76,
      respiratoryRate: 16,
      temperatureF: 98.6,
      spo2: 99,
      weightKg: 62,
      heightCm: 158,
      bmi: 24.8,
      recordedAt: '10:05 AM'
    },
    aiRecommendedSpecialty: 'Neurology',
    aiSpecialistReason: 'Classic presentation of acute migraine with aura; neurology review recommended.',
    assignedDoctorName: 'Dr. Elena Rostova (Neurologist)',
    intakeTimestamp: '10:05 AM',
    status: 'with_doctor'
  },
  {
    id: 'tr-003',
    patientMrin: 'HS-2026-00318',
    patientName: 'Abdur Rahman',
    age: 63,
    gender: 'Male',
    tokenNumber: 'TK-103',
    chiefComplaints: 'Sudden onset retrosternal crushing chest pain radiating to left shoulder, diaphoresis.',
    symptoms: ['Crushing Chest Pain', 'Profuse Sweating', 'Shortness of Breath'],
    vitals: {
      bloodPressureSys: 158,
      bloodPressureDia: 98,
      pulseRate: 104,
      respiratoryRate: 24,
      temperatureF: 98.2,
      spo2: 94,
      weightKg: 82,
      heightCm: 168,
      bmi: 29.0,
      recordedAt: '11:15 AM'
    },
    aiRecommendedSpecialty: 'Cardiology',
    aiSpecialistReason: 'CRITICAL: High suspicion of Acute Coronary Syndrome (ACS); STAT ECG and Troponin required.',
    assignedDoctorName: 'Dr. Marcus Vance (Cardiologist)',
    intakeTimestamp: '11:15 AM',
    status: 'with_doctor'
  }
];

export const INITIAL_NOTIFICATIONS: HospitalNotification[] = [
  {
    id: 'notif-1',
    title: 'CRITICAL LAB ALERT: Abdur Rahman (HS-2026-00318)',
    message: 'hs-Troponin I reported at 0.082 ng/mL (CRITICAL HIGH). Immediate cardiologist review required.',
    type: 'lab_panic',
    timestamp: '12:02 PM',
    read: false,
    targetRole: 'doctor'
  },
  {
    id: 'notif-2',
    title: 'New Triage Handover Ready',
    message: 'Patient Mohammad Rafiqul Islam (TK-101) vitals and anamnesis dispatched to Dr. Marcus chamber.',
    type: 'triage',
    timestamp: '09:46 AM',
    read: true,
    targetRole: 'doctor'
  },
  {
    id: 'notif-3',
    title: 'ICU Bed Allocation Available',
    message: 'Bed ICU-02 sanitized and marked available for emergency admissions.',
    type: 'bed',
    timestamp: '11:20 AM',
    read: true,
    targetRole: 'maintenance'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  { id: 'aud-1', timestamp: '12:02:14 PM', actor: 'Dr. Kamrul (Biochemist)', role: 'Lab Technologist', action: 'VERIFIED_STAT_RESULT', details: 'hs-Troponin I (0.082 ng/mL) flagged CRITICAL PANIC', mrin: 'HS-2026-00318' },
  { id: 'aud-2', timestamp: '11:45:00 AM', actor: 'Dr. Marcus Vance', role: 'Cardiologist', action: 'ORDERED_DIAGNOSTIC_TESTS', details: 'Ordered HbA1c, Serum Electrolytes, and 2D-ECHO', mrin: 'HS-2026-00421' },
  { id: 'aud-3', timestamp: '10:05:30 AM', actor: 'Sr. Nurse Farzana', role: 'Clinical Assistant', action: 'COMPLETED_TRIAGE_DOSSIER', details: 'Vitals BP 124/80, SpO2 99%, dispatched to Dr. Elena', mrin: 'HS-2026-00892' },
  { id: 'aud-4', timestamp: '09:40:12 AM', actor: 'Shamim Ahmed', role: 'Receptionist', action: 'ISSUED_PATIENT_TOKEN', details: 'Token TK-101 issued for Mohammad Rafiqul Islam', mrin: 'HS-2026-00421' }
];

// Initial Pharmacy Medicines Inventory
export const INITIAL_PHARMACY_INVENTORY: PharmacyMedicineItem[] = [
  { id: 'ph-01', brandName: 'Comet 500mg', genericName: 'Metformin Hydrochloride', form: 'Tablet', strength: '500mg', manufacturer: 'Square Pharmaceuticals', unitPriceBDT: 6.00, stockUnits: 1450, batchNumber: 'SQ-MTF-882', expiryDate: '2028-06-30', category: 'Diabetes & Endocrine' },
  { id: 'ph-02', brandName: 'Telma 40mg', genericName: 'Telmisartan', form: 'Tablet', strength: '40mg', manufacturer: 'Beximco Pharma', unitPriceBDT: 10.50, stockUnits: 980, batchNumber: 'BX-TLM-401', expiryDate: '2028-03-31', category: 'Cardiovascular' },
  { id: 'ph-03', brandName: 'Seclo 20mg', genericName: 'Omeprazole', form: 'Capsule', strength: '20mg', manufacturer: 'Square Pharmaceuticals', unitPriceBDT: 7.00, stockUnits: 2200, batchNumber: 'SQ-OMP-912', expiryDate: '2028-11-30', category: 'GI & Antacid' },
  { id: 'ph-04', brandName: 'Napa Extra 500+65mg', genericName: 'Paracetamol + Caffeine', form: 'Tablet', strength: '500mg+65mg', manufacturer: 'Beximco Pharma', unitPriceBDT: 3.50, stockUnits: 4500, batchNumber: 'BX-NPX-103', expiryDate: '2028-12-31', category: 'Analgesic' },
  { id: 'ph-05', brandName: 'Inj. Atropine Sulfate', genericName: 'Atropine Sulfate', form: 'Injection', strength: '0.6mg/mL', manufacturer: 'Popular Pharma', unitPriceBDT: 45.00, stockUnits: 120, batchNumber: 'POP-ATR-004', expiryDate: '2027-08-31', category: 'Emergency STAT' },
  { id: 'ph-06', brandName: 'Inj. Adrenaline (Epinephrine)', genericName: 'Epinephrine', form: 'Injection', strength: '1mg/1mL (1:1000)', manufacturer: 'Popular Pharma', unitPriceBDT: 65.00, stockUnits: 85, batchNumber: 'POP-EPI-009', expiryDate: '2027-04-30', category: 'Emergency STAT' },
  { id: 'ph-07', brandName: 'Ventolin Inhaler 100mcg', genericName: 'Salbutamol', form: 'Inhaler', strength: '100mcg/puff (200 doses)', manufacturer: 'GSK / Incepta', unitPriceBDT: 280.00, stockUnits: 340, batchNumber: 'INC-VNT-701', expiryDate: '2027-10-31', category: 'Respiratory' },
  { id: 'ph-08', brandName: 'Differin Gel 0.1%', genericName: 'Adapalene', form: 'Gel', strength: '0.1% (30g tube)', manufacturer: 'Galderma', unitPriceBDT: 420.00, stockUnits: 180, batchNumber: 'GAL-DIF-220', expiryDate: '2028-01-31', category: 'Analgesic' },
  { id: 'ph-09', brandName: 'Glarmax SoloStar', genericName: 'Insulin Glargine', form: 'Insulin', strength: '100 IU/mL Pen', manufacturer: 'Incepta Pharma', unitPriceBDT: 850.00, stockUnits: 240, batchNumber: 'INC-GLR-310', expiryDate: '2027-09-30', category: 'Diabetes & Endocrine' },
  { id: 'ph-10', brandName: 'Ciprocin 500mg', genericName: 'Ciprofloxacin', form: 'Tablet', strength: '500mg', manufacturer: 'Square Pharmaceuticals', unitPriceBDT: 15.00, stockUnits: 1600, batchNumber: 'SQ-CIP-504', expiryDate: '2028-05-31', category: 'Antibiotic' }
];

export const INITIAL_STAT_REQUESTS: StatMedicationRequest[] = [
  { id: 'stat-01', patientMrin: 'HS-2026-00318', patientName: 'Abdur Rahman', orderedByDoctor: 'Dr. Marcus Vance', wardOrChamber: 'CCU-01', medicineName: 'Inj. Adrenaline 1mg (1:1000)', dosage: '1 Ampoule STAT IV', priority: 'STAT', status: 'pending', orderedAt: '11:35 AM' },
  { id: 'stat-02', patientMrin: 'HS-2026-00421', patientName: 'Mohammad Rafiqul Islam', orderedByDoctor: 'Dr. Marcus Vance', wardOrChamber: 'Room 304', medicineName: 'Telma 40mg', dosage: '1 Strip (10 Tabs)', priority: 'Urgent', status: 'dispensed', orderedAt: '10:20 AM' }
];

// =========================================================================
// EXPANDED HOSPITAL CLINICAL, ADMINISTRATIVE & TELEMETRY ENTERPRISE DATA
// =========================================================================

export interface VisitorGatePass {
  id: string;
  visitorName: string;
  visitorPhone: string;
  patientMrin: string;
  patientName: string;
  ward: string;
  bedNumber: string;
  passType: 'Standard Day Visitor' | 'Attendant 24H Pass' | 'VIP ICU Visitor';
  validUntil: string;
  issuedAt: string;
  status: 'active' | 'expired' | 'surrendered';
}

export interface CashierDepositSlip {
  receiptNo: string;
  patientMrin: string;
  patientName: string;
  amountBDT: number;
  purpose: 'IPD Admission Advance' | 'Cath Lab Package' | 'Dialysis 5-Cycle Deposit' | 'OPD Consultation & Tests';
  paymentMode: 'bKash' | 'Nagad' | 'Cash' | 'Credit Card' | 'SSK Govt Scheme';
  cashierStaff: string;
  timestamp: string;
  balanceDueBDT: number;
}

export interface DoctorDutySchedule {
  doctorId: string;
  doctorName: string;
  specialty: string;
  chamberRoom: string;
  status: 'In Chamber' | 'In Cath Lab' | 'Ward Rounds' | 'Emergency Call' | 'On Leave';
  timing: string;
  tokensIssued: number;
  tokensServed: number;
  bmdcRegNo: string;
}

export interface LeveyJenningsQCRun {
  id: string;
  instrumentName: string;
  analyte: string;
  unit: string;
  targetMean: number;
  standardDeviation: number;
  measuredValue: number;
  zScore: number;
  status: 'In Control (1-2s)' | 'Warning (2-2s)' | 'Out of Control (1-3s)' | 'Reject (R-4s)';
  runDate: string;
  technologist: string;
}

export interface CriticalPanicCallLog {
  id: string;
  orderId: string;
  patientMrin: string;
  patientName: string;
  testName: string;
  panicValue: string;
  criticalThreshold: string;
  notifiedStaff: string;
  wardLocation: string;
  readBackConfirmed: boolean;
  notifiedAt: string;
  dispatcherStaff: string;
}

export interface BloodBankUnit {
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  prbcUnits: number;
  ffpUnits: number;
  plateletConcentrateUnits: number;
  cryoprecipitateUnits: number;
  reservedUnits: number;
  status: 'Optimal' | 'Adequate' | 'Critical Shortage';
}

export interface FacilityTelemetrySystem {
  lmoTank: {
    capacityLiters: number;
    currentVolumeLiters: number;
    levelPercent: number;
    tankPressureBar: number;
    flowRateNm3h: number;
    hoursRemaining: number;
    status: 'Normal' | 'Refill Required' | 'Critical Low';
  };
  mgpsPressures: {
    oxygenBar: number;
    nitrousOxideBar: number;
    medicalAir4Bar: number;
    surgicalAir7Bar: number;
    vacuumKPa: number;
    alarmStatus: 'All Systems Normal' | 'Low Vacuum' | 'Pipeline Warning';
  };
  hvacIsolation: {
    roomCode: string;
    pressureDifferentialPa: number;
    airChangesPerHour: number;
    hepaFilterLifePercent: number;
    temperatureC: number;
    humidityPercent: number;
    mode: 'Negative (Infection Isolation)' | 'Positive (Bone Marrow / Burn ICU)';
  }[];
  generators: {
    id: string;
    ratedKVA: number;
    fuelLevelPercent: number;
    runningHours: number;
    batteryVoltage: number;
    atsStatus: 'Standby / Grid Online' | 'Auto-Running / Generator Active';
  }[];
  cssdAutoclaves: {
    batchId: string;
    machineName: string;
    cycleType: '134°C Porous / Textile' | '121°C Rubber / Optics';
    chamberTempC: number;
    pressureBar: number;
    elapsedMinutes: number;
    bowieDickTest: 'Passed' | 'Pending';
    biologicalIndicator: 'Negative (Sterile)' | 'In Incubation';
  }[];
  biomedicalPPM: {
    assetTag: string;
    equipmentName: string;
    model: string;
    location: string;
    lastPpmDate: string;
    nextPpmDue: string;
    calibrationStatus: 'Calibrated & Certified' | 'PPM Due Within 7 Days' | 'Out of Order';
  }[];
}

export interface NarcoticsLedgerItem {
  id: string;
  medicineName: string;
  dosageForm: string;
  patientMrin: string;
  patientName: string;
  prescribingDoctor: string;
  bmdcReg: string;
  quantityDispensed: number;
  balanceVaultRemaining: number;
  witnessNurse: string;
  pharmacistSignature: string;
  timestamp: string;
}

export interface ColdChainLogEntry {
  refrigeratorId: string;
  unitName: string;
  currentTempC: number;
  min24hTempC: number;
  max24hTempC: number;
  targetRange: string;
  doorOpenCount24h: number;
  powerBackupStatus: 'Mains Powered' | 'UPS Battery Active';
  status: 'In Compliance (2-8°C)' | 'Temperature Excursion Alert';
  lastLogTime: string;
}

// Initial Datasets for All New Hub Modules
export const INITIAL_VISITOR_PASSES: VisitorGatePass[] = [
  { id: 'VP-8821', visitorName: 'Tanvir Hossain', visitorPhone: '+880 1700-000011', patientMrin: 'HS-2026-00318', patientName: 'Abdur Rahman', ward: 'CCU', bedNumber: 'CCU-01', passType: 'VIP ICU Visitor', validUntil: '08:00 PM', issuedAt: '03:30 PM', status: 'active' },
  { id: 'VP-8822', visitorName: 'Shabnam Begum', visitorPhone: '+880 1800-000022', patientMrin: 'HS-2026-00421', patientName: 'Mohammad Rafiqul Islam', ward: 'General Ward (Male)', bedNumber: 'GWM-101', passType: 'Attendant 24H Pass', validUntil: 'Tomorrow 10:00 AM', issuedAt: '10:00 AM', status: 'active' },
  { id: 'VP-8823', visitorName: 'Kamal Uddin', visitorPhone: '+880 1900-000033', patientMrin: 'HS-2026-00892', patientName: 'Rokeya Sultana', ward: 'Post-Op', bedNumber: 'POP-01', passType: 'Standard Day Visitor', validUntil: '06:00 PM', issuedAt: '04:15 PM', status: 'active' }
];

export const INITIAL_CASHIER_DEPOSITS: CashierDepositSlip[] = [
  { receiptNo: 'CSH-2026-4401', patientMrin: 'HS-2026-00318', patientName: 'Abdur Rahman', amountBDT: 50000, purpose: 'Cath Lab Package', paymentMode: 'bKash', cashierStaff: 'Adnan Sami (Cashier 1)', timestamp: '11:40 AM', balanceDueBDT: 25000 },
  { receiptNo: 'CSH-2026-4402', patientMrin: 'HS-2026-00421', patientName: 'Mohammad Rafiqul Islam', amountBDT: 15000, purpose: 'IPD Admission Advance', paymentMode: 'Credit Card', cashierStaff: 'Rubina Akter (Cashier 2)', timestamp: '10:15 AM', balanceDueBDT: 0 },
  { receiptNo: 'CSH-2026-4403', patientMrin: 'HS-2026-00994', patientName: 'Nazrul Hassan', amountBDT: 12000, purpose: 'Dialysis 5-Cycle Deposit', paymentMode: 'SSK Govt Scheme', cashierStaff: 'Adnan Sami (Cashier 1)', timestamp: '09:30 AM', balanceDueBDT: 0 }
];

export const INITIAL_DOCTOR_SCHEDULES: DoctorDutySchedule[] = [
  { doctorId: 'doc-01', doctorName: 'Dr. Marcus Vance', specialty: 'Cardiology & Interventional', chamberRoom: 'Chamber 304', status: 'In Chamber', timing: '09:00 AM - 05:00 PM', tokensIssued: 18, tokensServed: 12, bmdcRegNo: 'BMDC-A-44821' },
  { doctorId: 'doc-02', doctorName: 'Dr. Elena Rostova', specialty: 'Neurology & Stroke Unit', chamberRoom: 'Chamber 308', status: 'In Chamber', timing: '10:00 AM - 06:00 PM', tokensIssued: 14, tokensServed: 9, bmdcRegNo: 'BMDC-A-51920' },
  { doctorId: 'doc-03', doctorName: 'Dr. Tariqul Islam', specialty: 'Endocrinology & Diabetology', chamberRoom: 'Chamber 212', status: 'Ward Rounds', timing: '08:30 AM - 04:30 PM', tokensIssued: 22, tokensServed: 17, bmdcRegNo: 'BMDC-A-38702' },
  { doctorId: 'doc-04', doctorName: 'Dr. Nusrat Jahan', specialty: 'Nephrology & Renal Transplant', chamberRoom: 'Chamber 401', status: 'In Chamber', timing: '09:30 AM - 05:30 PM', tokensIssued: 11, tokensServed: 6, bmdcRegNo: 'BMDC-A-62409' },
  { doctorId: 'doc-05', doctorName: 'Dr. Kazi Mahfuzur', specialty: 'Pulmonology & Critical Care', chamberRoom: 'Chamber 205', status: 'In Cath Lab', timing: '11:00 AM - 07:00 PM', tokensIssued: 8, tokensServed: 4, bmdcRegNo: 'BMDC-A-49215' }
];

export const INITIAL_LEVEY_JENNINGS: LeveyJenningsQCRun[] = [
  { id: 'qc-01', instrumentName: 'Siemens Atellica CH930', analyte: 'Serum Potassium (K+)', unit: 'mmol/L', targetMean: 4.20, standardDeviation: 0.12, measuredValue: 4.23, zScore: 0.25, status: 'In Control (1-2s)', runDate: 'Today 07:00 AM', technologist: 'Rashedul (LIS Tech)' },
  { id: 'qc-02', instrumentName: 'Roche Cobas e411', analyte: 'hs-Troponin I (High Sens)', unit: 'ng/mL', targetMean: 0.014, standardDeviation: 0.002, measuredValue: 0.015, zScore: 0.50, status: 'In Control (1-2s)', runDate: 'Today 07:15 AM', technologist: 'Dr. Kamrul (Biochemist)' },
  { id: 'qc-03', instrumentName: 'Sysmex XN-1000', analyte: 'Platelet Count (PLT)', unit: 'x10^9/L', targetMean: 245, standardDeviation: 12, measuredValue: 262, zScore: 1.41, status: 'In Control (1-2s)', runDate: 'Today 06:45 AM', technologist: 'Rashedul (LIS Tech)' },
  { id: 'qc-04', instrumentName: 'Radiometer ABL90 FLEX', analyte: 'Arterial Blood Gas pH', unit: 'pH', targetMean: 7.40, standardDeviation: 0.02, measuredValue: 7.39, zScore: -0.50, status: 'In Control (1-2s)', runDate: 'Today 08:00 AM', technologist: 'Dr. Kamrul (Biochemist)' }
];

export const INITIAL_PANIC_CALLS: CriticalPanicCallLog[] = [
  { id: 'pan-01', orderId: 'ORD-003', patientMrin: 'HS-2026-00318', patientName: 'Abdur Rahman', testName: 'Cardiac hs-Troponin I', panicValue: '0.082 ng/mL', criticalThreshold: '> 0.034 ng/mL', notifiedStaff: 'Sr. Staff Nurse Poly (CCU)', wardLocation: 'CCU-01 Bedside', readBackConfirmed: true, notifiedAt: '12:02 PM', dispatcherStaff: 'Dr. Kamrul (Lab Officer)' },
  { id: 'pan-02', orderId: 'ORD-008', patientMrin: 'HS-2026-00892', patientName: 'Rokeya Sultana', testName: 'Serum Potassium (K+)', panicValue: '2.8 mmol/L (Severe Hypokalemia)', criticalThreshold: '< 3.0 mmol/L', notifiedStaff: 'Duty Doctor Dr. Rashed', wardLocation: 'Post-Op Bed POP-01', readBackConfirmed: true, notifiedAt: '10:45 AM', dispatcherStaff: 'Rashedul (Biochem Tech)' }
];

export const INITIAL_BLOOD_BANK: BloodBankUnit[] = [
  { bloodGroup: 'O+', prbcUnits: 28, ffpUnits: 34, plateletConcentrateUnits: 14, cryoprecipitateUnits: 8, reservedUnits: 6, status: 'Optimal' },
  { bloodGroup: 'A+', prbcUnits: 22, ffpUnits: 26, plateletConcentrateUnits: 9, cryoprecipitateUnits: 6, reservedUnits: 4, status: 'Optimal' },
  { bloodGroup: 'B+', prbcUnits: 31, ffpUnits: 40, plateletConcentrateUnits: 16, cryoprecipitateUnits: 12, reservedUnits: 8, status: 'Optimal' },
  { bloodGroup: 'AB+', prbcUnits: 12, ffpUnits: 18, plateletConcentrateUnits: 5, cryoprecipitateUnits: 4, reservedUnits: 2, status: 'Adequate' },
  { bloodGroup: 'O-', prbcUnits: 3, ffpUnits: 6, plateletConcentrateUnits: 2, cryoprecipitateUnits: 1, reservedUnits: 2, status: 'Critical Shortage' },
  { bloodGroup: 'A-', prbcUnits: 4, ffpUnits: 8, plateletConcentrateUnits: 2, cryoprecipitateUnits: 2, reservedUnits: 1, status: 'Critical Shortage' },
  { bloodGroup: 'B-', prbcUnits: 5, ffpUnits: 9, plateletConcentrateUnits: 3, cryoprecipitateUnits: 2, reservedUnits: 1, status: 'Critical Shortage' },
  { bloodGroup: 'AB-', prbcUnits: 2, ffpUnits: 4, plateletConcentrateUnits: 1, cryoprecipitateUnits: 1, reservedUnits: 1, status: 'Critical Shortage' }
];

export const INITIAL_FACILITY_TELEMETRY: FacilityTelemetrySystem = {
  lmoTank: {
    capacityLiters: 10000,
    currentVolumeLiters: 8420,
    levelPercent: 84.2,
    tankPressureBar: 8.4,
    flowRateNm3h: 38.5,
    hoursRemaining: 182,
    status: 'Normal'
  },
  mgpsPressures: {
    oxygenBar: 4.25,
    nitrousOxideBar: 4.02,
    medicalAir4Bar: 4.51,
    surgicalAir7Bar: 7.15,
    vacuumKPa: -68.4,
    alarmStatus: 'All Systems Normal'
  },
  hvacIsolation: [
    { roomCode: 'ISO-NEG-01 (Airborne/TB)', pressureDifferentialPa: -32.5, airChangesPerHour: 14.2, hepaFilterLifePercent: 89, temperatureC: 21.2, humidityPercent: 52, mode: 'Negative (Infection Isolation)' },
    { roomCode: 'ISO-NEG-02 (Severe Viral)', pressureDifferentialPa: -28.0, airChangesPerHour: 13.8, hepaFilterLifePercent: 92, temperatureC: 21.0, humidityPercent: 50, mode: 'Negative (Infection Isolation)' },
    { roomCode: 'BMT-POS-01 (Bone Marrow)', pressureDifferentialPa: 34.0, airChangesPerHour: 18.5, hepaFilterLifePercent: 96, temperatureC: 22.0, humidityPercent: 48, mode: 'Positive (Bone Marrow / Burn ICU)' }
  ],
  generators: [
    { id: 'DG-1 (Primary)', ratedKVA: 500, fuelLevelPercent: 88, runningHours: 412, batteryVoltage: 26.4, atsStatus: 'Standby / Grid Online' },
    { id: 'DG-2 (Secondary)', ratedKVA: 750, fuelLevelPercent: 92, runningHours: 288, batteryVoltage: 26.6, atsStatus: 'Standby / Grid Online' }
  ],
  cssdAutoclaves: [
    { batchId: 'CSSD-B-2026-88', machineName: 'Getinge GSS67 Steam Sterilizer', cycleType: '134°C Porous / Textile', chamberTempC: 134.4, pressureBar: 3.12, elapsedMinutes: 28, bowieDickTest: 'Passed', biologicalIndicator: 'Negative (Sterile)' },
    { batchId: 'CSSD-B-2026-89', machineName: 'Steris V-PRO Low Temp Plasma', cycleType: '121°C Rubber / Optics', chamberTempC: 55.0, pressureBar: 1.05, elapsedMinutes: 14, bowieDickTest: 'Passed', biologicalIndicator: 'In Incubation' }
  ],
  biomedicalPPM: [
    { assetTag: 'BME-VENT-04', equipmentName: 'Hamilton C6 Mechanical Ventilator', model: 'Hamilton Medical C6', location: 'ICU Bed 01', lastPpmDate: '2026-10-15', nextPpmDue: '2026-11-20', calibrationStatus: 'Calibrated & Certified' },
    { assetTag: 'BME-DEFIB-02', equipmentName: 'Zoll R Series Biphasic Defibrillator', model: 'Zoll Medical R', location: 'CCU Crash Cart', lastPpmDate: '2026-11-01', nextPpmDue: '2026-12-01', calibrationStatus: 'Calibrated & Certified' },
    { assetTag: 'BME-ANESTH-01', equipmentName: 'Dräger Perseus A500 Anesthesia Workstation', model: 'Dräger A500', location: 'OT-1 Cardiac OT', lastPpmDate: '2026-09-10', nextPpmDue: '2026-11-16', calibrationStatus: 'PPM Due Within 7 Days' }
  ]
};

export const INITIAL_NARCOTICS_LEDGER: NarcoticsLedgerItem[] = [
  { id: 'NARC-001', medicineName: 'Inj. Morphine Sulfate 10mg/mL', dosageForm: 'Ampoule IV', patientMrin: 'HS-2026-00318', patientName: 'Abdur Rahman', prescribingDoctor: 'Dr. Marcus Vance', bmdcReg: 'BMDC-A-44821', quantityDispensed: 1, balanceVaultRemaining: 24, witnessNurse: 'Sr. Nurse Poly (CCU)', pharmacistSignature: 'Md. Shahidul (PharmD)', timestamp: '11:42 AM' },
  { id: 'NARC-002', medicineName: 'Inj. Fentanyl Citrate 100mcg/2mL', dosageForm: 'Ampoule IV', patientMrin: 'HS-2026-00892', patientName: 'Rokeya Sultana', prescribingDoctor: 'Dr. Elena Rostova', bmdcReg: 'BMDC-A-51920', quantityDispensed: 2, balanceVaultRemaining: 38, witnessNurse: 'Sr. Nurse Farzana', pharmacistSignature: 'Md. Shahidul (PharmD)', timestamp: '09:15 AM' }
];

export const INITIAL_COLD_CHAIN_LOGS: ColdChainLogEntry[] = [
  { refrigeratorId: 'CHILL-PHARMA-01', unitName: 'Main Dispensary Vaccine & Insulin Chiller', currentTempC: 3.8, min24hTempC: 2.6, max24hTempC: 5.1, targetRange: '+2.0°C to +8.0°C', doorOpenCount24h: 34, powerBackupStatus: 'Mains Powered', status: 'In Compliance (2-8°C)', lastLogTime: '10 mins ago' },
  { refrigeratorId: 'CHILL-BIOLOGIC-02', unitName: 'Oncology Monoclonal Antibodies Cryo-Locker', currentTempC: 4.2, min24hTempC: 3.1, max24hTempC: 4.9, targetRange: '+2.0°C to +8.0°C', doorOpenCount24h: 12, powerBackupStatus: 'Mains Powered', status: 'In Compliance (2-8°C)', lastLogTime: '5 mins ago' }
];

// Helper Clinical Calculators
export function calculateNEWS2Score(params: {
  respiratoryRate: number;
  spo2: number;
  onOxygen: boolean;
  systolicBp: number;
  pulseRate: number;
  consciousness: 'Alert' | 'CVPU'; // Confusion, Voice, Pain, Unresponsive
  temperatureF: number;
}): { score: number; riskLevel: 'Low' | 'Medium' | 'High'; clinicalAction: string } {
  let score = 0;

  // RR
  if (params.respiratoryRate <= 8) score += 3;
  else if (params.respiratoryRate >= 9 && params.respiratoryRate <= 11) score += 1;
  else if (params.respiratoryRate >= 21 && params.respiratoryRate <= 24) score += 2;
  else if (params.respiratoryRate >= 25) score += 3;

  // SpO2
  if (params.spo2 <= 91) score += 3;
  else if (params.spo2 >= 92 && params.spo2 <= 93) score += 2;
  else if (params.spo2 >= 94 && params.spo2 <= 95) score += 1;

  // O2
  if (params.onOxygen) score += 2;

  // SBP
  if (params.systolicBp <= 90) score += 3;
  else if (params.systolicBp >= 91 && params.systolicBp <= 100) score += 2;
  else if (params.systolicBp >= 101 && params.systolicBp <= 110) score += 1;
  else if (params.systolicBp >= 220) score += 3;

  // Pulse
  if (params.pulseRate <= 40) score += 3;
  else if (params.pulseRate >= 41 && params.pulseRate <= 50) score += 1;
  else if (params.pulseRate >= 91 && params.pulseRate <= 110) score += 1;
  else if (params.pulseRate >= 111 && params.pulseRate <= 130) score += 2;
  else if (params.pulseRate >= 131) score += 3;

  // Consciousness
  if (params.consciousness === 'CVPU') score += 3;

  // Temp
  if (params.temperatureF <= 95.0) score += 3;
  else if (params.temperatureF >= 95.1 && params.temperatureF <= 96.8) score += 1;
  else if (params.temperatureF >= 100.5 && params.temperatureF <= 102.2) score += 1;
  else if (params.temperatureF >= 102.3) score += 2;

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let clinicalAction = 'Ward-based 12-hourly routine nursing monitoring.';

  if (score >= 7) {
    riskLevel = 'High';
    clinicalAction = 'EMERGENCY: Immediate continuous monitoring and MET / ICU Rapid Response Team activation.';
  } else if (score >= 5 || (score >= 3 && params.consciousness === 'CVPU')) {
    riskLevel = 'Medium';
    clinicalAction = 'URGENT: Urgent clinical review by ward doctor and min. 1-hourly monitoring.';
  }

  return { score, riskLevel, clinicalAction };
}

// ========================================================
// NEXT-GEN BIO-CYBERNETIC & DEEP-TECH TELEMETRY MODELS
// ========================================================

export interface PharmacogenomicGeneVariant {
  gene: 'CYP2C19' | 'CYP2D6' | 'CYP3A5' | 'HLA-B' | 'VKORC1' | 'TPMT' | 'DPYD';
  diplotype: string;
  phenotype: 'Ultrarapid Metabolizer' | 'Normal Metabolizer' | 'Intermediate Metabolizer' | 'Poor Metabolizer' | 'High Toxicity Risk';
  implicatedDrugs: string[];
  clinicalGuideline: string;
  contraindicated: boolean;
}

export interface OrganDigitalTwinModel {
  patientMrin: string;
  targetOrgan: 'Heart' | 'Brain' | 'Kidney' | 'Liver';
  ffrCtScore: number;
  hemodynamicPressureDropKPa: number;
  stenosisPercent: number;
  inSilicoBindingAffinityKcal: number;
  shearStressDynesPerCm2: number;
  virtualStentRecommended: boolean;
}

export interface AutonomousMedicalDrone {
  droneId: string;
  callsign: string;
  model: string;
  status: 'In Flight - Cruising' | 'Descending' | 'Charging Pad' | 'Pre-Flight Diagnostics';
  batteryPercent: number;
  altitudeMeters: number;
  airspeedKmh: number;
  originHub: string;
  destinationFacility: string;
  payloadType: 'O-Negative PRBC Units' | 'Viper Antivenom Vials' | 'Cardiac Donor Transport' | 'Platelet Apheresis Unit';
  payloadTempCelsius: number;
  etaMinutes: number;
  lidarObstacleAvoidance: 'Optimal' | 'Caution' | 'Rerouted';
}

export interface DaVinciRoboticsTelemetry {
  robotId: string;
  activeSurgeon: string;
  procedureName: string;
  activeArmCount: number;
  tremorFiltrationRatio: number;
  networkLatencyMs: number;
  octResectionMarginClearMm: number;
  endoscopicZoomFactor: string;
  systemStatus: 'Master Console Engaged' | 'Standby' | 'Haptic Calibrated';
}

export interface NeuralBciTelemetry {
  patientMrin: string;
  bispectralIndex: number;
  sedationDepth: 'Awake (BIS 90-100)' | 'Light Sedation (BIS 70-89)' | 'General Anesthesia (BIS 40-69)' | 'Deep Hypnosis (BIS <40)';
  corticalBands: {
    deltaPowerPct: number;
    thetaPowerPct: number;
    alphaPowerPct: number;
    betaPowerPct: number;
    gammaPowerPct: number;
  };
  spikeBurstsDetectedPerMin: number;
  ncseSeizureRiskPercent: number;
}

export const INITIAL_PHARMACOGENOMICS: PharmacogenomicGeneVariant[] = [
  {
    gene: 'CYP2C19',
    diplotype: '*2/*3',
    phenotype: 'Poor Metabolizer',
    implicatedDrugs: ['Clopidogrel (Plagran)', 'Omeprazole', 'Voriconazole'],
    clinicalGuideline: 'CRITICAL: Severe loss-of-function allele prevents hepatic bioactivation of Clopidogrel. Increased stent thrombosis risk. CPIC Guideline: Switch to Prasugrel or Ticagrelor.',
    contraindicated: true
  },
  {
    gene: 'CYP2D6',
    diplotype: '*4/*4',
    phenotype: 'Poor Metabolizer',
    implicatedDrugs: ['Codeine', 'Tramadol', 'Metoprolol'],
    clinicalGuideline: 'Reduced bio-conversion of prodrug codeine to active morphine; lack of analgesia. Recommend non-CYP2D6 opioid or multimodal NSAID/acetaminophen.',
    contraindicated: false
  },
  {
    gene: 'HLA-B',
    diplotype: '*1502 Positive',
    phenotype: 'High Toxicity Risk',
    implicatedDrugs: ['Carbamazepine', 'Oxcarbazepine', 'Phenytoin'],
    clinicalGuideline: 'EXTREME CONTRAINDICATION: 100x risk of life-threatening Stevens-Johnson Syndrome (SJS) and Toxic Epidermal Necrolysis (TEN). Avoid all aromatic antiepileptics.',
    contraindicated: true
  },
  {
    gene: 'VKORC1',
    diplotype: '-1639G>A (AA)',
    phenotype: 'Intermediate Metabolizer',
    implicatedDrugs: ['Warfarin'],
    clinicalGuideline: 'High warfarin sensitivity. Standard starting dose will cause INR > 4.0 and major hemorrhage. Reduce initial dose by 50% or initiate DOAC (Apixaban).',
    contraindicated: false
  },
  {
    gene: 'DPYD',
    diplotype: '*2A/*1',
    phenotype: 'Intermediate Metabolizer',
    implicatedDrugs: ['Fluorouracil (5-FU)', 'Capecitabine'],
    clinicalGuideline: 'Partial Dihydropyrimidine Dehydrogenase deficiency. Reduce fluoropyrimidine dose by 50% to prevent fatal mucositis and myelosuppression.',
    contraindicated: true
  }
];

export const INITIAL_DRONES: AutonomousMedicalDrone[] = [
  {
    droneId: 'V-DRONE-01',
    callsign: 'AeroLifeline Alpha',
    model: 'Zipline P2 Hybrid Hexacopter',
    status: 'In Flight - Cruising',
    batteryPercent: 88,
    altitudeMeters: 120,
    airspeedKmh: 94,
    originHub: 'Vitality Central Cryo Bank',
    destinationFacility: 'Trauma Unit 4 (National Cardiac Apex)',
    payloadType: 'O-Negative PRBC Units',
    payloadTempCelsius: 3.8,
    etaMinutes: 4.2,
    lidarObstacleAvoidance: 'Optimal'
  },
  {
    droneId: 'V-DRONE-02',
    callsign: 'AeroLifeline Bravo',
    model: 'Wingcopter 198 Long-Range',
    status: 'Pre-Flight Diagnostics',
    batteryPercent: 100,
    altitudeMeters: 0,
    airspeedKmh: 0,
    originHub: 'Vitality Pharma Vault',
    destinationFacility: 'Rural Anteroom Outpost B',
    payloadType: 'Viper Antivenom Vials',
    payloadTempCelsius: 4.1,
    etaMinutes: 11.5,
    lidarObstacleAvoidance: 'Optimal'
  }
];

export const INITIAL_ROBOTICS: DaVinciRoboticsTelemetry = {
  robotId: 'DAVINCI-XI-04',
  activeSurgeon: 'Dr. Marcus Vance (Tele-Console 1)',
  procedureName: 'Robotic-Assisted Minimally Invasive CABG (LIMA to LAD)',
  activeArmCount: 4,
  tremorFiltrationRatio: 99.8,
  networkLatencyMs: 1.2,
  octResectionMarginClearMm: 4.2,
  endoscopicZoomFactor: '16x 3D HD Stereoscopic',
  systemStatus: 'Master Console Engaged'
};

export const INITIAL_BCI: NeuralBciTelemetry = {
  patientMrin: 'HS-2026-00318',
  bispectralIndex: 82,
  sedationDepth: 'Light Sedation (BIS 70-89)',
  corticalBands: {
    deltaPowerPct: 34,
    thetaPowerPct: 22,
    alphaPowerPct: 28,
    betaPowerPct: 12,
    gammaPowerPct: 4
  },
  spikeBurstsDetectedPerMin: 0,
  ncseSeizureRiskPercent: 3.2
};

// LocalStorage Persistence Helpers
export function loadStoredData<T>(key: string, fallback: T): T {
  try {
    const storageKey = key.startsWith('vitality_') ? key : `vitality_${key}`;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback) && Array.isArray(parsed)) {
        return (parsed.length > 0 ? parsed : fallback) as unknown as T;
      }
      return parsed;
    }
  } catch (e) {
    console.warn(`Failed to parse localStorage key ${key}`, e);
  }
  return fallback;
}

export function saveStoredData<T>(key: string, data: T): void {
  try {
    const storageKey = key.startsWith('vitality_') ? key : `vitality_${key}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to save localStorage key ${key}`, e);
  }
}
