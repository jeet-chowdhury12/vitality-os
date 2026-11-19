import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type SupportedLanguage = 'en' | 'bn';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (text: string) => text
});

export const DICTIONARY_EN_TO_BN: Record<string, string> = {
  // Hospital & System Core
  'Dhaka Central Medical College & Hospital (DCMCH)': 'ঢাকা সেন্ট্রাল মেডিকেল কলেজ ও হাসপাতাল (DCMCH)',
  'Hospital Information System (HIS) v3.4': 'হাসপাতাল তথ্য ব্যবস্থাপনা সিস্টেম (HIS) v3.4',
  'Emergency CPR & 999': 'জরুরী সিপিআর ও ৯৯৯',
  'Hospital Operations Launchpad': 'হাসপাতাল অপারেশনস লঞ্চপ্যাড',
  'Vitality-OS • Smart Hospital Cloud OS': 'ভাইটালিটি-ওএস • স্মার্ট হসপিটাল ক্লাউড সিস্টেম',
  'Install as Browser App / PWA': 'ব্রাউজার অ্যাপ / PWA ইনস্টল করুন',
  'Launch Doctor Cockpit': 'ডাক্তার ককপিট খুলুন',
  'Consultation Cockpit': 'কনসালটেশন ককপিট',
  'Launchpad Overview': 'লঞ্চপ্যাড ড্যাশবোর্ড',
  'Open Station': 'স্টেশন খুলুন',

  // 9 Apps & Portals
  'Receptionist Desk': 'রিসেপশন ও রোগী নিবন্ধন',
  'Patient Registration, MRIN Issuance & OPD Billing': 'রোগী নিবন্ধন, এমআরআইএন ও বহির্বিভাগ বিলিং',
  'Clinical Assistant': 'ক্লিনিক্যাল অ্যাসিস্ট্যান্ট (ট্রায়াজ)',
  'Anteroom Triage & Clinical Anamnesis': 'অ্যান্টেরুম ট্রায়াজ ও প্রাথমিক স্বাস্থ্য পরীক্ষা',
  "Doctor's Chamber": 'ডাক্তারের কনসালটেশন চেম্বার',
  'Electronic Health Record, Digital Prescription & Lab Orders': 'ডিজিটাল প্রেসক্রিপশন ও ল্যাব টেস্ট অর্ডার',
  'Diagnostic Lab Hub': 'ডায়াগনস্টিক ও প্যাথলজি ল্যাব',
  'Analyzer Telemetry, Specimen Tracking & Panic Alerts': 'ল্যাব টেস্ট রিপোর্টিং ও ক্রিটিক্যাল অ্যালার্ট',
  'Patient Health SuperApp': 'রোগীর স্বাস্থ্য সুপারঅ্যাপ',
  'Prescriptions, Daily Dose Reminders, Lab Reports & AI Companion': 'ওষুধের সময়সূচী, রিপোর্ট ও ভ্যালেরিয়ান এআই',
  'Command Telemetry': 'কমান্ড ও টেলিমেট্রি',
  'Live Ward Matrix, Engineering Machinery & Biomedical Plant': 'ওয়ার্ড বেড ম্যাট্রিক্স, অক্সিজেন প্ল্যান্ট ও রক্ষণাবেক্ষণ',
  'Enterprise Central Registry': 'সেন্ট্রাল মাস্টার ডেটাহাব',
  'Patient Master Records & Demographics Editor': 'রোগীর মূল ডাটাবেজ ও ডেমোগ্রাফিক্স',
  'Vitality Pharmacy': 'ফার্মেসি ও ডিসপেনসারি',
  'Prescription Dispenser, POS Billing, Emergency STAT Orders & Cold-Chain': 'প্রেসক্রিপশন ওষুধ বিতরণ, বিলিং ও স্টক',

  // Triage & Nursing
  'Patient Triage, Anamnesis & Nursing Station': 'রোগী ট্রায়াজ, এনামনেসিস ও নার্সিং স্টেশন',
  'Capture biometrics, evaluate early warning scores (NEWS2, GCS, Morse), rapid glucose tests, and dispatch to assigned doctor.': 'ভাইটালস রেকর্ড করুন, আর্লি ওয়ার্নিং স্কোর (NEWS2, GCS, Morse) পরীক্ষা করুন এবং নির্ধারিত ডাক্তারের কাছে পাঠান।',
  '1. Vitals Intake & Gemini Multi-Specialist Intake': '১. ভাইটালস গ্রহণ ও জেমিনাই মাল্টি-স্পেশালিস্ট ট্রায়াজ',
  '2. SBAR Clinical Handover Protocol': '২. এসবিএআর (SBAR) নার্সিং হ্যান্ডওভার প্রোটোকল',
  'Anteroom Triage Queue': 'অপেক্ষারত ট্রায়াজ কিউ',
  'Waiting': 'অপেক্ষারত',
  'Awaiting Vitals': 'ভাইটালস বাকি আছে',
  'Ready for Doctor': 'ডাক্তারের জন্য প্রস্তুত',
  'Filter queue by name, alphabet, or MRIN...': 'নাম, অক্ষর বা এমআরআইএন দিয়ে খুঁজুন...',
  'Token': 'টোকেন',
  'MRIN Identifier': 'এমআরআইএন নম্বর',
  'Physical Vitals & Biometrics Intake': 'শারীরিক ভাইটালস ও বায়োমেট্রিক্স গ্রহণ',
  'Blood Pressure': 'রক্তচাপ (BP)',
  'Pulse Rate': 'নাড়ির স্পন্দন (Pulse)',
  'Temperature (°F)': 'শরীরের তাপমাত্রা (°F)',
  'SpO2 Oxygen (%)': 'অক্সিজেন স্যাচুরেশন (SpO2 %)',
  'Weight (kg)': 'ওজন (কেজি)',
  'Height (cm)': 'উচ্চতা (সেমি)',
  'Calculated BMI': 'বডি ম্যাস ইনডেক্স (BMI)',
  'Chief Complaints & Onset Duration': 'প্রধান শারীরিক সমস্যা ও লক্ষণসমূহ',
  'Type below for nearby disease auto-match': 'সম্ভাব্য রোগ স্বয়ংক্রিয়ভাবে মেলাতে নিচে টাইপ করুন',
  "Search symptom dictionary (e.g. 'chest pain', 'vertigo', 'thirst')...": "লক্ষণ ডিকশনারি খুঁজুন (যেমন 'বুকে ব্যথা', 'মাথা ঘোরা', 'তৃষ্ণা')...",
  'Frequent Thirst (Polydipsia) & Polyuria': 'অতিরিক্ত তৃষ্ণা (পলিডিপসিয়া) ও ঘন ঘন প্রস্রাব',
  'Unexplained Weight Loss & Fatigue': 'অস্বাভাবিক ওজন হ্রাস ও চরম ক্লান্তি',
  'Leg Pain / Calf Muscle Cramps': 'পায়ে তীব্র ব্যথা ও পেশির টান (ক্র্যাম্প)',
  'Knee & Joint Pain (Arthralgia)': 'হাঁটু ও জয়েন্টে ব্যথা (আর্থ্রালজিয়া)',
  'Lower Back Pain / Lumbago': 'কোমরে ব্যথা ও মেরুদণ্ডের সমস্যা',
  'Morning Dizziness & Lightheadedness': 'সকালে মাথা ঘোরা ও ভারসাম্যহীনতা',
  'Exertional Chest Tightness': 'হাঁটাহাঁটিতে বুকে চাপ ও শ্বাসকষ্ট',
  'leg pain': 'পায়ে ব্যথা',
  'chest pain': 'বুকে ব্যথা',
  'Add to File': 'ফাইলে যোগ করুন',

  // Valerian AI Multi-Specialty Matcher
  'Valerian AI Multi-Specialty Clinical Matcher': 'ভ্যালেরিয়ান এআই মাল্টি-স্পেশালিস্ট ক্লিনিক্যাল ম্যাচিং',
  'Differential diagnoses & assigned doctors mapped to chief complaints': 'প্রধান লক্ষণসমূহের ওপর ভিত্তি করে সম্ভাব্য রোগ ও বিশেষজ্ঞ ডাক্তার নির্ধারণ',
  'Re-evaluate Symptoms': 'লক্ষণসমূহ পুনরায় মূল্যায়ন করুন',
  'Evaluating...': 'বিশ্লেষণ করা হচ্ছে...',
  'Primary Match': 'প্রধান মিল (Primary Match)',
  'Secondary Rule-Out': 'দ্বিতীয় বিবেচনা (Secondary Rule-Out)',
  'Tertiary Consult': 'তৃতীয় পরামর্শ (Tertiary Consult)',
  'Available Specialists in': 'উপলব্ধ বিশেষজ্ঞ চিকিৎসকবৃন্দ:',
  'in queue': 'লাইনে আছেন',
  'Active Chamber Assignment:': 'বর্তমান নির্ধারিত চেম্বার ও ডাক্তার:',
  'Complete Triage & Dispatch Dossier to': 'ট্রায়াজ সম্পন্ন করে নির্ধারিত ডাক্তারের কাছে পাঠান:',

  // Specialties
  'Endocrinology & Diabetology': 'এন্ডোক্রাইনোলজি ও ডায়াবেটোলজি (হরমোন ও বহুমূত্র)',
  'Orthopedics & Trauma Surgery': 'অর্থোপেডিকস ও ট্রমা সার্জারি (হাড় ও জোড়া)',
  'Cardiology': 'কার্ডিওলজি (হৃদরোগ বিভাগ)',
  'Neurology & Stroke Care': 'নিউরোলজি ও স্ট্রোক কেয়ার (স্নায়ুরোগ বিভাগ)',
  'Pulmonology & Respiratory Medicine': 'পালমোনোলজি ও বক্ষব্যাধি বিভাগ',
  'Nephrology & Renal Medicine': 'নেফ্রোলজি ও কিডনি রোগ বিভাগ',
  'Gastroenterology & Hepatology': 'গ্যাস্ট্রোএন্টারোলজি ও লিভার বিভাগ',
  'Internal Medicine & Critical Care': 'ইন্টারনাল মেডিসিন ও ক্রিটিক্যাল কেয়ার',

  // Priority Tiers
  'Emergent Priority': 'তাৎক্ষণিক জরুরী অগ্রাধিকার',
  'Urgent Priority': 'জরুরী অগ্রাধিকার',
  'Semi-Urgent Priority': 'মধ্যম জরুরী অগ্রাধিকার',
  'Routine Priority': 'সাধারণ অগ্রাধিকার',

  // Common UI words
  'Male': 'পুরুষ',
  'Female': 'মহিলা',
  'Years': 'বছর',
  'Years Old': 'বছর বয়সী',
  'Year': 'বছর',
  'Save': 'সংরক্ষণ করুন',
  'Cancel': 'বাতিল করুন',
  'Close': 'বন্ধ করুন',
  'Confirm': 'নিশ্চিত করুন',
  'Delete': 'মুছে ফেলুন',
  'Edit': 'সম্পাদনা করুন',
  'Search': 'অনুসন্ধান করুন',
  'Print': 'প্রিন্ট করুন',
  'Download': 'ডাউনলোড করুন',
  'Export': 'রপ্তানি করুন',
  'Completed': 'সম্পন্ন',
  'Active': 'সক্রিয়',
  'Pending': 'অপেক্ষমান',
  'Emergency': 'জরুরী',
  'Warning': 'সতর্কতা',
  'Critical': 'সংকটাপন্ন',
  'Normal': 'স্বাভাবিক',

  // Modals & Tools
  '🖐️ Turjuman Sign AI': '🖐️ তরজুমান ইশারা ভাষা এআই',
  '🧭 Clinic Sense': '🧭 ক্লিনিক সেন্স ট্রায়াজ',
  '📸 Optical rPPG Vitals': '📸 অপটিক্যাল ক্যামেরা ভাইটালস',
  'SBAR Nurse-to-Nurse Shift Handover Protocol': 'এসবিএআর (SBAR) নার্স-টু-নার্স শিফট হ্যান্ডওভার প্রোটোকল',
  'Print SBAR Handover Slip': 'SBAR হ্যান্ডওভার স্লিপ প্রিন্ট করুন',
  'S - Situation': 'এস - পরিস্থিতি (Situation)',
  'B - Background': 'বি - পূর্ব ইতিহাস (Background)',
  'A - Assessment': 'এ - পর্যবেক্ষণ ও ভাইটালস (Assessment)',
  'R - Recommendation': 'আর - চিকিৎসা পরামর্শ (Recommendation)',

  // Strategic 6 Sectors
  'Integrated Healthcare Ecosystem • 6 Strategic Sectors': 'সমন্বিত স্বাস্থ্যসেবা ইকোসিস্টেম • ৬টি কৌশলগত সেক্টর',
  'Next-Gen Clinical AI & IoT Architecture': 'নেক্সট-জেন ক্লিনিক্যাল এআই ও আইওটি আর্কিটেকচার',
  'Sector 1: Emergency & Pre-Hospital Care (STAT Response)': 'সেক্টর ১: জরুরী ও প্রাক-হাসপাতাল ট্রানজিট কেয়ার',
  'Sector 1: Emergency & Ambulance Services': 'সেক্টর ১: জরুরী ও অ্যাম্বুলেন্স সেবা',
  'Sector 2: Operational AI, Ward Robotics & Continuous Telemetry': 'সেক্টর ২: ওয়ার্ড রোবটিক্স ও নিরবচ্ছিন্ন ভাইটালস মনিটরিং',
  'Sector 2: Doctor Decision Support & Patient Bedside Care': 'সেক্টর ২: ডাক্তার সিদ্ধান্ত সহায়তা ও বেডসাইড রোগীর যত্ন',
  'Sector 2: Clinical Decision Support & Inpatient Care (Doctor & Bedside)': 'সেক্টর ২: ক্লিনিক্যাল সিদ্ধান্ত সহায়তা ও ইনপেশেন্ট কেয়ার',
  'Sector 3: Advanced Clinical AI Diagnostics & Prescription Screening': 'সেক্টর ৩: এআই ডায়াগনস্টিকস ও প্রেসক্রিপশন ড্রাগ স্ক্রিনিং',
  'Sector 3: Hospital Operations & Bed Capacity Management': 'সেক্টর ৩: হাসপাতাল অপারেশনস ও বেড ব্যবস্থাপনা',
  'Sector 3: Hospital Operations & Capacity Logistics (Queue & Bed Optimization)': 'সেক্টর ৩: হাসপাতাল অপারেশনস ও বেড অপ্টিমাইজেশন',
  'Sector 4: Post-Discharge, Home Monitoring & Caregiver Support': 'সেক্টর ৪: রিলিজ-পরবর্তী হোম মনিটরিং ও কেয়ারগিভার অ্যাসিস্ট্যান্ট',
  'Sector 4: Outpatient & Family Caregiver Support': 'সেক্টর ৪: বহির্বিভাগ ও পারিবারিক কেয়ারগিভার সহায়তা',
  'Sector 4: Outpatient, Mental Health & Caregiver Ecosystem (Home Care)': 'সেক্টর ৪: বহির্বিভাগ, মানসিক স্বাস্থ্য ও হোম কেয়ার',
  'Sector 5: Population Health, Blood Bank & Outbreak Epidemiology': 'সেক্টর ৫: রোগ প্রাদুর্ভাব পূর্বাভাস ও ব্লাড ব্যাংক নেটওয়ার্ক',
  'Sector 5: Public Health & Emergency Blood Supply': 'সেক্টর ৫: জনস্বাস্থ্য ও জরুরী রক্ত সরবরাহ',
  'Sector 5: Population Health & Regional Epidemiology (Public Health Defense)': 'সেক্টর ৫: জনস্বাস্থ্য ও রোগ প্রাদুর্ভাব প্রতিরোধ',
  'Sector 6: Medical Financial Integrity & Anti-Fraud Security': 'সেক্টর ৬: স্বাস্থ্যসেবা আর্থিক স্বচ্ছতা ও অ্যান্টি-ফ্রড সিস্টেম',
  'Sector 6: Hospital Bill & Billing Accuracy Defense': 'সেক্টর ৬: হাসপাতাল বিল ও আর্থিক স্বচ্ছতা নিরীক্ষা',
  'Sector 6: Revenue Cycle & Trust Defense (Financial Integrity)': 'সেক্টর ৬: রাজস্ব চক্র ও আর্থিক স্বচ্ছতা নিরীক্ষা',

  // Simplified Apps & Roles
  'Hospital Launchpad': 'হাসপাতাল লঞ্চপ্যাড',
  'All Hospital Portals': 'সকল হাসপাতাল পোর্টাল',
  'Reception & Admissions': 'রিসেপশন ও রোগী ভর্তি',
  'Patient Intake & Tokens': 'রোগী নিবন্ধন ও টোকেন',
  'Triage & Vitals Station': 'ট্রায়াজ ও ভাইটালস স্টেশন',
  'Check Symptoms & Pulse': 'লক্ষণ ও নাড়ির স্পন্দন পরীক্ষা',
  'Triage & Vitals': 'ট্রায়াজ ও ভাইটালস',
  'Doctor Consultation': 'ডাক্তার কনসালটেশন চেম্বার',
  "Doctor's Consultation": 'ডাক্তার কনসালটেশন চেম্বার',
  'Consultation & Medicines': 'পরামর্শ ও ডিজিটাল প্রেসক্রিপশন',
  'Diagnostic & Blood Lab': 'ডায়াগনস্টিক ও রক্ত পরীক্ষা ল্যাব',
  'Blood Tests & Reports': 'রক্ত পরীক্ষা ও রিপোর্ট',
  'Patient Mobile Health App': 'রোগীর মোবাইল হেলথ অ্যাপ',
  'Medicine Times & QR Pass': 'ওষুধের সময়সূচী ও কিউআর পাস',
  'Hospital Beds & Operations': 'হাসপাতাল বেড ও অপারেশনস',
  'Ward Beds & Oxygen': 'ওয়ার্ড বেড ও অক্সিজেন সরবরাহ',
  'Bed & ICU Command': 'বেড ও আইসিইউ কমান্ড',
  'Hospital Pharmacy': 'হাসপাতাল ফার্মেসি',
  'Medicine Store & Billing': 'ওষুধের দোকান ও বিলিং',
  'Master Patient Registry': 'মূল রোগী তথ্যভাণ্ডার',
  'Patient Records Database': 'রোগীর কেন্দ্রীয় ডাটাবেজ',
  'Master Directory': 'সেন্ট্রাল ডিরেক্টরি',
  'Patient Master Records': 'রোগীর মূল স্বাস্থ্য রেকর্ড',

  // 16 Simplified Strategic AI Modules
  'Ambulance Emergency GPS Router': 'অ্যাম্বুলেন্স জরুরী জিপিএস রাউটার',
  'Fastest hospital route navigation with traffic signals priority for emergency ambulances.': 'জরুরী অ্যাম্বুলেন্সের জন্য ট্রাফিক সিগন্যাল প্রাধান্যসহ দ্রুততম হাসপাতাল পথ নির্দেশনা।',
  'Track Ambulance': 'অ্যাম্বুলেন্স ট্র্যাক করুন',
  'Voice & Visual Symptom Translator': 'ভয়েস ও ভিজ্যুয়াল লক্ষণ অনুবাদক',
  'Translates spoken complaints and non-verbal signs into clear medical summaries for doctors.': 'কথিত অভিযোগ ও অমৌখিক লক্ষণসমূহকে চিকিৎসকদের জন্য স্পষ্ট মেডিকেল নোটে রূপান্তর করে।',
  'Open Translator': 'অনুবাদক খুলুন',
  'Emergency Urgency Checker': 'জরুরী অবস্থা যাচাইকারী',
  'Quickly checks symptoms to advise whether you need the Emergency Room or outpatient clinic.': 'লক্ষণ পরীক্ষা করে দ্রুত পরামর্শ দেয় রোগী কি জরুরী বিভাগে যাবেন নাকি বহির্বিভাগে।',
  'Check Urgency': 'জরুরী অবস্থা যাচাই করুন',
  'Emergency CPR & Life Support Guide': 'জরুরী সিপিআর ও লাইফ সাপোর্ট গাইড',
  'Real-time CPR metronome timer and voice guidance for medical teams during cardiac arrest.': 'কার্ডিয়াক অ্যারেস্টের সময় মেডিকেল টিমের জন্য রিয়েল-টাইম সিপিআর টাইমার ও ভয়েস নির্দেশনা।',
  'Start CPR Guide': 'সিপিআর গাইড শুরু করুন',

  'Medicine Safety & Conflict Checker': 'ওষুধের নিরাপত্তা ও প্রতিক্রিয়া পরীক্ষক',
  'Scans prescriptions to prevent dangerous side effects when taking multiple medicines together.': 'একাধিক ওষুধ একসাথে সেবনের ক্ষতিকর প্রতিক্রিয়া ও পার্শ্বপ্রতিক্রিয়া প্রতিরোধে প্রেসক্রিপশন স্ক্যান করে।',
  'Check Medicines': 'ওষুধের প্রতিক্রিয়া যাচাই করুন',
  'Wearable Continuous Health Monitor': 'ওয়্যারলেস স্বাস্থ্য ও হার্টরেট মনিটর',
  'Monitors heart rhythm, blood oxygen, and sugar levels with instant irregular heartbeat alerts.': 'হৃদস্পন্দনের ছন্দ, রক্তের অক্সিজেন ও গ্লুকোজ পর্যবেক্ষণ করে অনিয়মিত হার্টবিটের তাৎক্ষণিক সতর্কতা প্রদান করে।',
  'View Live Vitals': 'লাইভ ভাইটালস দেখুন',
  'Bedside Patient Health Monitor': 'বেডসাইড সার্বক্ষণিক ভাইটালস মনিটর',
  'Watches patient vitals around the clock and immediately alerts on-duty nurses if condition drops.': 'সার্বক্ষণিক রোগীর শারীরিক অবস্থা পর্যবেক্ষণ করে এবং অবনতি হলে তাৎক্ষণিক নার্সদের সতর্ক করে।',
  'Open Bed Monitor': 'বেড মনিটর খুলুন',
  'Hospital Discharge Instructions': 'হাসপাতাল রিলিজ ও ডিসচার্জ নির্দেশনা',
  'Creates clear, easy-to-read discharge directions for patients and families in plain English and বাংলা.': 'রোগী ও পরিবারের জন্য সহজ বাংলা ও ইংরেজিতে স্পষ্ট রিলিজ ও ওষুধ সেবনের নির্দেশনা তৈরি করে।',
  'Generate Instructions': 'ডিসচার্জ নির্দেশনা তৈরি করুন',

  'Smart Doctor Appointment Scheduler': 'স্মার্ট ডাক্তার অ্যাপয়েন্টমেন্ট শিডিউলার',
  'Schedules clinic visits and reduces waiting room crowding by predicting appointment times accurately.': 'সঠিক অ্যাপয়েন্টমেন্ট সময় নির্ধারণ করে বহির্বিভাগে রোগীদের অতিরিক্ত ভিড় কমায়।',
  'Book Appointment': 'অ্যাপয়েন্টমেন্ট নিন',
  'Emergency Bed & ICU Locator': 'জরুরী বেড ও আইসিইউ সন্ধানকারী',
  'Finds available ICU, CCU, and general hospital beds nearby and reserves them before arrival.': 'কাছাকাছি হাসপাতালের খালি আইসিইউ, সিসিইউ ও সাধারণ বেড খুঁজে বের করে এবং পৌঁছানোর পূর্বেই বুক করে।',
  'Find & Lock Bed': 'বেড খুঁজুন ও বুক করুন',
  'Hospital Ward & Room Management': 'হাসপাতাল ওয়ার্ড ও রুম ব্যবস্থাপনা',
  'Tracks hospital ward rooms, bed cleaning status, and patient bed transfers.': 'হাসপাতালের ওয়ার্ড রুম, বেড জীবাণুমুক্তকরণ অবস্থা এবং রোগী স্থানান্তরের হিসাব রাখে।',
  'View Ward Rooms': 'ওয়ার্ড রুম দেখুন',
  'Hospital Bed Demand & Surge Forecaster': 'ভবিষ্যৎ বেড ও অক্সিজেন চাহিদা পূর্বাভাস',
  'Predicts patient admissions and oxygen needs for the upcoming week.': 'আগামী সপ্তাহের জন্য রোগী ভর্তি এবং অক্সিজেন সিলিন্ডারের সম্ভাব্য চাহিদা পূর্বাভাস দেয়।',
  'Forecast Capacity': 'চাহিদা পূর্বাভাস দেখুন',

  'Mental Health Support Assistant': 'মানসিক স্বাস্থ্য সহায়তা সহকারী',
  'Gentle conversational counseling guide for stress relief, anxiety, and everyday mental wellness.': 'মানসিক চাপ, উদ্বেগ ও মানসিক সুস্থতার জন্য সহমর্মী কথোপকথনমূলক কাউন্সেলিং গাইড।',
  'Start Conversation': 'কাউন্সিলিং শুরু করুন',
  'Daily Medicine Box & Reminder': 'দৈনিক ওষুধের বাক্স ও রিমাইন্ডার',
  'Tracks daily doses and sends sound alerts to help patients take their medicine on time.': 'দৈনিক ওষুধের হিসাব রাখে এবং রোগীকে সময়মতো ওষুধ সেবন মনে করিয়ে দিতে অ্যালার্ম বাজায়।',
  'Check Doses': 'ওষুধের মাত্রা দেখুন',
  'Family Caregiver Health Explainer': 'পারিবারিক স্বাস্থ্য নির্দেশিকা (হোয়াটসঅ্যাপ)',
  'Explains medicines and lab numbers in simple everyday words for families on WhatsApp.': 'হোয়াটসঅ্যাপে পরিবারের সদস্যদের জন্য ওষুধ ও ল্যাব রিপোর্টের কঠিন তথ্য সহজ ভাষায় বুঝিয়ে দেয়।',
  'Open Family Hub': 'ফ্যামিলি হাব খুলুন',
  'Virtual Doctor Video Consultation': 'ভার্চুয়াল ডাক্তার ভিডিও কনসালটেশন',
  'Secure video consultation with hospital doctors for remote health checkups and advice.': 'দূরবর্তী স্বাস্থ্য পরীক্ষা ও চিকিৎসার পরামর্শের জন্য চিকিৎসকদের সাথে নিরাপদ ভিডিও কল।',
  'Start Video Call': 'ভিডিও কল শুরু করুন',

  'Community Disease Outbreak Monitor': 'কমিউনিটি রোগ প্রাদুর্ভাব মনিটর',
  'Tracks fever, dengue, and infection clusters across districts to stop outbreaks early.': 'বিভিন্ন জেলায় জ্বর, ডেঙ্গু ও সংক্রামক রোগের গুচ্ছ ট্র্যাক করে দ্রুত মহামারী প্রতিরোধে সাহায্য করে।',
  'Track Outbreaks': 'প্রাদুর্ভাব ট্র্যাক করুন',
  'Emergency Blood Bank & Donor Finder': 'জরুরী ব্লাড ব্যাংক ও রক্তদাতা সন্ধানকারী',
  'Locates compatible blood donors and emergency blood units nearby in real time.': 'রিয়েল-টাইমে কাছাকাছি সামঞ্জস্যপূর্ণ রক্তের গ্রুপ ও জরুরী রক্তদাতা খুঁজে দেয়।',
  'Find Blood Units': 'রক্ত ও রক্তদাতা খুঁজুন',
  'Hospital Bill & Billing Accuracy Auditor': 'হাসপাতাল বিল ও বিলিং সঠিকতা নিরীক্ষক',
  'Checks hospital bills to protect patients from duplicate charges and billing mistakes.': 'অতিরিক্ত বা ভুল চার্জ থেকে রোগীদের সুরক্ষা দিতে হাসপাতাল বিলসমূহ নিরীক্ষা করে।',
  'Audit Bill': 'বিল নিরীক্ষা করুন',

  // Top Ribbon & Patient UI
  '📱 Patient Mobile App': '📱 রোগীর মোবাইল অ্যাপ',
  'Return to Staff Launchpad': 'স্টাফ লঞ্চপ্যাডে ফিরে যান',
  'Open Standalone Patient WebApp Tab': 'নতুন ট্যাবে রোগীর ওয়েবঅ্যাপ খুলুন',
  'In-Portal Live Mobile Preview': 'পোর্টালে লাইভ মোবাইল প্রিভিউ',
  'Synchronized Patient Record (Live FHIR)': 'সিঙ্ক্রোনাইজড রোগীর রেকর্ড (লাইভ FHIR)',
  'Live OpenStreetMap Regional Bed Capacity': 'লাইভ ওপেনস্ট্রিটম্যাপ আঞ্চলিক বেড সক্ষমতা',
  'DISPATCH & BED RESERVATION DESK': 'ডিসপ্যাচ ও বেড বুকিং ডেস্ক',
  'Lock ICU Ventilator Bed & Dispatch': 'আইসিইউ ভেন্টিলেটর বেড বুক ও প্রেরণ করুন',
  'Lock Coronary Care (CCU) Bed': 'সিসিইউ (CCU) কার্ডিয়াক বেড বুক করুন',
  'HOSPITALS WITH OPEN CAPACITY': 'খালি বেড থাকা হাসপাতালসমূহ',
  'CLICK TO FOCUS & RESERVE': 'ক্লিক করে অবস্থান দেখুন ও বুক করুন',
  'Emergency Hotline:': 'জরুরী হটলাইন:',
  'Cryogenic Oxygen Plant:': 'ক্রায়োজেনিক অক্সিজেন প্ল্যান্ট:',
  'Ambulance Siren Corridor:': 'জরুরী অ্যাম্বুলেন্স করিডোর:',
  'SURPLUS': 'উদ্বৃত্ত (সুরক্ষিত)',
  'ICU Ventilator': 'আইসিইউ ভেন্টিলেটর',
  'CCU Cardiac': 'সিসিইউ কার্ডিয়াক',
  'HDU Step-down': 'এইচডিইউ কেয়ার',
  'Dengue / Iso': 'ডেঙ্গু / আইসোলেশন',
  'Open': 'খালি আছে',
  'Selected': 'নির্বাচিত',
  'Live Socket Ready': 'লাইভ সকেট প্রস্তুত',

  // Map Controls & Badges
  'OpenFreeMap': 'ওপেনফ্রি-ম্যাপ',
  'No API Keys Required': 'বিনামূল্যে কোনো এপিআই কি ছাড়া',
  'Embedded Map Ready': 'সরাসরি এমবেডেড ম্যাপ প্রস্তুত',
  'Recenter Map': 'ম্যাপের কেন্দ্রে ফিরুন',
  'Zoom In': 'বড় করে দেখুন (+)',
  'Zoom Out': 'ছোট করে দেখুন (-)',
  'Reset 2D Flat View': 'দ্বিমাত্রিক সমতল ভিউ',
  '3D Perspective Tilt': 'ত্রিমাত্রিক (3D) পারসপেক্টিভ',

  // Patient Portal Strings
  "Today's Medication Doses": 'আজকের ওষুধের সময়সূচী',
  'Mark Taken': 'খেয়েছি (Taken)',
  'Taken Today': 'আজ খাওয়া হয়েছে',
  'Missed Dose': 'ছুটে যাওয়া ডোজ',
  'Snooze 15m': '১৫ মিনিট পর স্মরণ করান',
  'Plain-Language Prescription Explainer': 'প্রেসক্রিপশন সহজ ব্যাখ্যাকারী (Plain RX)',
  'AdvocateGPT Plain RX': 'সহজ ভাষার প্রেসক্রিপশন নির্দেশিকা',
  'Why You Are Taking This Medicine': 'এই ওষুধটি আপনি কেন খাচ্ছেন',
  'What To Do If You Miss A Dose': 'ডোজ ভুলে গেলে করণীয়',
  'Foods & Drinks To Avoid': 'যেসব খাবার ও পানীয় এড়িয়ে চলবেন',
  'Emergency Precautions': 'জরুরী সতর্কতা লক্ষণ',
  '24/7 AI Clinical Companion': '২৪/৭ এআই স্বাস্থ্য সঙ্গী',
  'Valerian AI Companion': 'ভ্যালেরিয়ান এআই স্বাস্থ্য সহকারী',
  'Ask anything about your health, lab reports, or medicines...': 'আপনার স্বাস্থ্য, টেস্ট রিপোর্ট বা ওষুধ সম্পর্কে যেকোনো প্রশ্ন করুন...',
  'Log Daily Vitals': 'দৈনিক ভাইটালস রেকর্ড করুন',
  'Fasting Blood Sugar': 'খালি পেটে রক্তের সুগার (FBS)',
  'Automated Clinical Health Assessment': 'স্বয়ংক্রিয় ক্লিনিক্যাল মূল্যায়ন',
  'Emergency QR Medical Passport': 'জরুরী কিউআর মেডিকেল আইডি পাস',
  'Blood Group:': 'রক্তের গ্রুপ:',
  'Known Drug Allergies:': 'ওষুধের এলার্জি:',
  'Emergency Contact:': 'জরুরী যোগাযোগ:',
  'Universal Health MRIN:': 'ইউনিভার্সাল হেলথ এমআরআইএন নম্বর:',

  // Camera & Distress AI Scanner
  'Camera & Distress AI Scanner': 'ক্যামেরা ও এআই ডিস্ট্রেস স্ক্যানার',
  'Open Distress Scanner': 'ডিস্ট্রেস স্ক্যানার খুলুন',
  'CAMERA AI': 'ক্যামেরা এআই',
  'Live camera scan for distressed or unresponsive patients. Identifies signs, explains clinical condition, prevents dangerous bystander mistakes (e.g. cardiac arrest vs dehydration), and gives step-by-step emergency steps.': 'অসুস্থ বা অচেতন রোগীর জন্য লাইভ ক্যামেরা স্ক্যান। লক্ষণ চিহ্নিতকরণ, রোগের সঠিক ব্যাখ্যা, মারাত্মক ভুল পদক্ষেপ রোধ এবং ধাপে ধাপে জরুরি নির্দেশিকা।',
  'Emergency Turjuman™': 'ইমার্জেন্সি তর্জমান™',
  'Sign Language & Non-Verbal AI': 'ইশারা ভাষা ও শারীরিক সংকেত এআই',
  'Distress Camera': 'ক্যামেরা স্ক্যানার',
  'Sign Library': 'ইশারা ও সাইন',
  'Procedures': 'প্রসিডিউর গাইড',
  'Start Camera': 'ক্যামেরা চালু করুন',
  'Stop Camera': 'ক্যামেরা বন্ধ করুন',
  'Push to Hospital Triage': 'রোগীর চার্টে পুশ করুন',
  'Call 999 Emergency': 'জরুরি ৯৯৯ কল দিন',
  'Close Turjuman': 'তর্জমান বন্ধ করুন',

  // Telemetry & Master Hub Simplifications
  'Connected Hospital Network • Live Data Sync': 'সংযুক্ত হাসপাতাল নেটওয়ার্ক • রিয়েল-টাইম ডাটা সিঙ্ক',
  'Triage Active': 'ট্রায়াজ সক্রিয়',
  'Automatic Health Scoring • Fast Doctor Routing': 'স্বয়ংক্রিয় স্বাস্থ্য স্কোরিং • দ্রুত ডাক্তার বরাদ্দ',
  'Blood & Chemistry Analyzers Active': 'রক্ত ও বায়োকেমিস্ট্রি বিশ্লেষক সচল',
  'Instant Lab Results • Urgent Doctor Alerts': 'তাৎক্ষণিক ল্যাব রিপোর্ট • ডাক্তারকে জরুরী সতর্কতা',
  'Continuous Oxygen Tracking • Clean Air Isolation': 'অবিচ্ছিন্ন অক্সিজেন মনিটরিং • পরিচ্ছন্ন বাতাস আইসোলেশন',
  'Safe Pressure': 'নিরাপদ চাপ',
  'Hospital Oxygen Tank: 98.4% Full': 'হাসপাতাল অক্সিজেন ট্যাংক: ৯৮.৪% পূর্ণ',
  'Backup Generator Ready • Clean Air Ventilation': 'ব্যাকআপ জেনারেটর প্রস্তুত • ভেন্টিলেশন সচল',
  'VERIFIED LOGS': 'যাচাইকৃত লগ',
  'Patient Master Records & Change History': 'রোগীর মূল ডাটাবেজ ও পরিবর্তনের ইতিহাস',
  'Complete history tracking every medicine dispensed, prescription written, and record update.': 'প্রতিটি ওষুধ বিতরণ, প্রেসক্রিপশন প্রদান ও রেকর্ড পরিবর্তনের পূর্ণাঙ্গ নির্ভরযোগ্য ইতিহাস।',
  'Open Master Records': 'মূল রেকর্ড দেখুন'
};

// Sorted multi-word phrases for greedy replacement
const SORTED_PHRASES = Object.keys(DICTIONARY_EN_TO_BN).sort((a, b) => b.length - a.length);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem('vitality_language');
      if (stored === 'bn' || stored === 'en') return stored;
    } catch (e) {}
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('vitality_language', lang);
    } catch (e) {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const t = useCallback((text: string): string => {
    if (language === 'en') return text;
    if (!text) return text;
    const trimmed = text.trim();
    if (DICTIONARY_EN_TO_BN[trimmed]) {
      return DICTIONARY_EN_TO_BN[trimmed];
    }
    // Partial phrase translation
    let result = text;
    for (const phrase of SORTED_PHRASES) {
      if (result.includes(phrase)) {
        result = result.split(phrase).join(DICTIONARY_EN_TO_BN[phrase]);
      }
    }
    return result;
  }, [language]);

  // Deep DOM Real-Time Auto-Translation Engine
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const translateString = (str: string): string => {
      if (!str || str.trim() === '') return str;
      let out = str;
      for (const phrase of SORTED_PHRASES) {
        if (out.includes(phrase)) {
          out = out.split(phrase).join(DICTIONARY_EN_TO_BN[phrase]);
        }
      }
      return out;
    };

    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textNode = node as Text;
        const val = textNode.nodeValue || '';
        if (language === 'bn') {
          if ((textNode as any).__origText === undefined) {
            (textNode as any).__origText = val;
          }
          const translated = translateString((textNode as any).__origText);
          if (translated !== val) {
            textNode.nodeValue = translated;
          }
        } else {
          // Revert to English
          if ((textNode as any).__origText !== undefined) {
            textNode.nodeValue = (textNode as any).__origText;
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') return;

        // Translate placeholders
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          const ph = el.placeholder;
          if (language === 'bn') {
            if ((el as any).__origPlaceholder === undefined) {
              (el as any).__origPlaceholder = ph;
            }
            if ((el as any).__origPlaceholder) {
              el.placeholder = translateString((el as any).__origPlaceholder);
            }
          } else {
            if ((el as any).__origPlaceholder !== undefined) {
              el.placeholder = (el as any).__origPlaceholder;
            }
          }
        }

        // Process children
        for (let i = 0; i < el.childNodes.length; i++) {
          processNode(el.childNodes[i]);
        }
      }
    };

    // Initial pass on document
    processNode(document.body);

    // MutationObserver to translate dynamically rendered elements
    const observer = new MutationObserver((mutations) => {
      for (const mut of mutations) {
        if (mut.type === 'childList') {
          for (let i = 0; i < mut.addedNodes.length; i++) {
            processNode(mut.addedNodes[i]);
          }
        } else if (mut.type === 'characterData') {
          const textNode = mut.target as Text;
          if (language === 'bn') {
            if ((textNode as any).__origText === undefined) {
              (textNode as any).__origText = textNode.nodeValue || '';
              const tr = translateString((textNode as any).__origText);
              if (tr !== textNode.nodeValue) {
                textNode.nodeValue = tr;
              }
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
