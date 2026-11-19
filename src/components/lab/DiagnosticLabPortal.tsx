import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  FlaskConical, Search, CheckCircle2, ShieldAlert, ArrowRight, 
  Clock, Plus, Filter, AlertTriangle, FileText, UploadCloud,
  ChevronRight, Sparkles, Building2, BarChart3, QrCode,
  Droplet, Phone, Activity, Eye, Sliders, Check, RefreshCw, AlertCircle,
  Cpu, Terminal, Radio
} from 'lucide-react';
import { DIAGNOSTIC_TEST_CATALOG, DiagnosticTestItem, searchDiagnosticTests } from '../../data/diagnosticTestDatabase';
import { 
  LabOrderItem, INITIAL_LAB_ORDERS, 
  LeveyJenningsQCRun, CriticalPanicCallLog, BloodBankUnit,
  INITIAL_LEVEY_JENNINGS, INITIAL_PANIC_CALLS, INITIAL_BLOOD_BANK
} from '../../data/hospitalStore';
import { PatientRecord } from '../../data/patientsDatabase';
import { SersRamanCanvas } from './SersRamanCanvas';
import DarkVeil from '../reactbits/DarkVeil';

interface DiagnosticLabPortalProps {
  labOrders: LabOrderItem[];
  onUpdateOrderStatus: (orderId: string, status: LabOrderItem['status'], results?: any, isPanic?: boolean) => void;
  onOrderNewTest: (test: DiagnosticTestItem, patientMrin: string) => void;
  patients: PatientRecord[];
  onNavigateToDoctor: () => void;
}

export function DiagnosticLabPortal({
  labOrders,
  onUpdateOrderStatus,
  onOrderNewTest,
  patients,
  onNavigateToDoctor
}: DiagnosticLabPortalProps) {
  // Navigation tabs within Diagnostic Lab
  const [activeTab, setActiveTab] = useState<'worklist' | 'qc' | 'panic' | 'tubes' | 'bloodbank' | 'pacs' | 'liquid_biopsy_genomics'>('worklist');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  
  // Active selected order for entry
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    labOrders[0]?.orderId || ''
  );
  const activeOrder = labOrders.find(o => o.orderId === selectedOrderId) || labOrders[0];
  const [panicSelectedOrderId, setPanicSelectedOrderId] = useState<string>(labOrders[0]?.orderId || '');
  const panicTargetOrder = labOrders.find(o => o.orderId === panicSelectedOrderId) || activeOrder || labOrders[0];

  // Manual result entry state
  const [resultParam1, setResultParam1] = useState('7.6');
  const [resultParam2, setResultParam2] = useState('175');
  const [isCriticalDetected, setIsCriticalDetected] = useState(false);

  // New test ordering modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPatientMrin, setSelectedPatientMrin] = useState(patients[0]?.mrin || '');
  const [testToOrder, setTestToOrder] = useState<DiagnosticTestItem | null>(null);

  // Quality Control Runs State
  const [qcRuns, setQcRuns] = useState<LeveyJenningsQCRun[]>(INITIAL_LEVEY_JENNINGS);

  // Critical Panic Call Log State
  const [panicLogs, setPanicLogs] = useState<CriticalPanicCallLog[]>(INITIAL_PANIC_CALLS);
  const [newNurseName, setNewNurseName] = useState('Sr. Staff Nurse Farzana (Ward 3)');
  const [newReadBackConfirmed, setNewReadBackConfirmed] = useState(true);

  // Blood Bank Inventory State
  const [bloodBank, setBloodBank] = useState<BloodBankUnit[]>(INITIAL_BLOOD_BANK);

  // Radiology PACS Viewer Mockup State
  const [pacsModality, setPacsModality] = useState<'Chest X-Ray (Digital)' | '3T Cardiac MRI' | '128-Slice CT Thorax'>('Chest X-Ray (Digital)');
  const [pacsBrightness, setPacsBrightness] = useState(100);
  const [pacsContrast, setPacsContrast] = useState(110);
  const [pacsInvert, setPacsInvert] = useState(false);
  const [pacsReportNotes, setPacsReportNotes] = useState('Normal cardiothoracic ratio (CTR < 0.50). Lung fields clear bilaterally. No pleural effusion or pneumothorax.');

  const departments = ['All', 'Biochemistry', 'Hematology', 'Microbiology', 'Radiology', 'Cardiology', 'Gastroenterology'];

  const filteredCatalog = searchDiagnosticTests(searchQuery).filter(t => 
    selectedDepartment === 'All' || t.department === selectedDepartment
  );

  // Hardware Auto-Analyzer Telemetry State
  const [isHardwareRunning, setIsHardwareRunning] = useState(false);
  const [hardwareProgress, setHardwareProgress] = useState(0);
  const [hardwareTelemetryLogs, setHardwareTelemetryLogs] = useState<string[]>([
    '>> ESP32 / Arduino Diagnostic Bus: COM4 Ready @ 115200 Baud',
    '>> Instruments: Sysmex XN-550 (Hematology) & Cobas 6000 (Biochemistry) Standby'
  ]);

  const handleRunHardwareAnalyzer = () => {
    setIsHardwareRunning(true);
    setHardwareProgress(20);
    setHardwareTelemetryLogs([
      '>> [HARDWARE BRIDGE] ESP32 COM4 Handshake Initialized @ 115200 Baud',
      `>> [ASTM-1394] Specimen Aspirated: Tube Barcode #${activeOrder?.orderId || 'BAR-90214'}`,
      '>> [Sysmex XN-550] Reagent Chamber Lyse Pressurized (0.24 MPa)...'
    ]);

    setTimeout(() => {
      setHardwareProgress(55);
      setHardwareTelemetryLogs(prev => [
        ...prev,
        '>> [FLOW CYTOMETRY] Semiconductor Laser (633nm) Forward Scatter active',
        '>> [DETECTION] Granularity / Lobularity (SSC) & DNA/RNA Fluorescence (SFL)'
      ]);
    }, 800);

    setTimeout(() => {
      setHardwareProgress(85);
      setHardwareTelemetryLogs(prev => [
        ...prev,
        '>> [COBAS 6000] Spectrophotometric Photometer: Absorbance delta calculated',
        '>> [HL7 PARSER] Mapping parameters to LOINC clinical taxonomy...'
      ]);
    }, 1600);

    setTimeout(() => {
      setHardwareProgress(100);
      setIsHardwareRunning(false);
      setHardwareTelemetryLogs(prev => [
        ...prev,
        '✓ [TRANSMISSION SUCCESS] All 18 Quantitative Parameters Ingested from Machine!'
      ]);

      if (activeOrder?.testName?.toLowerCase().includes('cbc') || activeOrder?.testName?.toLowerCase().includes('blood') || activeOrder?.testName?.toLowerCase().includes('hemoglobin')) {
        setResultParam1('13.8 g/dL (Hb)');
        setResultParam2('240,000 /uL (Platelets)');
      } else if (activeOrder?.testName?.toLowerCase().includes('lipid') || activeOrder?.testName?.toLowerCase().includes('cholesterol')) {
        setResultParam1('178 mg/dL (Total Chol)');
        setResultParam2('112 mg/dL (LDL)');
      } else if (activeOrder?.testName?.toLowerCase().includes('sugar') || activeOrder?.testName?.toLowerCase().includes('glucose') || activeOrder?.testName?.toLowerCase().includes('hba1c')) {
        setResultParam1('5.8 mmol/L (FBS)');
        setResultParam2('6.2% (HbA1c)');
      } else {
        setResultParam1('1.1 mg/dL (Normal)');
        setResultParam2('28 U/L (SGPT)');
      }
    }, 2400);
  };

  const handleVerifyResults = () => {
    if (!activeOrder) return;

    const results = [
      { parameter: 'Primary Value', value: resultParam1, unit: 'mg/dL / %', normalRange: 'Normal', isFlagged: isCriticalDetected },
      { parameter: 'Secondary Index', value: resultParam2, unit: 'U/L', normalRange: 'Standard', isFlagged: false },
      { parameter: 'Hardware Telemetry Source', value: 'Sysmex XN-550 / Roche Cobas Auto-Analyzer via ESP32 COM4', unit: 'ASTM-1394', normalRange: 'Verified', isFlagged: false }
    ];

    onUpdateOrderStatus(activeOrder.orderId, 'verified', results, isCriticalDetected);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    alert(`✓ Verified and Published Results for Order ${activeOrder.orderId} (${activeOrder.testName})!\nReport has been automatically transmitted to both Doctor Chamber and Patient Portal.`);
  };

  const handleLogPanicCall = (e: React.FormEvent) => {
    e.preventDefault();
    const target = panicTargetOrder || activeOrder;
    if (!target) return;
    const newLog: CriticalPanicCallLog = {
      id: `pan-${Date.now().toString().slice(-4)}`,
      orderId: target.orderId,
      patientMrin: target.patientMrin,
      patientName: target.patientName,
      testName: target.testName,
      panicValue: `${resultParam1} (HIGH ALERT)`,
      criticalThreshold: 'Laboratory Panic Limit Exceeded',
      notifiedStaff: newNurseName,
      wardLocation: 'Immediate Ward Bedside',
      readBackConfirmed: newReadBackConfirmed,
      notifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dispatcherStaff: 'Dr. Kamrul (LIS Lab In-Charge)'
    };
    setPanicLogs(prev => [newLog, ...prev]);
    alert(`✓ Critical Panic telephone call logged with verbal read-back verification for ${target.patientName} (${target.patientMrin}).`);
  };

  return (
    <div className="min-h-screen bg-[#F6F5FB] text-slate-800 p-4 md:p-8 transition-colors relative overflow-hidden">
      {/* Background React Bits: DarkVeil */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <DarkVeil color="#8B75D7" speed={0.4} />
      </div>
      <div className="relative z-10">
        {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-200/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#34466F] text-white">
                App 4 • LIS &amp; RIS Modalities
              </span>
              <span className="text-xs font-semibold text-[#8B75D7]">
                Vitality Diagnostic Network
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#34466F]">
              Diagnostic Laboratory &amp; Imaging Operations
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Full LIS/RIS suite: Sample barcode tracking, Levey-Jennings QC, panic telephone read-backs, phlebotomy tube guides, blood bank, and radiology PACS viewer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="px-4 py-2.5 bg-[#8B75D7] hover:bg-[#7a64c4] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Order Diagnostic Test</span>
            </button>
            <button
              onClick={onNavigateToDoctor}
              className="px-4 py-2.5 bg-[#34466F] hover:bg-[#283758] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <span>Back to Doctor Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Modular Sub-Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 border-b border-indigo-200/60">
          <button
            onClick={() => setActiveTab('worklist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'worklist'
                ? 'bg-[#34466F] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-[#8B75D7]" />
            <span>1. LIS Worklist &amp; Barcode Pipeline ({labOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('qc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'qc'
                ? 'bg-[#34466F] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>2. Levey-Jennings QC &amp; Westgard ({qcRuns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('panic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'panic'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <Phone className="w-4 h-4 text-rose-600" />
            <span>3. Critical Panic Telephone Log ({panicLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tubes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'tubes'
                ? 'bg-[#34466F] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Droplet className="w-4 h-4 text-purple-600" />
            <span>4. Phlebotomy Tube Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('bloodbank')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'bloodbank'
                ? 'bg-[#34466F] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-rose-600" />
            <span>5. Blood Bank &amp; Crossmatch</span>
          </button>

          <button
            onClick={() => setActiveTab('pacs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'pacs'
                ? 'bg-[#101F32] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Eye className="w-4 h-4 text-cyan-500" />
            <span>6. Radiology PACS / DICOM Viewer</span>
          </button>

          <button
            onClick={() => setActiveTab('liquid_biopsy_genomics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'liquid_biopsy_genomics'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md ring-1 ring-purple-400'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>7. 🔬 Nano-CTC Liquid Biopsy &amp; SERS</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ======================================================== */}
        {/* TAB 1: LIS WORKLIST & BARCODE PIPELINE                   */}
        {/* ======================================================== */}
        {activeTab === 'worklist' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 5 Columns: Active Orders List */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold text-[#34466F]">Active Laboratory Worklist</h2>
                <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {labOrders.length} Orders Pending
                </span>
              </div>

              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {labOrders.map(order => {
                  const isSelected = order.orderId === selectedOrderId;
                  return (
                    <div
                      key={order.orderId}
                      onClick={() => setSelectedOrderId(order.orderId)}
                      className={`p-4 rounded-2xl cursor-pointer transition border text-left ${
                        isSelected 
                          ? 'bg-[#34466F] text-white shadow-md border-[#34466F]' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {order.orderId}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : order.priority === 'urgent'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="font-extrabold text-sm">{order.testName}</div>
                      <div className={`text-xs font-mono mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {order.patientName} • {order.patientMrin}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/40 text-[11px]">
                        <span className={isSelected ? 'text-indigo-100' : 'text-slate-500'}>{order.department}</span>
                        <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>৳{order.priceBDT} BDT</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 7 Columns: Order Processing Cockpit */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-indigo-100">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#8B75D7] bg-indigo-50 px-2 py-0.5 rounded">
                      {activeOrder?.orderId}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{activeOrder?.department}</span>
                  </div>
                  <h2 className="text-xl font-black text-[#34466F]">{activeOrder?.testName}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Patient: <strong className="text-slate-800">{activeOrder?.patientName}</strong> ({activeOrder?.patientMrin}) • Ordered by {activeOrder?.doctorName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#34466F]">৳{activeOrder?.priceBDT} BDT</span>
                  <span className="text-[10px] text-slate-400 block">Billed Tariff</span>
                </div>
              </div>

              {/* Sample Barcode Lifecycle (Clickable Interactive Buttons) */}
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Interactive Specimen Barcode Pipeline (Click step to advance)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {(['ordered', 'sample_collected', 'processing', 'verified'] as const).map((st, idx) => {
                    const isDone = activeOrder?.status === st || (
                      st === 'ordered' || 
                      (st === 'sample_collected' && (activeOrder?.status === 'processing' || activeOrder?.status === 'verified')) ||
                      (st === 'processing' && activeOrder?.status === 'verified')
                    );
                    return (
                      <button
                        type="button"
                        key={st}
                        onClick={() => {
                          if (activeOrder) {
                            onUpdateOrderStatus(activeOrder.orderId, st);
                          }
                        }}
                        className={`p-2.5 rounded-xl text-center text-xs font-bold transition border ${
                          isDone 
                            ? 'bg-[#34466F] text-white border-[#34466F] shadow-sm' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-indigo-300">Stage {idx + 1}</div>
                        <div className="text-xs capitalize mt-0.5">{st.replace('_', ' ')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hardware Auto-Analyzer (ESP32/Arduino Serial Telemetry Bridge) */}
              <div className="mb-6 p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-sky-400" />
                    <div>
                      <h4 className="text-xs font-black text-white">Automated Lab Hardware Analyzer Interface</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Sysmex XN-550 / Roche Cobas via ESP32 COM4</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRunHardwareAnalyzer}
                    disabled={isHardwareRunning}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
                  >
                    <Radio className={`w-3.5 h-3.5 ${isHardwareRunning ? 'animate-spin' : ''}`} />
                    <span>{isHardwareRunning ? 'Aspirating Specimen...' : 'Run Auto-Analyzer'}</span>
                  </button>
                </div>

                {isHardwareRunning && (
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                    <div 
                      className="bg-sky-400 h-full transition-all duration-300"
                      style={{ width: `${hardwareProgress}%` }}
                    />
                  </div>
                )}

                {/* Serial Telemetry Stream */}
                <div className="p-3 bg-black/60 rounded-xl border border-white/5 font-mono text-[11px] text-emerald-400 space-y-1 max-h-28 overflow-y-auto">
                  {hardwareTelemetryLogs.map((log, lIdx) => (
                    <div key={lIdx} className="leading-tight">{log}</div>
                  ))}
                </div>
              </div>

              {/* Manual Result Input & Verification */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Analyzer Test Parameters &amp; Quantitative Values
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <label className="font-bold text-slate-700 block mb-1">Primary Metric Value</label>
                    <input
                      type="text"
                      value={resultParam1}
                      onChange={e => setResultParam1(e.target.value)}
                      className="w-full p-2 bg-white rounded-xl border border-slate-200 font-extrabold text-[#34466F] text-sm"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">Normal Benchmark: 4.0 - 5.6</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <label className="font-bold text-slate-700 block mb-1">Secondary Differential Index</label>
                    <input
                      type="text"
                      value={resultParam2}
                      onChange={e => setResultParam2(e.target.value)}
                      className="w-full p-2 bg-white rounded-xl border border-slate-200 font-extrabold text-[#34466F] text-sm"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">Normal Benchmark: 130 - 200</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <div>
                      <span className="font-bold text-rose-900 block">Critical Panic Value Trigger</span>
                      <span className="text-[11px] text-rose-700">Flags immediate high-risk alert to Doctor Cockpit</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isCriticalDetected}
                    onChange={e => setIsCriticalDetected(e.target.checked)}
                    className="w-5 h-5 accent-rose-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleVerifyResults}
                className="w-full py-3.5 bg-[#8B75D7] hover:bg-[#7a64c4] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[#8B75D7]/20 flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Specimen &amp; Publish Official Lab Report</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: LEVEY-JENNINGS QC & WESTGARD RULES                */}
        {/* ======================================================== */}
        {activeTab === 'qc' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-indigo-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#34466F]">Levey-Jennings Quality Control Runs</h2>
                <p className="text-xs text-slate-500">Analyzer standard deviation tracking, Z-scores, and Westgard multi-rule validation</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● All 4 Analyzers In Calibration
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {qcRuns.map(qc => (
                <div
                  key={qc.id}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 text-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 block">{qc.instrumentName}</span>
                      <h3 className="font-extrabold text-[#34466F] text-sm">{qc.analyte}</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {qc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Target Mean</span>
                      <span className="font-bold text-slate-800">{qc.targetMean} {qc.unit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Measured</span>
                      <span className="font-extrabold text-emerald-700">{qc.measuredValue} {qc.unit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Z-Score</span>
                      <span className="font-mono font-bold text-indigo-700">{qc.zScore > 0 ? `+${qc.zScore}` : qc.zScore} SD</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[10px] pt-1">
                    <span>Run: {qc.runDate}</span>
                    <span>Operator: {qc.technologist}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CRITICAL PANIC TELEPHONE REGISTER                 */}
        {/* ======================================================== */}
        {activeTab === 'panic' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-rose-200">
              <h2 className="text-base font-extrabold text-rose-900 mb-1 flex items-center gap-2">
                <Phone className="w-5 h-5 text-rose-600" />
                Critical Panic Value Telephone Log
              </h2>
              <p className="text-xs text-rose-700 mb-4">
                Mandatory verbal read-back documentation when high panic laboratory thresholds are breached.
              </p>

              <form onSubmit={handleLogPanicCall} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Patient Order for Panic Notification</label>
                  <select
                    value={panicSelectedOrderId || activeOrder?.orderId || ''}
                    onChange={e => {
                      setPanicSelectedOrderId(e.target.value);
                      setSelectedOrderId(e.target.value);
                    }}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-rose-300 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    {labOrders.map(order => (
                      <option key={order.orderId} value={order.orderId}>
                        {order.patientName} ({order.patientMrin}) • {order.testName} [{order.priority.toUpperCase()}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Notified Ward Nurse / Staff</label>
                  <input
                    type="text"
                    required
                    value={newNurseName}
                    onChange={e => setNewNurseName(e.target.value)}
                    className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                  <span className="font-bold text-amber-900">Verbal Read-Back Confirmed</span>
                  <input
                    type="checkbox"
                    checked={newReadBackConfirmed}
                    onChange={e => setNewReadBackConfirmed(e.target.checked)}
                    className="w-4 h-4 accent-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-extrabold rounded-xl shadow transition"
                >
                  Record Critical Panic Call Entry
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-extrabold text-[#34466F] mb-3">Critical Panic Telecommunication Ledger</h3>
              <div className="space-y-2.5 overflow-y-auto max-h-[460px] text-xs">
                {panicLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-rose-900">{log.id}</span>
                        <span className="font-bold text-slate-900">{log.testName}</span>
                      </div>
                      <div className="text-rose-700 font-black mt-0.5">{log.panicValue}</div>
                      <div className="text-slate-600 mt-1">
                        Notified: <span className="font-bold">{log.notifiedStaff}</span> • {log.wardLocation}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full block mb-1">
                        ✓ Read-Back Confirmed
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">{log.notifiedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PHLEBOTOMY TUBE GUIDE & ORDER OF DRAW             */}
        {/* ======================================================== */}
        {activeTab === 'tubes' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-indigo-100">
            <h2 className="text-base font-extrabold text-[#34466F] mb-2">Phlebotomy Specimen Vacuum Tube Taxonomy</h2>
            <p className="text-xs text-slate-500 mb-6">Standard international clinical draw order to avoid cross-contamination of additives.</p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <div className="w-8 h-8 rounded-full bg-amber-400 mx-auto mb-2 shadow" />
                <span className="font-extrabold text-amber-950 block">1. Blood Culture</span>
                <span className="text-[11px] text-amber-800 mt-1 block">SPS Broth Bottle</span>
                <span className="text-[10px] text-slate-500 block mt-2">Aerobic / Anaerobic</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                <div className="w-8 h-8 rounded-full bg-sky-400 mx-auto mb-2 shadow" />
                <span className="font-extrabold text-blue-950 block">2. Light Blue</span>
                <span className="text-[11px] text-blue-800 mt-1 block">3.2% Sodium Citrate</span>
                <span className="text-[10px] text-slate-500 block mt-2">PT/INR, APTT, D-Dimer</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                <div className="w-8 h-8 rounded-full bg-rose-500 mx-auto mb-2 shadow" />
                <span className="font-extrabold text-rose-950 block">3. Red / Gold Gel</span>
                <span className="text-[11px] text-rose-800 mt-1 block">Clot Activator + Gel</span>
                <span className="text-[10px] text-slate-500 block mt-2">Biochemistry, Troponin</span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                <div className="w-8 h-8 rounded-full bg-purple-500 mx-auto mb-2 shadow" />
                <span className="font-extrabold text-purple-950 block">4. Lavender</span>
                <span className="text-[11px] text-purple-800 mt-1 block">K2 / K3 EDTA</span>
                <span className="text-[10px] text-slate-500 block mt-2">CBC, ESR, HbA1c</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-center">
                <div className="w-8 h-8 rounded-full bg-slate-400 mx-auto mb-2 shadow" />
                <span className="font-extrabold text-slate-900 block">5. Grey</span>
                <span className="text-[11px] text-slate-700 mt-1 block">Sodium Fluoride</span>
                <span className="text-[10px] text-slate-500 block mt-2">Fasting Plasma Glucose</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: BLOOD BANK & CROSSMATCH INVENTORY                 */}
        {/* ======================================================== */}
        {activeTab === 'bloodbank' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-indigo-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#34466F]">Blood Transfusion &amp; Component Inventory</h2>
                <p className="text-xs text-slate-500">Live units of Packed Red Cells (PRBC), Fresh Frozen Plasma (FFP), and Platelets</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                Rh-Negative Critical Reserve Monitored
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bloodBank.map(b => (
                <div
                  key={b.bloodGroup}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-rose-700">{b.bloodGroup}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">PRBC Units:</span>
                      <span className="font-extrabold text-slate-800">{b.prbcUnits} Units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">FFP Plasma:</span>
                      <span className="font-bold text-slate-700">{b.ffpUnits} Units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Platelets:</span>
                      <span className="font-bold text-slate-700">{b.plateletConcentrateUnits} Units</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: RADIOLOGY PACS / DICOM VIEWER MOCKUP              */}
        {/* ======================================================== */}
        {activeTab === 'pacs' && (
          <div className="bg-[#0b1329] rounded-3xl p-6 md:p-8 text-slate-200 border border-cyan-900/60 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-900/60 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Vitality PACS / DICOM Workstation</h2>
                  <p className="text-xs text-cyan-400 font-mono">Modality: {pacsModality} • Resolution: 3072 x 3072 16-bit Grayscale</p>
                </div>
              </div>

              {/* Modality Selector */}
              <div className="flex items-center gap-2">
                {(['Chest X-Ray (Digital)', '3T Cardiac MRI', '128-Slice CT Thorax'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setPacsModality(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      pacsModality === m ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* PACS Viewport Area */}
              <div className="lg:col-span-8 bg-black rounded-2xl border border-cyan-950 p-6 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
                <div 
                  className="w-64 h-80 rounded-2xl border-2 border-cyan-500/40 flex flex-col items-center justify-center relative transition-all"
                  style={{
                    filter: `brightness(${pacsBrightness}%) contrast(${pacsContrast}%) ${pacsInvert ? 'invert(1)' : ''}`,
                    background: 'radial-gradient(circle, #334155 0%, #0f172a 70%, #000 100%)'
                  }}
                >
                  <Activity className="w-24 h-24 text-cyan-300/60 animate-pulse" />
                  <span className="text-[11px] font-mono text-cyan-200 mt-4 font-bold uppercase tracking-wider">
                    {pacsModality}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Series #1 • Slice 12/64</span>
                </div>

                <div className="absolute bottom-3 left-4 text-[10px] font-mono text-cyan-500/70">
                  W: {pacsContrast * 10} L: {pacsBrightness * 4} • Zoom: 1.0x
                </div>
              </div>

              {/* Viewport Adjustments & Radiologist Notes */}
              <div className="lg:col-span-4 space-y-4 text-xs">
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-cyan-950 space-y-3">
                  <span className="font-extrabold text-cyan-400 uppercase tracking-wider block">Window / Level Controls</span>
                  
                  <div>
                    <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                      <span>Brightness (Level)</span>
                      <span>{pacsBrightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={pacsBrightness}
                      onChange={e => setPacsBrightness(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                      <span>Contrast (Window)</span>
                      <span>{pacsContrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="180"
                      value={pacsContrast}
                      onChange={e => setPacsContrast(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <button
                    onClick={() => setPacsInvert(!pacsInvert)}
                    className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold"
                  >
                    Toggle Invert Grayscale ({pacsInvert ? 'ON' : 'OFF'})
                  </button>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-2xl border border-cyan-950 space-y-2">
                  <span className="font-extrabold text-cyan-400 uppercase tracking-wider block">Radiologist Provisional Finding</span>
                  <textarea
                    rows={4}
                    value={pacsReportNotes}
                    onChange={e => setPacsReportNotes(e.target.value)}
                    className="w-full p-2.5 bg-black/60 border border-cyan-900/40 rounded-xl text-slate-200 text-xs outline-none"
                  />
                  <button
                    onClick={() => alert('✓ Radiology impression signed and synced to Doctor Consultation Cockpit!')}
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold"
                  >
                    Sign &amp; Sync Impression to Doctor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: QUANTUM NANO-BIOSENSING & LIQUID BIOPSY           */}
        {/* ======================================================== */}
        {activeTab === 'liquid_biopsy_genomics' && (
          <div className="space-y-6 text-xs text-slate-800">
            {/* Top Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    Next-Gen Molecular Diagnostics
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Microfluidic Liquid Biopsy &amp; SERS Proteomics
                  </h2>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Microfluidic magnetic sorting for Circulating Tumor Cells (CTCs) and Surface-Enhanced Raman Spectroscopy (SERS) for pre-clinical sepsis shock forecasting.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Laser Waveguide: 785nm Active</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left 6 Columns: CTC Counter & cfDNA Variants */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-purple-100 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-purple-600" />
                    <h3 className="font-extrabold text-sm text-[#34466F]">Microfluidic CTC Liquid Biopsy Counter</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    EpCAM+/CK+ Magnetic Isolation
                  </span>
                </div>

                <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Circulating Tumor Cells (CTCs)</span>
                    <span className="text-3xl font-black text-purple-900">3 CTCs</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">per 7.5 mL peripheral whole blood</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ Below Metastatic Cutoff (&lt;5 CTCs)
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">CellSearch® Verified Standard</span>
                  </div>
                </div>

                {/* cfDNA Variant Allele Frequencies */}
                <div>
                  <span className="font-extrabold text-slate-700 text-xs block mb-2">Cell-free DNA (cfDNA) Somatic Allele Frequencies (ddPCR)</span>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">EGFR T790M Mutation</span>
                        <span className="text-[10px] text-slate-500 block">Exon 20 gatekeeper resistance allele</span>
                      </div>
                      <span className="font-mono font-extrabold text-emerald-700">0.03% VAF (Negative)</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">KRAS G12D Mutation</span>
                        <span className="text-[10px] text-slate-500 block">Codon 12 oncogenic activation</span>
                      </div>
                      <span className="font-mono font-extrabold text-emerald-700">0.01% VAF (Negative)</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">BRAF V600E Mutation</span>
                        <span className="text-[10px] text-slate-500 block">Valine-to-Glutamic acid kinase substitute</span>
                      </div>
                      <span className="font-mono font-extrabold text-emerald-700">0.00% (Not Detected)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 6 Columns: SERS Sepsis Cytokine Storm Predictor */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-indigo-100 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-600" />
                    <h3 className="font-extrabold text-sm text-[#34466F]">SERS Pre-Clinical Sepsis Predictor</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                    Surface Raman Laser
                  </span>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-rose-900 text-xs">AI Early Warning: Pre-Symptomatic Septic Shock</span>
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono font-bold text-[10px]">
                      87.2% Probability
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    SERS spectral peak elevation detected picomolar cytokine surge. Physiological shock trajectory indicates impending arterial hypotension in <strong>6.5 ± 0.8 hours</strong> prior to vital sign decompensation.
                  </p>
                </div>

                {/* Live SERS Picomolar Laser Spectrograph */}
                <SersRamanCanvas />

                {/* Cytokine Markers Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Interleukin-6 (IL-6)</span>
                    <span className="text-lg font-black text-rose-600 font-mono">142 pg/mL</span>
                    <span className="text-[9px] text-rose-500 font-bold block mt-0.5">⚠️ Severe Elevation (&gt;50)</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Procalcitonin (PCT)</span>
                    <span className="text-lg font-black text-rose-600 font-mono">2.8 ng/mL</span>
                    <span className="text-[9px] text-rose-500 font-bold block mt-0.5">⚠️ Severe Bacterial (&gt;2.0)</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">TNF-Alpha (TNF-α)</span>
                    <span className="text-lg font-black text-amber-600 font-mono">38 pg/mL</span>
                    <span className="text-[9px] text-amber-500 font-bold block mt-0.5">Moderate Surge (&gt;25)</span>
                  </div>
                </div>

                {/* Sepsis Bundle Action Button */}
                <button
                  type="button"
                  onClick={() => alert('🚨 PRE-EMPTIVE SEPSIS 1-HOUR BUNDLE DISPATCHED: Blood cultures, IV Piperacillin-Tazobactam, and 30 mL/kg crystalloids queued for ICU team!')}
                  className="w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-extrabold rounded-xl shadow transition text-xs flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-amber-300" />
                  <span>Dispatch Pre-emptive 1-Hour Sepsis Bundle to ICU</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-lg font-black text-[#34466F]">Order Diagnostic Test to Lab Worklist</h2>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Patient</label>
                <select
                  value={selectedPatientMrin}
                  onChange={e => setSelectedPatientMrin(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  {patients.map(p => (
                    <option key={p.mrin} value={p.mrin}>{p.fullName} ({p.mrin})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Filter Test Catalog</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Type test name (e.g. Troponin, MRI, HbA1c)..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs mb-2"
                />
                <div className="max-h-60 overflow-y-auto space-y-1.5 border border-slate-100 rounded-xl p-2">
                  {filteredCatalog.slice(0, 8).map(t => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onOrderNewTest(t, selectedPatientMrin);
                        setIsOrderModalOpen(false);
                      }}
                      className="p-2.5 hover:bg-indigo-50 rounded-lg cursor-pointer transition flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{t.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">({t.department})</span>
                      </div>
                      <span className="font-mono font-bold text-[#8B75D7]">৳{t.priceBDT} BDT</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}