import React, { useState, useEffect } from 'react';
import { 
  Download, Chrome, Smartphone, Monitor, ShieldCheck, 
  Sparkles, X, CheckCircle, ExternalLink, ArrowRight
} from 'lucide-react';

interface PwaExtensionBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PwaExtensionBanner({ isOpen, onClose }: PwaExtensionBannerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install Vitality-OS as a desktop or mobile browser application:\n\n1. In Chrome / Edge: Click the "Install" icon (computer screen with down arrow) in the address bar.\n2. Or click the 3-dots menu -> "Save and share" -> "Install Vitality-OS".\n3. On iPhone Safari: Tap Share -> "Add to Home Screen".');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Background glow banner */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-teal-600/20 via-cyan-600/20 to-indigo-600/20 -z-10" />

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> PWA &amp; Browser Extension
            </span>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-2">
            Install Vitality-OS on Any Device
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Run Vitality-OS standalone without browser tabs. Instant desktop workstation access for doctors and nurses, and mobile home screen app for patients with offline synchronization.
          </p>

          {/* Three Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left">
              <Monitor className="w-5 h-5 text-teal-400 mb-2" />
              <div className="text-xs font-bold text-white">Clinical Desktop</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Runs in dedicated window with multi-monitor cockpit support.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left">
              <Smartphone className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-xs font-bold text-white">Mobile PWA</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Patient medicine alarms &amp; camera QR prescription import.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left">
              <ShieldCheck className="w-5 h-5 text-indigo-400 mb-2" />
              <div className="text-xs font-bold text-white">Offline Vault</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Instant IndexedDB local cache when internet drops.</div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleInstallClick}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalled ? 'App Installed (Running)' : 'Install as Browser App / PWA'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
            >
              Continue in Browser
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Compatible with Chrome, Edge, Safari, Firefox, Opera</span>
            <span className="font-mono text-teal-400">DGHS FHIR Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
