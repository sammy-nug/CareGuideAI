import React, { useState } from 'react';
import {
  Activity,
  BookOpen,
  Info,
  Menu,
  MessageSquare,
  Moon,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ActiveTab, Language } from '../types';
import { TRANSLATIONS } from '../utils/pidginTranslations';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenEmergencyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenEmergencyModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();
  const t = TRANSLATIONS[language];
  const isPidgin = language === 'pcm';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.navHome, icon: <Activity className="w-4 h-4" /> },
    { id: 'chat', label: t.navChat, icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'library', label: t.navLibrary, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'insights', label: t.navInsights, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'about', label: t.navAbout, icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Top micro-banner for Clinical Safety & Challenge Transparency */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-1 px-4 sm:px-6 lg:px-8 text-[11px] font-medium border-b border-slate-800 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-200 font-semibold tracking-wide">
              {isPidgin ? 'Safety Screening Protocol Dey Active' : 'Deterministic Safety Protocol Active'}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">
              {isPidgin ? 'Zero personal data stored' : 'Confidential • Zero personal data stored'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">
              {isPidgin ? 'Bilingual System:' : 'Language:'}
            </span>
            <button
              onClick={() => setLanguage(language === 'en' ? 'pcm' : 'en')}
              className="text-teal-400 hover:text-teal-300 font-bold transition-colors underline-offset-2 hover:underline cursor-pointer"
            >
              {language === 'en' ? 'Switch to Nigerian Pidgin 🇳🇬' : 'Switch to English 🇬🇧'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Identity */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            role="button"
            tabIndex={0}
            aria-label="CareGuide AI Home"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setActiveTab('home');
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-800 dark:bg-teal-700 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 dark:group-hover:bg-teal-600 transition-colors">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  CareGuide<span className="text-teal-700 dark:text-teal-400">AI</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 rounded-md border border-teal-200/80 dark:border-teal-800/80">
                  Clinical Navigation
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block leading-tight">
                Understand • Triage • Actionable Next Step
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav
            id="desktop-main-navigation"
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-teal-900 dark:text-teal-300 shadow-xs font-bold border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className={isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle, Language Switcher & Emergency Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark Mode Toggle Button */}
            <button
              id="theme-mode-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-200/70 dark:hover:bg-slate-750 transition-colors cursor-pointer"
              title={isDark ? (isPidgin ? 'Switch go Light mode' : 'Switch to Light Mode') : (isPidgin ? 'Switch go Dark mode' : 'Switch to Dark Mode')}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
              )}
            </button>

            {/* Language Switcher Button */}
            <div
              id="language-switcher"
              className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
            >
              <button
                id="lang-en-btn"
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="English language"
              >
                EN
              </button>
              <button
                id="lang-pcm-btn"
                onClick={() => setLanguage('pcm')}
                aria-pressed={language === 'pcm'}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  language === 'pcm'
                    ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Nigerian Pidgin English"
              >
                <span>Pidgin</span>
                <span className="text-[10px]">🇳🇬</span>
              </button>
            </div>

            {/* Emergency Button */}
            <button
              id="header-emergency-btn"
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer"
              title="Urgent Emergency Information"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Emergency</span>
              <span className="sm:hidden font-extrabold">112</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150"
        >
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-900 dark:text-teal-300 font-bold border border-teal-200/80 dark:border-teal-800/80'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Theme Toggle Row */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {isPidgin ? 'Display Theme:' : 'App Theme:'}
            </span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Emergency Protocol:</span>
            <button
              id="mobile-drawer-emergency-link"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEmergencyModal();
              }}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Dial 112 / 911</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

