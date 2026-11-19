export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  organCategory: 'cardiovascular' | 'central_nervous' | 'respiratory' | 'gastrointestinal' | 'endocrine' | 'renal' | 'dermatology' | 'musculoskeletal' | 'ent_eyes';
  organName: string;
  organIcon: string;
  form: 'Tablet' | 'Capsule' | 'Injection / Pen' | 'Gel / Cream' | 'Inhaler' | 'Eye Drops' | 'Syrup';
  dosageOptions: string[];
  defaultDosage: string;
  defaultFrequency: string; // e.g., 'Once daily in morning'
  defaultFoodRelation: 'before_food' | 'with_food' | 'after_food' | 'empty_stomach';
  whyGiven: string;
  indications: string[];
  benefitsPatient: string;
  pharmacologyClinical: string;
  targetAgeGroup: string;
  sideEffects: {
    common: string[];
    infrequent: string[];
    severeAlert: string[];
  };
  missedDoseProtocol: string;
  canCrushOrSplit: boolean;
  crushWarning?: string;
  conflicts: {
    food: string[];
    alcohol: string;
    warningNote: string;
  };
  countryOfOrigin: string;
  manufacturer: string;
  countryAvailability: string[];
  benchmarkPriceUSD: number;
  localPrices: Record<string, number>;
  requiredLabTests?: string[];
  appearance: {
    color: string;
    shape: string;
    imprint?: string;
  };
}

export const MEDICINE_DATABASE: Medicine[] = [
  // 🫀 Cardiovascular
  {
    id: 'med-telmisartan',
    name: 'Telmisartan (Micardis)',
    genericName: 'Telmisartan',
    brandNames: ['Micardis', 'Telma', 'Kinzalmono', 'Pritor'],
    organCategory: 'cardiovascular',
    organName: 'Cardiovascular & Blood Pressure',
    organIcon: '🫀',
    form: 'Tablet',
    dosageOptions: ['20mg', '40mg', '80mg'],
    defaultDosage: '40mg',
    defaultFrequency: 'Once daily in the morning',
    defaultFoodRelation: 'after_food',
    whyGiven: 'Prescribed to treat high blood pressure (hypertension) and protect the heart and kidneys from long-term cardiovascular damage.',
    indications: ['Essential Hypertension', 'Cardiovascular Risk Reduction', 'Diabetic Nephropathy'],
    benefitsPatient: 'Relaxes and widens your blood vessels, lowering blood pressure and significantly reducing your risk of heart attack or stroke.',
    pharmacologyClinical: 'Potent, non-peptide angiotensin II receptor antagonist (ARB) with high selectivity for AT1 subtype. Eliminates vasoconstrictor and aldosterone-secreting effects of angiotensin II.',
    targetAgeGroup: 'Adults (18-64), Geriatric (65+). Not recommended in pregnancy.',
    sideEffects: {
      common: ['Dizziness when standing up', 'Mild sinus congestion', 'Back pain'],
      infrequent: ['Diarrhea', 'Dry cough (rare with ARBs)', 'Eczema'],
      severeAlert: ['Swelling of face/throat (Angioedema)', 'Severe low blood pressure', 'Hyperkalemia (high potassium)']
    },
    missedDoseProtocol: 'Take it as soon as you remember that day. If it is already evening or close to your next morning dose, skip the missed dose. NEVER take two tablets at once.',
    canCrushOrSplit: true,
    conflicts: {
      food: ['Potassium supplements', 'Salt substitutes containing potassium'],
      alcohol: 'Avoid excessive alcohol as it compounds blood pressure dropping and dizziness.',
      warningNote: 'Monitor serum potassium and renal parameters regularly.'
    },
    countryOfOrigin: 'Germany',
    manufacturer: 'Boehringer Ingelheim',
    countryAvailability: ['United States', 'United Kingdom', 'European Union', 'Canada', 'India', 'Australia', 'Japan', 'Singapore'],
    benchmarkPriceUSD: 28.50,
    localPrices: { USD: 28.50, GBP: 22.00, EUR: 26.00, INR: 340, CAD: 38.00, AUD: 42.00, BDT: 420 },
    requiredLabTests: ['Serum Potassium (K+)', 'Serum Creatinine & eGFR', 'Blood Pressure Check'],
    appearance: { color: 'White or off-white', shape: 'Oval oblong', imprint: '51H' }
  },
  {
    id: 'med-atorvastatin',
    name: 'Atorvastatin (Lipitor)',
    genericName: 'Atorvastatin Calcium',
    brandNames: ['Lipitor', 'Atorva', 'Torvast', 'Sortis'],
    organCategory: 'cardiovascular',
    organName: 'Cardiovascular & Blood Lipids',
    organIcon: '🫀',
    form: 'Tablet',
    dosageOptions: ['10mg', '20mg', '40mg', '80mg'],
    defaultDosage: '20mg',
    defaultFrequency: 'Once daily at bedtime',
    defaultFoodRelation: 'after_food',
    whyGiven: 'Lowers "bad" LDL cholesterol and triglycerides in the blood while raising "good" HDL cholesterol to prevent artery blockages.',
    indications: ['Hypercholesterolemia', 'Coronary Artery Disease', 'Atherosclerosis Prevention'],
    benefitsPatient: 'Slows down the accumulation of plaque in blood vessels and reduces the risk of heart attacks and stroke.',
    pharmacologyClinical: 'Selective, competitive inhibitor of HMG-CoA reductase, the rate-limiting enzyme converting HMG-CoA to mevalonate in hepatic cholesterol synthesis.',
    targetAgeGroup: 'Adults (18+), Geriatric. Contraindicated in active liver disease and pregnancy.',
    sideEffects: {
      common: ['Mild joint pain', 'Nasopharyngitis', 'Mild dyspepsia'],
      infrequent: ['Headache', 'Nausea', 'Elevated liver enzymes (ALT/AST)'],
      severeAlert: ['Unexplained muscle pain or weakness (Rhabdomyolysis)', 'Dark tea-colored urine', 'Jaundice']
    },
    missedDoseProtocol: 'Take as soon as remembered if within 12 hours. If more than 12 hours late, skip and take your next dose at bedtime.',
    canCrushOrSplit: true,
    conflicts: {
      food: ['Grapefruit juice (inhibits CYP3A4 metabolism, drastically increasing drug blood levels)'],
      alcohol: 'Heavy alcohol consumption significantly increases hepatic strain.',
      warningNote: 'Avoid consuming more than 1 small glass of grapefruit juice per day.'
    },
    countryOfOrigin: 'USA',
    manufacturer: 'Pfizer Inc.',
    countryAvailability: ['United States', 'United Kingdom', 'European Union', 'Canada', 'India', 'Australia', 'UAE', 'Singapore'],
    benchmarkPriceUSD: 19.80,
    localPrices: { USD: 19.80, GBP: 15.50, EUR: 18.00, INR: 220, CAD: 26.00, AUD: 29.00, BDT: 280 },
    requiredLabTests: ['Lipid Profile (Total, LDL, HDL, Triglycerides)', 'Liver Function Test (ALT, AST)', 'Creatine Kinase (if muscle ache)'],
    appearance: { color: 'White', shape: 'Elliptical', imprint: 'PD 155' }
  },

  // 🩸 Endocrine & Diabetes
  {
    id: 'med-insulin-glargine',
    name: 'Insulin Glargine (Lantus / Toujeo SoloStar)',
    genericName: 'Insulin Glargine (rDNA origin)',
    brandNames: ['Lantus SoloStar', 'Toujeo', 'Basaglar', 'Glaritus'],
    organCategory: 'endocrine',
    organName: 'Endocrine & Blood Sugar (Pancreas)',
    organIcon: '🩸',
    form: 'Injection / Pen',
    dosageOptions: ['10 Units', '14 Units', '20 Units', '28 Units', 'Custom Units'],
    defaultDosage: '14 Units SubQ',
    defaultFrequency: 'Once daily at night (22:00)',
    defaultFoodRelation: 'before_food',
    whyGiven: 'Provides steady 24-hour basal insulin to keep fasting blood sugar in a safe, healthy range for Type 1 and Type 2 diabetes.',
    indications: ['Type 1 Diabetes Mellitus', 'Type 2 Diabetes Mellitus (Uncontrolled on oral agents)'],
    benefitsPatient: 'Delivers a smooth, flat peakless release of insulin, preventing dangerous nighttime and morning blood glucose spikes.',
    pharmacologyClinical: 'Long-acting human insulin analog produced by recombinant DNA technology. Micro-precipitates in subcutaneous tissue upon injection, slowing absorption over 24 hours without pronounced peak.',
    targetAgeGroup: 'Pediatric (6+), Adult, Geriatric.',
    sideEffects: {
      common: ['Mild injection site redness/itching', 'Mild weight gain'],
      infrequent: ['Lipodystrophy (fat thickening if injecting same spot)'],
      severeAlert: ['Hypoglycemia (Sweating, shakiness, confusion, fainting)', 'Severe allergic reaction']
    },
    missedDoseProtocol: 'Contact your clinician if forgotten overnight. If remembered within a few hours of regular time, administer immediately; if next dose is near, adjust unit timing to prevent insulin stacking.',
    canCrushOrSplit: false,
    crushWarning: 'INJECTABLE ONLY: Rotate subcutaneous injection sites (abdomen, thighs, upper arms). Never inject intravenously.',
    conflicts: {
      food: ['Skipping meals without adjusting insulin dose can trigger severe hypoglycemia'],
      alcohol: 'Alcohol severely impairs gluconeogenesis, causing delayed nighttime hypoglycemia.',
      warningNote: 'Always keep fast-acting glucose (candy or glucose tablets) nearby.'
    },
    countryOfOrigin: 'France',
    manufacturer: 'Sanofi Aventis',
    countryAvailability: ['United States', 'United Kingdom', 'European Union', 'Canada', 'India', 'Australia', 'UAE', 'Singapore', 'Japan'],
    benchmarkPriceUSD: 85.00,
    localPrices: { USD: 85.00, GBP: 45.00, EUR: 52.00, INR: 890, CAD: 78.00, AUD: 65.00, BDT: 1150 },
    requiredLabTests: ['Fasting Blood Glucose (FBG)', 'HbA1c (every 3 months)', 'Renal Function (eGFR)'],
    appearance: { color: 'Clear colorless solution', shape: 'Pre-filled SoloStar Pen' }
  },
  {
    id: 'med-metformin',
    name: 'Metformin HCl 500mg ER (Glucophage XR)',
    genericName: 'Metformin Hydrochloride Extended-Release',
    brandNames: ['Glucophage XR', 'Glycomet-SR', 'Fortamet', 'Riomet'],
    organCategory: 'endocrine',
    organName: 'Endocrine & Metabolism (Pancreas & Liver)',
    organIcon: '🩸',
    form: 'Tablet',
    dosageOptions: ['500mg', '850mg', '1000mg'],
    defaultDosage: '500mg ER',
    defaultFrequency: 'Twice daily with meals',
    defaultFoodRelation: 'with_food',
    whyGiven: 'First-line therapy for managing blood sugar levels in Type 2 Diabetes and improving cellular insulin sensitivity.',
    indications: ['Type 2 Diabetes Mellitus', 'Prediabetes', 'Polycystic Ovary Syndrome (PCOS)'],
    benefitsPatient: 'Lowers blood glucose without causing sudden hypoglycemia; helps reduce cravings and supports healthy weight maintenance.',
    pharmacologyClinical: 'Biguanide antihyperglycemic agent that activates AMP-activated protein kinase (AMPK), reducing hepatic gluconeogenesis and enhancing peripheral glucose uptake.',
    targetAgeGroup: 'Adults (18+), Geriatric with eGFR > 30 mL/min.',
    sideEffects: {
      common: ['Mild nausea or metallic taste', 'Loose stools or abdominal bloating during initial 2 weeks'],
      infrequent: ['Vitamin B12 deficiency with long-term use'],
      severeAlert: ['Lactic Acidosis (severe fatigue, cold feeling, rapid breathing — urgent medical emergency)']
    },
    missedDoseProtocol: 'Take with your next meal. If it is already time for the next meal dose, take just one dose. Never double the tablet count.',
    canCrushOrSplit: false,
    crushWarning: 'DO NOT CRUSH OR CHEW: Extended-release matrix releases medicine gradually. Crushing dumps the entire dose into the stomach at once.',
    conflicts: {
      food: ['Heavy fatty foods may slow absorption', 'Take with meals to avoid stomach upset'],
      alcohol: 'Avoid binge drinking: alcohol dramatically increases risk of rare but dangerous Lactic Acidosis.',
      warningNote: 'Discontinue temporarily 48 hours prior to iodinated radiocontrast imaging procedures.'
    },
    countryOfOrigin: 'United Kingdom',
    manufacturer: 'Merck Healthcare',
    countryAvailability: ['United States', 'United Kingdom', 'European Union', 'Canada', 'India', 'Australia', 'Brazil', 'Singapore'],
    benchmarkPriceUSD: 12.00,
    localPrices: { USD: 12.00, GBP: 8.50, EUR: 9.80, INR: 95, CAD: 15.00, AUD: 16.00, BDT: 120 },
    requiredLabTests: ['Fasting Glucose & HbA1c', 'eGFR / Serum Creatinine', 'Serum Vitamin B12 (Annual)'],
    appearance: { color: 'White', shape: 'Oblong tablet', imprint: 'GX 500' }
  },

  // 🧬 Dermatology & Skin
  {
    id: 'med-adapalene',
    name: 'Adapalene 0.1% Topical Gel (Differin)',
    genericName: 'Adapalene',
    brandNames: ['Differin', 'Adaferin', 'Deriva', 'Epiduo (with BPO)'],
    organCategory: 'dermatology',
    organName: 'Dermatology & Skin Barrier',
    organIcon: '🧬',
    form: 'Gel / Cream',
    dosageOptions: ['0.1% Gel', '0.3% Gel'],
    defaultDosage: 'Pea-sized amount',
    defaultFrequency: 'Once daily at bedtime',
    defaultFoodRelation: 'empty_stomach',
    whyGiven: 'Clears acne blemishes, unclogs pores, and accelerates cellular renewal to prevent new comedones and post-acne pigmentation.',
    indications: ['Acne Vulgaris', 'Comedonal Acne', 'Post-Inflammatory Hyperpigmentation'],
    benefitsPatient: 'Restores clear, smooth skin texture by keeping pores clear of dead skin cells and reducing inflammatory breakouts.',
    pharmacologyClinical: 'Third-generation synthetic topical retinoid. Binds selectively to retinoic acid nuclear receptors beta and gamma, modulating cellular differentiation, keratinization, and inflammation.',
    targetAgeGroup: 'Adolescents (12+), Adults.',
    sideEffects: {
      common: ['Mild skin peeling or dryness', 'Temporary stinging', 'Mild redness during first 2 weeks'],
      infrequent: ['Contact dermatitis', 'Sun sensitivity (photosensitivity)'],
      severeAlert: ['Severe facial edema or blistering (rare allergy)']
    },
    missedDoseProtocol: 'Apply the next evening. Do not apply a double layer the next morning because daytime sunlight will irritate sensitized skin.',
    canCrushOrSplit: false,
    crushWarning: 'TOPICAL EXTERNAL USE ONLY: Do not apply to open cuts, eczema, or around eyes and lips.',
    conflicts: {
      food: ['None (topical)'],
      alcohol: 'No direct systemic conflict, but excessive alcohol dehydrates facial skin.',
      warningNote: 'ALWAYS wear Broad-Spectrum SPF 30+ sunscreen during the daytime while using this product.'
    },
    countryOfOrigin: 'Switzerland',
    manufacturer: 'Galderma Laboratories',
    countryAvailability: ['United States', 'United Kingdom', 'European Union', 'Canada', 'India', 'Australia', 'Japan', 'Singapore'],
    benchmarkPriceUSD: 24.00,
    localPrices: { USD: 24.00, GBP: 18.00, EUR: 21.00, INR: 320, CAD: 29.00, AUD: 33.00, BDT: 410 },
    requiredLabTests: ['None routinely required; baseline skin exam'],
    appearance: { color: 'Translucent white gel', shape: 'Topical Aluminum Tube 45g' }
  },

  // 🫁 Respiratory & Lungs
  {
    id: 'med-salbutamol',
    name: 'Salbutamol Inhaler 100mcg (Ventolin HFA)',
    genericName: 'Albuterol / Salbutamol Sulfate',
    brandNames: ['Ventolin HFA', 'ProAir', 'Asthalin', 'Airomir'],
    organCategory: 'respiratory',
    organName: 'Respiratory & Lungs (Airways)',
    organIcon: '🫁',
    form: 'Inhaler',
    dosageOptions: ['100mcg/puff'],
    defaultDosage: '2 Puffs (200mcg)',
    defaultFrequency: 'As needed (SOS) for wheezing or shortness of breath',
    defaultFoodRelation: 'empty_stomach',
    whyGiven: 'Fast-acting rescue bronchodilator to instantly open constricted airways during asthma attacks or COPD flare-ups.',
    indications: ['Acute Bronchospasm', 'Bronchial Asthma Attack', 'Exercise-Induced Bronchoconstriction', 'COPD'],
    benefitsPatient: 'Relaxes chest tightness within 2 to 5 minutes, allowing you to breathe deeply and easily again.',
    pharmacologyClinical: 'Selective short-acting beta-2 adrenergic receptor agonist (SABA). Stimulates adenyl cyclase, raising intracellular cAMP and causing bronchial smooth muscle relaxation.',
    targetAgeGroup: 'Pediatric (4+), Adults, Geriatric.',
    sideEffects: {
      common: ['Mild fine hand tremor', 'Briefly accelerated heart rate (palpitations)', 'Nervousness'],
      infrequent: ['Headache', 'Throat irritation', 'Hypokalemia with frequent overuse'],
      severeAlert: ['Paradoxical bronchospasm (worse wheezing after inhaling)', 'Chest pain']
    },
    missedDoseProtocol: 'This is a rescue medication used as needed. Only use when experiencing respiratory symptoms or 15 minutes before planned exercise.',
    canCrushOrSplit: false,
    crushWarning: 'INHALATION ONLY: Shake well before each spray. Rinse mouth with water after use.',
    conflicts: {
      food: ['Excessive caffeine may heighten jitteriness or heart racing'],
      alcohol: 'Moderate.',
      warningNote: 'If you need this inhaler more than 3 times a week, consult your doctor to adjust maintenance controller therapy.'
    },
    countryOfOrigin: 'United Kingdom',
    manufacturer: 'GlaxoSmithKline (GSK)',
    countryAvailability: ['United States', 'United Kingdom', 'European Union', 'Canada', 'India', 'Australia', 'New Zealand', 'Singapore'],
    benchmarkPriceUSD: 22.50,
    localPrices: { USD: 22.50, GBP: 12.00, EUR: 14.50, INR: 180, CAD: 25.00, AUD: 21.00, BDT: 240 },
    requiredLabTests: ['Spirometry / Peak Flow Rate (PFR)', 'Chest Auscultation'],
    appearance: { color: 'Blue aerosol canister', shape: 'Pressurized Metered Dose Inhaler (pMDI)' }
  },

  // 🧠 Central Nervous System
  {
    id: 'med-escitalopram',
    name: 'Escitalopram 10mg (Lexapro / Cipralex)',
    genericName: 'Escitalopram Oxalate',
    brandNames: ['Lexapro', 'Cipralex', 'Nexito', 'Esipram'],
    organCategory: 'central_nervous',
    organName: 'Brain & Nervous System (Neuropsychiatry)',
    organIcon: '🧠',
    form: 'Tablet',
    dosageOptions: ['5mg', '10mg', '20mg'],
    defaultDosage: '10mg',
    defaultFrequency: 'Once daily in morning or evening',
    defaultFoodRelation: 'with_food',
    whyGiven: 'Balancing brain neurotransmitters to alleviate symptoms of clinical depression and generalized anxiety disorders.',
    indications: ['Major Depressive Disorder (MDD)', 'Generalized Anxiety Disorder (GAD)', 'Panic Disorder'],
    benefitsPatient: 'Stabilizes mood, relieves overwhelming feelings of anxiety, and restores mental resilience over continuous 2 to 4 weeks.',
    pharmacologyClinical: 'Highly selective serotonin reuptake inhibitor (SSRI) with minimal affinity for other monoamine receptors, preserving synaptic 5-HT availability.',
    targetAgeGroup: 'Adolescents (12+), Adults, Geriatric (start with 5mg).',
    sideEffects: {
      common: ['Mild nausea in first week', 'Drowsiness or vivid dreams', 'Dry mouth'],
      infrequent: ['Mild tremors', 'Changes in sexual desire or delayed response'],
      severeAlert: ['Serotonin Syndrome (high fever, rigid muscles, confusion)', 'Sudden extreme mood shifts']
    },
    missedDoseProtocol: 'Take as soon as remembered unless it is bedtime (if it keeps you awake) or next dose is due. Never abruptly discontinue without a medical taper.',
    canCrushOrSplit: true,
    conflicts: {
      food: ['St. John’s Wort herbal supplements (severe serotonin syndrome risk)'],
      alcohol: 'AVOID ALCOHOL: Amplifies sedative effects and worsens depression recovery.',
      warningNote: 'Do not stop taking cold turkey; requires gradual tapering schedule under medical supervision.'
    },
    countryOfOrigin: 'Denmark',
    manufacturer: 'H. Lundbeck A/S',
    countryAvailability: ['United States', 'United Kingdom', 'European Union', 'Canada', 'India', 'Australia', 'Japan', 'Singapore'],
    benchmarkPriceUSD: 29.00,
    localPrices: { USD: 29.00, GBP: 21.00, EUR: 25.00, INR: 240, CAD: 34.00, AUD: 37.00, BDT: 320 },
    requiredLabTests: ['Electrolytes (Sodium check in elderly for hyponatremia)', 'ECG (if on high doses / QTc interval)'],
    appearance: { color: 'White', shape: 'Round scored tablet', imprint: 'E L 10' }
  },

  // 🍽️ Gastrointestinal / Stomach
  {
    id: 'med-esomeprazole',
    name: 'Esomeprazole 40mg (Nexium)',
    genericName: 'Esomeprazole Magnesium Trihydrate',
    brandNames: ['Nexium', 'Esomez', 'Nexpro', 'Inexium'],
    organCategory: 'gastrointestinal',
    organName: 'Stomach & Gastrointestinal (Digestive)',
    organIcon: '🍽️',
    form: 'Capsule',
    dosageOptions: ['20mg', '40mg'],
    defaultDosage: '40mg',
    defaultFrequency: 'Once daily 30 minutes before breakfast',
    defaultFoodRelation: 'before_food',
    whyGiven: 'Reduces excessive stomach acid production to heal acid reflux, painful heartburn, and gastric ulcers.',
    indications: ['Gastroesophageal Reflux Disease (GERD)', 'Erosive Esophagitis', 'Gastric & Duodenal Ulcers', 'H. Pylori Eradication'],
    benefitsPatient: 'Relieves burning chest pain and sour stomach regurgitation, allowing the sensitive lining of the esophagus and stomach to heal.',
    pharmacologyClinical: 'S-isomer of omeprazole. Proton pump inhibitor (PPI) that suppresses gastric acid secretion by specific inhibition of the H+/K+-ATPase in parietal cells.',
    targetAgeGroup: 'Pediatric (12+), Adults, Geriatric.',
    sideEffects: {
      common: ['Headache', 'Mild constipation or diarrhea', 'Flatulence'],
      infrequent: ['Dry mouth', 'Hypomagnesemia with multi-year continuous use'],
      severeAlert: ['Severe persistent diarrhea (C. Difficile colitis)', 'Bone fracture risk with multi-year unmonitored use']
    },
    missedDoseProtocol: 'Take it 30-60 minutes before your next meal. If taking once daily before breakfast and remembered at lunch, take before lunch.',
    canCrushOrSplit: false,
    crushWarning: 'DO NOT CHEW OR CRUSH: Delayed-release enteric pellets protect active drug from stomach acid breakdown before reaching the duodenum.',
    conflicts: {
      food: ['Heavy fried foods, citrus, and raw onions exacerbate underlying acid reflux'],
      alcohol: 'Alcohol directly irritates inflamed stomach mucosa.',
      warningNote: 'Take strictly on an empty stomach at least 30 minutes before food for maximum effectiveness.'
    },
    countryOfOrigin: 'Sweden',
    manufacturer: 'AstraZeneca',
    countryAvailability: ['United States', 'United Kingdom', 'European Union', 'Canada', 'India', 'Australia', 'Brazil', 'Singapore'],
    benchmarkPriceUSD: 26.00,
    localPrices: { USD: 26.00, GBP: 19.50, EUR: 23.00, INR: 280, CAD: 31.00, AUD: 34.00, BDT: 360 },
    requiredLabTests: ['Magnesium level (if used > 6 months)', 'Bone Density Scan (for long-term elderly use)'],
    appearance: { color: 'Purple capsule with gold bands', shape: 'Delayed-release capsule', imprint: 'NEXIUM 40mg' }
  },

  // 🦴 Musculoskeletal
  {
    id: 'med-ibuprofen',
    name: 'Ibuprofen 400mg (Advil / Motrin)',
    genericName: 'Ibuprofen',
    brandNames: ['Advil', 'Motrin', 'Brufen', 'Nurofen'],
    organCategory: 'musculoskeletal',
    organName: 'Musculoskeletal (Joints, Muscles & Bones)',
    organIcon: '🦴',
    form: 'Tablet',
    dosageOptions: ['200mg', '400mg', '600mg', '800mg'],
    defaultDosage: '400mg',
    defaultFrequency: 'Every 8 hours as needed with meals',
    defaultFoodRelation: 'with_food',
    whyGiven: 'Provides anti-inflammatory relief for joint stiffness, arthritis flares, muscular sprains, and tension headaches.',
    indications: ['Osteoarthritis & Rheumatoid Arthritis', 'Musculoskeletal Pain', 'Dysmenorrhea', 'Fever Reduction'],
    benefitsPatient: 'Calms swelling, alleviates painful joint stiffness, and restores comfortable daily physical mobility.',
    pharmacologyClinical: 'Non-steroidal anti-inflammatory drug (NSAID) with reversible inhibition of cyclooxygenase enzymes (COX-1 and COX-2), reducing pro-inflammatory prostaglandin synthesis.',
    targetAgeGroup: 'Adults (18+). Use with caution in elderly and patients with renal or ulcer history.',
    sideEffects: {
      common: ['Mild stomach discomfort', 'Nausea if taken on empty stomach'],
      infrequent: ['Mild fluid retention / swollen ankles', 'Tinnitus (ringing in ears)'],
      severeAlert: ['Stomach ulcer or GI bleeding (black tarry stools)', 'Acute kidney impairment']
    },
    missedDoseProtocol: 'Take as needed for pain. If prescribed on fixed schedule, take with food when remembered. Do not take extra doses closer than 6 hours apart.',
    canCrushOrSplit: true,
    conflicts: {
      food: ['MUST take with meals or a glass of milk to coat the stomach'],
      alcohol: 'AVOID COMBINING WITH ALCOHOL: Multiplies risk of stomach bleeding and ulcers.',
      warningNote: 'Do not combine with other NSAIDs (e.g. Naproxen, Aspirin) to avoid duplicate organ toxicity.'
    },
    countryOfOrigin: 'USA',
    manufacturer: 'Pfizer / Haleon',
    countryAvailability: ['United States', 'United Kingdom', 'European Union', 'Canada', 'India', 'Australia', 'Worldwide (OTC/Rx)'],
    benchmarkPriceUSD: 8.50,
    localPrices: { USD: 8.50, GBP: 6.00, EUR: 7.20, INR: 80, CAD: 10.00, AUD: 11.50, BDT: 95 },
    requiredLabTests: ['Serum Creatinine & BUN', 'Hemoglobin (to rule out occult GI bleeding with chronic use)'],
    appearance: { color: 'Brown/Orange coating', shape: 'Round coated tablet', imprint: 'IBU 400' }
  }
];

export const ORGAN_TAXONOMY = [
  { key: 'all', label: 'All Systems', icon: '🌐' },
  { key: 'cardiovascular', label: 'Heart & Blood Vessels', icon: '🫀' },
  { key: 'endocrine', label: 'Endocrine & Diabetes', icon: '🩸' },
  { key: 'respiratory', label: 'Lungs & Airways', icon: '🫁' },
  { key: 'central_nervous', label: 'Brain & Nervous System', icon: '🧠' },
  { key: 'gastrointestinal', label: 'Stomach & Digestive', icon: '🍽️' },
  { key: 'dermatology', label: 'Skin & Dermatology', icon: '🧬' },
  { key: 'musculoskeletal', label: 'Bones & Joints', icon: '🦴' },
  { key: 'renal', label: 'Kidneys & Urinary', icon: '🩺' },
];
