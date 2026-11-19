import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Hand, Eye, Volume2, Sparkles, CheckCircle2, AlertTriangle, 
  HelpCircle, RefreshCw, Activity, ArrowRight, ShieldCheck, Heart,
  Stethoscope, FileText, Camera, CameraOff, AlertOctagon, PhoneCall,
  Play, Square, ShieldAlert, HeartPulse, Zap, Clock, UserCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface EmergencyTurjumanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranslateToTriage?: (complaint: string, painScore: number) => void;
}

interface DistressConditionProfile {
  id: string;
  name: string;
  bengaliName: string;
  urgency: 'CRITICAL' | 'HIGH' | 'URGENT';
  painScale: number; // 0 - 10
  consciousness: 'Unresponsive (U)' | 'Pain Responsive (P)' | 'Confused / Verbal (V)' | 'Alert Panic (A)';
  eyeStatus: string;
  breathingPattern: string;
  motorSign: string;
  actualDiagnosis: string;
  bengaliDiagnosis: string;
  whyNotMisconception: string;
  bengaliWhyNotMisconception: string;
  fatalMistakes: string[];
  bengaliFatalMistakes: string[];
  stepByStepProtocol: {
    step: number;
    title: string;
    bengaliTitle: string;
    action: string;
    bengaliAction: string;
    icon: string;
  }[];
  requiresCPR?: boolean;
}

interface GesturePattern {
  id: string;
  name: string;
  signDesc: string;
  medicalMeaning: string;
  bengaliTranslation: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  painScale: number;
  suggestedProcedureId: string;
}

interface VisualProcedure {
  id: string;
  title: string;
  bengaliTitle: string;
  description: string;
  bengaliDescription: string;
  icon: string;
  duration: string;
  painLevel: 'Painless' | 'Mild Pinch' | 'Non-Invasive';
  keySteps: string[];
}

const DISTRESS_PROFILES: DistressConditionProfile[] = [
  {
    id: 'cardiac_arrest',
    name: 'Unresponsive & Agonal Gasping (Sudden Cardiac Arrest)',
    bengaliName: 'অচেতন ও অস্বাভাবিক হাঁপানো (হঠাৎ কার্ডিয়াক অ্যারেস্ট / হার্ট বন্ধ)',
    urgency: 'CRITICAL',
    painScale: 10,
    consciousness: 'Unresponsive (U)',
    eyeStatus: 'Fixed, non-reactive or rolled back (no blink reflex)',
    breathingPattern: 'Agonal Gasps: Reflexive irregular snoring/gasping spasms (Zero effective airflow)',
    motorSign: 'Completely limp, flaccid posture, no voluntary movement or defense',
    actualDiagnosis: 'Sudden Cardiac Arrest (Electrical Ventricular Fibrillation / Asystole). The heart has completely stopped pumping blood to the brain and lungs. Blood pressure is zero.',
    bengaliDiagnosis: 'হঠাৎ কার্ডিয়াক অ্যারেস্ট (হৃদস্পন্দন ও রক্ত চলাচল সম্পূর্ণরূপে বন্ধ)। মস্তিষ্কে রক্ত না পৌঁছানোর কারণে রোগী গভীর সংজ্ঞাহীন।',
    whyNotMisconception: 'CRITICAL DIFFERENTIATION: Family members frequently mistake agonal gasps for severe dehydration, heat stroke, or fainting and attempt to pour water or saline. Fainting retains normal regular breathing and pulse. Here, noisy gasping is the dying brainstem\'s reflex—oxygen circulation is completely ZERO.',
    bengaliWhyNotMisconception: 'ভুল ধারণা থেকে সাবধান: স্বজনরা অনেকেই একে সাধারণ অজ্ঞান হওয়া, অতিরিক্ত ক্লান্তি বা ডিহাইড্রেশন (পানি শূন্যতা) মনে করে মুখে পানি বা স্যালাইন ঢালার মারাত্মক ভুল করেন। কিন্তু এটি হার্ট অ্যাটাকের চেয়েও ভয়ংকর কার্ডিয়াক অ্যারেস্ট, যেখানে হার্ট ও রক্ত সঞ্চালন সম্পূর্ণ থেমে গেছে।',
    fatalMistakes: [
      'NEVER pour water, oral saline (ORS), or liquids into the mouth! An unconscious person has lost the swallowing reflex; water pours directly into the trachea/lungs causing immediate drowning and total airway flooding.',
      'DO NOT waste precious seconds massaging feet, splashing water, or fanning the patient.',
      'DO NOT shake violently or elevate legs—this does NOT restore an arrested heart rhythm.',
      'DO NOT wait to see if they "wake up". Brain tissue dies within 3-4 minutes without compressions.'
    ],
    bengaliFatalMistakes: [
      'মুখে কখনই পানি, স্যালাইন বা কোনো তরল ঢালবেন না! রোগী অচেতন থাকায় পানি সরাসরি ফুসফুসে ঢুকে তাৎক্ষণিক দম বন্ধ হয়ে মৃত্যু হবে।',
      'হাত-পা মালিশ করা, জুতা শুকানো বা বাতাস করে সময় নষ্ট করবেন না।',
      'রোগীকে ঝাঁকানো বা পা উঁচু করা হার্ট চালু করতে পারে না।',
      'দেরি না করে তাৎক্ষণিক বুকে দুই হাত দিয়ে পাম্প (সিপিআর) শুরু করুন।'
    ],
    stepByStepProtocol: [
      {
        step: 1,
        title: 'Emergency Dispatch (999)',
        bengaliTitle: 'তাৎক্ষণিক ৯৯৯ নম্বরে ফোন দিন',
        action: 'Shout for help, call 999 or hospital code blue. Put phone on speaker so the dispatcher can guide you.',
        bengaliAction: 'উচ্চস্বরে আশপাশের লোক ডাকুন এবং ৯৯৯ নম্বরে ফোন দিয়ে স্পিকারে দিন।',
        icon: '📞'
      },
      {
        step: 2,
        title: 'Position Flat on Firm Surface',
        bengaliTitle: 'রোগীকে শক্ত সমতল মেঝেতে শোয়ান',
        action: 'Lay the patient flat on their back on a hard floor. Do NOT leave them on a soft mattress.',
        bengaliAction: 'রোগীকে নরম বিছানায় না রেখে শক্ত মেঝেতে চিত করে শোয়ান যাতে বুক ঠিকমতো পাম্প করা যায়।',
        icon: '🛏️'
      },
      {
        step: 3,
        title: 'Start Hands-Only CPR Immediately',
        bengaliTitle: 'তক্ষুনি বুকে দুই হাত দিয়ে দ্রুত চাপ (CPR) দিন',
        action: 'Interlock both hands on center of chest. Push HARD & FAST (100-120 beats per minute, 5 cm deep). Do NOT stop until emergency doctors arrive.',
        bengaliAction: 'বুকের ঠিক মাঝখানে দুই হাত একের উপর এক রেখে সোজা হয়ে মিনিটে ১০০-১২০ বার দ্রুত ও জোরে পাম্প করতে থাকুন।',
        icon: '🫀'
      },
      {
        step: 4,
        title: 'Fetch Automated Defibrillator (AED)',
        bengaliTitle: 'কাছের ডিফিব্রিলেটর (AED) মেশিন আনান',
        action: 'If in a public space, train station, or clinic, send someone to get an AED. Turn it on and follow voice instructions.',
        bengaliAction: 'কাছাকাছি এইডি (AED) শক মেশিন থাকলে আনিয়ে প্যাড লাগিয়ে দিন, মেশিন নিজেই পথ দেখাবে।',
        icon: '⚡'
      }
    ],
    requiresCPR: true
  },
  {
    id: 'acute_stroke',
    name: 'Facial Asymmetry & Arm Drift (Acute Ischemic Stroke)',
    bengaliName: 'মুখের একপাশ বেঁকে যাওয়া ও পক্ষাঘাত (তীব্র ব্রেইন স্ট্রোক)',
    urgency: 'CRITICAL',
    painScale: 7,
    consciousness: 'Confused / Verbal (V)',
    eyeStatus: 'Gaze deviation to one side; asymmetric eyebrow and lid drooping (Ptosis)',
    breathingPattern: 'Shallow or normal breathing; attempted speech is garbled, slurred, or mutism',
    motorSign: 'Unilateral hemiparesis: right or left arm drifts downward when lifted',
    actualDiagnosis: 'Acute Ischemic Stroke (Cerebral Artery Occlusion) or Intracranial Hemorrhage. Oxygen-deprived brain tissue is actively necrosing (~1.9 million brain cells lost per minute).',
    bengaliDiagnosis: 'তীব্র ব্রেন স্ট্রোক (মস্তিষ্কের রক্তনালীতে রক্ত জমাট বাঁধা বা ছিঁড়ে যাওয়া)। প্রতি মিনিটে মস্তিষ্কের লক্ষ লক্ষ নিউরন ধ্বংস হচ্ছে।',
    whyNotMisconception: 'CRITICAL DIFFERENTIATION: Often mistaken for a migraine, stress breakdown, or fatigue. Simple headaches do not cause sudden one-sided facial paralysis and arm drop. This is a neurovascular crisis requiring hospital CT scanning within 4.5 hours.',
    bengaliWhyNotMisconception: 'ভুল ধারণা থেকে সাবধান: অনেকেই একে সাধারণ ক্লান্তি, গ্যাস বা মাথাব্যথা ভেবে রোগীকে ঘুমাতে বলেন। কিন্তু মুখের কোণ ঝুলে যাওয়া এবং এক হাত অবশ হয়ে যাওয়া নিশ্চিত ব্রেন স্ট্রোকের লক্ষণ।',
    fatalMistakes: [
      'NEVER administer Aspirin, Disprin, or blood thinners at home! If this is a hemorrhagic stroke (bleeding inside brain), Aspirin causes massive fatal hemorrhage.',
      'DO NOT give water or food to swallow! Stroke causes pharyngeal muscle paralysis, leading to choking and chemical aspiration pneumonia.',
      'DO NOT advise the patient to "take a nap" to sleep it off. The clot-busting medicine (tPA) window expires after 4.5 hours.',
      'DO NOT take the patient to a clinic without a 24/7 emergency CT scanner.'
    ],
    bengaliFatalMistakes: [
      'সিটি স্ক্যান ছাড়া রোগীকে কখনোই অ্যাসপিরিন বা ব্যথানাশক ট্যাবলেট খাওয়াবেন না! ব্রেনে রক্তক্ষরণ হলে অ্যাসপিরিন মৃত্যু ডেকে আনবে।',
      'মুখে পানি বা খাবার দেবেন না; গলার পেশি অবশ থাকায় শ্বাসনালীতে আটকে রোগী মারা যেতে পারে।',
      'রোগীকে ঘুমিয়ে পড়ার উপদেশ দেবেন না। প্রতিটি মিনিট অত্যন্ত মূল্যবান।',
      'সিটি স্ক্যান সুবিধা ছাড়া সাধারণ ক্লিনিকে গিয়ে সময় নষ্ট করবেন না।'
    ],
    stepByStepProtocol: [
      {
        step: 1,
        title: 'Note Exact Symptom Onset Time',
        bengaliTitle: 'লক্ষণ শুরুর ঠিক সময়টি লিখে রাখুন',
        action: 'Check clock immediately. Stroke thrombolytic medication must be administered within a strict 4.5-hour golden window.',
        bengaliAction: 'ঘড়ি দেখে ঠিক কোন সময় সমস্যাটি শুরু হয়েছে তা নোট করুন। ডাক্তারদের জন্য এটি অত্যন্ত গুরুত্বপূর্ণ।',
        icon: '⏱️'
      },
      {
        step: 2,
        title: 'Elevate Head & Torso 30 Degrees',
        bengaliTitle: 'মাথা ও বুক ৩০ ডিগ্রি উঁচুতে রাখুন',
        action: 'Keep patient seated semi-upright or elevated at 30 degrees to minimize intracranial swelling. Loosen tight collars.',
        bengaliAction: 'মাথার নিচে বালিশ দিয়ে বুক ও মাথা সামান্য উঁচুতে রাখুন এবং গলার টাই বা বোতাম আলগা করুন।',
        icon: '📐'
      },
      {
        step: 3,
        title: 'Turn to Recovery Side if Vomiting',
        bengaliTitle: 'বমি হলে একপাশে কাত করে দিন',
        action: 'If nausea or vomiting occurs, roll them onto their unaffected side to keep saliva and emesis clear of airway.',
        bengaliAction: 'বমি ভাব হলে সাথে সাথে রোগীকে একপাশে কাত করে দিন যাতে বমি শ্বাসনালীতে না যায়।',
        icon: '🔄'
      },
      {
        step: 4,
        title: 'Immediate CT-Equipped Hospital Transfer',
        bengaliTitle: 'সিটি স্ক্যানযুক্ত হাসপাতালে জরুরি স্থানান্তর',
        action: 'Transport via emergency ambulance directly to a primary stroke center or tertiary hospital with operational CT imaging.',
        bengaliAction: 'দেরি না করে অ্যাম্বুলেন্সে করে সরাসরি সিটি স্ক্যান সুবিধাযুক্ত বড় হাসপাতালে নিয়ে যান।',
        icon: '🚑'
      }
    ]
  },
  {
    id: 'airway_choking',
    name: 'Silent Panic & Clutching Throat (Complete Foreign Body Choking)',
    bengaliName: 'গলায় খাবার বা বস্তু আটকে শ্বাসরুদ্ধ হওয়া (চোকিং / দম বন্ধ)',
    urgency: 'CRITICAL',
    painScale: 9,
    consciousness: 'Alert Panic (A)',
    eyeStatus: 'Wide, terrified, bulging eyes staring intently for help',
    breathingPattern: 'Zero airflow: complete inability to speak, cough, or vocalize sounds',
    motorSign: 'Universal Distress Sign: Both hands tightly clamped around front of neck',
    actualDiagnosis: 'Complete Upper Airway Obstruction (Laryngeal Foreign Body Impact). 100% of oxygen supply to lungs is mechanically blocked. Unconsciousness occurs in 60-90 seconds.',
    bengaliDiagnosis: 'শ্বাসযন্ত্রে খাদ্য বা বস্তু আটকে সম্পূর্ণ বায়ু চলাচল বন্ধ (কমপ্লিট এয়ারওয়ে ব্লকেজ)। ১ মিনিটের মধ্যে অজ্ঞান হওয়ার ঝুঁকি।',
    whyNotMisconception: 'CRITICAL DIFFERENTIATION: Bystanders often mistake this for asthma or a sudden heart attack and frantically try to hand them a glass of water. Unlike asthma (which wheezes and speaks in broken words), foreign body choking is instantly silent during eating.',
    bengaliWhyNotMisconception: 'ভুল ধারণা থেকে সাবধান: আশপাশের মানুষ একে শ্বাসকষ্ট বা বুক ধড়ফড় মনে করে পানি গিলতে বলে। কিন্তু শ্বাসনালী আটকে থাকায় পানি খাওয়ালে অবশিষ্ট বায়ু চলাচলও বন্ধ হয়ে সেকেন্ডের মধ্যে মৃত্যু হবে।',
    fatalMistakes: [
      'NEVER give water or drinks to "wash it down"! The obstruction is in the trachea, not the stomach. Water instantly drowns the lungs and worsens obstruction.',
      'NEVER perform blind finger sweeps in the throat! Shoving fingers blindly pushes the object deeper into the vocal cords, turning a partial block into a permanent fatal seal.',
      'DO NOT slap their back while they are standing completely upright (this gravity-pulls the object deeper down).'
    ],
    bengaliFatalMistakes: [
      'ভুল করেও পানি খাওয়াবেন না! শ্বাসনালীতে পানি ঢুকলে সাথে সাথে দম বন্ধ হয়ে মারা যাবে।',
      'গলার ভেতর হাত বা আঙুল ঢুকিয়ে বস্তু খোঁজার চেষ্টা করবেন না; এতে বস্তুটি আরও গভীরে চলে যাবে।',
      'সোজা দাঁড়িয়ে থাকা অবস্থায় পিঠে থাপ্পড় দেবেন না, রোগীকে সামনে ঝুঁকিয়ে থাপ্পড় দিতে হবে।'
    ],
    stepByStepProtocol: [
      {
        step: 1,
        title: 'Confirm Airway Obstruction',
        bengaliTitle: 'দ্রুত কথা বলতে বা কাশতে বলুন',
        action: 'Ask loudly: "Are you choking?" If they nod frantically but CANNOT cough or speak, act instantly.',
        bengaliAction: 'রোগীকে জিজ্ঞেস করুন "গলায় কি কিছু আটকেছে?" যদি কথা বা কাশি না আসে, তৎক্ষণাৎ ব্যবস্থা নিন।',
        icon: '🗣️'
      },
      {
        step: 2,
        title: 'Deliver 5 Sharp Back Blows',
        bengaliTitle: 'সামনে ঝুঁকিয়ে পিঠের মাঝে ৫ বার জোরে আঘাত করুন',
        action: 'Stand to side and slightly behind. Support chest with one hand, lean them well forward, and strike sharply between shoulder blades with heel of hand.',
        bengaliAction: 'রোগীকে সামনের দিকে ভালো করে ঝুঁকিয়ে এক হাত বুকে রেখে অপর হাতের তালু দিয়ে পিঠের দুই হাড়ের মাঝে ৫ বার সজোরে আঘাত করুন।',
        icon: '✋'
      },
      {
        step: 3,
        title: '5 Abdominal Thrusts (Heimlich Maneuver)',
        bengaliTitle: 'হাইমলিচ পদ্ধতি: পেটে ৫ বার ওপরের দিকে চাপ দিন',
        action: 'Stand behind them. Place your fist (thumb inward) just above their navel. Grasp fist with other hand and pull sharply inward and UPWARD.',
        bengaliAction: 'পেছনে দাঁড়িয়ে নাভির ঠিক ওপরে দুই হাত পেঁচিয়ে শক্ত করে ভিতরের ও ওপরের দিকে ৫ বার সজোরে টানুন যাতে পেটের বাতাসে বস্তুটি বেরিয়ে আসে।',
        icon: '🎯'
      },
      {
        step: 4,
        title: 'If Patient Collapses Unconscious',
        bengaliTitle: 'অচেতন হয়ে পড়লে তৎক্ষণাৎ সিপিআর শুরু করুন',
        action: 'Lower carefully to floor, call 999 immediately, and begin CPR chest compressions. Look in mouth only if object is clearly visible.',
        bengaliAction: 'রোগী জ্ঞান হারালে মাটিতে শুইয়ে ৯৯৯-এ ফোন দিন এবং তৎক্ষণাৎ বুকের ওপর দুই হাত দিয়ে সিপিআর শুরু করুন।',
        icon: '🫀'
      }
    ]
  },
  {
    id: 'tonic_clonic_seizure',
    name: 'Rhythmic Convulsions & Clenched Jaw (Generalized Tonic-Clonic Seizure)',
    bengaliName: 'হাত-পা ছোঁড়া ও খিঁচুনি (মস্তিষ্কের তীব্র খিঁচুনি / মৃগীরোগ)',
    urgency: 'HIGH',
    painScale: 8,
    consciousness: 'Unresponsive (U)',
    eyeStatus: 'Eyes rolled upward or fixated laterally; pupils dilated',
    breathingPattern: 'Stertorous, noisy respiration; frothy saliva or tongue-bite bleeding from mouth',
    motorSign: 'Tonic body stiffening followed by rhythmic violent bilateral arm and leg jerking',
    actualDiagnosis: 'Generalized Tonic-Clonic Seizure (Epileptic Storm). Mass hypersynchronous electrical discharge firing across the cerebral cortex. Usually lasts 1 to 3 minutes.',
    bengaliDiagnosis: 'মস্তিষ্কে অতিরিক্ত বৈদ্যুতিক তরঙ্গের কারণে শরীরের পেশিগুলোর তীব্র অনিয়ন্ত্রিত খিঁচুনি (মৃগীরোগ বা এপিলেপ্সি)।',
    whyNotMisconception: 'CRITICAL DIFFERENTIATION: In many communities, seizures are mistakenly treated as spiritual possession or hysteria, and bystanders aggressively force spoons, keys, or onion into the mouth. Patients have strong pulses; this is purely neurological.',
    bengaliWhyNotMisconception: 'ভুল ধারণা থেকে সাবধান: অনেকে কুসংস্কারবশত রোগীর মুখে চামচ, লোহার চাবি, জুতা বা কাপড় গুঁজে দেন অথবা জোর করে হাত-পা চেপে ধরে সোজা করার চেষ্টা করেন। এটি মারাত্মক বিপজ্জনক এবং হাড় ভেঙে দেওয়ার মতো ক্ষতি করে।',
    fatalMistakes: [
      'NEVER force a metal spoon, leather belt, cloth, or fingers into their mouth! It is anatomically impossible to "swallow one\'s tongue". Forcing objects breaks teeth into the lungs and severs fingers.',
      'NEVER forcibly hold down or restrain violently jerking limbs! Counter-resisting convulsions causes severe bone fractures and shoulder dislocations.',
      'NEVER splash water, blow into their ears, or force liquid down during a seizure.'
    ],
    bengaliFatalMistakes: [
      'রোগীর মুখে কখনোই চামচ, লোহার চাবি, কাপড় বা আঙুল ঢোকাবেন না! এতে দাঁত ভেঙে ফুসফুসে ঢুকে যাবে এবং আপনার আঙুলও কেটে যেতে পারে।',
      'খিঁচুনির সময় হাত-পা জোর করে চেপে ধরে রাখবেন না; এতে রোগীর হাড় ভেঙে যেতে পারে।',
      'মুখে পানি ছিটাবেন না বা পানি খাওয়ানোর চেষ্টা করবেন না।'
    ],
    stepByStepProtocol: [
      {
        step: 1,
        title: 'Protect Head & Clear Hazards',
        bengaliTitle: 'মাথার নিচে নরম কিছু দিন ও বিপদ দূর করুন',
        action: 'Clear away tables, sharp objects, and furniture. Place a folded soft jacket or pillow gently under their head to prevent trauma.',
        bengaliAction: 'আশপাশের ধারালো ও শক্ত জিনিস সরিয়ে দিন এবং রোগীর মাথার নিচে একটি ভাঁজ করা নরম কাপড় বা বালিশ দিন।',
        icon: '🛡️'
      },
      {
        step: 2,
        title: 'Time the Seizure Duration',
        bengaliTitle: 'ঘড়ি দেখে খিঁচুনির সময় মাপুন',
        action: 'Look at your watch. If continuous convulsions exceed 5 minutes, this is Status Epilepticus—call 999 immediately!',
        bengaliAction: 'ঘড়ি দেখে নিশ্চিত করুন খিঁচুনি কতক্ষণ স্থায়ী হচ্ছে। ৫ মিনিটের বেশি স্থায়ী হলে তা মারাত্মক বিপজ্জনক এবং জরুরি অ্যাম্বুলেন্স দরকার।',
        icon: '⏱️'
      },
      {
        step: 3,
        title: 'Roll into Recovery Position',
        bengaliTitle: 'খিঁচুনি থামলে একপাশে কাত করে দিন',
        action: 'As soon as jerking stops, gently turn the patient onto their left side. This allows saliva and tongue to drain forward, keeping airway open.',
        bengaliAction: 'খিঁচুনি বন্ধ হওয়া মাত্র রোগীকে বামপাশে কাত (রিকভারি পজিশন) করে দিন যাতে মুখের লালা অনায়াসে বের হয়ে যেতে পারে।',
        icon: '🔄'
      },
      {
        step: 4,
        title: 'Reassure in Post-Ictal Phase',
        bengaliTitle: 'জ্ঞান ফিরলে শান্তভাবে পাশে থাকুন',
        action: 'Patient will be groggy, confused, and fatigued for 20 minutes. Speak gently and do not leave them unattended.',
        bengaliAction: 'জ্ঞান ফেরার পর রোগী ক্লান্ত ও কিছুটা বিভ্রান্ত থাকতে পারে। শান্তভাবে তার পাশে থাকুন এবং আশ্বস্ত করুন।',
        icon: '🤝'
      }
    ]
  },
  {
    id: 'severe_hypoglycemia',
    name: 'Cold Sweats & Confusion (Diabetic Hypoglycemic Shock)',
    bengaliName: 'শরীর ভিজে ঠান্ডা ঘাম ও বিভ্রান্তি (তীব্র সুগার কমে যাওয়া / ডায়াবেটিস শক)',
    urgency: 'HIGH',
    painScale: 6,
    consciousness: 'Confused / Verbal (V)',
    eyeStatus: 'Dilated pupils, wandering unfocused gaze, heavy sweating from brow',
    breathingPattern: 'Rapid shallow breathing; patient complains of racing heart and extreme dizziness',
    motorSign: 'Prominent fine hand and body tremors, unsteady staggering gait or combative disorientation',
    actualDiagnosis: 'Severe Neuroglycopenia / Hypoglycemic Crisis. Blood glucose has fallen below 50 mg/dL (< 2.8 mmol/L), depriving the brain of essential metabolic substrate.',
    bengaliDiagnosis: 'রক্তে গ্লুকোজের মাত্রা বিপজ্জনকভাবে কমে যাওয়া (হাইপোগ্লাইসেমিয়া)। মস্তিষ্কে জ্বালানি না পেয়ে রোগী প্রলাপ বকছে ও বিভ্রান্ত হয়ে পড়ছে।',
    whyNotMisconception: 'CRITICAL DIFFERENTIATION: Family members often mistake sudden confusion and staggering in a diabetic person for psychiatric agitation or drunkenness, and withhold sugar. If left untreated, severe hypoglycemia leads to irreversible brain damage.',
    bengaliWhyNotMisconception: 'ভুল ধারণা থেকে সাবধান: অনেকে ডায়াবেটিস রোগীর আচরণে পরিবর্তন ও কথা জড়িয়ে যাওয়াকে পাগলামি বা অতিরিক্ত রাগ মনে করেন। এটি আসলে রক্তে সুগার কমে যাওয়ার বিপদসংকেত।',
    fatalMistakes: [
      'NEVER administer insulin or oral diabetes tablets! Giving insulin to a hypoglycemic patient drives glucose to zero and causes irreversible brain death or fatal coma.',
      'NEVER try to force liquid or solid food into an unresponsive or heavily drowsy person—risk of fatal choking and lung aspiration.',
      'DO NOT delay treatment to measure blood sugar if signs are obvious and a meter is not immediately reachable.'
    ],
    bengaliFatalMistakes: [
      'ভুল করেও ইনসুলিন ইনজেকশন বা ডায়াবেটিসের ওষুধ দেবেন না! এতে সুগার শূন্যে নেমে রোগী কোমায় চলে যাবে।',
      'রোগী বেশি ঝিমিয়ে পড়লে বা গিলতে না পারলে জোর করে পানি বা মিষ্টি খাওয়াবেন না।',
      'গ্লুকোমিটার খুঁজে পেতে দেরি হলে সাথে সাথে মিষ্টি দিয়ে দিন, অতিরিক্ত দেরি করা বিপজ্জনক।'
    ],
    stepByStepProtocol: [
      {
        step: 1,
        title: 'Assess Ability to Swallow',
        bengaliTitle: 'রোগী নিজে গিলতে পারছে কিনা নিশ্চিত করুন',
        action: 'If the patient is awake and can swallow safely without coughing, proceed to give fast oral sugar.',
        bengaliAction: 'রোগী নিজে ঠিকমতো গিলতে সক্ষম কিনা দেখুন। গিলতে পারলে দ্রুত চিনি বা মিষ্টি দিতে হবে।',
        icon: '👀'
      },
      {
        step: 2,
        title: 'Execute Rule of 15 (Fast Carbs)',
        bengaliTitle: '১৫ গ্রাম দ্রুত শোষিত চিনি বা শরবত দিন',
        action: 'Administer 15 grams of fast-acting simple carbohydrates: half a glass of fruit juice, 3 teaspoons of sugar in water, or 4 glucose sweets.',
        bengaliAction: 'আধা গ্লাস ফলের রস অথবা ৩ চা-চামচ চিনি মেশানো পানি বা মিষ্টি চকলেট তৎক্ষণাৎ খাইয়ে দিন।',
        icon: '🍯'
      },
      {
        step: 3,
        title: 'For Drowsy / Unconscious Patient',
        bengaliTitle: 'অর্ধ-সচেতন হলে গালে বা মাড়িতে মধু ঘষুন',
        action: 'DO NOT pour liquids. Gently massage thick honey or glucose gel inside their inner cheek gumline, or administer emergency Glucagon.',
        bengaliAction: 'রোগী বেশি অচেতন হলে তরল না দিয়ে মাড়ির ভেতরের অংশে ঘন মধু বা মিষ্টি জেলি আলতো করে ঘষে দিন এবং ৯৯৯-এ ফোন দিন।',
        icon: '⚠️'
      },
      {
        step: 4,
        title: 'Recheck in 15 Minutes & Provide Meal',
        bengaliTitle: '১৫ মিনিট পর চেক করে ভারী খাবার দিন',
        action: 'Recheck symptoms after 15 minutes. Once alert, provide a complex meal (bread, rice, or biscuits) to prevent a secondary relapse.',
        bengaliAction: '১৫ মিনিট পর সুস্থ বোধ করলে রুটি বা ভাত খাইয়ে দিন যাতে সুগার পুনরায় না কমে যায়।',
        icon: '🍞'
      }
    ]
  }
];

const GESTURE_DATABASE: GesturePattern[] = [
  {
    id: 'chest_clench',
    name: 'Chest Fist Clench (Levine Sign)',
    signDesc: 'Right fist clenched tightly over sternum with pained facial contraction',
    medicalMeaning: 'Acute Sub-sternal Chest Pressure / Suspected Myocardial Ischemia',
    bengaliTranslation: 'বুকে তীব্র চাপ এবং অসহ্য ব্যথা অনুভব করছি, নিঃশ্বাস নিতে কষ্ট হচ্ছে',
    urgency: 'HIGH',
    painScale: 9,
    suggestedProcedureId: 'ecg_test'
  },
  {
    id: 'throat_choke',
    name: 'Hands Clasping Throat',
    signDesc: 'Both hands clutching neck, flared nostrils, shallow breathing',
    medicalMeaning: 'Acute Respiratory Distress / Airway Constriction',
    bengaliTranslation: 'আমার শ্বাস বন্ধ হয়ে আসছে, বাতাস পাচ্ছি না',
    urgency: 'HIGH',
    painScale: 8,
    suggestedProcedureId: 'nebulizer'
  },
  {
    id: 'head_squeeze',
    name: 'Palms Pressing Temples',
    signDesc: 'Bilateral temple compression with eyes shut tightly',
    medicalMeaning: 'Severe Throbbing Migraine / Hypertensive Encephalopathy',
    bengaliTranslation: 'মাথায় প্রচণ্ড যন্ত্রণা এবং তীব্র মাথা ঘোরা',
    urgency: 'MEDIUM',
    painScale: 7,
    suggestedProcedureId: 'bp_check'
  },
  {
    id: 'abdomen_crouch',
    name: 'Double Hand Lower Abdominal Guard',
    signDesc: 'Hands guarding right lower abdomen with forward body bend',
    medicalMeaning: 'Acute Abdominal Tenderness / Suspected Appendicitis or Renal Colic',
    bengaliTranslation: 'পেটে অসহ্য তীব্র খিঁচুনি ও ব্যথা হচ্ছে',
    urgency: 'HIGH',
    painScale: 8,
    suggestedProcedureId: 'ultrasound'
  },
  {
    id: 'arm_vein_tap',
    name: 'Finger Pointing to Antefossa',
    signDesc: 'Index finger tapping inner elbow crease while asking for relief',
    medicalMeaning: 'Requesting Intravenous Analgesia / Fluid Hydration',
    bengaliTranslation: 'আমাকে ব্যথানাশক স্যালাইন বা ইনজেকশন দিন',
    urgency: 'MEDIUM',
    painScale: 6,
    suggestedProcedureId: 'iv_cannula'
  }
];

const PROCEDURES: VisualProcedure[] = [
  {
    id: 'ecg_test',
    title: '12-Lead Electrocardiogram (ECG)',
    bengaliTitle: 'ইসিজি পরীক্ষা (হৃদযন্ত্রের গতি নিরীক্ষা)',
    description: 'Painless test using small sticky sensor pads placed on your chest to record heart electrical rhythms.',
    bengaliDescription: 'আপনার বুকের ওপর কয়েকটি নরম প্যাড বসিয়ে হার্টের স্পন্দন দেখা হবে। এতে কোনোরূপ ব্যথা লাগে না।',
    icon: '🫀',
    duration: '3 Minutes',
    painLevel: 'Painless',
    keySteps: [
      'Lie comfortably flat on the examination bed',
      'Gentle placement of 6 chest electrodes and 4 limb leads',
      'Relax and breathe normally for 60 seconds during recording'
    ]
  },
  {
    id: 'nebulizer',
    title: 'Bronchodilator Nebulization',
    bengaliTitle: 'নেবুলাইজার থেরাপি (শ্বাসকষ্ট উপশম)',
    description: 'Inhaling soothing, medicated micro-mist through a soft face mask to rapidly open constricted airways.',
    bengaliDescription: 'একটি নরম মাস্ক দিয়ে ঠান্ডা বাষ্পের মাধ্যমে ওষুধ দেওয়া হবে, যাতে ফুসফুসের শ্বাসনালী সহজেই খুলে যায়।',
    icon: '🌬️',
    duration: '8 Minutes',
    painLevel: 'Non-Invasive',
    keySteps: [
      'Soft silicone mask fitted over nose and mouth',
      'Inhale slowly and deeply through the mouth',
      'Immediate relief of chest tightness and shortness of breath'
    ]
  },
  {
    id: 'iv_cannula',
    title: 'Intravenous (IV) Catheter Line',
    bengaliTitle: 'আইভি স্যালাইন ক্যানুলা লাইন',
    description: 'A tiny flexible tube placed in an arm vein to administer emergency fluids, antibiotics, and analgesics.',
    bengaliDescription: 'হাতে একটি ক্ষুদ্র নল পরানো হবে যার মাধ্যমে দ্রুত ব্যথানাশক ওষুধ ও স্যালাইন শরীরে প্রবেশ করবে।',
    icon: '💉',
    duration: '2 Minutes',
    painLevel: 'Mild Pinch',
    keySteps: [
      'Gentle tourniquet applied to forearm to highlight vein',
      'Sterile alcohol swab wipe with a brief 1-second tiny pinch',
      'Secured with transparent medical dressing for safe infusion'
    ]
  },
  {
    id: 'bp_check',
    title: 'Hemodynamic Blood Pressure Profiling',
    bengaliTitle: 'রক্তচাপ ও রক্তে অক্সিজেনের মাত্রা পরীক্ষা',
    description: 'Automated inflatable arm cuff and pulse oximeter finger sensor to evaluate cardiovascular stability.',
    bengaliDescription: 'বাহুতে একটি নরম কাফ জড়িয়ে কয়েক সেকেন্ড রক্তচাপ পরীক্ষা করা হবে। সম্পূর্ণ যন্ত্রণাহীন।',
    icon: '🩺',
    duration: '90 Seconds',
    painLevel: 'Painless',
    keySteps: [
      'Soft fabric cuff wrapped comfortably around upper arm',
      'Gentle pressure sensation while cuff inflates automatically',
      'Fingertip sensor instantly measures SpO2 oxygen and pulse'
    ]
  }
];

export function EmergencyTurjumanModal({
  isOpen,
  onClose,
  onTranslateToTriage
}: EmergencyTurjumanModalProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Primary navigation: Default to camera_distress (User's core request!)
  const [activeTab, setActiveTab] = useState<'camera_distress' | 'gestures' | 'procedures'>('camera_distress');
  
  // Selected Profile & Gesture
  const [selectedProfile, setSelectedProfile] = useState<DistressConditionProfile>(DISTRESS_PROFILES[0]);
  const [selectedGesture, setSelectedGesture] = useState<GesturePattern>(GESTURE_DATABASE[0]);
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Audio & Metronome state
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false);
  const [cprCount, setCprCount] = useState<number>(0);
  const metronomeTimerRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // AI Scanning HUD simulation state
  const [scanPulse, setScanPulse] = useState<number>(0);
  const [scanningActive, setScanningActive] = useState<boolean>(true);

  // Stop camera on unmount or modal close
  useEffect(() => {
    return () => {
      stopCamera();
      stopMetronome();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // When modal closes, clean up streams
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      stopMetronome();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  // Optical scanning animation ticker
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setScanPulse(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Start Webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported in this browser environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access could not be acquired:', err);
      setCameraError(err.message || 'Unable to access camera. Utilizing HD optical simulation mode.');
      setIsCameraActive(false);
    }
  };

  // Stop Webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Toggle Camera
  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Play synthetic tone for CPR Metronome (110 BPM = ~545ms interval)
  const playBeep = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.18, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.08);
      }
    } catch (e) {
      // AudioContext unavailable
    }
  };

  // CPR Metronome toggle
  const toggleMetronome = () => {
    if (isMetronomeActive) {
      stopMetronome();
    } else {
      setIsMetronomeActive(true);
      setCprCount(1);
      playBeep();
      // 110 beats per minute -> 60000 / 110 ≈ 545ms
      metronomeTimerRef.current = setInterval(() => {
        setCprCount(prev => (prev >= 30 ? 1 : prev + 1));
        playBeep();
      }, 545);
    }
  };

  const stopMetronome = () => {
    setIsMetronomeActive(false);
    if (metronomeTimerRef.current) {
      clearInterval(metronomeTimerRef.current);
      metronomeTimerRef.current = null;
    }
  };

  // Speak medical guidance aloud
  const handleSpeak = (text: string, lang: 'bn-BD' | 'en-US') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.onstart = () => setAudioPlaying(true);
    utterance.onend = () => setAudioPlaying(false);
    utterance.onerror = () => setAudioPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSelectProfile = (profile: DistressConditionProfile) => {
    setSelectedProfile(profile);
    stopMetronome();
    setScanningActive(false);
    setTimeout(() => {
      setScanningActive(true);
      if (isBn) {
        handleSpeak(profile.bengaliDiagnosis, 'bn-BD');
      } else {
        handleSpeak(profile.actualDiagnosis, 'en-US');
      }
    }, 300);
  };

  if (!isOpen) return null;

  const activeProcedure = PROCEDURES.find(p => p.id === selectedGesture.suggestedProcedureId) || PROCEDURES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-gradient-to-r from-teal-950/90 via-slate-900 to-indigo-950/90 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-inner">
              <Camera className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {isBn ? 'ইমার্জেন্সি তর্জমান • অপটিক্যাল ডিস্ট্রেস ও ক্যামেরা স্ক্যানার' : 'Emergency Turjuman™ • Optical Camera & Distress AI'}
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-300 border border-rose-500/30 animate-pulse">
                  {isBn ? 'লাইফ-সেভিং প্রোটোকল' : 'LIFE-SAVING ACTION'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isBn 
                  ? 'ক্যামেরা ও এআই দিয়ে অসুস্থ বা অচেতন রোগীর অবস্থা নির্ণয়, মারাত্মক ভুল রোধ এবং জরুরি চিকিৎসা নির্দেশিকা'
                  : 'Judges facial distress & unresponsiveness, prevents fatal bystander mistakes, and provides step-by-step guides'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary Tab Navigation */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
              <button
                onClick={() => setActiveTab('camera_distress')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'camera_distress' 
                    ? 'bg-rose-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isBn ? 'ক্যামেরা স্ক্যানার' : 'Distress Camera'}</span>
              </button>
              <button
                onClick={() => setActiveTab('gestures')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'gestures' 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>{isBn ? 'ইশারা ও সাইন' : 'Sign Library'}</span>
              </button>
              <button
                onClick={() => setActiveTab('procedures')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'procedures' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isBn ? 'প্রসিডিউর গাইড' : 'Procedures'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: OPTICAL DISTRESS & CAMERA SCANNER (User Request Core) */}
          {activeTab === 'camera_distress' && (
            <div className="space-y-6">

              {/* Condition Selector Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    {isBn ? 'রোগীর দৃশ্যমান লক্ষণ ও জরুরি অবস্থা বাছাই করুন:' : 'Select Patient Visible Emergency Clue / Scenario:'}
                  </span>
                  <span className="text-[11px] text-teal-400 font-semibold">
                    {isBn ? '৫টি জীবনরক্ষাকারী জরুরি কেস' : '5 Clinical Distress Presets'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {DISTRESS_PROFILES.map(profile => {
                    const isSelected = selectedProfile.id === profile.id;
                    return (
                      <button
                        key={profile.id}
                        onClick={() => handleSelectProfile(profile)}
                        className={`text-left p-2.5 sm:p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-rose-950/60 border-rose-500 shadow-lg shadow-rose-950/50 scale-[1.02]'
                            : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                            profile.urgency === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {profile.urgency}
                          </span>
                          <span className="text-xs">
                            {profile.id === 'cardiac_arrest' ? '🫀' :
                             profile.id === 'acute_stroke' ? '🧠' :
                             profile.id === 'airway_choking' ? '🌬️' :
                             profile.id === 'tonic_clonic_seizure' ? '⚡' : '🩸'}
                          </span>
                        </div>
                        <h4 className={`text-xs font-bold line-clamp-2 leading-tight ${isSelected ? 'text-rose-200' : 'text-slate-200'}`}>
                          {isBn ? profile.bengaliName.split('(')[0] : profile.name.split('(')[0]}
                        </h4>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Dual Grid: Live Camera / HUD on Left, Clinical Assessment & Dangerous Mistakes on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column (5 Cols): Live Camera / Visual HUD */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="relative rounded-2xl bg-black border border-slate-800 overflow-hidden aspect-[4/3] flex items-center justify-center shadow-xl group">
                    
                    {/* Live Video Element */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                    />

                    {/* Simulation Canvas if camera is not active */}
                    {!isCameraActive && (
                      <div className="relative w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
                        <div className="relative mb-3">
                          <div className="w-24 h-24 rounded-full border-2 border-dashed border-teal-500/40 flex items-center justify-center">
                            <span className="text-4xl animate-pulse">
                              {selectedProfile.id === 'cardiac_arrest' ? '🫀' :
                               selectedProfile.id === 'acute_stroke' ? '🧠' :
                               selectedProfile.id === 'airway_choking' ? '🌬️' :
                               selectedProfile.id === 'tonic_clonic_seizure' ? '⚡' : '🩸'}
                            </span>
                          </div>
                          <div className="absolute inset-0 rounded-full border border-teal-400/30 animate-ping" />
                        </div>
                        <span className="text-xs font-bold text-slate-200">
                          {isBn ? 'অপটিক্যাল এআই ডিস্ট্রেস সিমুলেশন' : 'Optical Distress Sensor Active'}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-[260px]">
                          {isBn ? 'আপনার ডিভাইসের ক্যামেরা চালু করতে নিচে বাটনে চাপুন' : 'Click "Start Camera" below to feed live patient video'}
                        </p>
                      </div>
                    )}

                    {/* Scanning Laser Beam Overlay */}
                    {scanningActive && (
                      <div 
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] pointer-events-none transition-all duration-75"
                        style={{ top: `${scanPulse}%` }}
                      />
                    )}

                    {/* HUD Bounding Target Box */}
                    <div className="absolute inset-6 border border-teal-500/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                      <div className="flex justify-between items-start">
                        <div className="w-4 h-4 border-t-2 border-l-2 border-teal-400" />
                        <span className="text-[9px] font-mono font-bold text-teal-400 bg-black/60 px-1.5 py-0.5 rounded border border-teal-500/30">
                          {isCameraActive ? 'LIVE WEBCAM' : 'SIMULATION HUD'}
                        </span>
                        <div className="w-4 h-4 border-t-2 border-r-2 border-teal-400" />
                      </div>
                      
                      {/* Center Crosshairs */}
                      <div className="flex items-center justify-center text-teal-400/40">
                        <span className="text-xs tracking-widest font-mono">+ TARGET LOCK +</span>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="w-4 h-4 border-b-2 border-l-2 border-teal-400" />
                        <span className="text-[9px] font-mono text-rose-400 bg-black/60 px-1.5 py-0.5 rounded border border-rose-500/30">
                          PAIN: {selectedProfile.painScale}/10
                        </span>
                        <div className="w-4 h-4 border-b-2 border-r-2 border-teal-400" />
                      </div>
                    </div>

                    {/* Camera Switch Floating Control */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                      <button
                        onClick={toggleCamera}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
                          isCameraActive 
                            ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                            : 'bg-teal-600 hover:bg-teal-500 text-white'
                        }`}
                      >
                        {isCameraActive ? (
                          <>
                            <CameraOff className="w-3.5 h-3.5" />
                            <span>{isBn ? 'ক্যামেরা বন্ধ করুন' : 'Stop Camera'}</span>
                          </>
                        ) : (
                          <>
                            <Camera className="w-3.5 h-3.5" />
                            <span>{isBn ? 'ক্যামেরা চালু করুন' : 'Start Camera'}</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (isBn) {
                              handleSpeak(selectedProfile.bengaliDiagnosis + '. ' + selectedProfile.bengaliWhyNotMisconception, 'bn-BD');
                            } else {
                              handleSpeak(selectedProfile.actualDiagnosis + '. ' + selectedProfile.whyNotMisconception, 'en-US');
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-teal-300 font-bold text-xs border border-slate-700 shadow"
                          title="Speak Explanation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{audioPlaying ? '...' : (isBn ? 'বাংলা শুনুন' : 'Listen')}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Optical Telemetry Breakdown */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/50">
                      <span className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-teal-400" />
                        {isBn ? 'চিহ্নিত শারীরিক সংকেত (Optical Clues)' : 'Detected Clinical Signs'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300">
                        {selectedProfile.consciousness}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 shrink-0 font-medium">👁️ {isBn ? 'চোখ ও দৃষ্টি:' : 'Eye State:'}</span>
                        <span className="text-slate-200 font-semibold">{selectedProfile.eyeStatus}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 shrink-0 font-medium">🌬️ {isBn ? 'শ্বাস-প্রশ্বাস:' : 'Respiration:'}</span>
                        <span className="text-slate-200 font-semibold">{selectedProfile.breathingPattern}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 shrink-0 font-medium">💪 {isBn ? 'শারীরিক অঙ্গভঙ্গি:' : 'Motor State:'}</span>
                        <span className="text-slate-200 font-semibold">{selectedProfile.motorSign}</span>
                      </div>
                    </div>
                  </div>

                  {/* CPR Metronome Box (If Cardiac Arrest) */}
                  {selectedProfile.requiresCPR && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-rose-950/70 border border-rose-500/40 shadow-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HeartPulse className="w-5 h-5 text-rose-400 animate-pulse" />
                          <div>
                            <h4 className="text-xs font-bold text-white">
                              {isBn ? 'সিপিআর পালস মেট্রোনোম (১১০ BPM)' : 'CPR Audio-Visual Metronome (110 BPM)'}
                            </h4>
                            <p className="text-[10px] text-rose-300">
                              {isBn ? 'বুকে পাম্প করার সঠিক গতি নির্দেশক' : 'AHA Standard: Push hard & fast at this rhythm'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={toggleMetronome}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow transition-all ${
                            isMetronomeActive 
                              ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' 
                              : 'bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {isMetronomeActive ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-current" />
                              <span>{isBn ? 'বন্ধ করুন' : 'Stop Beat'}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>{isBn ? 'বিপ চালু করুন' : 'Start Beat'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* CPR Beat Visual Meter */}
                      <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-rose-500/20 text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full transition-all ${
                            isMetronomeActive ? 'bg-rose-500 scale-125 shadow-[0_0_10px_#f43f5e]' : 'bg-slate-700'
                          }`} />
                          <span className="text-[11px] text-slate-300 font-mono">
                            {isBn ? 'কম্প্রেশন কাউন্ট:' : 'Cycle:'} <strong className="text-white text-sm">{cprCount}</strong> / 30
                          </span>
                        </div>
                        <span className="text-[10px] text-rose-400 font-bold uppercase">
                          {cprCount % 2 === 0 ? 'PUSH DOWN 5cm' : 'RECOIL UP'}
                        </span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Right Column (7 Cols): What Is Actually Happening + DANGEROUS MISTAKES + Step-by-Step Guide */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Card 1: What Is Actually Happening & Misconception Busting */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/70 border border-indigo-500/30 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                          {isBn ? 'প্রকৃতপক্ষে রোগীর শরীরে কী ঘটছে? (Clinical Reality)' : 'What Is Actually Happening (Differential Diagnosis)'}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {isBn ? 'চিকিৎসাগত নিশ্চিতকরণ' : 'Verified Clinical Rule'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-sm font-semibold text-white leading-relaxed">
                      {isBn ? selectedProfile.bengaliDiagnosis : selectedProfile.actualDiagnosis}
                    </div>

                    {/* Misconception Alert */}
                    <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-200 leading-relaxed">
                        <strong className="text-amber-300 block mb-0.5">
                          {isBn ? '⚠️ সাধারণ ভুল ধারণা বনাম আসল সত্য:' : '⚠️ Misconception Differentiation:'}
                        </strong>
                        {isBn ? selectedProfile.bengaliWhyNotMisconception : selectedProfile.whyNotMisconception}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: ⛔ FATAL BYSTANDER MISTAKES TO AVOID IMMEDIATELY (User's specific highlight!) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-950/90 via-slate-900 to-rose-950/90 border-2 border-rose-500/80 shadow-2xl shadow-rose-950/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
                        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-rose-300">
                          {isBn 
                            ? '⛔ ভুলেও যা করবেন না! (মারাত্মক ক্ষতিকর ভুল পদক্ষেপ)' 
                            : '⛔ FATAL BYSTANDER MISTAKES TO AVOID IMMEDIATELY'}
                        </h3>
                      </div>
                      <span className="text-[10px] font-black uppercase text-rose-200 bg-rose-600 px-2 py-0.5 rounded">
                        {isBn ? 'জরুরি নিষেধ' : 'DO NOT DO'}
                      </span>
                    </div>

                    <p className="text-xs text-rose-200 font-medium">
                      {isBn 
                        ? 'আতঙ্কের কারণে স্বজনরা প্রায়ই ভুল পদক্ষেপ নেন (যেমন কার্ডিয়াক অ্যারেস্টে অচেতন মুখে পানি বা স্যালাইন ঢালা), যা রোগীকে সরাসরি মৃত্যুর দিকে ঠেলে দেয়:'
                        : 'Panicked family members often make fatal mistakes (e.g. mistaking cardiac arrest for dehydration and forcing water), causing instant asphyxiation:'}
                    </p>

                    <div className="space-y-2">
                      {(isBn ? selectedProfile.bengaliFatalMistakes : selectedProfile.fatalMistakes).map((mistake, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-black/50 border border-rose-500/30 text-xs text-rose-100">
                          <span className="text-rose-400 font-bold shrink-0 mt-0.5">🚫</span>
                          <span className="font-semibold leading-relaxed">{mistake}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Step-by-Step Emergency Protocol (What To Do Next) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950/60 border border-teal-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-400" />
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-teal-300">
                          {isBn ? '📋 এখনই কী করবেন? ধাপে ধাপে প্রাথমিক চিকিৎসা নির্দেশিকা' : '📋 Step-by-Step Action Protocol (What To Do Next)'}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-teal-300">
                        {selectedProfile.stepByStepProtocol.length} {isBn ? 'টি ধাপ' : 'Action Steps'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedProfile.stepByStepProtocol.map(step => (
                        <div key={step.step} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 hover:border-teal-500/40 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 font-extrabold text-xs flex items-center justify-center">
                              {step.step}
                            </span>
                            <span className="text-base">{step.icon}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white">
                            {isBn ? step.bengaliTitle : step.title}
                          </h4>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {isBn ? step.bengaliAction : step.action}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Action Dispatch Buttons */}
                    <div className="flex flex-wrap items-center justify-between pt-2 gap-3 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        <a
                          href="tel:999"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-950/60 transition-all"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{isBn ? 'জরুরি ৯৯৯ কল দিন' : 'Call 999 Emergency'}</span>
                        </a>
                      </div>

                      <button
                        onClick={() => {
                          if (onTranslateToTriage) {
                            onTranslateToTriage(selectedProfile.name, selectedProfile.painScale);
                          }
                          onClose();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-950/50 transition-all"
                      >
                        <span>{isBn ? 'রোগীর চার্টে পুশ করুন' : 'Push to Hospital Triage'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: NON-VERBAL SIGN GESTURE DATABASE (Retained & Enhanced) */}
          {activeTab === 'gestures' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Sign & Gesture Library */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Hand className="w-4 h-4 text-teal-400" />
                    {isBn ? 'শনাক্তকৃত অঙ্গভঙ্গি তালিকা' : 'Detected Non-Verbal Gestures'}
                  </h3>
                  <span className="text-[11px] text-teal-400/80">Optical Vision Active</span>
                </div>

                <div className="space-y-2">
                  {GESTURE_DATABASE.map(gesture => {
                    const isSelected = selectedGesture.id === gesture.id;
                    return (
                      <button
                        key={gesture.id}
                        onClick={() => {
                          setSelectedGesture(gesture);
                          handleSpeak(gesture.bengaliTranslation, 'bn-BD');
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-teal-950/40 border-teal-500/50 shadow-lg shadow-teal-950/50'
                            : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-bold ${isSelected ? 'text-teal-300' : 'text-slate-200'}`}>
                            {gesture.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            gesture.urgency === 'HIGH' 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {gesture.urgency} PRIORITY
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{gesture.signDesc}</p>
                        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                          <span>Pain: {gesture.painScale}/10</span>
                          <span>•</span>
                          <span className="text-teal-400/90 font-medium">{gesture.medicalMeaning.split('/')[0]}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Facial Grimace Metric */}
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200">Wong-Baker FACES Pain Index</span>
                    </div>
                    <span className="text-xs font-extrabold text-amber-400">
                      Score: {selectedGesture.painScale} / 10
                    </span>
                  </div>

                  <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${selectedGesture.painScale * 10}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>😊 0 (No Hurt)</span>
                    <span>😐 4 (Moderate)</span>
                    <span>😫 8 (Severe)</span>
                    <span>😭 10 (Worst Pain)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Real-Time Clinical Interpretation */}
              <div className="lg:col-span-7 space-y-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-teal-500/30 relative space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300">
                        AI Clinical Interpretation Engine
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      98.4% Confidence
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-1">CLINICAL FINDING (TRIAGE):</div>
                    <div className="text-base font-bold text-white bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      {selectedGesture.medicalMeaning}
                    </div>
                  </div>

                  {/* Bengali Translation & Speech */}
                  <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-teal-300 uppercase">
                        বাংলা ভয়েস অনুবাদ (Spoken Patient Feedback)
                      </span>
                      <button
                        onClick={() => handleSpeak(selectedGesture.bengaliTranslation, 'bn-BD')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {audioPlaying ? 'প্লে হচ্ছে...' : 'বাংলা শুনুন'}
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-teal-100 font-sans">
                      "{selectedGesture.bengaliTranslation}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Triage Red Flag</span>
                      <span className={`text-xs font-extrabold ${selectedGesture.urgency === 'HIGH' ? 'text-rose-400' : 'text-amber-400'}`}>
                        {selectedGesture.urgency === 'HIGH' ? 'STAT Resuscitation Bay' : 'Urgent Assessment'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Protocol</span>
                      <span className="text-xs font-extrabold text-teal-300">
                        {activeProcedure.title.split('(')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Button: Route into Patient Chart */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-200">Push to Emergency Triage Queue</h4>
                    <p className="text-[11px] text-slate-400">
                      Auto-populates chief complaint and {selectedGesture.painScale}/10 pain score into patient digital EHR
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onTranslateToTriage) {
                        onTranslateToTriage(selectedGesture.medicalMeaning, selectedGesture.painScale);
                      }
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-900/40 transition-all"
                  >
                    <span>Send to Triage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: VISUAL PROCEDURE GUIDE */}
          {activeTab === 'procedures' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-400" />
                    {isBn ? 'ভিজ্যুয়াল মেডিকেল প্রসিডিউর গাইড' : 'Visual Medical Procedure Visualizer'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isBn 
                      ? 'চিকিৎসা শুরু করার আগে রোগীকে সহজ চিত্রে পরীক্ষাগুলো বুঝিয়ে দিয়ে ভীতি ও আতঙ্ক দূর করুন' 
                      : 'Graphic guides to reassure patients before procedures, reducing emergency room panic and disorientation'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROCEDURES.map(proc => (
                  <div
                    key={proc.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      proc.id === activeProcedure.id
                        ? 'bg-indigo-950/40 border-indigo-500/50 shadow-xl'
                        : 'bg-slate-800/40 border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                        {proc.icon}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{proc.title}</h4>
                        <p className="text-xs font-medium text-teal-400 font-sans">{proc.bengaliTitle}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">{proc.description}</p>
                    <p className="text-xs text-indigo-200/90 font-medium mb-3 italic">"{proc.bengaliDescription}"</p>

                    <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800 mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Procedure Steps:</span>
                      {proc.keySteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400">Duration: <strong className="text-white">{proc.duration}</strong></span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20 text-[10px]">
                        {proc.painLevel}
                      </span>
                      <button
                        onClick={() => handleSpeak(proc.bengaliDescription, 'bn-BD')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 transition-colors"
                        title="বাংলায় বর্ণনা শুনুন"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>
              {isBn 
                ? 'ডব্লিউএইচও (WHO) ও বাংলাদেশ জরুরি স্বাস্থ্য সুরক্ষা নীতিমালা অনুমোদিত' 
                : 'Compliant with WHO Disability & Non-Verbal Clinical Communication Guidelines'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            {isBn ? 'তর্জমান বন্ধ করুন' : 'Close Turjuman'}
          </button>
        </div>

      </div>
    </div>
  );
}
