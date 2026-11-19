import React, { useState } from 'react';
import { 
  Stethoscope, UserPlus, ClipboardList, FlaskConical, 
  Activity, LayoutGrid, Database, Smartphone, Bell, 
  Settings, ShieldAlert, ChevronRight, LogOut, CheckCircle2,
  Download, Pill, LogIn, User, Globe
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type AppRoleId = 
  | 'receptionist'   // App 1: Trust & Admin
  | 'assistant'      // App 2: Clinical Triage
  | 'doctor'         // App 3: Doctor Consultation
  | 'lab'            // App 4: Diagnostic Lab
  | 'patient'        // App 5: Patient Mobile App (Separated)
  | 'maintenance'    // App 6: Admin Command Center
  | 'launchpad'      // App 7: Central Launchpad Switcher
  | 'central_hub'    // App 8: Master Data Backbone
  | 'pharmacy';      // App 9: Vitality Pharmacy & Medical Store

interface AppSidebarProps {
  currentRole: AppRoleId;
  onSelectRole: (role: AppRoleId) => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onOpenCommandMenu?: () => void;
  onOpenPwaInstall?: () => void;
  onOpenAuth?: () => void;
}

export function AppSidebar({
  currentRole,
  onSelectRole,
  unreadCount = 0,
  onOpenNotifications,
  onOpenCommandMenu,
  onOpenPwaInstall,
  onOpenAuth
}: AppSidebarProps) {
  const [hoveredRole, setHoveredRole] = useState<AppRoleId | null>(null);
  const { language, toggleLanguage } = useLanguage();

  // App 1 to 8 navigation items with color identities
  const navItems = [
    {
      id: 'launchpad' as AppRoleId,
      label: 'Hospital Launchpad',
      sub: 'All Hospital Portals',
      icon: LayoutGrid,
      accentColor: '#168C86',
      badge: 'Hub 7'
    },
    {
      id: 'receptionist' as AppRoleId,
      label: 'Reception Desk',
      sub: 'Patient Intake & Tokens',
      icon: UserPlus,
      accentColor: '#299DAB',
      badge: 'App 1'
    },
    {
      id: 'assistant' as AppRoleId,
      label: 'Triage & Vitals',
      sub: 'Check Symptoms & Pulse',
      icon: ClipboardList,
      accentColor: '#35B69A',
      badge: 'App 2'
    },
    {
      id: 'doctor' as AppRoleId,
      label: 'Doctor Chamber',
      sub: 'Consultation & Medicines',
      icon: Stethoscope,
      accentColor: '#697FE5',
      badge: 'App 3'
    },
    {
      id: 'lab' as AppRoleId,
      label: 'Diagnostic Lab',
      sub: 'Blood Tests & Reports',
      icon: FlaskConical,
      accentColor: '#8B75D7',
      badge: 'App 4'
    },
    {
      id: 'patient' as AppRoleId,
      label: 'Patient App',
      sub: 'Medicine Times & QR Pass',
      icon: Smartphone,
      accentColor: '#10B981',
      badge: 'App 5'
    },
    {
      id: 'maintenance' as AppRoleId,
      label: 'Bed & ICU Command',
      sub: 'Ward Beds & Oxygen',
      icon: Activity,
      accentColor: '#E0A84C',
      badge: 'App 6'
    },
    {
      id: 'pharmacy' as AppRoleId,
      label: 'Hospital Pharmacy',
      sub: 'Medicine Store & Billing',
      icon: Pill,
      accentColor: '#059669',
      badge: 'App 9'
    },
    {
      id: 'central_hub' as AppRoleId,
      label: 'Master Directory',
      sub: 'Patient Records Database',
      icon: Database,
      accentColor: '#38BDF8',
      badge: 'Hub 8'
    }
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 bg-[#0f172a]/95 backdrop-blur-xl border-r border-slate-800/80 z-40 flex flex-col items-center py-4 justify-between transition-all duration-300">
      {/* Top Logo Mark */}
      <div className="flex flex-col items-center space-y-4">
        <button 
          onClick={() => onSelectRole('launchpad')}
          title="Vitality-OS Central"
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 hover:scale-105 transition-transform"
        >
          <span className="font-extrabold text-lg tracking-tighter">V</span>
        </button>
      </div>

      {/* Middle Icon Rail with Hover Flyouts (App Sidebar 2 Block) */}
      <nav className="flex flex-col space-y-2 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRole === item.id;
          const isHovered = hoveredRole === item.id;

          return (
            <div 
              key={item.id} 
              className="relative flex items-center justify-center"
              onMouseEnter={() => setHoveredRole(item.id)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              <button
                onClick={() => onSelectRole(item.id)}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 relative ${
                  isActive 
                    ? 'text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                }`}
                style={{
                  backgroundColor: isActive ? item.accentColor : undefined,
                  boxShadow: isActive ? `0 0 16px ${item.accentColor}40` : undefined
                }}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -left-2 w-1 h-5 bg-white rounded-r-full" />
                )}
              </button>

              {/* Hover Flyout Card */}
              {isHovered && (
                <div 
                  className="absolute left-16 z-50 w-56 p-3 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl text-left pointer-events-none transform -translate-y-1 transition-all animate-in fade-in slide-in-from-left-2 duration-150"
                  style={{ borderLeftColor: item.accentColor, borderLeftWidth: '3px' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {item.badge}
                    </span>
                    {isActive && (
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    {item.label}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.sub}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Utility Actions */}
      <div className="flex flex-col items-center space-y-3 w-full px-2">
        {/* Browser Extension / PWA Install */}
        <button
          onClick={onOpenPwaInstall}
          title="Download as Browser Extension / PWA"
          className="w-10 h-10 rounded-xl bg-slate-800/70 hover:bg-teal-900/40 text-slate-400 hover:text-teal-300 flex items-center justify-center border border-slate-700/50 transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Language Quick Switcher */}
        <button
          onClick={toggleLanguage}
          title={language === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border transition-all shadow-sm ${
            language === 'bn'
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-950/40'
              : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700/50'
          }`}
        >
          {language === 'en' ? 'বাং' : 'EN'}
        </button>

        {/* 1-Click Role Switcher / Direct Login */}
        <button
          onClick={onOpenAuth}
          title="Direct Passwordless Role Login"
          className="w-10 h-10 rounded-xl bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white flex items-center justify-center border border-teal-500/40 transition-all shadow-sm"
        >
          <LogIn className="w-4 h-4" />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          title="Hospital Notifications"
          className="relative w-10 h-10 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/50 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
