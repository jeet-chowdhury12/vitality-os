import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, ShieldAlert, Copy, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, copied: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('Vitality-OS Telemetry Caught Error:', error, errorInfo);
  }

  private handleSoftReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleSafeReset = () => {
    try {
      localStorage.removeItem('vitality_patients');
      localStorage.removeItem('vitality_triage_queue');
      localStorage.removeItem('vitality_lab_orders');
      localStorage.removeItem('vitality_beds');
    } catch (e) {
      console.warn('Storage purge error', e);
    }
    window.location.href = '/';
  };

  private handleCopyDiagnostic = () => {
    const diagnostic = `Vitality-OS Diagnostic Trace:\nError: ${this.state.error?.message}\nStack: ${this.state.error?.stack}\nComponent: ${this.state.errorInfo?.componentStack}`;
    navigator.clipboard.writeText(diagnostic);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080c14] text-slate-100 flex items-center justify-center p-6 font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="max-w-xl w-full bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-teal-500" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400">
                  Vitality-OS Resilient Kernel
                </span>
                <h1 className="text-xl font-black text-white">Clinical Telemetry Safeguard Activated</h1>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              An unexpected render anomaly occurred in the UI presentation tier. All clinical records, triage dossiers, and active prescriptions remain intact in secure local cache.
            </p>

            {this.state.error && (
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl mb-6 font-mono text-[11px] text-rose-300 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                onClick={this.handleSoftReload}
                className="py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition"
              >
                <RefreshCw className="w-4 h-4" /> Reload Portal Interface
              </button>
              <button
                onClick={this.handleSafeReset}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/20 flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" /> Safe Mode Factory Reset
              </button>
            </div>

            <button
              onClick={this.handleCopyDiagnostic}
              className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-mono flex items-center justify-center gap-2 border border-slate-800 transition"
            >
              {this.state.copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {this.state.copied ? 'Diagnostics Copied to Clipboard' : 'Copy Crash Diagnostic Stack'}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
