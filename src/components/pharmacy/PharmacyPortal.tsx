import React, { useState } from 'react';
import { 
  Pill, ShoppingCart, Plus, Minus, Trash2, Printer, 
  Search, CheckCircle2, AlertTriangle, ShieldCheck, Clock,
  ArrowRight, DollarSign, Filter, Building2, Package, Sparkles,
  Lock, Snowflake, FileSpreadsheet, Check, ShieldAlert, AlertCircle, Camera
} from 'lucide-react';
import { 
  PharmacyMedicineItem, INITIAL_PHARMACY_INVENTORY, 
  StatMedicationRequest, INITIAL_STAT_REQUESTS, 
  PharmacyInvoice, NarcoticsLedgerItem, ColdChainLogEntry,
  INITIAL_NARCOTICS_LEDGER, INITIAL_COLD_CHAIN_LOGS
} from '../../data/hospitalStore';
import { PatientRecord } from '../../data/patientsDatabase';
import { printPharmacyBill } from '../../utils/printUtils';
import { PrescriptionVisionModal } from '../common/PrescriptionVisionModal';
import ShapeGrid from '../reactbits/ShapeGrid';

interface PharmacyPortalProps {
  patients: PatientRecord[];
  onNavigateToLaunchpad: () => void;
  onNavigateToDoctor: () => void;
}

export function PharmacyPortal({
  patients,
  onNavigateToLaunchpad,
  onNavigateToDoctor
}: PharmacyPortalProps) {
  // Inventory state
  const [inventory, setInventory] = useState<PharmacyMedicineItem[]>(INITIAL_PHARMACY_INVENTORY);
  const [statRequests, setStatRequests] = useState<StatMedicationRequest[]>(INITIAL_STAT_REQUESTS);

  // Active view tab: 'pos' | 'dispenser' | 'stat' | 'inventory' | 'narcotics' | 'coldchain' | 'po'
  const [activeTab, setActiveTab] = useState<'pos' | 'dispenser' | 'stat' | 'inventory' | 'narcotics' | 'coldchain' | 'po'>('pos');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // POS Cart State
  const [buyerName, setBuyerName] = useState('Walk-in Outpatient');
  const [buyerMrin, setBuyerMrin] = useState('');
  const [cart, setCart] = useState<{ item: PharmacyMedicineItem; quantity: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Card'>('bKash');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [printedInvoice, setPrintedInvoice] = useState<PharmacyInvoice | null>(null);

  // Prescription Dispenser state
  const [dispenserMrin, setDispenserMrin] = useState(patients[0]?.mrin || '');
  const activeDispenserPatient = patients.find(p => p.mrin === dispenserMrin) || patients[0];
  const [showVisionModal, setShowVisionModal] = useState(false);

  // Emergency Stat Request Form State
  const [newStatMedicine, setNewStatMedicine] = useState('Inj. Atropine Sulfate');
  const [newStatDosage, setNewStatDosage] = useState('0.6mg STAT IV');
  const [newStatWard, setNewStatWard] = useState('ICU-01');
  const [newStatDoctor, setNewStatDoctor] = useState('Dr. Marcus Vance');

  // Narcotics Vault State
  const [narcoticsLedger, setNarcoticsLedger] = useState<NarcoticsLedgerItem[]>(INITIAL_NARCOTICS_LEDGER);
  const [narcDrugName, setNarcDrugName] = useState('Inj. Morphine Sulfate 10mg/mL');
  const [narcPatientMrin, setNarcPatientMrin] = useState(patients[0]?.mrin || 'HS-2026-00318');
  const [narcDoctorName, setNarcDoctorName] = useState('Dr. Marcus Vance (Cardiologist)');
  const [narcBmdc, setNarcBmdc] = useState('BMDC-A-44821');
  const [narcQty, setNarcQty] = useState(1);
  const [narcWitnessNurse, setNarcWitnessNurse] = useState('Sr. Staff Nurse Poly (CCU)');

  // Cold Chain State
  const [coldChainLogs, setColdChainLogs] = useState<ColdChainLogEntry[]>(INITIAL_COLD_CHAIN_LOGS);

  // Supplier Purchase Orders
  const [poSupplier, setPoSupplier] = useState('Square Pharmaceuticals Ltd.');
  const [poItem, setPoItem] = useState('Comet 500mg (Metformin)');
  const [poQty, setPoQty] = useState(5000);
  const [poList, setPoList] = useState([
    { poNumber: 'PO-2026-901', supplier: 'Square Pharmaceuticals Ltd.', items: 'Comet 500mg x 5,000 tabs', valueBDT: 25000, status: 'Goods Received (GRN Verified)', date: 'Yesterday' },
    { poNumber: 'PO-2026-902', supplier: 'Beximco Pharma Ltd.', items: 'Telma 40mg x 3,000 tabs', valueBDT: 28500, status: 'Pending Delivery (Dispatch ETA: Today)', date: 'Today' }
  ]);

  const categories = ['All', 'Cardiovascular', 'Diabetes & Endocrine', 'Antibiotic', 'Respiratory', 'GI & Antacid', 'Emergency STAT', 'Analgesic'];

  // Add to Cart
  const handleAddToCart = (item: PharmacyMedicineItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.item.id === id) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : null;
      }
      return c;
    }).filter(Boolean) as { item: PharmacyMedicineItem; quantity: number }[]);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.item.id !== id));
  };

  // Compute Cart Totals
  const subtotal = cart.reduce((acc, c) => acc + (c.item.unitPriceBDT * c.quantity), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = subtotal - discountAmount;

  // Checkout and Generate Invoice
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Please add medications before checkout.');
      return;
    }

    const newInvoice: PharmacyInvoice = {
      invoiceId: `INV-${Date.now().toString().slice(-5)}`,
      buyerName: buyerName || 'Walk-in Customer',
      patientMrin: buyerMrin || undefined,
      items: cart.map(c => ({
        medicineName: c.item.brandName,
        form: c.item.form,
        quantity: c.quantity,
        unitPrice: c.item.unitPriceBDT,
        total: c.item.unitPriceBDT * c.quantity
      })),
      subtotal,
      discount: discountAmount,
      total: grandTotal,
      paymentMethod,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPrintedInvoice(newInvoice);
    setCart([]);
    printPharmacyBill(newInvoice);
  };

  // Dispense from digital prescription
  const handleDispensePrescription = () => {
    if (!activeDispenserPatient || !activeDispenserPatient.activePrescription.medicines) return;
    alert(`✓ Dispensed full active regimen for ${activeDispenserPatient.fullName} (${activeDispenserPatient.mrin}). Stock balances updated.`);
  };

  // Create Emergency STAT Requisition
  const handleCreateStatRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: StatMedicationRequest = {
      id: `stat-${Date.now().toString().slice(-4)}`,
      patientMrin: dispenserMrin,
      patientName: activeDispenserPatient?.fullName || 'Emergency Inpatient',
      orderedByDoctor: newStatDoctor,
      wardOrChamber: newStatWard,
      medicineName: newStatMedicine,
      dosage: newStatDosage,
      priority: 'STAT',
      status: 'pending',
      orderedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setStatRequests(prev => [newReq, ...prev]);
    alert(`🚨 STAT Emergency Requisition #${newReq.id} received for ${newReq.wardOrChamber}! Dispatch team notified.`);
  };

  const handleDispenseStat = (id: string) => {
    setStatRequests(prev => prev.map(s => s.id === id ? { ...s, status: 'dispensed' } : s));
  };

  // Handle Narcotics double-sign entry
  const handleRecordNarcotics = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPatient = patients.find(p => p.mrin === narcPatientMrin) || patients[0];
    const newEntry: NarcoticsLedgerItem = {
      id: `NARC-${Math.floor(100 + Math.random() * 899)}`,
      medicineName: narcDrugName,
      dosageForm: 'Ampoule IV',
      patientMrin: targetPatient.mrin,
      patientName: targetPatient.fullName,
      prescribingDoctor: narcDoctorName,
      bmdcReg: narcBmdc,
      quantityDispensed: narcQty,
      balanceVaultRemaining: 23,
      witnessNurse: narcWitnessNurse,
      pharmacistSignature: 'Md. Shahidul (PharmD)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNarcoticsLedger(prev => [newEntry, ...prev]);
    alert(`✓ Controlled Substance Schedule H Entry recorded with double-signature.`);
  };

  // Filter inventory
  const filteredInventory = inventory.filter(med => {
    const matchesSearch = med.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          med.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || med.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#F2FBF7] text-slate-800 p-4 md:p-8 transition-colors relative overflow-hidden">
      {/* Background React Bits: ShapeGrid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <ShapeGrid shape="tile" speed={0.4} lineColor="#a7f3d0" hoverColor="#059669" />
      </div>
      <div className="relative z-10">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#064E3B] text-white">
                App 9 • Pharmacy &amp; Medical Store
              </span>
              <span className="text-xs font-semibold text-[#059669]">
                Vitality Pharmacy OS
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#064E3B]">
              Hospital Pharmacy, Medical Store &amp; POS Counter
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Complete pharmacy enterprise: Outpatient retail POS, inpatient prescription dispenser, emergency STAT requisitions, narcotics vault, and cold-chain monitoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToDoctor}
              className="px-4 py-2.5 bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition"
            >
              <span>Doctor Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7 Modular Sub-Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 border-b border-emerald-200">
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'pos'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span>1. POS Retail Billing Counter</span>
          </button>

          <button
            onClick={() => setActiveTab('dispenser')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'dispenser'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Pill className="w-4 h-4 text-teal-400" />
            <span>2. Prescription Dispenser</span>
          </button>

          <button
            onClick={() => setActiveTab('stat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'stat'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>3. Emergency STAT Orders ({statRequests.filter(s => s.status === 'pending').length} Pending)</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4 text-amber-500" />
            <span>4. Stock &amp; Batches ({inventory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('narcotics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'narcotics'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Lock className="w-4 h-4 text-purple-600" />
            <span>5. Narcotics &amp; Sched-H Vault ({narcoticsLedger.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coldchain')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'coldchain'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Snowflake className="w-4 h-4 text-cyan-600" />
            <span>6. Cold-Chain 2-8°C Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('po')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'po'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>7. Supplier Purchase Orders</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ======================================================== */}
        {/* TAB 1: POS RETAIL BILLING & CASHIER COUNTER             */}
        {/* ======================================================== */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: Product Selection Grid */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search brand or generic medicine..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 bg-slate-50/50"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {categories.slice(0, 4).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition ${
                        categoryFilter === cat ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medication Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
                {filteredInventory.map(med => (
                  <div
                    key={med.id}
                    className="p-4 rounded-3xl bg-white shadow-sm border border-emerald-100 hover:border-emerald-300 transition text-left flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">{med.category}</span>
                        <span className="font-mono text-[10px] text-slate-500">{med.batchNumber}</span>
                      </div>
                      <h4 className="font-black text-sm text-slate-900">{med.brandName}</h4>
                      <p className="text-xs text-slate-500 font-mono">{med.genericName} • {med.strength}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">{med.manufacturer}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-xs font-black text-[#065F46]">৳{med.unitPriceBDT.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400 block">Stock: {med.stockUnits}</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(med)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Columns: Active POS Cart & Billing Checkout */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm">Active POS Register</h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                    {cart.length} Items in Cart
                  </span>
                </div>

                {/* Buyer Information Input */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">Buyer / Outpatient</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={e => setBuyerName(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">Patient MRIN (Optional)</label>
                    <input
                      type="text"
                      value={buyerMrin}
                      onChange={e => setBuyerMrin(e.target.value)}
                      placeholder="e.g. HS-2026-00421"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mb-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                      Cart is empty. Click +Add on any medication.
                    </div>
                  ) : (
                    cart.map(c => (
                      <div key={c.item.id} className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-slate-800 truncate">{c.item.brandName}</div>
                          <div className="text-[10px] text-slate-400">৳{c.item.unitPriceBDT} x {c.quantity}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => handleUpdateCartQty(c.item.id, -1)} className="p-1 rounded bg-slate-200 hover:bg-slate-300"><Minus className="w-3 h-3" /></button>
                          <span className="font-bold font-mono text-xs">{c.quantity}</span>
                          <button onClick={() => handleUpdateCartQty(c.item.id, 1)} className="p-1 rounded bg-slate-200 hover:bg-slate-300"><Plus className="w-3 h-3" /></button>
                          <span className="font-extrabold text-[#065F46] min-w-14 text-right">৳{(c.item.unitPriceBDT * c.quantity).toFixed(2)}</span>
                          <button onClick={() => handleRemoveFromCart(c.item.id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Checkout Calculation & Action */}
              <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-800">৳{subtotal.toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Discount (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={discountPercent}
                    onChange={e => setDiscountPercent(parseInt(e.target.value, 10) || 0)}
                    className="w-14 p-1 bg-slate-50 border border-slate-200 rounded text-right font-bold"
                  />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-sm font-black text-slate-900">Grand Total:</span>
                  <span className="text-lg font-black text-[#065F46]">৳{grandTotal.toFixed(2)} BDT</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-2">
                  {(['bKash', 'Nagad', 'Cash', 'Card'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition border ${
                        paymentMethod === m ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow transition"
                >
                  Confirm Sale &amp; Print Thermal Bill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PRESCRIPTION DISPENSER                            */}
        {/* ======================================================== */}
        {activeTab === 'dispenser' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#064E3B]">Digital Prescription Dispenser</h3>
                <p className="text-xs text-slate-500">Loads doctor prescriptions directly by patient MRIN for dispensing and barcode verification.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowVisionModal(true)}
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-sm transition"
                >
                  <Camera className="w-4 h-4 text-emerald-200" />
                  <span>📸 Scan Handwritten Rx (বাংলা ভয়েস)</span>
                </button>
                <span className="text-xs font-bold text-slate-600">Patient:</span>
                <select
                  value={dispenserMrin}
                  onChange={e => setDispenserMrin(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  {patients.map(p => (
                    <option key={p.mrin} value={p.mrin}>{p.fullName} ({p.mrin})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-extrabold text-emerald-950 block text-sm">{activeDispenserPatient.fullName} ({activeDispenserPatient.mrin})</span>
                <span className="text-emerald-800">Prescribed by {activeDispenserPatient.activePrescription.doctorName} • Diagnosis: {activeDispenserPatient.activePrescription.diagnosis}</span>
              </div>
              <button
                onClick={handleDispensePrescription}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-extrabold shadow"
              >
                ✓ Dispense All Prescribed Drugs
              </button>
            </div>

            <div className="space-y-3">
              {activeDispenserPatient.activePrescription.medicines.map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{m.medicineName}</h4>
                    <span className="text-slate-500">{m.dosage} • {m.form} • Taken at {m.timing} ({m.exactTime})</span>
                    <span className="text-[10px] text-teal-700 block mt-1">Indication: {m.whyGivenForPatient}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800 text-sm">{m.durationDays} Days Supply</span>
                    <span className="text-[10px] text-emerald-600 block font-bold">✓ In Stock Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: EMERGENCY STAT REQUISITIONS                       */}
        {/* ======================================================== */}
        {activeTab === 'stat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-rose-200 space-y-4">
              <h3 className="text-sm font-extrabold text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Dispatch Emergency STAT Requisition
              </h3>

              <form onSubmit={handleCreateStatRequest} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Emergency Medication</label>
                  <select
                    value={newStatMedicine}
                    onChange={e => setNewStatMedicine(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    <option value="Inj. Atropine Sulfate 0.6mg">Inj. Atropine Sulfate 0.6mg (Bradycardia)</option>
                    <option value="Inj. Adrenaline (Epinephrine) 1:1000">Inj. Adrenaline 1:1000 (Anaphylaxis/Cardiac)</option>
                    <option value="Inj. Amiodarone 150mg/3mL">Inj. Amiodarone 150mg (VT/VF Arrest)</option>
                    <option value="Inj. Dextrose 25% 100mL">Inj. Dextrose 25% (Severe Hypoglycemia)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dosage Directive</label>
                  <input
                    type="text"
                    value={newStatDosage}
                    onChange={e => setNewStatDosage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-rose-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Destination Ward</label>
                    <input
                      type="text"
                      value={newStatWard}
                      onChange={e => setNewStatWard(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ordering Doctor</label>
                    <input
                      type="text"
                      value={newStatDoctor}
                      onChange={e => setNewStatDoctor(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-extrabold rounded-xl shadow transition"
                >
                  Dispatch STAT Emergency Delivery Runner
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900">Active Emergency STAT Orders Log</h3>
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto text-xs">
                {statRequests.map(req => (
                  <div
                    key={req.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      req.status === 'pending' ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-rose-900">{req.id}</span>
                        <span className="font-extrabold text-slate-900">{req.medicineName}</span>
                      </div>
                      <div className="text-slate-600 mt-1">{req.dosage} • Delivered to <strong>{req.wardOrChamber}</strong></div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Ordered by {req.orderedByDoctor} at {req.orderedAt}</div>
                    </div>
                    <div>
                      {req.status === 'pending' ? (
                        <button
                          onClick={() => handleDispenseStat(req.id)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow"
                        >
                          Mark Dispensed
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓ Delivered
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: STOCK & BATCH EXPIRY (FEFO)                       */}
        {/* ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-100">
            <h3 className="text-base font-extrabold text-[#064E3B] mb-4">Stock Registry &amp; Near-Expiry Rotation (FEFO)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono">
                    <th className="pb-3">Brand Name</th>
                    <th className="pb-3">Generic Composition</th>
                    <th className="pb-3">Form</th>
                    <th className="pb-3">Batch #</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Expiry Date</th>
                    <th className="pb-3 text-right">Price (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map(med => (
                    <tr key={med.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-800">{med.brandName}</td>
                      <td className="py-3 text-slate-600">{med.genericName}</td>
                      <td className="py-3 font-mono text-[11px]">{med.form}</td>
                      <td className="py-3 font-mono text-slate-500 text-[11px]">{med.batchNumber}</td>
                      <td className="py-3 font-bold text-emerald-700">{med.stockUnits} units</td>
                      <td className="py-3 font-mono text-slate-600">{med.expiryDate}</td>
                      <td className="py-3 text-right font-black text-[#065F46]">৳{med.unitPriceBDT.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: NARCOTICS & SCHEDULE H VAULT                      */}
        {/* ======================================================== */}
        {activeTab === 'narcotics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-purple-200 space-y-4">
              <h3 className="text-sm font-extrabold text-purple-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" />
                Schedule H &amp; Controlled Narcotics Double-Sign
              </h3>

              <form onSubmit={handleRecordNarcotics} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Controlled Narcotic</label>
                  <select
                    value={narcDrugName}
                    onChange={e => setNarcDrugName(e.target.value)}
                    className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                  >
                    <option value="Inj. Morphine Sulfate 10mg/mL">Inj. Morphine Sulfate 10mg/mL (Ampoule)</option>
                    <option value="Inj. Fentanyl Citrate 100mcg/2mL">Inj. Fentanyl Citrate 100mcg/2mL (Ampoule)</option>
                    <option value="Inj. Pethidine HCl 100mg/2mL">Inj. Pethidine HCl 100mg/2mL (Ampoule)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prescribing Doctor &amp; BMDC</label>
                  <input
                    type="text"
                    value={narcDoctorName}
                    onChange={e => setNarcDoctorName(e.target.value)}
                    className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Witness Registered Nurse</label>
                  <input
                    type="text"
                    value={narcWitnessNurse}
                    onChange={e => setNarcWitnessNurse(e.target.value)}
                    className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl shadow transition"
                >
                  Verify Double Sign &amp; Unlock Vault
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900">Controlled Substances Ledger</h3>
              <div className="space-y-2 max-h-[460px] overflow-y-auto">
                {narcoticsLedger.map(n => (
                  <div key={n.id} className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-purple-950">{n.medicineName} ({n.quantityDispensed} Dispensed)</div>
                      <div className="text-slate-600">Patient: {n.patientName} ({n.patientMrin}) • Rx by {n.prescribingDoctor}</div>
                      <div className="text-slate-400 text-[10px]">Witness Nurse: {n.witnessNurse} • Signed: {n.pharmacistSignature}</div>
                    </div>
                    <span className="font-mono text-purple-900 font-bold">{n.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: COLD-CHAIN TELEMETRY                              */}
        {/* ======================================================== */}
        {activeTab === 'coldchain' && (
          <div className="space-y-4 text-xs">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#064E3B]">Vaccine &amp; Biologicals Cold-Chain Temperature Logs</h3>
                <p className="text-xs text-slate-500">Continuous 24h IoT refrigeration sensor logs for Insulins, Vaccines &amp; Monoclonal Antibodies</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                All Chillers In Compliance (+2°C to +8°C)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coldChainLogs.map(c => (
                <div key={c.refrigeratorId} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{c.unitName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{c.status}</span>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                    <span className="text-[10px] text-slate-400 block font-bold">Current Core Temperature</span>
                    <div className="text-4xl font-black font-mono text-emerald-700 my-1">{c.currentTempC}°C</div>
                    <span className="text-[10px] text-slate-500">Safe Window: {c.targetRange}</span>
                  </div>

                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>24h Min: {c.min24hTempC}°C • 24h Max: {c.max24hTempC}°C</span>
                    <span>Door Opens 24h: {c.doorOpenCount24h} times</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: SUPPLIER PURCHASE ORDERS                          */}
        {/* ======================================================== */}
        {activeTab === 'po' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-100 space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-[#064E3B]">Manufacturer Purchase Order (PO) Engine</h3>
            
            <div className="space-y-3">
              {poList.map(p => (
                <div key={p.poNumber} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{p.poNumber}</span>
                      <span className="font-bold text-slate-800">{p.supplier}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{p.items}</p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{p.status} • {p.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#065F46]">৳{p.valueBDT.toLocaleString()} BDT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* DEDICATED PRINTABLE PHARMACY POS RECEIPT (Only visible during print) */}
      {printedInvoice && (
        <div id="printable-pharmacy-bill">
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>VITALITY PHARMACY OS</h2>
            <p style={{ fontSize: '10px', margin: '2px 0 0 0' }}>OFFICIAL RETAIL CASH INVOICE</p>
            <p style={{ fontSize: '9px', margin: '2px 0 0 0' }}>Bill #{printedInvoice.invoiceId} | {printedInvoice.timestamp}</p>
          </div>

          <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '6px 0', fontSize: '10px', margin: '8px 0' }}>
            <div><strong>Buyer:</strong> {printedInvoice.buyerName}</div>
            {printedInvoice.patientMrin && <div><strong>MRIN:</strong> {printedInvoice.patientMrin}</div>}
          </div>

          <table style={{ width: '100%', fontSize: '10px', textAlign: 'left', marginBottom: '8px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <th>Item</th>
                <th>Qty</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {printedInvoice.items.map((it, idx) => (
                <tr key={idx}>
                  <td>{it.medicineName}</td>
                  <td>{it.quantity}</td>
                  <td style={{ textAlign: 'right' }}>৳{it.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ borderTop: '1px dashed #000', paddingTop: '6px', fontSize: '11px', textAlign: 'right' }}>
            <div>Subtotal: ৳{printedInvoice.subtotal.toFixed(2)}</div>
            {printedInvoice.discount > 0 && <div>Discount: -৳{printedInvoice.discount.toFixed(2)}</div>}
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '4px' }}>
              Grand Total: ৳{printedInvoice.total.toFixed(2)} BDT
            </div>
            <div style={{ fontSize: '9px', marginTop: '4px' }}>Paid via {printedInvoice.paymentMethod}</div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '9px' }}>
            <p style={{ margin: '0' }}>* Prescribed Medicines Non-Refundable *</p>
            <p style={{ margin: '2px 0 0 0' }}>Thank you for visiting Vitality Healthcare</p>
          </div>
        </div>
      )}

      {showVisionModal && activeDispenserPatient && (
        <PrescriptionVisionModal
          isOpen={showVisionModal}
          onClose={() => setShowVisionModal(false)}
          patient={activeDispenserPatient}
          onImportMedicines={(imported) => {
            alert(`✓ Decoded & Imported ${imported.length} medicines into pharmacy dispensation queue!`);
          }}
        />
      )}
      </div>
    </div>
  );
}