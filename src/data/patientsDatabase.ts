export interface LabParameter {
  name: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  flag?: 'normal' | 'high' | 'low' | 'critical';
}

export interface ClinicLabReport {
  id: string;
  title: string;
  date: string;
  laboratoryName: string;
  status: 'completed' | 'sample_collected' | 'pending';
  parameters: LabParameter[];
  summaryNote: string;
}

export interface PrescribedMedicineItem {
  id: string;
  medicineId: string;
  medicineName: string;
  organName: string;
  organIcon: string;
  form: string;
  dosage: string;
  timing: 'Morning' | 'Noon' | 'Evening' | 'Night' | 'SOS';
  exactTime: string; // '08:00 AM'
  foodRelation: 'before_food' | 'with_food' | 'after_food' | 'empty_stomach';
  durationDays: number;
  whyGivenForPatient: string;
  takenToday?: boolean;
  takenTime?: string;
  snoozed?: boolean;
  skipped?: boolean;
  skipReason?: string;
}

export interface DiagnosticTestOrder {
  id: string;
  testName: string;
  orderedByDoctor: string;
  orderDate: string;
  priority: 'Routine' | 'Urgent';
  status: 'Requisitioned' | 'Sample Collected' | 'Report Available';
  instructions: string;
  reportId?: string;
}

export interface PatientRecord {
  mrin: string; // e.g. "MRIN-89210"
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  appointmentDate: string; // "2026-11-13"
  appointmentTime: string; // "09:30 AM"
  isToday: boolean;
  vitals: {
    bloodPressure: string; // "146/92 mmHg"
    heartRate: number; // 78 bpm
    spO2: number; // 98%
    bmi: number; // 28.4
    temperature: string; // "98.6 F"
    glucoseRandom?: number; // 188 mg/dL
  };
  chiefComplaints: string[];
  pastMedicalHistory: string[];
  knownDrugAllergies: string[];
  clinicLabReports: ClinicLabReport[];
  activePrescription: {
    prescriptionId: string;
    prescribedDate: string;
    doctorName: string;
    licenseNumber: string;
    clinicName: string;
    diagnosis: string;
    medicines: PrescribedMedicineItem[];
    clinicalAdvice: string[];
  };
  orderedDiagnosticTests: DiagnosticTestOrder[];
}

export const INITIAL_PATIENTS: PatientRecord[] = [
  {
    mrin: 'MRIN-89210',
    fullName: 'Arthur Pendelton',
    age: 58,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 (555) 234-8901',
    email: 'arthur.pendelton@example.com',
    emergencyContact: {
      name: 'Eleanor Pendelton',
      relation: 'Spouse',
      phone: '+1 (555) 234-8909'
    },
    appointmentDate: '2026-11-13',
    appointmentTime: '09:30 AM',
    isToday: true,
    vitals: {
      bloodPressure: '148/94 mmHg',
      heartRate: 82,
      spO2: 97,
      bmi: 29.1,
      temperature: '98.4 F',
      glucoseRandom: 196
    },
    chiefComplaints: [
      'Frequent thirst (polydipsia) and nocturnal urination for 3 weeks',
      'Morning dizziness upon rising from bed',
      'Mild ankle swelling in the late evening'
    ],
    pastMedicalHistory: [
      'Type 2 Diabetes Mellitus (Diagnosed 4 years ago)',
      'Essential Hypertension (Grade 1)',
      'Hypercholesterolemia'
    ],
    knownDrugAllergies: ['Penicillin (Hives and facial swelling)'],
    clinicLabReports: [
      {
        id: 'lab-89210-hba1c',
        title: 'Comprehensive Metabolic & Glycemic Profile',
        date: '2026-11-11',
        laboratoryName: 'Apex Central PathLab',
        status: 'completed',
        parameters: [
          { name: 'HbA1c (Glycated Hemoglobin)', value: 8.6, unit: '%', referenceRange: '< 5.7 (Normal), > 7.0 (Uncontrolled)', flag: 'high' },
          { name: 'Fasting Blood Glucose', value: 168, unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', flag: 'high' },
          { name: 'Post-Prandial Glucose (2h)', value: 242, unit: 'mg/dL', referenceRange: '< 140 mg/dL', flag: 'high' },
          { name: 'Serum Creatinine', value: 1.25, unit: 'mg/dL', referenceRange: '0.7 - 1.2 mg/dL', flag: 'high' },
          { name: 'eGFR (Kidney Filtration Rate)', value: 64, unit: 'mL/min/1.73m²', referenceRange: '> 90 mL/min', flag: 'low' },
          { name: 'Serum Potassium (K+)', value: 4.8, unit: 'mEq/L', referenceRange: '3.5 - 5.0 mEq/L', flag: 'normal' }
        ],
        summaryNote: 'Elevated HbA1c indicative of poor recent glycemic control. Mild decline in eGFR indicates early renal strain.'
      },
      {
        id: 'lab-89210-lipid',
        title: 'Fasting Lipid Profile',
        date: '2026-11-11',
        laboratoryName: 'Apex Central PathLab',
        status: 'completed',
        parameters: [
          { name: 'Total Cholesterol', value: 238, unit: 'mg/dL', referenceRange: '< 200 mg/dL', flag: 'high' },
          { name: 'LDL ("Bad") Cholesterol', value: 154, unit: 'mg/dL', referenceRange: '< 100 mg/dL', flag: 'high' },
          { name: 'HDL ("Good") Cholesterol', value: 38, unit: 'mg/dL', referenceRange: '> 40 mg/dL', flag: 'low' },
          { name: 'Triglycerides', value: 215, unit: 'mg/dL', referenceRange: '< 150 mg/dL', flag: 'high' }
        ],
        summaryNote: 'Atherogenic dyslipidemia pattern consistent with metabolic syndrome.'
      }
    ],
    activePrescription: {
      prescriptionId: 'RX-2026-89210',
      prescribedDate: '2026-11-13',
      doctorName: 'Dr. Marcus Vance, MD, FACP',
      licenseNumber: 'MD-88319-NY',
      clinicName: 'Metropolitan Clinical Endocrinology Institute',
      diagnosis: 'Uncontrolled Type 2 Diabetes Mellitus with Stage 1 Hypertension & Mixed Dyslipidemia',
      medicines: [
        {
          id: 'rxm-1',
          medicineId: 'med-metformin',
          medicineName: 'Metformin HCl 500mg ER',
          organName: 'Endocrine & Metabolism (Pancreas & Liver)',
          organIcon: '🩸',
          form: 'Tablet',
          dosage: '500mg ER - 1 Tablet',
          timing: 'Morning',
          exactTime: '08:00 AM',
          foodRelation: 'with_food',
          durationDays: 30,
          whyGivenForPatient: 'Lowers blood sugar production and improves insulin sensitivity.',
          takenToday: true,
          takenTime: '08:14 AM'
        },
        {
          id: 'rxm-2',
          medicineId: 'med-telmisartan',
          medicineName: 'Telmisartan 40mg',
          organName: 'Cardiovascular & Blood Pressure',
          organIcon: '🫀',
          form: 'Tablet',
          dosage: '40mg - 1 Tablet',
          timing: 'Morning',
          exactTime: '08:30 AM',
          foodRelation: 'after_food',
          durationDays: 30,
          whyGivenForPatient: 'Relaxes blood vessels, stabilizes morning blood pressure, and shields kidneys from diabetic damage.',
          takenToday: true,
          takenTime: '08:35 AM'
        },
        {
          id: 'rxm-3',
          medicineId: 'med-atorvastatin',
          medicineName: 'Atorvastatin 20mg',
          organName: 'Cardiovascular & Blood Lipids',
          organIcon: '🫀',
          form: 'Tablet',
          dosage: '20mg - 1 Tablet',
          timing: 'Night',
          exactTime: '10:00 PM',
          foodRelation: 'after_food',
          durationDays: 30,
          whyGivenForPatient: 'Clears arterial LDL plaque and lowers risk of cardiovascular events.',
          takenToday: false
        },
        {
          id: 'rxm-4',
          medicineId: 'med-insulin-glargine',
          medicineName: 'Insulin Glargine (Lantus Pen)',
          organName: 'Endocrine & Blood Sugar (Pancreas)',
          organIcon: '🩸',
          form: 'Injection / Pen',
          dosage: '14 Units SubQ',
          timing: 'Night',
          exactTime: '10:30 PM',
          foodRelation: 'before_food',
          durationDays: 30,
          whyGivenForPatient: 'Provides 24-hour basal insulin to prevent high fasting glucose overnight.',
          takenToday: false
        }
      ],
      clinicalAdvice: [
        'Maintain low-glycemic dietary intake; strictly limit refined sugars and sodas.',
        'Drink at least 2.5L of water daily to support kidney function.',
        'Log fasting and post-meal glucose readings twice weekly in the app.'
      ]
    },
    orderedDiagnosticTests: [
      {
        id: 'ord-1',
        testName: 'Urine Albumin-to-Creatinine Ratio (uACR)',
        orderedByDoctor: 'Dr. Marcus Vance',
        orderDate: '2026-11-13',
        priority: 'Urgent',
        status: 'Requisitioned',
        instructions: 'First morning clean-catch urine specimen to detect early microalbuminuria.'
      },
      {
        id: 'ord-2',
        testName: 'Follow-up HbA1c & Renal Function Panel',
        orderedByDoctor: 'Dr. Marcus Vance',
        orderDate: '2026-11-13',
        priority: 'Routine',
        status: 'Requisitioned',
        instructions: 'Repeat after 90 days to evaluate insulin titration efficacy.'
      }
    ]
  },
  {
    mrin: 'MRIN-44109',
    fullName: 'Elena Rostova',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '+1 (555) 782-1194',
    email: 'elena.rostova@example.com',
    emergencyContact: {
      name: 'Dmitri Rostov',
      relation: 'Brother',
      phone: '+1 (555) 782-1190'
    },
    appointmentDate: '2026-11-13',
    appointmentTime: '11:15 AM',
    isToday: true,
    vitals: {
      bloodPressure: '118/76 mmHg',
      heartRate: 74,
      spO2: 99,
      bmi: 22.3,
      temperature: '98.6 F'
    },
    chiefComplaints: [
      'Persistent cystic acne on jawline and cheeks despite OTC washes',
      'Occasional nocturnal wheezing and post-exercise cough'
    ],
    pastMedicalHistory: [
      'Mild Intermittent Bronchial Asthma',
      'Acne Vulgaris (Grade III)'
    ],
    knownDrugAllergies: ['Sulfa drugs (Skin rash)'],
    clinicLabReports: [
      {
        id: 'lab-44109-spiro',
        title: 'Pulmonary Function Spirometry Report',
        date: '2026-11-08',
        laboratoryName: 'Metro Respiratory Diagnostics',
        status: 'completed',
        parameters: [
          { name: 'FEV1 (Forced Expiratory Volume 1s)', value: 81, unit: '% Predicted', referenceRange: '> 80%', flag: 'normal' },
          { name: 'FEV1 / FVC Ratio', value: 74, unit: '%', referenceRange: '> 75%', flag: 'low' },
          { name: 'Peak Expiratory Flow (PEF)', value: 380, unit: 'L/min', referenceRange: '400 - 450 L/min', flag: 'low' }
        ],
        summaryNote: 'Mild reversible obstructive airway pattern responsive to bronchodilator challenge.'
      }
    ],
    activePrescription: {
      prescriptionId: 'RX-2026-44109',
      prescribedDate: '2026-11-13',
      doctorName: 'Dr. Sarah Lin, MD (Dermatology & Allergy)',
      licenseNumber: 'MD-90124-CA',
      clinicName: 'St. Jude Specialty Dermatology & Allergy Clinic',
      diagnosis: 'Acne Vulgaris (Moderate Inflammatory) & Exercise-Induced Bronchospasm',
      medicines: [
        {
          id: 'rxm-201',
          medicineId: 'med-adapalene',
          medicineName: 'Adapalene 0.1% Gel (Differin)',
          organName: 'Dermatology & Skin Barrier',
          organIcon: '🧬',
          form: 'Gel / Cream',
          dosage: 'Pea-sized amount over face',
          timing: 'Night',
          exactTime: '10:30 PM',
          foodRelation: 'empty_stomach',
          durationDays: 60,
          whyGivenForPatient: 'Unclogs pores and speeds up cellular renewal to clear acne lesions.',
          takenToday: false
        },
        {
          id: 'rxm-202',
          medicineId: 'med-salbutamol',
          medicineName: 'Salbutamol Inhaler (Ventolin)',
          organName: 'Respiratory & Lungs (Airways)',
          organIcon: '🫁',
          form: 'Inhaler',
          dosage: '2 Puffs (200mcg)',
          timing: 'SOS',
          exactTime: 'As Needed',
          foodRelation: 'empty_stomach',
          durationDays: 90,
          whyGivenForPatient: 'Fast-acting bronchodilator to relieve sudden chest tightness or before workouts.',
          takenToday: false
        }
      ],
      clinicalAdvice: [
        'Apply gentle non-comedogenic moisturizer 10 mins before Adapalene gel to minimize peeling.',
        'Use Broad Spectrum SPF 50 sunscreen daily.',
        'Inhale 2 puffs of Salbutamol 15 minutes before aerobic running.'
      ]
    },
    orderedDiagnosticTests: [
      {
        id: 'ord-3',
        testName: 'Hormonal Profile (Free Testosterone, DHEA-S, LH/FSH)',
        orderedByDoctor: 'Dr. Sarah Lin',
        orderDate: '2026-11-13',
        priority: 'Routine',
        status: 'Sample Collected',
        instructions: 'Morning blood draw to evaluate hormonal contributors to jawline acne.'
      }
    ]
  },
  {
    mrin: 'MRIN-77301',
    fullName: 'James MacIntyre',
    age: 72,
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+1 (555) 901-4433',
    email: 'j.macintyre@example.com',
    emergencyContact: {
      name: 'Clara MacIntyre',
      relation: 'Daughter',
      phone: '+1 (555) 901-4430'
    },
    appointmentDate: '2026-11-10',
    appointmentTime: '02:00 PM',
    isToday: false,
    vitals: {
      bloodPressure: '134/82 mmHg',
      heartRate: 72,
      spO2: 96,
      bmi: 26.8,
      temperature: '98.2 F'
    },
    chiefComplaints: [
      'Bilateral knee joint pain upon morning walking',
      'Heartburn after heavy dinners'
    ],
    pastMedicalHistory: [
      'Bilateral Knee Osteoarthritis',
      'Gastroesophageal Reflux Disease (GERD)',
      'History of Peptic Ulcer Disease'
    ],
    knownDrugAllergies: ['Aspirin (Severe gastric pain)'],
    clinicLabReports: [
      {
        id: 'lab-77301-esr',
        title: 'Inflammatory Markers & Comprehensive CBC',
        date: '2026-11-09',
        laboratoryName: 'Metropolitan Central PathLab',
        status: 'completed',
        parameters: [
          { name: 'ESR (Erythrocyte Sedimentation Rate)', value: 24, unit: 'mm/hr', referenceRange: '< 20 mm/hr', flag: 'high' },
          { name: 'C-Reactive Protein (CRP)', value: 3.2, unit: 'mg/L', referenceRange: '< 1.0 mg/L', flag: 'high' },
          { name: 'Hemoglobin', value: 14.1, unit: 'g/dL', referenceRange: '13.5 - 17.5 g/dL', flag: 'normal' }
        ],
        summaryNote: 'Mild inflammatory elevation consistent with degenerative osteoarthritis flare.'
      }
    ],
    activePrescription: {
      prescriptionId: 'RX-2026-77301',
      prescribedDate: '2026-11-10',
      doctorName: 'Dr. Robert Sterling, MD (Rheumatology & Internal Med)',
      licenseNumber: 'MD-55102-IL',
      clinicName: 'Sterling Joint & Digestive Health Center',
      diagnosis: 'Knee Osteoarthritis Flare & Moderate GERD',
      medicines: [
        {
          id: 'rxm-301',
          medicineId: 'med-esomeprazole',
          medicineName: 'Esomeprazole 40mg (Nexium)',
          organName: 'Stomach & Gastrointestinal (Digestive)',
          organIcon: '🍽️',
          form: 'Capsule',
          dosage: '40mg - 1 Capsule',
          timing: 'Morning',
          exactTime: '07:30 AM',
          foodRelation: 'before_food',
          durationDays: 14,
          whyGivenForPatient: 'Suppresses stomach acid to prevent ulcer irritation and allow esophageal healing.',
          takenToday: true,
          takenTime: '07:35 AM'
        },
        {
          id: 'rxm-302',
          medicineId: 'med-ibuprofen',
          medicineName: 'Ibuprofen 400mg',
          organName: 'Musculoskeletal (Joints, Muscles & Bones)',
          organIcon: '🦴',
          form: 'Tablet',
          dosage: '400mg - 1 Tablet',
          timing: 'Noon',
          exactTime: '01:00 PM',
          foodRelation: 'with_food',
          durationDays: 7,
          whyGivenForPatient: 'Relieves joint inflammation and acute knee pain; taken strictly with food.',
          takenToday: false
        }
      ],
      clinicalAdvice: [
        'Take Esomeprazole at least 30 minutes before eating breakfast.',
        'Never take Ibuprofen on an empty stomach due to previous ulcer history.',
        'Avoid bending knees past 90 degrees during acute flare.'
      ]
    },
    orderedDiagnosticTests: [
      {
        id: 'ord-4',
        testName: 'Weight-Bearing Bilateral Knee X-Ray (AP & Lateral)',
        orderedByDoctor: 'Dr. Robert Sterling',
        orderDate: '2026-11-10',
        priority: 'Routine',
        status: 'Report Available',
        instructions: 'Check medial joint space narrowing and osteophyte progression.'
      }
    ]
  }
];
