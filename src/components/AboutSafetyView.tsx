import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  FileCheck,
  Globe,
  HeartHandshake,
  Lock,
  Phone,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/pidginTranslations';

interface AboutSafetyViewProps {
  language: Language;
  onOpenEmergencyModal: () => void;
}

export const AboutSafetyView: React.FC<AboutSafetyViewProps> = ({
  language,
  onOpenEmergencyModal,
}) => {
  const isPidgin = language === 'pcm';
  const t = TRANSLATIONS[language];

  const ethicalPrinciples = [
    {
      title: isPidgin ? 'No Medical Diagnosis' : 'Strictly Non-Diagnostic',
      desc: isPidgin
        ? 'CareGuide AI no dey tell you say you get this disease or that disease. E only dey explain general information and help you navigate.'
        : 'CareGuide AI is explicitly prohibited from diagnosing medical conditions or diseases. It translates user symptoms into general educational guidance and navigation levels.',
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
    },
    {
      title: isPidgin ? 'No Medicine Prescriptions' : 'Zero Medication Prescriptions',
      desc: isPidgin
        ? 'CareGuide AI no fit prescribe drugs or recommend specific milligram doses for drugs. All prescription drugs must come from licensed doctor or pharmacist.'
        : 'CareGuide AI never prescribes medications, antibiotics, or specific drug dosages. Supportive self-care advice is strictly limited to safe general measures (hydration, rest, cooling compress).',
      icon: <FileCheck className="w-5 h-5 text-cyan-600" />,
    },
    {
      title: isPidgin ? 'No Replacement for Doctors' : 'Never Replaces Clinical Judgment',
      desc: isPidgin
        ? 'CareGuide AI no be human doctor or nurse. Nothing inside this app replace qualified medical evaluation.'
        : 'This software is designed as a navigation companion before clinical care, never as a substitute for an in-person physical examination by a registered medical doctor or community clinic.',
      icon: <Users className="w-5 h-5 text-teal-600" />,
    },
    {
      title: isPidgin ? 'Emergency Means Rush Hospital' : 'Emergency Zero-Delay Protocol',
      desc: isPidgin
        ? 'Any emergency sign like chest pain or breath seizure must be attended to immediately for hospital. We no dey delay person with long chat.'
        : 'Whenever emergency warning signs are detected, the system immediately surfaces bold red emergency callouts and directs the patient to urgent medical services without conversational delay.',
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
    },
    {
      title: isPidgin ? 'Strict Privacy & No Tracking' : 'Privacy-First Architecture',
      desc: isPidgin
        ? 'We no dey ask for your name, phone number, address, or card. We no dey store your private medical history for any central database.'
        : 'No account creation, login, or personal identifiers (name, phone, address) are requested or stored. Sessions live solely in your browser storage and can be cleared at any time.',
      icon: <Lock className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: isPidgin ? 'African & Nigerian Respectful Context' : 'African & Nigerian Context',
      desc: isPidgin
        ? 'CareGuide AI understand local sickness like malaria, hot weather dehydration, and e speak good English and respectful Pidgin.'
        : 'Built to recognize health realities across African communities, including tropical illnesses like malaria, climate dehydration factors, and respectful multilingual support.',
      icon: <Globe className="w-5 h-5 text-amber-600" />,
    },
  ];

  return (
    <div id="about-safety-view" className="space-y-12 py-6 sm:py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>{isPidgin ? 'Ethical AI & Safety Standards' : 'Ethical AI, Safety & Privacy'}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isPidgin ? 'CareGuide AI Safety & Ethical Commitments' : 'Ethical Foundations & Safety Architecture'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          {isPidgin
            ? 'We build CareGuide AI with high sense of responsibility. We make sure say safety of the user come first before any AI capability.'
            : 'CareGuide AI is built on uncompromising principles of patient safety, ethical technology deployment, and clinical humility. Learn how our guardrails protect you.'}
        </p>
      </div>

      {/* Principles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ethicalPrinciples.map((item, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {item.icon}
              </div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">{item.title}</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* AI Limitations & Human Oversight */}
      <section className="bg-slate-900 dark:bg-slate-950 text-slate-200 rounded-3xl p-8 sm:p-10 space-y-6 border border-slate-800">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Clinical Humility
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            AI Limitations & Human Oversight
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="space-y-2 bg-slate-800/80 dark:bg-slate-900 p-5 rounded-2xl border border-slate-700 dark:border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>What Artificial Intelligence CANNOT Do</span>
            </h4>
            <p>
              Large Language Models do not possess physical senses, stethoscope auscultation, palpation abilities, or laboratory diagnostics. They can misunderstand nuances or generate inaccurate suggestions.
            </p>
          </div>

          <div className="space-y-2 bg-slate-800/80 dark:bg-slate-900 p-5 rounded-2xl border border-slate-700 dark:border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-400" />
              <span>What CareGuide AI Is Designed For</span>
            </h4>
            <p>
              CareGuide acts as an educational compass. It assists patients in framing their symptoms, understanding urgency, and preparing targeted questions for their clinical visit.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            For medical emergencies, immediate human clinical intervention is essential.
          </div>
          <button
            id="about-open-emergency-btn"
            onClick={onOpenEmergencyModal}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all shrink-0 cursor-pointer"
          >
            Emergency Protocols (112)
          </button>
        </div>
      </section>

      {/* Mandatory Disclaimer Callout */}
      <section className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200 text-xs sm:text-sm leading-relaxed">
        <strong>Mandatory Regulatory Notice:</strong> {t.disclaimerBanner}
      </section>
    </div>
  );
};
