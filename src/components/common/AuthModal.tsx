import React, { useState } from 'react';
import { 
  User, Stethoscope, ClipboardList, UserPlus, FlaskConical, 
  Activity, Pill, Key, ShieldCheck, X, Sparkles, LogIn, ArrowRight
} from 'lucide-react';
import { AppRoleId } from './AppSidebar';
import { PatientRecord } from '../../data/patientsDatabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAsRole: (role: AppRoleId, doctorName?: string, patientMrin?: string) => void;
  patients: PatientRecord[];
}

export function AuthModal({
  isOpen,
  onClose,
  onLoginAsRole,
  patients
}: AuthModalProps) {
  const [selectedRole, setSelectedRole] = useState<AppRoleId>('assistant');
  const [emailInput, setEmailInput] = useState('vitality.assistant@gmail.com');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Marcus Vance (Cardiologist)');
  const [patientMrinInput, setPatientMrinInput] = useState(patients[0]?.mrin || 'HS-2026-00421');

  if (!isOpen) return null;

  const roleProfiles = [
    { role: 'assistant' as AppRoleId, label: 'Clinical Assistant', email: 'vitality.assistant@gmail.com', icon: ClipboardList, color: '#35B69A' },
    { role: 'receptionist' as AppRoleId, label: 'Receptionist Desk', email: 'vitality.reception@gmail.com', icon: UserPlus, color: '#299DAB' },
    { role: 'doctor' as AppRoleId, label: "Doctor's Chamber", email: 'vitality.doctor@gmail.com', icon: Stethoscope, color: '#697FE5' },
    { role: 'lab' as AppRoleId, label: 'Diagnostic Lab Technologist', email: 'vitality.lab@gmail.com', icon: FlaskConical, color: '#8B75D7' },
    { role: 'pharmacy' as AppRoleId, label: 'Hospital Pharmacist', email: 'vitality.pharma@gmail.com', icon: Pill, color: '#059669' },
    { role: 'maintenance' as AppRoleId, label: 'Hospital Admin / Director', email: 'vitality.admin@gmail.com', icon: Activity, color: '#E0A84C' },
    { role: 'patient' as AppRoleId, label: 'Patient Self-Service (MRIN)', email: 'patient@vitality.health', icon: User, color: '#167C72' }
  ];

  const handleSelectRole = (r: AppRoleId, defaultEmail: string) => {
    setSelectedRole(r);
    setEmailInput(defaultEmail);
  };

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'doctor') {
      onLoginAsRole('doctor', selectedDoctor);
    } else if (selectedRole === 'patient') {
      onLoginAsRole('patient', undefined, patientMrinInput);
    } else {
      onLoginAsRole(selectedRole);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Vitality-OS Staff &amp; Patient Login</h2>
              <p className="text-[11px] text-slate-400">Passwordless 1-Click Identity Switching</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleDirectLogin} className="p-6 space-y-4">
          {/* Role Grid */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Operating Role (Auto-fills Identity)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roleProfiles.map(p => {
                const Icon = p.icon;
                const isSelected = selectedRole === p.role;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleSelectRole(p.role, p.email)}
                    className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-500/10 text-white shadow'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" style={{ color: p.color }} />
                    <span className="text-xs font-bold truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Input based on Role */}
          {selectedRole === 'patient' ? (
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Login via Medical Record Index Number (MRIN)
              </label>
              <select
                value={patientMrinInput}
                onChange={e => setPatientMrinInput(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold outline-none focus:border-teal-400"
              >
                {patients.map(p => (
                  <option key={p.mrin} value={p.mrin}>
                    {p.fullName} ({p.mrin})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Patients authenticate using their hospital-issued MRIN card.
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Staff Email Identity (Pre-configured)
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-teal-300 font-mono outline-none"
                />
              </div>

              {selectedRole === 'doctor' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Select Attending Physician Profile
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={e => setSelectedDoctor(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold outline-none"
                  >
                    <option value="Dr. Marcus Vance (Cardiologist)">Dr. Marcus Vance (Cardiology — Room 304)</option>
                    <option value="Dr. Elena Rostova (Neurologist)">Dr. Elena Rostova (Neurology — Room 308)</option>
                    <option value="Dr. Tariqul Islam (Endocrinologist)">Dr. Tariqul Islam (Endocrinology — Room 212)</option>
                    <option value="Dr. Nusrat Jahan (Nephrologist)">Dr. Nusrat Jahan (Nephrology — Room 401)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Direct Sign In as {selectedRole.toUpperCase()}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
