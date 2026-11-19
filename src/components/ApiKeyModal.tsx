import React, { useState, useEffect } from 'react';
import { Key, Sparkles, Check, X, ShieldAlert, ExternalLink } from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey } from '../services/valerianAI';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [keyInput, setKeyInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getGeminiApiKey());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(keyInput);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setGeminiApiKey('');
    setKeyInput('');
    setSavedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 rounded-xl font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Valerian AI • Gemini API Key</h2>
              <p className="text-[11px] text-slate-400">Unlock real-time AI clinical reasoning</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Google Gemini API Key:
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-teal-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <span>Your key is stored securely in your local browser storage.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 hover:underline flex items-center gap-0.5 ml-1"
              >
                <span>Get Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center gap-2 font-semibold">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>API Key saved! Valerian AI is now live.</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition"
            >
              Clear Key
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition flex items-center gap-1.5 shadow-md shadow-teal-900/30"
              >
                <Check className="w-4 h-4" />
                <span>Save Key</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
