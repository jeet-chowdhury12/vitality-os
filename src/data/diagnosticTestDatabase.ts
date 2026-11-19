// Comprehensive Vitality Diagnostic Network & Imaging Test Taxonomy
// For Vitality-OS (Smart Hospital LIS / RIS Engine)

export interface DiagnosticTestItem {
  id: string;
  code: string;
  name: string;
  category: 'Laboratory & Pathology' | 'Radiology & Imaging' | 'Cardiology & Vascular' | 'Gastroenterology & Specialty';
  subCategory: string;
  department: 'Biochemistry' | 'Hematology' | 'Microbiology' | 'Histopathology' | 'Radiology' | 'Cardiology' | 'Gastroenterology' | 'Pulmonology';
  sampleType: 'Blood' | 'Serum' | 'Plasma' | 'Urine' | 'Stool' | 'Tissue' | 'Imaging / Scan' | 'Procedure' | 'Non-Invasive Sensor';
  turnaroundTime: string;
  priceBDT: number;
  criticalPanicRule?: string;
  description: string;
  commonIndications: string[];
  parameters?: {
    name: string;
    unit: string;
    normalRangeMale: string;
    normalRangeFemale: string;
    criticalLow?: number;
    criticalHigh?: number;
  }[];
}

export const DIAGNOSTIC_TEST_CATALOG: DiagnosticTestItem[] = [
  // 1. HEMATOLOGY & COAGULATION
  {
    id: 'test-hem-001',
    code: 'LAB-HEM-CBC',
    name: 'Complete Blood Count (CBC) with ESR & PBF',
    category: 'Laboratory & Pathology',
    subCategory: 'Hematology & Coagulation',
    department: 'Hematology',
    sampleType: 'Blood',
    turnaroundTime: '2 Hours',
    priceBDT: 450,
    criticalPanicRule: 'Platelets < 20,000 /uL or Hb < 6.0 g/dL',
    description: 'Measures RBC, WBC, Hemoglobin, Hematocrit, Platelets, differential count, and ESR for infection, anemia, and bleeding disorders.',
    commonIndications: ['Fever', 'Anemia', 'Dengue Screening', 'Fatigue', 'Pre-Op Evaluation'],
    parameters: [
      { name: 'Hemoglobin (Hb)', unit: 'g/dL', normalRangeMale: '13.5 - 17.5', normalRangeFemale: '12.0 - 15.5', criticalLow: 6.0, criticalHigh: 20.0 },
      { name: 'Total WBC Count', unit: 'x10^3/uL', normalRangeMale: '4.0 - 11.0', normalRangeFemale: '4.0 - 11.0', criticalLow: 2.0, criticalHigh: 30.0 },
      { name: 'Platelet Count', unit: 'x10^3/uL', normalRangeMale: '150 - 450', normalRangeFemale: '150 - 450', criticalLow: 20, criticalHigh: 1000 },
      { name: 'ESR (Westergren)', unit: 'mm/1st hr', normalRangeMale: '0 - 15', normalRangeFemale: '0 - 20' }
    ]
  },
  {
    id: 'test-hem-002',
    code: 'LAB-COAG-PT',
    name: 'Prothrombin Time (PT) with INR',
    category: 'Laboratory & Pathology',
    subCategory: 'Hematology & Coagulation',
    department: 'Hematology',
    sampleType: 'Plasma',
    turnaroundTime: '3 Hours',
    priceBDT: 650,
    criticalPanicRule: 'INR > 4.5 (High Hemorrhagic Risk)',
    description: 'Evaluates extrinsic coagulation pathway; essential for Warfarin therapy monitoring and pre-surgical bleeding risk assessment.',
    commonIndications: ['Warfarin Monitoring', 'Liver Disease', 'Unexplained Bruising', 'Pre-Op Coagulation'],
    parameters: [
      { name: 'Patient PT', unit: 'seconds', normalRangeMale: '11.0 - 13.5', normalRangeFemale: '11.0 - 13.5' },
      { name: 'INR', unit: 'Ratio', normalRangeMale: '0.8 - 1.2', normalRangeFemale: '0.8 - 1.2', criticalHigh: 4.5 }
    ]
  },
  {
    id: 'test-hem-003',
    code: 'LAB-HEM-GRP',
    name: 'Blood Grouping (ABO & Rh Phenotype)',
    category: 'Laboratory & Pathology',
    subCategory: 'Hematology & Coagulation',
    department: 'Hematology',
    sampleType: 'Blood',
    turnaroundTime: '1 Hour',
    priceBDT: 250,
    description: 'Determines forward and reverse ABO blood grouping and Rh(D) status for safe transfusion and emergency trauma intake.',
    commonIndications: ['Blood Transfusion', 'Pregnancy Workup', 'Emergency Admission', 'Organ Donation']
  },

  // 2. BIOCHEMISTRY & ORGAN PANELS
  {
    id: 'test-bio-001',
    code: 'LAB-BIO-HBA1C',
    name: 'HbA1c (Glycated Hemoglobin) by HPLC',
    category: 'Laboratory & Pathology',
    subCategory: 'Biochemistry & Organ Panels',
    department: 'Biochemistry',
    sampleType: 'Blood',
    turnaroundTime: '2 Hours',
    priceBDT: 850,
    criticalPanicRule: 'HbA1c > 10.0% (Uncontrolled Hyperglycemia)',
    description: 'Gold standard NGSP-certified high-performance liquid chromatography assay reflecting 3-month glycemic control.',
    commonIndications: ['Diabetes Mellitus Monitoring', 'Prediabetes Screening', 'Metabolic Syndrome'],
    parameters: [
      { name: 'HbA1c Concentration', unit: '%', normalRangeMale: '4.0 - 5.6', normalRangeFemale: '4.0 - 5.6', criticalHigh: 10.0 },
      { name: 'Estimated Average Glucose', unit: 'mg/dL', normalRangeMale: '70 - 114', normalRangeFemale: '70 - 114' }
    ]
  },
  {
    id: 'test-bio-002',
    code: 'LAB-BIO-LFT',
    name: 'Liver Function Tests (LFT Complete Panel)',
    category: 'Laboratory & Pathology',
    subCategory: 'Biochemistry & Organ Panels',
    department: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundTime: '4 Hours',
    priceBDT: 1100,
    criticalPanicRule: 'Total Bilirubin > 5.0 mg/dL or SGPT > 500 U/L',
    description: 'Assesses hepatocellular injury, cholestasis, and protein synthesis: Total/Direct Bilirubin, SGPT (ALT), SGOT (AST), Alkaline Phosphatase, Total Protein, and Albumin.',
    commonIndications: ['Jaundice', 'Hepatitis Evaluation', 'Fatty Liver', 'Medication Hepatotoxicity Screening'],
    parameters: [
      { name: 'Total Bilirubin', unit: 'mg/dL', normalRangeMale: '0.2 - 1.2', normalRangeFemale: '0.2 - 1.2', criticalHigh: 5.0 },
      { name: 'SGPT (ALT)', unit: 'U/L', normalRangeMale: '10 - 45', normalRangeFemale: '7 - 35', criticalHigh: 500 },
      { name: 'SGOT (AST)', unit: 'U/L', normalRangeMale: '10 - 40', normalRangeFemale: '9 - 32', criticalHigh: 500 },
      { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', normalRangeMale: '40 - 130', normalRangeFemale: '35 - 105' },
      { name: 'Serum Albumin', unit: 'g/dL', normalRangeMale: '3.5 - 5.0', normalRangeFemale: '3.5 - 5.0', criticalLow: 2.0 }
    ]
  },
  {
    id: 'test-bio-003',
    code: 'LAB-BIO-KFT',
    name: 'Kidney Function Tests (KFT / RFT) with eGFR',
    category: 'Laboratory & Pathology',
    subCategory: 'Biochemistry & Organ Panels',
    department: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundTime: '2 Hours',
    priceBDT: 850,
    criticalPanicRule: 'Serum Creatinine > 3.0 mg/dL or Urea > 100 mg/dL',
    description: 'Measures Serum Creatinine, Blood Urea, Blood Urea Nitrogen (BUN), Uric Acid, and CKD-EPI calculated Estimated Glomerular Filtration Rate (eGFR).',
    commonIndications: ['Hypertension', 'Diabetes Complications', 'Chronic Kidney Disease', 'Edema', 'Nephrotoxic Drug Monitoring'],
    parameters: [
      { name: 'Serum Creatinine', unit: 'mg/dL', normalRangeMale: '0.7 - 1.3', normalRangeFemale: '0.5 - 1.1', criticalHigh: 3.0 },
      { name: 'Blood Urea', unit: 'mg/dL', normalRangeMale: '15 - 40', normalRangeFemale: '15 - 40', criticalHigh: 100 },
      { name: 'eGFR (CKD-EPI)', unit: 'mL/min/1.73m2', normalRangeMale: '> 90', normalRangeFemale: '> 90', criticalLow: 15 },
      { name: 'Serum Uric Acid', unit: 'mg/dL', normalRangeMale: '3.4 - 7.0', normalRangeFemale: '2.4 - 5.7', criticalHigh: 10.0 }
    ]
  },
  {
    id: 'test-bio-004',
    code: 'LAB-BIO-LYTES',
    name: 'Serum Electrolytes (Na+, K+, Cl-, HCO3-)',
    category: 'Laboratory & Pathology',
    subCategory: 'Biochemistry & Organ Panels',
    department: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundTime: '1 Hour',
    priceBDT: 750,
    criticalPanicRule: 'Potassium (K+) < 2.8 mmol/L or > 6.2 mmol/L (Severe Arrhythmia Risk)',
    description: 'Critical ion-selective electrode measurement for acid-base equilibrium, diuretic therapy, and emergency fluid resuscitation.',
    commonIndications: ['Vomiting / Diarrhea', 'Diuretic Use', 'Arrhythmia', 'ICU / Acute Admission', 'Renal Failure'],
    parameters: [
      { name: 'Sodium (Na+)', unit: 'mmol/L', normalRangeMale: '136 - 145', normalRangeFemale: '136 - 145', criticalLow: 120, criticalHigh: 160 },
      { name: 'Potassium (K+)', unit: 'mmol/L', normalRangeMale: '3.5 - 5.1', normalRangeFemale: '3.5 - 5.1', criticalLow: 2.8, criticalHigh: 6.2 },
      { name: 'Chloride (Cl-)', unit: 'mmol/L', normalRangeMale: '98 - 107', normalRangeFemale: '98 - 107' },
      { name: 'Bicarbonate (HCO3-)', unit: 'mmol/L', normalRangeMale: '22 - 29', normalRangeFemale: '22 - 29', criticalLow: 10, criticalHigh: 40 }
    ]
  },
  {
    id: 'test-bio-005',
    code: 'LAB-BIO-LIPID',
    name: 'Lipid Profile (Fasting Lipid Panel)',
    category: 'Laboratory & Pathology',
    subCategory: 'Biochemistry & Organ Panels',
    department: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundTime: '3 Hours',
    priceBDT: 950,
    criticalPanicRule: 'Triglycerides > 500 mg/dL (Acute Pancreatitis Risk)',
    description: 'Measures Total Cholesterol, Triglycerides, HDL (Good Cholesterol), LDL (Bad Cholesterol), and VLDL for cardiovascular risk stratification.',
    commonIndications: ['Coronary Artery Disease', 'Stroke Prevention', 'Statin Therapy Monitoring', 'Family History of Dyslipidemia'],
    parameters: [
      { name: 'Total Cholesterol', unit: 'mg/dL', normalRangeMale: '< 200', normalRangeFemale: '< 200', criticalHigh: 300 },
      { name: 'Triglycerides', unit: 'mg/dL', normalRangeMale: '< 150', normalRangeFemale: '< 150', criticalHigh: 500 },
      { name: 'HDL Cholesterol', unit: 'mg/dL', normalRangeMale: '> 40', normalRangeFemale: '> 50' },
      { name: 'LDL Cholesterol', unit: 'mg/dL', normalRangeMale: '< 100', normalRangeFemale: '< 100', criticalHigh: 190 }
    ]
  },

  // 3. HORMONES & VITAMINS
  {
    id: 'test-horm-001',
    code: 'LAB-HORM-THY',
    name: 'Thyroid Function Profile (TSH, Free T3, Free T4)',
    category: 'Laboratory & Pathology',
    subCategory: 'Hormones & Vitamins',
    department: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundTime: '4 Hours',
    priceBDT: 1250,
    criticalPanicRule: 'TSH > 20.0 uIU/mL or Free T4 < 0.4 ng/dL',
    description: 'Chemiluminescent immunoassay for Hypothyroidism, Hyperthyroidism, Hashimoto thyroiditis, and Thyroxine dosing.',
    commonIndications: ['Unexplained Weight Change', 'Palpitations', 'Hair Loss', 'Goiter', 'Thyroxine Follow-up'],
    parameters: [
      { name: 'TSH (Ultrasensitive)', unit: 'uIU/mL', normalRangeMale: '0.4 - 4.2', normalRangeFemale: '0.4 - 4.2', criticalHigh: 20.0 },
      { name: 'Free T3', unit: 'pg/mL', normalRangeMale: '2.3 - 4.2', normalRangeFemale: '2.3 - 4.2' },
      { name: 'Free T4', unit: 'ng/dL', normalRangeMale: '0.8 - 1.8', normalRangeFemale: '0.8 - 1.8', criticalLow: 0.4 }
    ]
  },
  {
    id: 'test-horm-002',
    code: 'LAB-HORM-VITD',
    name: 'Vitamin D 25-Hydroxy (25-OH Total)',
    category: 'Laboratory & Pathology',
    subCategory: 'Hormones & Vitamins',
    department: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundTime: '6 Hours',
    priceBDT: 1800,
    description: 'Measures both D2 and D3 25-hydroxyvitamin D for bone mineralization, osteoporosis screening, and immune competence.',
    commonIndications: ['Osteopenia / Osteoporosis', 'Chronic Bone/Muscle Pain', 'Fatigue', 'Limited Sunlight Exposure']
  },

  // 4. MICROBIOLOGY & INFECTIOUS DISEASES
  {
    id: 'test-micro-001',
    code: 'LAB-MIC-DENGUE',
    name: 'Dengue Duo Combo (NS1 Antigen + IgM/IgG Antibodies)',
    category: 'Laboratory & Pathology',
    subCategory: 'Microbiology & Infectious Diseases',
    department: 'Microbiology',
    sampleType: 'Serum',
    turnaroundTime: '1 Hour',
    priceBDT: 850,
    criticalPanicRule: 'NS1 Positive with Platelets falling rapidly',
    description: 'Rapid diagnostic test detecting Dengue Virus NS1 antigen (Days 1-5) and secondary antibodies (Days 5+) during seasonal epidemics.',
    commonIndications: ['Acute High Fever', 'Retro-orbital Pain', 'Severe Body Ache', 'Monsoon Epidemic Screening']
  },
  {
    id: 'test-micro-002',
    code: 'LAB-MIC-CULT-BLD',
    name: 'Blood Culture & Automated Antibiotic Sensitivity (AST)',
    category: 'Laboratory & Pathology',
    subCategory: 'Microbiology & Infectious Diseases',
    department: 'Microbiology',
    sampleType: 'Blood',
    turnaroundTime: '48 Hours',
    priceBDT: 1500,
    criticalPanicRule: 'Bacterial Growth in Blood Bottle (Bacteremia / Sepsis Flag)',
    description: 'BACTEC automated blood culture with CLSI-standard minimum inhibitory concentration (MIC) antibiotic sensitivity testing.',
    commonIndications: ['PUO (Pyrexia of Unknown Origin)', 'Sepsis', 'Infective Endocarditis', 'ICU Neutropenic Fever']
  },

  // 5. HISTOPATHOLOGY & TUMOR MARKERS
  {
    id: 'test-onco-001',
    code: 'LAB-ONCO-PSA',
    name: 'Prostate-Specific Antigen (PSA Total)',
    category: 'Laboratory & Pathology',
    subCategory: 'Histopathology & Cancer Markers',
    department: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundTime: '4 Hours',
    priceBDT: 1100,
    criticalPanicRule: 'Total PSA > 10.0 ng/mL (High Malignancy Risk)',
    description: 'Screening biomarker for benign prostatic hyperplasia (BPH) and prostate carcinoma in males above 50.',
    commonIndications: ['Urinary Hesitancy', 'Nocturia in Elderly Males', 'Prostate Cancer Screening', 'Post-Op Follow-up']
  },
  {
    id: 'test-onco-002',
    code: 'LAB-ONCO-CA125',
    name: 'Cancer Antigen 125 (CA-125) Ovarian Marker',
    category: 'Laboratory & Pathology',
    subCategory: 'Histopathology & Cancer Markers',
    department: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundTime: '6 Hours',
    priceBDT: 1750,
    description: 'Serum glycoprotein biomarker used in differential diagnosis of pelvic masses and monitoring ovarian cancer treatment.',
    commonIndications: ['Ovarian Cyst', 'Pelvic Mass', 'Endometriosis', 'Gynecological Oncology Workup']
  },

  // 6. RADIOLOGY & ADVANCED IMAGING
  {
    id: 'test-rad-001',
    code: 'RAD-XRAY-CHEST',
    name: 'Digital Chest X-Ray (PA View)',
    category: 'Radiology & Imaging',
    subCategory: 'Digital X-Ray & Ultrasound',
    department: 'Radiology',
    sampleType: 'Imaging / Scan',
    turnaroundTime: '30 Minutes',
    priceBDT: 600,
    criticalPanicRule: 'Tension Pneumothorax or Acute Pulmonary Edema Flag',
    description: 'High-resolution digital radiography assessing cardiac silhouette (Cardiothoracic ratio), lung parenchymal opacities, and pleural effusion.',
    commonIndications: ['Persistent Cough', 'Shortness of Breath', 'Hemoptysis', 'Chest Pain', 'Pre-Anesthesia Clearance']
  },
  {
    id: 'test-rad-002',
    code: 'RAD-USG-ABD',
    name: 'Ultrasonography (USG) of Whole Abdomen with Color Doppler',
    category: 'Radiology & Imaging',
    subCategory: 'Digital X-Ray & Ultrasound',
    department: 'Radiology',
    sampleType: 'Imaging / Scan',
    turnaroundTime: '1 Hour',
    priceBDT: 1500,
    description: 'Real-time sonographic evaluation of Liver, Gallbladder (stones), Spleen, Pancreas, Kidneys (calculi/hydronephrosis), and Urinary Bladder.',
    commonIndications: ['Abdominal Pain', 'Gallstones Screening', 'Fatty Liver Grading', 'Kidney Stones (Renal Colic)', 'Ascites']
  },
  {
    id: 'test-rad-003',
    code: 'RAD-CT-HRCT',
    name: 'High-Resolution Computed Tomography (HRCT) Chest',
    category: 'Radiology & Imaging',
    subCategory: 'Computed Tomography (CT)',
    department: 'Radiology',
    sampleType: 'Imaging / Scan',
    turnaroundTime: '2 Hours',
    priceBDT: 6500,
    description: 'Sub-millimeter multi-detector CT imaging for interstitial lung disease (ILD), bronchiectasis, pulmonary fibrosis, and occult lesions.',
    commonIndications: ['Post-COVID Fibrosis', 'Interstitial Lung Disease (ILD)', 'Unresolved Pneumonia', 'Hemoptysis']
  },
  {
    id: 'test-rad-004',
    code: 'RAD-CT-ANGIO',
    name: 'CT Coronary Angiography (640-Slice Flash MDCT)',
    category: 'Radiology & Imaging',
    subCategory: 'Computed Tomography (CT)',
    department: 'Radiology',
    sampleType: 'Imaging / Scan',
    turnaroundTime: '4 Hours',
    priceBDT: 18000,
    criticalPanicRule: 'Left Main Coronary Artery > 70% Stenosis',
    description: 'Non-invasive contrast-enhanced CT assessing coronary artery plaque burden, Calcium Score (Agatston), and luminal stenosis.',
    commonIndications: ['Atypical Angina', 'Intermediate Risk CAD', 'Pre-Op Cardiac Clearance', 'Coronary Calcium Score']
  },
  {
    id: 'test-rad-005',
    code: 'RAD-MRI-3T',
    name: '3 Tesla MRI Brain with MR Angiography (MRA)',
    category: 'Radiology & Imaging',
    subCategory: 'Magnetic Resonance Imaging (MRI)',
    department: 'Radiology',
    sampleType: 'Imaging / Scan',
    turnaroundTime: '3 Hours',
    priceBDT: 12000,
    criticalPanicRule: 'Acute Ischemic Stroke / Intracranial Hemorrhage Detected',
    description: 'High-definition 3T MRI with Diffusion-Weighted Imaging (DWI) for acute stroke detection within minutes of onset and vascular aneurysm screening.',
    commonIndications: ['Acute Stroke / TIA', 'Intractable Headache', 'Seizure Disorder', 'Brain Tumor Evaluation', 'Aneurysm Screening']
  },
  {
    id: 'test-rad-006',
    code: 'RAD-NUC-PETCT',
    name: 'Whole-Body 18F-FDG PET-CT Oncology Staging Scan',
    category: 'Radiology & Imaging',
    subCategory: 'Nuclear Medicine & PET-CT',
    department: 'Radiology',
    sampleType: 'Imaging / Scan',
    turnaroundTime: '8 Hours',
    priceBDT: 42000,
    description: 'Molecular positron emission tomography combined with anatomical CT for metabolic cancer staging, restaging, and chemotherapy response evaluation.',
    commonIndications: ['Lymphoma Staging', 'Solid Tumor Metastasis Search', 'Response to Chemotherapy', 'Fever of Unknown Origin']
  },

  // 7. CARDIOLOGY & VASCULAR DIAGNOSTICS
  {
    id: 'test-card-001',
    code: 'CARD-ECG-12',
    name: '12-Lead Electrocardiogram (ECG / EKG) with Analysis',
    category: 'Cardiology & Vascular',
    subCategory: 'Non-Invasive Cardiac Tests',
    department: 'Cardiology',
    sampleType: 'Non-Invasive Sensor',
    turnaroundTime: '15 Minutes',
    priceBDT: 350,
    criticalPanicRule: 'ST-Elevation Myocardial Infarction (STEMI) or Ventricular Tachycardia',
    description: 'Standard 12-lead digital electrophysiological recording measuring rate, rhythm, axis, ST segment deviations, and conduction blocks.',
    commonIndications: ['Chest Pain', 'Palpitations', 'Syncope', 'Pre-Op Cardiac Evaluation', 'Hypertension Baseline']
  },
  {
    id: 'test-card-002',
    code: 'CARD-ECHO-2D',
    name: '2D Transthoracic Echocardiography with Color Doppler',
    category: 'Cardiology & Vascular',
    subCategory: 'Non-Invasive Cardiac Tests',
    department: 'Cardiology',
    sampleType: 'Procedure',
    turnaroundTime: '45 Minutes',
    priceBDT: 2500,
    criticalPanicRule: 'Left Ventricular Ejection Fraction (LVEF) < 30% (Severe LV Dysfunction)',
    description: 'Ultrasound imaging of heart chambers assessing Ejection Fraction (LVEF), regional wall motion abnormalities (RWMA), and valvular regurgitation/stenosis.',
    commonIndications: ['Heart Failure', 'Post-Myocardial Infarction', 'Valvular Heart Disease', 'Breathlessness on Exertion']
  },
  {
    id: 'test-card-003',
    code: 'CARD-LAB-TROP',
    name: 'High-Sensitivity Troponin-I (hs-cTnI) Quantitative',
    category: 'Cardiology & Vascular',
    subCategory: 'Cardiac Biomarkers',
    department: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundTime: '30 Minutes',
    priceBDT: 1400,
    criticalPanicRule: 'hs-cTnI > 0.04 ng/mL (Acute Myocardial Injury Flag)',
    description: 'Ultra-fast quantitative cardiac biomarker indicating myocardial necrosis; gold standard for Non-STEMI and STEMI acute triage.',
    commonIndications: ['Acute Chest Pain', 'Unstable Angina', 'Suspected Heart Attack', 'Post-Cardiac Arrest Monitoring']
  },
  {
    id: 'test-card-004',
    code: 'CARD-INV-CAG',
    name: 'Coronary Angiogram (CAG via Radial / Femoral Route)',
    category: 'Cardiology & Vascular',
    subCategory: 'Invasive Cardiac Diagnostics',
    department: 'Cardiology',
    sampleType: 'Procedure',
    turnaroundTime: 'Day Care',
    priceBDT: 16000,
    description: 'Fluoroscopic catheterization visualizing lumen stenosis across Left Anterior Descending (LAD), Circumflex (LCx), and Right Coronary (RCA) arteries.',
    commonIndications: ['Positive TMT / Stress Test', 'Acute Coronary Syndrome', 'Pre-CABG Evaluation', 'Recurrent Angina']
  },

  // 8. GASTROENTEROLOGY & SPECIALTY DIAGNOSTICS
  {
    id: 'test-gas-001',
    code: 'GAS-ENDO-OGD',
    name: 'Upper GI Video Endoscopy (Esophagogastroduodenoscopy)',
    category: 'Gastroenterology & Specialty',
    subCategory: 'Endoscopic Procedures',
    department: 'Gastroenterology',
    sampleType: 'Procedure',
    turnaroundTime: '2 Hours',
    priceBDT: 3500,
    criticalPanicRule: 'Active Bleeding Peptic Ulcer or Esophageal Varices',
    description: 'High-definition video visualization of esophagus, stomach, and duodenum with biopsy for H. pylori, peptic ulcers, and variceal banding.',
    commonIndications: ['Dyspepsia / Acid Reflux', 'Hematemesis (Vomiting Blood)', 'Melena (Black Stools)', 'Unexplained Weight Loss']
  },
  {
    id: 'test-gas-002',
    code: 'GAS-LIV-FIBRO',
    name: 'FibroScan (Transient Elastography) of Liver',
    category: 'Gastroenterology & Specialty',
    subCategory: 'Organ Function Tests',
    department: 'Gastroenterology',
    sampleType: 'Procedure',
    turnaroundTime: '30 Minutes',
    priceBDT: 4000,
    description: 'Non-invasive ultrasound shear wave elastography quantifying liver stiffness (fibrosis/cirrhosis in kPa) and Controlled Attenuation Parameter (CAP steatosis score).',
    commonIndications: ['NAFLD / NASH (Fatty Liver)', 'Chronic Hepatitis B / C', 'Cirrhosis Monitoring', 'Alcoholic Liver Disease']
  },
  {
    id: 'test-pulm-001',
    code: 'PULM-FUNC-PFT',
    name: 'Pulmonary Function Test (PFT / Spirometry with Reversibility)',
    category: 'Gastroenterology & Specialty',
    subCategory: 'Organ Function Tests',
    department: 'Pulmonology',
    sampleType: 'Procedure',
    turnaroundTime: '45 Minutes',
    priceBDT: 1500,
    description: 'Measures FEV1, FVC, and FEV1/FVC ratio before and after Salbutamol bronchodilator inhalation to differentiate Asthma from COPD.',
    commonIndications: ['Chronic Cough', 'Wheezing / Asthma', 'COPD Staging in Smokers', 'Pre-Thoracic Surgery Assessment']
  }
];

// Quick lookup index for search by test name, code, keyword, acronym or organ
export function searchDiagnosticTests(query: string): DiagnosticTestItem[] {
  if (!query || query.trim() === '') return DIAGNOSTIC_TEST_CATALOG.slice(0, 8);
  const q = query.toLowerCase().trim();
  return DIAGNOSTIC_TEST_CATALOG.filter(item => 
    item.name.toLowerCase().includes(q) ||
    item.code.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.subCategory.toLowerCase().includes(q) ||
    item.department.toLowerCase().includes(q) ||
    item.commonIndications.some(ind => ind.toLowerCase().includes(q)) ||
    (item.description && item.description.toLowerCase().includes(q))
  );
}
