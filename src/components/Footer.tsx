import React from 'react';
import { Activity, HeartHandshake, Lock, Moon, Phone, ShieldAlert, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ActiveTab, Language } from '../types';
import { TRANSLATIONS } from '../utils/pidginTranslations';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  onOpenEmergencyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, language, onOpenEmergencyModal }) => {
  const isPidgin = language === 'pcm';
  const t = TRANSLATIONS[language];
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <footer id="app-footer" className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800 mt-20 transition-colors">
      {/* Mandatory Safety Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-amber-200 text-xs sm:text-sm font-medium">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
          <p id="footer-mandatory-disclaimer" className="leading-relaxed">
            {t.disclaimerBanner}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-display text-lg font-bold text-white tracking-tight">
                CareGuide<span className="text-teal-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {isPidgin
                ? 'CareGuide AI na smart health navigation system wey dey help people understand symptoms, know how urgent e be, and prepare well before them reach hospital.'
                : 'CareGuide AI is a responsible health navigation assistant designed to help general users understand symptoms, assess urgency levels, and prepare effectively for healthcare visits.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg flex items-center gap-1.5 border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-teal-400" /> No Registration Required
              </span>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg flex items-center gap-1.5 border border-slate-700">
                <HeartHandshake className="w-3.5 h-3.5 text-cyan-400" /> Ethical & Non-Diagnostic
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isPidgin ? 'App Sections' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  id="footer-link-home"
                  onClick={() => setActiveTab('home')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-chat"
                  onClick={() => setActiveTab('chat')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  {t.navChat}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-library"
                  onClick={() => setActiveTab('library')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  {t.navLibrary}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-insights"
                  onClick={() => setActiveTab('insights')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  {t.navInsights}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => setActiveTab('about')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  {t.navAbout}
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines & Theme Toggle */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Emergency Contacts
            </h4>
            <div className="text-sm space-y-2 text-slate-400">
              <p>
                <strong className="text-slate-200">Nigeria National Emergency:</strong> 112 / 199
              </p>
              <p>
                <strong className="text-slate-200">Ambulance / Police:</strong> 112
              </p>
              <p>
                <strong className="text-slate-200">International Emergency:</strong> 112 / 911
              </p>
              <button
                id="footer-emergency-view-btn"
                onClick={onOpenEmergencyModal}
                className="mt-2 text-xs font-bold text-red-300 underline hover:text-red-200 block cursor-pointer"
              >
                {isPidgin ? 'Check full emergency guide' : 'View full emergency protocols →'}
              </button>
            </div>

            {/* Footer Theme Toggle */}
            <div className="pt-2">
              <button
                id="footer-theme-toggle-btn"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-300" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CareGuide AI. Crafted for accessible health navigation.</p>
          <div className="flex items-center gap-4">
            <span>Deterministic Safety Guardrails Enabled</span>
            <span>•</span>
            <span>English & Nigerian Pidgin Supported</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
