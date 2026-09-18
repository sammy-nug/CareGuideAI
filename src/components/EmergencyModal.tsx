import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/pidginTranslations';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isPidgin = language === 'pcm';
  const t = TRANSLATIONS[language];

  return (
    <div
      id="emergency-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="emergency-modal-content"
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-red-200 dark:border-red-900/60 overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-red-700 dark:bg-red-800 px-6 sm:px-8 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-900/60 px-2 py-0.5 rounded text-red-100">
                {t.emergencyNotice}
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-0.5">{t.emergencyHeading}</h2>
            </div>
          </div>
          <button
            id="close-emergency-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-5 text-slate-800 dark:text-slate-200">
          <div className="p-4 bg-red-50/80 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/60 text-red-950 dark:text-red-200 text-xs sm:text-sm font-semibold leading-relaxed">
            {isPidgin
              ? 'If you or person near you get any of these emergency signs, NO WAIT FOR CHATBOT. Seek immediate medical attention or call emergency line now now:'
              : 'If you or someone around you is experiencing life-threatening symptoms, DO NOT wait for an AI chat. Contact emergency medical services or go to the nearest emergency room immediately:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 font-medium text-slate-800 dark:text-slate-200">
              <span className="text-red-600 dark:text-red-400 font-bold">•</span>
              <span>{isPidgin ? 'Hard to breathe or gasping for air' : 'Severe difficulty breathing or choking'}</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 font-medium text-slate-800 dark:text-slate-200">
              <span className="text-red-600 dark:text-red-400 font-bold">•</span>
              <span>{isPidgin ? 'Crushing chest pain wey spread go arm' : 'Crushing chest pain or pressure'}</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 font-medium text-slate-800 dark:text-slate-200">
              <span className="text-red-600 dark:text-red-400 font-bold">•</span>
              <span>{isPidgin ? 'Person faint or no fit wake up' : 'Loss of consciousness / unresponsiveness'}</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 font-medium text-slate-800 dark:text-slate-200">
              <span className="text-red-600 dark:text-red-400 font-bold">•</span>
              <span>{isPidgin ? 'Face bend, arm weak, slurred talk' : 'Face drooping, arm weakness, slurred speech'}</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 font-medium text-slate-800 dark:text-slate-200">
              <span className="text-red-600 dark:text-red-400 font-bold">•</span>
              <span>{isPidgin ? 'Blood dey rush without stopping' : 'Severe uncontrolled heavy bleeding'}</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 font-medium text-slate-800 dark:text-slate-200">
              <span className="text-red-600 dark:text-red-400 font-bold">•</span>
              <span>{isPidgin ? 'Tongue/throat swell reach breath seize' : 'Severe allergic reaction with throat swelling'}</span>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isPidgin ? 'Emergency Numbers Wey You Fit Call' : 'Direct Emergency Shortcuts'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:112"
                id="call-nigeria-112-btn"
                className="flex items-center justify-between px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-sm transition-all shadow-xs active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  <span>Nigeria Emergency</span>
                </div>
                <span className="bg-red-900 px-2 py-0.5 rounded text-xs">112 / 199</span>
              </a>

              <a
                href="tel:911"
                id="call-general-emergency-btn"
                className="flex items-center justify-between px-4 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all shadow-xs active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  <span>General Emergency</span>
                </div>
                <span className="bg-slate-700 px-2 py-0.5 rounded text-xs">911 / 112</span>
              </a>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-1 font-medium">
            {t.emergencyActionAdvice}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-6 sm:px-8 py-4 flex justify-end">
          <button
            id="dismiss-emergency-modal-btn"
            onClick={onClose}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {isPidgin ? 'I Understand, Close' : 'I Understand, Return'}
          </button>
        </div>
      </div>
    </div>
  );
};
