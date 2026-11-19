import React, { useState, useMemo } from 'react';
import { 
  Activity, ShieldAlert, Users, Server, Clock, 
  Bed, CheckCircle2, AlertTriangle, ArrowRight, Zap,
  BarChart3, Wifi, Database, RefreshCw, Cpu, UserPlus,
  X, Search, Droplet, Wind, HeartPulse, Gauge, BatteryCharging,
  Sliders, Shield, Siren, AlertCircle, Wrench, Check, Filter
} from 'lucide-react';
import { HospitalBed, AuditLogItem, INITIAL_AUDIT_LOGS } from '../../data/hospitalStore';
import { PatientRecord } from '../../data/patientsDatabase';
import GradientBlinds from '../reactbits/GradientBlinds';

interface MaintenancePortalProps {
  beds: HospitalBed[];
  patients: PatientRecord[];
  onAdmitPatientToBed: (bedId: string, patient: PatientRecord, diagnosis: string, oxygenMode: HospitalBed['oxygenMode']) => void;
  onDischargeBed: (bedId: string) => void;
  onNavigateToHub: () => void;
}

export interface HospitalEquipmentItem {
  id: string;
  name: string;
  category: 
    | 'Oxygen & Gas Pipelines'
    | 'Power & Diesel Gensets'
    | 'HVAC & Vacuum Pumps'
    | 'CSSD & Autoclaves'
    | 'Ventilators & Critical Care'
    | 'Dialysis & Surgical Plant'
    | 'Radiology & Biomedical Imaging';
  model: string;
  maker: string;
  location: string;
  status: 'Operational' | 'Standby' | 'Running Cycle' | 'Maintenance Due';
  primaryMetric: string;
  secondaryMetric: string;
  operatingHours: number;
  nextPpmDate: string;
}

const UNIFIED_MACHINERY_CATALOG: HospitalEquipmentItem[] = [
  // 1. Oxygen & Gas Pipelines
  {
    id: 'EQ-O2-01',
    name: 'Cryogenic Bulk LMO Tank (10,000L)',
    category: 'Oxygen & Gas Pipelines',
    model: 'Chart Cryo 10K High-Pressure Vacuum Insulated',
    maker: 'Chart Industries',
    location: 'Cryogenic Central Gas Yard (Rear Zone)',
    status: 'Operational',
    primaryMetric: '84.2% Bulk Tank Volume (8,420 Liters)',
    secondaryMetric: 'Pipeline Header Pressure: 4.2 bar (Safe 4.0 - 4.5)',
    operatingHours: 14820,
    nextPpmDate: '15 Dec 2026'
  },
  {
    id: 'EQ-O2-02',
    name: 'Vacuum Insulated Evaporator (VIE) Bank',
    category: 'Oxygen & Gas Pipelines',
    model: 'Air Liquide VIE-Dual Manifold 500Nm3/h',
    maker: 'Air Liquide Healthcare',
    location: 'Central Manifold Room 1',
    status: 'Operational',
    primaryMetric: '99.5% Medical Grade O2 Purity',
    secondaryMetric: 'Vaporizer Frost Level: Normal • Flow: 142 Nm3/h',
    operatingHours: 9240,
    nextPpmDate: '02 Jan 2027'
  },
  {
    id: 'EQ-O2-03',
    name: 'Medical Vacuum Pump Station (Triplex)',
    category: 'Oxygen & Gas Pipelines',
    model: 'Busch Mink MM 1202 AV Medical Vacuum',
    maker: 'Busch Vacuum Solutions',
    location: 'Basement Plant Room B-2',
    status: 'Operational',
    primaryMetric: '-0.85 bar Negative Vacuum Gauge',
    secondaryMetric: 'Pumps 1 & 2 Running • Pump 3 on Auto-Standby',
    operatingHours: 18450,
    nextPpmDate: '28 Nov 2026'
  },
  {
    id: 'EQ-O2-04',
    name: 'Medical Air Compressor Station (Duplex)',
    category: 'Oxygen & Gas Pipelines',
    model: 'Atlas Copco LFx Medical Oil-Free Scroll',
    maker: 'Atlas Copco',
    location: 'Basement Plant Room B-2',
    status: 'Operational',
    primaryMetric: '4.0 bar Delivery • Dewpoint -42°C',
    secondaryMetric: 'Air Quality: ISO 7396-1 Certified Pure Breathable',
    operatingHours: 11200,
    nextPpmDate: '10 Jan 2027'
  },

  // 2. Power & Diesel Gensets
  {
    id: 'EQ-PWR-01',
    name: 'Cummins 1500 kVA Backup Diesel Generator #1',
    category: 'Power & Diesel Gensets',
    model: 'Cummins QSK50-G4 Silent Enclosed Genset',
    maker: 'Cummins Power Generation',
    location: 'Exterior Generator Enclosure Gen-Bay 1',
    status: 'Standby',
    primaryMetric: '415V 3-Phase • 50 Hz • 1,500 kVA Ready',
    secondaryMetric: 'Base Tank Diesel: 3,240 Liters (88% Full)',
    operatingHours: 420,
    nextPpmDate: '05 Dec 2026'
  },
  {
    id: 'EQ-PWR-02',
    name: 'Perkins 1250 kVA Backup Diesel Generator #2',
    category: 'Power & Diesel Gensets',
    model: 'Perkins 4012-46TWG2A Industrial Diesel',
    maker: 'Perkins Engines Ltd',
    location: 'Exterior Generator Enclosure Gen-Bay 2',
    status: 'Standby',
    primaryMetric: '415V 3-Phase • 50 Hz • 1,250 kVA Ready',
    secondaryMetric: 'Base Tank Diesel: 2,850 Liters (85% Full)',
    operatingHours: 380,
    nextPpmDate: '18 Dec 2026'
  },
  {
    id: 'EQ-PWR-03',
    name: 'Hospital Automatic Transfer Switch (ATS)',
    category: 'Power & Diesel Gensets',
    model: 'Schneider Electric Masterpact MTZ ATS Dual-Line',
    maker: 'Schneider Electric',
    location: 'Main Substation Room S-1',
    status: 'Operational',
    primaryMetric: 'DESCO Grid Active • 0.38s Auto-Failover Ceiling',
    secondaryMetric: 'Harmonic Distortion: 1.8% THD • Power Factor: 0.98',
    operatingHours: 26200,
    nextPpmDate: '20 Jan 2027'
  },
  {
    id: 'EQ-PWR-04',
    name: 'Central Critical Care UPS Battery Bank',
    category: 'Power & Diesel Gensets',
    model: 'APC Symmetra PX 500kVA Modular UPS',
    maker: 'Schneider APC',
    location: 'UPS Battery Room U-1',
    status: 'Operational',
    primaryMetric: '100% Charged • 52 min Full ICU/OT Autonomy',
    secondaryMetric: 'VRLA Battery Health: 99.2% • Float Voltage: 540V',
    operatingHours: 19400,
    nextPpmDate: '12 Dec 2026'
  },

  // 3. HVAC & Vacuum Pumps
  {
    id: 'EQ-HVAC-01',
    name: 'Infectious Negative Pressure AHU-01',
    category: 'HVAC & Vacuum Pumps',
    model: 'Carrier WeatherMaker 39M Air Handling Unit',
    maker: 'Carrier Corporation',
    location: 'Isolation Ward 3 (Rooms 301-304)',
    status: 'Operational',
    primaryMetric: '-18.5 Pa Differential Negative Pressure',
    secondaryMetric: 'HEPA H14 Filtration (99.995%) • 18 Air Changes/hr',
    operatingHours: 15400,
    nextPpmDate: '08 Dec 2026'
  },
  {
    id: 'EQ-HVAC-02',
    name: 'Severe Airborne Pathogen Isolation AHU-02',
    category: 'HVAC & Vacuum Pumps',
    model: 'Daikin Modular Air Handler D-AHU Series',
    maker: 'Daikin Applied',
    location: 'Isolation Ward 4 (Negative Anteroom)',
    status: 'Operational',
    primaryMetric: '-22.0 Pa Differential Negative Pressure',
    secondaryMetric: 'UVGI Germicidal UV-C Core Active • 24 ACH',
    operatingHours: 12800,
    nextPpmDate: '14 Dec 2026'
  },
  {
    id: 'EQ-HVAC-03',
    name: 'Cardiac Surgical OT-1 Positive Laminar AHU',
    category: 'HVAC & Vacuum Pumps',
    model: 'Trox Laminar Clean Air Ceiling Diffuser Unit',
    maker: 'Trox GmbH',
    location: 'Main Surgical Complex Suite 1',
    status: 'Operational',
    primaryMetric: '+25.0 Pa Positive Pressure Sterile Seal',
    secondaryMetric: 'ISO Class 5 Ultra-Clean Airflow • Velocity: 0.38 m/s',
    operatingHours: 8900,
    nextPpmDate: '22 Dec 2026'
  },

  // 4. CSSD & Autoclaves
  {
    id: 'EQ-CSSD-01',
    name: 'Getinge Double-Door Steam Autoclave #1',
    category: 'CSSD & Autoclaves',
    model: 'Getinge GSS67H High-Capacity Steam Sterilizer',
    maker: 'Getinge AB',
    location: 'CSSD Sterile Processing Area (Clean Side)',
    status: 'Operational',
    primaryMetric: '134.0°C • 2.2 bar Saturated Steam Chamber',
    secondaryMetric: 'Cycle #4,412 Completed • Bowie-Dick Test: PASS',
    operatingHours: 7200,
    nextPpmDate: '10 Dec 2026'
  },
  {
    id: 'EQ-CSSD-02',
    name: 'Tuttnauer Steam Sterilizer #2',
    category: 'CSSD & Autoclaves',
    model: 'Tuttnauer 5596 Large Hospital Autoclave',
    maker: 'Tuttnauer Medical',
    location: 'CSSD Processing Room 2',
    status: 'Running Cycle',
    primaryMetric: 'Sterilization Phase: 134°C (18 min remaining)',
    secondaryMetric: 'Cycle #3,189 in Progress • Vacuum Pulsing 3/3',
    operatingHours: 5400,
    nextPpmDate: '27 Dec 2026'
  },
  {
    id: 'EQ-CSSD-03',
    name: 'Sterrad 100NX Hydrogen Peroxide Plasma Sterilizer',
    category: 'CSSD & Autoclaves',
    model: 'Sterrad 100NX with ALLClear Technology',
    maker: 'Advanced Sterilization Products (ASP)',
    location: 'CSSD Endoscopic & Optical Sterilizing Bay',
    status: 'Operational',
    primaryMetric: 'Low-Temp H2O2 Vapor Plasma (45°C - 50°C)',
    secondaryMetric: 'Vapor Cassette: 82% Remaining • Standard Cycle: Ready',
    operatingHours: 4100,
    nextPpmDate: '04 Jan 2027'
  },
  {
    id: 'EQ-CSSD-04',
    name: 'Getinge Automated Washer-Disinfector',
    category: 'CSSD & Autoclaves',
    model: 'Getinge 8668 Multi-Chamber Instrument Washer',
    maker: 'Getinge AB',
    location: 'CSSD Decontamination Wash Bay (Dirty Side)',
    status: 'Operational',
    primaryMetric: 'Thermal Disinfection A0: 3,000 (93°C for 10 min)',
    secondaryMetric: 'Ultrasonic Cavitation & Alkaline Wash Active',
    operatingHours: 6150,
    nextPpmDate: '15 Jan 2027'
  },

  // 5. Life Support Ventilators & Infusion
  {
    id: 'EQ-VENT-01',
    name: 'Hamilton-G5 Intelligent ICU Ventilator',
    category: 'Ventilators & Critical Care',
    model: 'Hamilton-G5 High-End Mechanical Ventilator',
    maker: 'Hamilton Medical',
    location: 'Intensive Care Unit (ICU-02)',
    status: 'Operational',
    primaryMetric: 'ASV Closed-Loop • Tidal Vol: 460 mL • PEEP: 8',
    secondaryMetric: 'FiO2: 45% • Peak Pressure: 22 cmH2O • EtCO2: 36',
    operatingHours: 6800,
    nextPpmDate: '11 Dec 2026'
  },
  {
    id: 'EQ-VENT-02',
    name: 'Maquet Servo-u Advanced Adult Ventilator',
    category: 'Ventilators & Critical Care',
    model: 'Getinge Maquet Servo-u with NAVA Module',
    maker: 'Maquet Critical Care',
    location: 'Coronary Care Unit (CCU-01)',
    status: 'Operational',
    primaryMetric: 'NAVA Diaphragmatic Trigger • Edi Peak: 14 μV',
    secondaryMetric: 'FiO2: 40% • RR: 16 bpm • O2 Sensor: Calibrated',
    operatingHours: 5200,
    nextPpmDate: '19 Dec 2026'
  },
  {
    id: 'EQ-VENT-03',
    name: 'Draeger Babylog VN500 Neonatal Ventilator',
    category: 'Ventilators & Critical Care',
    model: 'Draeger Babylog VN500 High-Frequency Oscillator',
    maker: 'Draeger Medical',
    location: 'Neonatal ICU (NICU-04)',
    status: 'Operational',
    primaryMetric: 'High-Frequency Oscillation (10 Hz) • Mean Paw: 12',
    secondaryMetric: 'VG Active • Tidal Vol: 4.2 mL • Safe Neonatal Limits',
    operatingHours: 4900,
    nextPpmDate: '26 Dec 2026'
  },
  {
    id: 'EQ-VENT-04',
    name: 'B. Braun Perfusor Space Syringe Infusion Bank (12-ch)',
    category: 'Ventilators & Critical Care',
    model: 'B. Braun Space Infusion Station with DoseGuard',
    maker: 'B. Braun Melsungen AG',
    location: 'Intensive Care Unit (ICU-01)',
    status: 'Operational',
    primaryMetric: '12 Channels Online • Infusing Norepinephrine 0.08 mcg/kg',
    secondaryMetric: 'Dose Error Reduction System (DERS): Active & Guarded',
    operatingHours: 8100,
    nextPpmDate: '30 Dec 2026'
  },
  {
    id: 'EQ-VENT-05',
    name: 'Philips HeartStart XL+ Biphasic Defibrillator',
    category: 'Ventilators & Critical Care',
    model: 'Philips HeartStart XL+ Monitor / Defibrillator',
    maker: 'Philips Healthcare',
    location: 'Emergency Resuscitation Crash Cart 1',
    status: 'Operational',
    primaryMetric: '200J SMART Biphasic • Daily 30J Auto-Test: PASS',
    secondaryMetric: 'Pacing Ready • Battery Capacity: 100% • SpO2 Linked',
    operatingHours: 2400,
    nextPpmDate: '06 Jan 2027'
  },

  // 6. Dialysis & Surgical Plant
  {
    id: 'EQ-DIA-01',
    name: 'Fresenius 5008S CorDiax Hemodialysis Console #1',
    category: 'Dialysis & Surgical Plant',
    model: 'Fresenius 5008S High-Volume Hemodiafiltration',
    maker: 'Fresenius Medical Care',
    location: 'Hemodialysis Unit (Bed D-1)',
    status: 'Running Cycle',
    primaryMetric: 'Blood Pump Flow: 480 mL/min • Kt/V Index: 1.44',
    secondaryMetric: 'Online HDF Substitution Vol: 22.4 Liters • TMP: 120',
    operatingHours: 8900,
    nextPpmDate: '15 Dec 2026'
  },
  {
    id: 'EQ-DIA-02',
    name: 'Central Reverse Osmosis (RO) Medical Water Plant',
    category: 'Dialysis & Surgical Plant',
    model: 'DWA ultraPURE Dual-Pass RO Water Treatment',
    maker: 'DWA Water Treatment',
    location: 'Dialysis Water Plant Room W-1',
    status: 'Operational',
    primaryMetric: 'Conductivity: 0.048 μS/cm (AAMI Standards < 10)',
    secondaryMetric: 'Endotoxin Level: < 0.03 EU/mL • Permeate Flow: 1,800 L/h',
    operatingHours: 14200,
    nextPpmDate: '02 Dec 2026'
  },
  {
    id: 'EQ-DIA-03',
    name: 'GE Carestation 650 Anesthesia Workstation',
    category: 'Dialysis & Surgical Plant',
    model: 'GE Healthcare Carestation 650 with Sevotec 7',
    maker: 'GE Healthcare',
    location: 'Main Operating Theater OT-2',
    status: 'Operational',
    primaryMetric: 'Sevoflurane Vaporizer: Calibrated • Circle Absorber: Fresh',
    secondaryMetric: 'Pipeline O2/N2O/Air Pressure: 4.1 bar • Leak Check: PASS',
    operatingHours: 6200,
    nextPpmDate: '23 Dec 2026'
  },

  // 7. Radiology & Biomedical Imaging
  {
    id: 'EQ-RAD-01',
    name: 'Siemens SOMATOM Force 128-Slice Dual Source CT',
    category: 'Radiology & Biomedical Imaging',
    model: 'SOMATOM Force Dual-Source 2x192 Slice Ultra CT',
    maker: 'Siemens Healthineers',
    location: 'Radiology & Advanced Imaging Bay CT-1',
    status: 'Operational',
    primaryMetric: 'Vectron X-Ray Tube Temp: 46°C (Safe < 75°C)',
    secondaryMetric: 'Detector Temp: 38.2°C • Rotation Speed: 0.25s • Ready',
    operatingHours: 7800,
    nextPpmDate: '17 Dec 2026'
  },
  {
    id: 'EQ-RAD-02',
    name: 'GE SIGNA Premier 3.0T Superconducting MRI',
    category: 'Radiology & Biomedical Imaging',
    model: 'SIGNA Premier 70cm Bore 3.0 Tesla Clinical MRI',
    maker: 'GE Healthcare',
    location: 'MRI Suite Room M-1 (RF Shielded Cage)',
    status: 'Operational',
    primaryMetric: 'Liquid Helium Level: 88.6% • Coldhead Temp: 4.18 K',
    secondaryMetric: 'Superconducting Magnet Field: 3.002 Tesla • Chiller: Normal',
    operatingHours: 11400,
    nextPpmDate: '29 Dec 2026'
  },
  {
    id: 'EQ-RAD-03',
    name: 'Philips Azurion 7 Biplane Cardiac Cath Lab C-Arm',
    category: 'Radiology & Biomedical Imaging',
    model: 'Philips Azurion 7 B20/15 Interventional Suite',
    maker: 'Philips Healthcare',
    location: 'Cardiac Catheterization Suite Room 1',
    status: 'Operational',
    primaryMetric: 'Anode Heat Capacity: 22% • Image Chain: Calibrated',
    secondaryMetric: 'Radiation Dose Index Monitoring (RDIM): DGHS Logged',
    operatingHours: 5900,
    nextPpmDate: '09 Jan 2027'
  }
];

export function MaintenancePortal({
  beds,
  patients,
  onAdmitPatientToBed,
  onDischargeBed,
  onNavigateToHub
}: MaintenancePortalProps) {
  const [activeTab, setActiveTab] = useState<'beds' | 'machinery' | 'codes'>('beds');
  
  // Bed Matrix Filter
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [activeBedModal, setActiveBedModal] = useState<HospitalBed | null>(null);

  // Machinery & Equipment Search and Filter
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [equipmentList, setEquipmentList] = useState<HospitalEquipmentItem[]>(UNIFIED_MACHINERY_CATALOG);
  const [testedEquipmentId, setTestedEquipmentId] = useState<string | null>(null);

  // Admission modal form
  const [selectedPatientMrin, setSelectedPatientMrin] = useState(patients[0]?.mrin || '');
  const [admitDiagnosis, setAdmitDiagnosis] = useState('Severe HTN with Acute Cardiac Syndrome');
  const [selectedOxygenMode, setSelectedOxygenMode] = useState<HospitalBed['oxygenMode']>('High-flow Nasal');

  // Emergency Codes state
  const [activeCodeAlert, setActiveCodeAlert] = useState<string | null>(null);

  const wards = ['All', 'ICU', 'CCU', 'HDU', 'General Ward (Male)', 'General Ward (Female)', 'Post-Op'];

  const filteredBeds = useMemo(() => {
    if (selectedWard === 'All') return beds;
    return beds.filter(b => b.wardName === selectedWard);
  }, [beds, selectedWard]);

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  // Filtered Machinery Catalog
  const categories = [
    'All',
    'Oxygen & Gas Pipelines',
    'Power & Diesel Gensets',
    'HVAC & Vacuum Pumps',
    'CSSD & Autoclaves',
    'Ventilators & Critical Care',
    'Dialysis & Surgical Plant',
    'Radiology & Biomedical Imaging'
  ];

  const filteredEquipment = useMemo(() => {
    return equipmentList.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const q = equipmentSearch.toLowerCase();
      const matchQuery = 
        item.name.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.maker.toLowerCase().includes(q) ||
        item.primaryMetric.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [equipmentList, selectedCategory, equipmentSearch]);

  const handleRunSelfTest = (id: string) => {
    setTestedEquipmentId(id);
    setTimeout(() => {
      setTestedEquipmentId(null);
      alert(`✓ Diagnostics Passed: Self-test and sensor calibration completed for ${id}. Telemetry nominal.`);
    }, 1500);
  };

  const handleConfirmAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBedModal) return;
    const targetPatient = patients.find(p => p.mrin === selectedPatientMrin) || patients[0];
    onAdmitPatientToBed(activeBedModal.id, targetPatient, admitDiagnosis, selectedOxygenMode);
    setActiveBedModal(null);
  };

  const handleConfirmDischarge = () => {
    if (!activeBedModal) return;
    onDischargeBed(activeBedModal.id);
    setActiveBedModal(null);
  };

  const handleTriggerCode = (code: string) => {
    setActiveCodeAlert(`🚨 HOSPITAL-WIDE ${code} BROADCAST ACTIVATED! Rapid response team dispatched to zone.`);
    setTimeout(() => {
      setActiveCodeAlert(null);
    }, 7000);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8 pb-24 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      {/* Background React Bits: GradientBlinds */}
      <div className="fixed inset-0 pointer-events-none opacity-25 z-0">
        <GradientBlinds gradientColors={['#f59e0b', '#0d9488']} angle={15} blindCount={14} glow={0.3} />
      </div>
      <div className="relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 shadow-lg">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                App 6 • Command Telemetry
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Live Ward Matrix, Engineering Machinery &amp; Biomedical Plant
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Real-time telemetry for hospital ward bed occupancy, cryogenic bulk LMO oxygen tanks, backup diesel generators, HVAC negative pressure isolation, CSSD autoclaves, ICU ventilators, dialysis water plants, and emergency code alarms.
          </p>
        </div>

        <button
          onClick={onNavigateToHub}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-teal-300 font-bold text-xs flex items-center gap-2 self-start md:self-auto transition"
        >
          <span>Hub 8 Master Registry</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Code Alert Notification */}
      {activeCodeAlert && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-rose-200 text-xs font-black flex items-center gap-3 animate-pulse shadow-2xl">
          <Siren className="w-6 h-6 text-rose-400 shrink-0" />
          <span className="text-sm">{activeCodeAlert}</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        <button
          onClick={() => setActiveTab('beds')}
          className={`px-5 py-3 rounded-2xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
            activeTab === 'beds'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>1. Live Ward &amp; Bed Matrix ({occupancyRate}% Occupied)</span>
        </button>

        <button
          onClick={() => setActiveTab('machinery')}
          className={`px-5 py-3 rounded-2xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
            activeTab === 'machinery'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>2. Machinery, Generators, Pumps &amp; Biomedical Plant ({UNIFIED_MACHINERY_CATALOG.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('codes')}
          className={`px-5 py-3 rounded-2xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
            activeTab === 'codes'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Siren className="w-4 h-4 text-rose-400" />
          <span>3. Hospital Emergency Codes (Blue / Red / Amber)</span>
        </button>
      </div>

      {/* TAB 1: LIVE WARD & BED OCCUPANCY MATRIX */}
      {activeTab === 'beds' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Bed Fleet</span>
              <div className="text-3xl font-black text-white mt-1">{totalBeds} Units</div>
              <span className="text-xs text-slate-500 mt-1 block">Full Inpatient Capacity</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Vacant &amp; Sanitized</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">{availableBeds} Units</div>
              <span className="text-xs text-slate-500 mt-1 block">Immediate Admission Ready</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Occupied Beds</span>
              <div className="text-3xl font-black text-amber-400 mt-1">{occupiedBeds} Units</div>
              <span className="text-xs text-slate-500 mt-1 block">Active Inpatient Care</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Occupancy Rate</span>
              <div className="text-3xl font-black text-sky-400 mt-1">{occupancyRate}%</div>
              <span className="text-xs text-slate-500 mt-1 block">Within Safe Operating Ceiling</span>
            </div>
          </div>

          {/* Ward Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {wards.map(ward => (
              <button
                key={ward}
                onClick={() => setSelectedWard(ward)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedWard === ward
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {ward}
              </button>
            ))}
          </div>

          {/* Bed Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBeds.map(bed => {
              const isOccupied = bed.status === 'occupied';
              return (
                <div
                  key={bed.id}
                  onClick={() => setActiveBedModal(bed)}
                  className={`p-5 rounded-3xl cursor-pointer transition border text-left relative overflow-hidden group hover:scale-[1.02] ${
                    isOccupied 
                      ? 'bg-gradient-to-br from-slate-900 to-amber-950/40 border-amber-500/40' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xl font-black text-white">{bed.bedNumber}</span>
                      <span className="text-xs text-slate-400 block font-semibold">{bed.wardName}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      isOccupied ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isOccupied ? 'Occupied' : 'Vacant (Ready)'}
                    </span>
                  </div>

                  {isOccupied ? (
                    <div className="space-y-1.5 text-xs">
                      <div className="font-extrabold text-white truncate">{bed.patientName}</div>
                      <div className="font-mono text-[10px] text-amber-300">{bed.patientMrin}</div>
                      <div className="text-[11px] text-slate-400 truncate">{bed.diagnosis}</div>
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800 text-[10px] text-teal-400 font-bold">
                        <Wind className="w-3 h-3" />
                        <span>O2: {bed.oxygenMode}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 text-emerald-400/90 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Sanitized &amp; Terminal Cleaned</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-2">Click to admit inpatient</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: UNIFIED HOSPITAL MACHINERY, PUMPS, DIESEL GENSETS & BIOMEDICAL PLANT */}
      {activeTab === 'machinery' && (
        <div className="space-y-6">
          {/* Search Bar & Category Filter */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={equipmentSearch}
                  onChange={e => setEquipmentSearch(e.target.value)}
                  placeholder="Search machinery, bulk LMO, diesel genset, vacuum pump, autoclave, ventilator, dialysis..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
              <span className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono font-bold text-amber-400 shrink-0 flex items-center justify-center">
                {filteredEquipment.length} Machines Online
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Machinery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEquipment.map(item => {
              const isTesting = testedEquipmentId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-4 relative overflow-hidden group shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                        {item.category}
                      </span>
                      <h3 className="text-base font-black text-white mt-0.5">{item.name}</h3>
                      <span className="text-[11px] text-slate-400 block">{item.maker} • {item.model}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase shrink-0 ${
                      item.status === 'Operational'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.status === 'Running Cycle'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Primary Telemetry Readout */}
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-1">
                    <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.primaryMetric}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.secondaryMetric}
                    </div>
                  </div>

                  {/* Metadata strip */}
                  <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800/60">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-bold text-slate-300">{item.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Operating Hours:</span>
                      <span className="font-mono text-slate-300">{item.operatingHours.toLocaleString()} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Next Scheduled PPM:</span>
                      <span className="text-teal-400 font-bold">{item.nextPpmDate}</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => handleRunSelfTest(item.id)}
                    disabled={isTesting}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
                    <span>{isTesting ? 'Executing Calibration & Sensor Sweep...' : 'Run Self-Diagnostic Test'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: EMERGENCY HOSPITAL CODE ACTIVATOR */}
      {activeTab === 'codes' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl max-w-3xl space-y-6">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Siren className="w-5 h-5 text-rose-500" />
              <span>Hospital Emergency Code Command Center</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Trigger instant, hospital-wide audio-visual alarms and broadcast emergency response protocols across all ward consoles and clinical pagers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleTriggerCode('CODE BLUE (Cardiac Arrest)')}
              className="p-5 rounded-2xl bg-gradient-to-br from-blue-950 to-blue-900 border-2 border-blue-500 hover:border-blue-400 text-left transition shadow-lg space-y-2 group"
            >
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 w-fit">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="font-black text-base text-white">CODE BLUE</div>
              <div className="text-[11px] text-blue-200">
                Adult / Pediatric Cardiac or Respiratory Arrest. Dispatches Crash Cart &amp; Anesthesia team.
              </div>
            </button>

            <button
              onClick={() => handleTriggerCode('CODE RED (Fire / Smoke Alarm)')}
              className="p-5 rounded-2xl bg-gradient-to-br from-rose-950 to-rose-900 border-2 border-rose-500 hover:border-rose-400 text-left transition shadow-lg space-y-2 group"
            >
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 w-fit">
                <Siren className="w-6 h-6" />
              </div>
              <div className="font-black text-base text-white">CODE RED</div>
              <div className="text-[11px] text-rose-200">
                Fire, smoke or thermal hazard. Seals fire dampers, HVAC shutdown and safety evacuation.
              </div>
            </button>

            <button
              onClick={() => handleTriggerCode('CODE AMBER (Mass Casualty / External Disaster)')}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-950 to-amber-900 border-2 border-amber-500 hover:border-amber-400 text-left transition shadow-lg space-y-2 group"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 w-fit">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="font-black text-base text-white">CODE AMBER</div>
              <div className="text-[11px] text-amber-200">
                Mass casualty influx or disaster triage. Unlocks emergency reserve beds and trauma bays.
              </div>
            </button>
          </div>
        </div>
      )}

      {/* BED ADMISSION / DISCHARGE MODAL */}
      {activeBedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-lg w-full text-slate-100 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">{activeBedModal.wardName}</span>
                <h3 className="text-2xl font-black text-white">Bed {activeBedModal.bedNumber}</h3>
              </div>
              <button
                onClick={() => setActiveBedModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeBedModal.status === 'occupied' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Current Inpatient</span>
                  <div className="text-base font-extrabold text-white">{activeBedModal.patientName}</div>
                  <div className="text-xs font-mono text-slate-300">{activeBedModal.patientMrin}</div>
                  {activeBedModal.diagnosis && (
                    <div className="text-xs text-amber-200 mt-2">Diagnosis: {activeBedModal.diagnosis}</div>
                  )}
                  <div className="text-xs text-slate-400">Oxygen Mode: {activeBedModal.oxygenMode}</div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmDischarge}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition"
                >
                  ✓ Discharge Patient &amp; Mark Bed Vacant (Sanitized)
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmAdmission} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Select Patient to Admit</label>
                  <select
                    value={selectedPatientMrin}
                    onChange={e => setSelectedPatientMrin(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none font-bold"
                  >
                    {patients.map(p => (
                      <option key={p.mrin} value={p.mrin}>
                        {p.fullName} ({p.mrin}) • {p.age}y {p.gender}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Admission Diagnosis</label>
                  <input
                    type="text"
                    value={admitDiagnosis}
                    onChange={e => setAdmitDiagnosis(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none"
                    placeholder="e.g. Acute STEMI, Severe Dengue with Shock"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Assigned Oxygen Mode</label>
                  <select
                    value={selectedOxygenMode}
                    onChange={e => setSelectedOxygenMode(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none font-semibold"
                  >
                    <option value="Room Air">Room Air</option>
                    <option value="Nasal Cannula">Nasal Cannula (2-4 L/min)</option>
                    <option value="High-flow Nasal">High-flow Nasal Cannula (HFNC)</option>
                    <option value="BiPAP / CPAP">BiPAP / CPAP Non-Invasive</option>
                    <option value="Mechanical Ventilator">Mechanical Ventilator (Invasive)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveBedModal(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow transition"
                  >
                    Confirm Inpatient Admission
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
