import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, X, User, Stethoscope, FlaskConical, 
  Activity, ArrowRight, Zap, Shield, FileText, CornerDownLeft
} from 'lucide-react';
import { PatientRecord } from '../../data/patientsDatabase';
import { DIAGNOSTIC_TEST_CATALOG, DiagnosticTestItem } from '../../data/diagnosticTestDatabase';
import { AppRoleId } from './AppSidebar';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  patients: PatientRecord[];
  onSelectPatient: (mrin: string) => void;
  onNavigateApp: (role: AppRoleId) => void;
  onSelectTest?: (test: DiagnosticTestItem) => void;
}

export function CommandMenu({
  isOpen,
  onClose,
  patients,
  onSelectPatient,
  onNavigateApp,
  onSelectTest
}: CommandMenuProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown handler for Escape & Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Filtered patients
  const matchedPatients = q === '' 
    ? patients.slice(0, 3) 
    : patients.filter(p => 
        p.fullName.toLowerCase().includes(q) ||
        p.mrin.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.activePrescription?.diagnosis && p.activePrescription.diagnosis.toLowerCase().includes(q))
      ).slice(0, 4);

  // Filtered diagnostic tests
  const matchedTests = q === ''
    ? DIAGNOSTIC_TEST_CATALOG.slice(0, 4)
    : DIAGNOSTIC_TEST_CATALOG.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q)
      ).slice(0, 4);

  // App quick jumps
  const appDestinations = [
    { role: 'receptionist' as AppRoleId, name: 'Receptionist Desk', desc: 'Register patients, issue tokens & fees', color: '#299DAB' },
    { role: 'assistant' as AppRoleId, name: 'Clinical Assistant', desc: 'Record vitals & AI specialist match', color: '#35B69A' },
    { role: 'doctor' as AppRoleId, name: "Doctor's Chamber", desc: 'Consultation, CCI timeline & prescription', color: '#697FE5' },
    { role: 'lab' as AppRoleId, name: 'Diagnostic Lab', desc: 'Process lab orders, samples & imaging', color: '#8B75D7' },
    { role: 'patient' as AppRoleId, name: 'Patient SuperApp', desc: 'Standalone patient medicine reminders & QR', color: '#48BFA3' },
    { role: 'pharmacy' as AppRoleId, name: 'Vitality Pharmacy', desc: 'POS billing, dispenser, emergency STAT & inventory', color: '#059669' },
    { role: 'maintenance' as AppRoleId, name: 'Admin Command', desc: 'Bed matrix, wait times & DGHS FHIR', color: '#E0A84C' }
  ].filter(app => q === '' || app.name.toLowerCase().includes(q) || app.desc.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90 gap-3">
          <Search className="w-5 h-5 text-teal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a patient MRIN, diagnostic test, or jump to an app..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm md:text-base focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">
            ESC
          </kbd>
        </div>

        {/* Grouped Results List */}
        <div className="overflow-y-auto p-3 space-y-4 text-left divide-y divide-slate-800/60">
          {/* Group 1: Hospital Applications */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>Hospital Applications & Hubs</span>
              <span className="text-[10px] text-slate-500">Jump directly</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
              {appDestinations.slice(0, 4).map(app => (
                <button
                  key={app.role}
                  onClick={() => {
                    onNavigateApp(app.role);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group text-left border border-slate-800/40 hover:border-slate-700"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: app.color }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        {app.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{app.desc}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-teal-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Group 2: Patients Directory */}
          <div className="pt-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>Patients by MRIN / Name</span>
              <span className="text-[10px] text-teal-400">Match MRIN</span>
            </div>
            <div className="space-y-1 mt-1">
              {matchedPatients.map(patient => (
                <button
                  key={patient.mrin}
                  onClick={() => {
                    onSelectPatient(patient.mrin);
                    onNavigateApp('doctor');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-950/60 text-teal-400 flex items-center justify-center font-bold text-xs border border-teal-800/50">
                      {patient.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white flex items-center gap-2">
                        {patient.fullName}
                        <span className="font-mono text-[10px] bg-slate-800 text-teal-300 px-1.5 py-0.2 rounded border border-slate-700">
                          {patient.mrin}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {patient.age}y • {patient.gender} • <span className="text-slate-300">{patient.activePrescription?.diagnosis || patient.chiefComplaints[0]}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-teal-300 font-mono">
                    Open File <CornerDownLeft className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 3: Diagnostic & Imaging Tests Catalog */}
          <div className="pt-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>Diagnostic Tests (LIS / RIS)</span>
              <span className="text-[10px] text-indigo-400">Vitality Test Catalog</span>
            </div>
            <div className="space-y-1 mt-1">
              {matchedTests.map(test => (
                <button
                  key={test.id}
                  onClick={() => {
                    if (onSelectTest) onSelectTest(test);
                    onNavigateApp('lab');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <FlaskConical className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white">
                        {test.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        <span className="font-mono text-purple-300">{test.code}</span> • {test.department} • Turnaround: {test.turnaroundTime}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-teal-400">৳{test.priceBDT}</span>
                    <div className="text-[10px] text-slate-500">Order test</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-teal-500 font-mono">Vitality-OS Command v2.6</span>
        </div>
      </div>
    </div>
  );
}
