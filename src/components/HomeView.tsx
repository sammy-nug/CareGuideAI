import React from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileText,
  Flame,
  Globe2,
  Heart,
  HelpCircle,
  LucideIcon,
  Shield,
  ShieldAlert,
  Sparkles,
  Thermometer,
  Zap,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/pidginTranslations';

interface HomeViewProps {
  onStartHealthCheck: (initialQuery?: string) => void;
  language: Language;
  onExploreTopic: (topicId: string) => void;
  onOpenEmergencyModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartHealthCheck,
  language,
  onExploreTopic,
  onOpenEmergencyModal,
}) => {
  const isPidgin = language === 'pcm';
  const t = TRANSLATIONS[language];

  const quickPrompts = [
    {
      text: 'I have had a headache since yesterday.',
      textPidgin: 'My head dey pain me since yesterday.',
      category: 'Headache',
      tag: 'Common',
    },
    {
      text: 'I have been coughing for three days.',
      textPidgin: 'I don dey cough for three days now.',
      category: 'Cough',
      tag: 'Respiratory',
    },
    {
      text: 'I feel dizzy when I stand up.',
      textPidgin: 'My eye dey turn me when I stand up.',
      category: 'Dizziness',
      tag: 'Circulation',
    },
    {
      text: 'I have a fever.',
      textPidgin: 'My body dey hot with fever.',
      category: 'Fever',
      tag: 'Infection',
    },
    {
      text: 'I have stomach pain.',
      textPidgin: 'My belle dey pain me.',
      category: 'Stomach',
      tag: 'Digestive',
    },
    {
      text: 'I have had a mild headache since yesterday.',
      textPidgin: 'Small headache dey disturb me since yesterday.',
      category: 'Normal Demo',
      tag: 'Routine Check',
    },
    {
      text: 'I have severe chest pain and difficulty breathing.',
      textPidgin: 'Severe chest pain dey hold me and I no fit breathe.',
      category: 'Emergency Demo',
      tag: 'Urgent Red Alert',
      isEmergency: true,
    },
  ];

  return (
    <div id="home-view" className="space-y-12 sm:space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-12 lg:p-14 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Eyebrow / Protocol Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-900/60 text-teal-300 text-xs font-semibold tracking-wide border border-teal-700/60">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>{isPidgin ? 'Smart Health Navigation System' : 'Clinical Health Navigation • Pre-Clinical Triage'}</span>
          </div>

          <h1
            id="hero-title"
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white"
          >
            {t.tagline}
          </h1>

          <p id="hero-subtitle" className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            {t.heroDescription}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              id="start-health-check-hero-btn"
              onClick={() => onStartHealthCheck()}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <span>{t.startHealthCheck}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              id="emergency-quick-alert-hero-btn"
              onClick={onOpenEmergencyModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-red-300 border border-red-900/80 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>{isPidgin ? 'Emergency Warning Protocol' : 'Emergency Triage Protocol'}</span>
            </button>
          </div>

          {/* Guarantees Row */}
          <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{isPidgin ? 'No need to create account' : 'No account or login required'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{isPidgin ? 'Deterministic safety rules active' : 'Deterministic safety screening'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{isPidgin ? 'English & Nigerian Pidgin' : 'English & Nigerian Pidgin'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards (1. Understand, 2. Check Urgency, 3. Prepare for Care) */}
      <section id="core-feature-cards" className="space-y-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            {t.featuresTitle}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {isPidgin ? 'Three steps to help your health' : 'Structured Navigation Protocol'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isPidgin
              ? 'From everyday talk to clear action step before you go clinic.'
              : 'Translating everyday symptom descriptions into structured, clinical-ready guidance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Understand */}
          <div
            id="feature-card-understand"
            className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold text-base border border-teal-200/70 dark:border-teal-800/80">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.features[0].title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{t.features[0].desc}</p>
            </div>
            <div className="pt-2 text-xs font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800">
              <span>{isPidgin ? 'No medical jargons' : 'Plain language dialogue'}</span>
            </div>
          </div>

          {/* Card 2: Check Urgency */}
          <div
            id="feature-card-urgency"
            className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-base border border-amber-200/70 dark:border-amber-800/80">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.features[1].title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{t.features[1].desc}</p>
            </div>
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border dark:border-emerald-800/80">
                Green
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border dark:border-amber-800/80">
                Yellow
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-300 border dark:border-red-800/80">
                Red
              </span>
            </div>
          </div>

          {/* Card 3: Prepare for Care */}
          <div
            id="feature-card-prepare"
            className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 flex items-center justify-center font-bold text-base border border-cyan-200/70 dark:border-cyan-800/80">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.features[2].title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{t.features[2].desc}</p>
            </div>
            <div className="pt-2 text-xs font-semibold text-cyan-800 dark:text-cyan-400 flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800">
              <FileText className="w-3.5 h-3.5" />
              <span>{isPidgin ? 'One-click doctor summary' : 'Clinician visit checklist'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Examples */}
      <section id="quick-start-examples-section" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {t.quickStartTitle}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {t.quickStartSubtitle}
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isPidgin ? 'Click any card to start chat immediately' : 'Select a symptom scenario to launch screening'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickPrompts.map((prompt, idx) => {
            const isRed = prompt.isEmergency;
            const query = isPidgin ? prompt.textPidgin : prompt.text;
            return (
              <button
                key={idx}
                id={`quick-prompt-${idx}`}
                onClick={() => onStartHealthCheck(query)}
                className={`group text-left p-4 rounded-xl transition-all border flex flex-col justify-between min-h-32 cursor-pointer ${
                  isRed
                    ? 'bg-red-50/70 hover:bg-red-100/90 border-red-300 dark:bg-red-950/30 dark:border-red-900/60 text-red-950 dark:text-red-200 shadow-xs'
                    : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs hover:border-teal-300 dark:hover:border-teal-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      isRed
                        ? 'bg-red-200 dark:bg-red-900/80 text-red-950 dark:text-red-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {prompt.tag}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${
                      isRed ? 'text-red-700 dark:text-red-400' : 'text-teal-700 dark:text-teal-400'
                    }`}
                  />
                </div>
                <p className={`text-xs sm:text-sm font-semibold leading-snug my-2 ${isRed ? 'font-bold text-red-950 dark:text-red-100' : 'text-slate-900 dark:text-slate-100'}`}>
                  "{query}"
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {isRed
                    ? isPidgin
                      ? '⚠️ Triggers immediate red emergency panel'
                      : '⚠️ Triggers deterministic emergency alert'
                    : isPidgin
                    ? 'Triage and guidance'
                    : 'Interactive triage & navigation'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Nigerian / African Health Context Spotlight */}
      <section className="rounded-2xl p-6 sm:p-8 bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-100/70 dark:bg-teal-950/70 px-2 py-0.5 rounded-md border dark:border-teal-800/60">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Community Healthcare Context</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isPidgin ? 'CareGuide AI dey ready for Naija & African Communities' : 'Tailored for African & Nigerian Communities'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isPidgin
              ? 'We include clear Pidgin English, information on tropical illnesses like Malaria, dehydration during hot season, and direct emergency call numbers for Nigeria (112/199) and beyond.'
              : 'Features respectful Nigerian Pidgin English translation, curated health education on common regional concerns including Malaria, dehydration, and hypertension, and direct phone links for local emergency lines.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
          <button
            id="explore-malaria-btn"
            onClick={() => onExploreTopic('malaria')}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-bold text-xs sm:text-sm shadow-xs text-center cursor-pointer"
          >
            {isPidgin ? 'Read About Malaria' : 'View Malaria Guide'}
          </button>
          <button
            id="start-check-nigerian-context-btn"
            onClick={() => onStartHealthCheck()}
            className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-xs text-center cursor-pointer"
          >
            {isPidgin ? 'Start Health Check Now' : 'Launch Assistant'}
          </button>
        </div>
      </section>
    </div>
  );
};
