import React from 'react';
import { 
  Bell, Check, ShieldAlert, HeartPulse, UserPlus, 
  ExternalLink, X, Activity, AlertTriangle
} from 'lucide-react';
import { HospitalNotification } from '../../data/hospitalStore';
import { AppRoleId } from './AppSidebar';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: HospitalNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (notif: HospitalNotification) => void;
  onNavigateApp: (role: AppRoleId) => void;
}

export function NotificationsPopover({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
  onNavigateApp
}: NotificationsPopoverProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: HospitalNotification['type']) => {
    switch (type) {
      case 'lab_panic':
        return <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'triage':
        return <UserPlus className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'bed':
        return <Activity className="w-4 h-4 text-amber-400 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-top-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Bell className="w-5 h-5 text-teal-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Hospital Telemetry Alerts</h3>
              <p className="text-[11px] text-slate-400">{unreadCount} unread clinical updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button 
                onClick={onMarkAllRead}
                className="text-[11px] text-teal-400 hover:text-teal-300 font-medium px-2 py-1 rounded bg-teal-950/50 hover:bg-teal-900/50 border border-teal-800/40"
              >
                Mark all read
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No notifications at this time
            </div>
          ) : (
            notifications.map(item => {
              const isPanic = item.type === 'lab_panic';
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectNotification(item)}
                  className={`p-3 rounded-xl transition-all cursor-pointer text-left relative ${
                    isPanic 
                      ? 'bg-rose-950/30 border border-rose-800/50 hover:bg-rose-900/40' 
                      : item.read 
                        ? 'hover:bg-slate-800/50 opacity-80' 
                        : 'bg-slate-800/70 border border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold truncate ${isPanic ? 'text-rose-300' : 'text-slate-100'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                      {isPanic && (
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateApp('doctor');
                              onClose();
                            }}
                            className="text-[10px] bg-rose-600 hover:bg-rose-500 text-white font-bold px-2 py-0.5 rounded shadow flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3 h-3" /> Open Doctor Cockpit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-center">
          <button 
            onClick={() => {
              onNavigateApp('central_hub');
              onClose();
            }}
            className="text-[11px] text-slate-400 hover:text-teal-400 flex items-center justify-center gap-1 w-full"
          >
            <span>View All Hospital Audit Trails</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
