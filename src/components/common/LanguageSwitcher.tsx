import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'ribbon' | 'floating';
}

export function LanguageSwitcher({ className = '', variant = 'ribbon' }: LanguageSwitcherProps) {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 ${className}`}>
        <button
          onClick={toggleLanguage}
          title={language === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}
          className="glass-btn px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-2xl border border-white/80 hover:scale-105 active:scale-95 transition-all text-slate-900 group"
        >
          <div className="w-6 h-6 rounded-xl bg-teal-500/20 text-teal-700 flex items-center justify-center font-bold">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center text-xs font-black tracking-wide">
            <span className={language === 'en' ? 'text-teal-700' : 'text-slate-400'}>EN</span>
            <span className="mx-1.5 text-slate-300">|</span>
            <span className={language === 'bn' ? 'text-emerald-700' : 'text-slate-400'}>বাংলা</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-bold ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-extrabold flex items-center gap-1 ${
          language === 'en'
            ? 'glass-btn-primary text-white shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Globe className="w-3 h-3" />
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-extrabold ${
          language === 'bn'
            ? 'glass-btn-primary text-white shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <span>বাংলা</span>
      </button>
    </div>
  );
}
