import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  BookOpen,
  CheckCircle2,
  Cpu,
  FileText,
  HelpCircle,
  Lock,
  MessageSquare,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Language, PipelineStage } from '../types';
import { TRANSLATIONS } from '../utils/pidginTranslations';

interface AiInsightsViewProps {
  language: Language;
  currentStage?: PipelineStage;
  onStartHealthCheck: () => void;
}

export const AiInsightsView: React.FC<AiInsightsViewProps> = ({
  language,
  currentStage = 'idle',
  onStartHealthCheck,
}) => {
  const isPidgin = language === 'pcm';
  const t = TRANSLATIONS[language];

  const pipelineSteps = [
    {
      id: 'concern',
      title: isPidgin ? '1. User Concern Input' : '1. User Concern',
      badge: 'Input Phase',
      desc: isPidgin
        ? 'User write wetin dey worry am in natural everyday language or Pidgin.'
        : 'User expresses health concerns, onset time, and symptoms in natural language without medical jargon.',
      icon: <MessageSquare className="w-5 h-5 text-teal-600" />,
      tag: 'Natural Language Input',
    },
    {
      id: 'safety',
      title: isPidgin ? '2. Deterministic Safety Screening' : '2. Safety Screening',
      badge: 'Critical Guardrail',
      desc: isPidgin
        ? 'Predefined deterministic rules scan for emergency signs (breathing seizure, chest pain, fainting, stroke) BEFORE or ALONGSIDE AI.'
        : 'Predefined deterministic rules evaluate text for critical red flags (severe breathlessness, crushing chest pain, anaphylaxis, unconsciousness) before or alongside AI.',
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      tag: 'Zero-Tolerance Safety Rules',
    },
    {
      id: 'conversation',
      title: isPidgin ? '3. AI Conversation' : '3. AI Conversation',
      badge: 'Context Gathering',
      desc: isPidgin
        ? 'Empathetic acknowledgement, clarifying duration and severity, adhering strictly to non-diagnostic boundaries.'
        : 'Empathetic conversation asking only essential follow-up questions (duration, severity, age group) strictly bounded by non-diagnostic rules.',
      icon: <Cpu className="w-5 h-5 text-cyan-600" />,
      tag: 'Gemini 3.8 Flash (Server-side)',
    },
    {
      id: 'knowledge',
      title: isPidgin ? '4. Health Information Retrieval' : '4. Health Information',
      badge: 'Curated Grounding',
      desc: isPidgin
        ? 'System cross-references verified educational facts for common conditions (malaria, cough, fever, hydration).'
        : 'Grounded against a curated dataset of 15 core conditions, ensuring reliable self-care and warning sign identification.',
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
      tag: 'Internal Curated Dataset',
    },
    {
      id: 'navigation',
      title: isPidgin ? '5. Next-Step Guidance & Triage' : '5. Next-Step Guidance',
      badge: 'Actionable Triage',
      desc: isPidgin
        ? 'Urgency level (Green, Yellow, Red) with clear "Why this recommendation?" explanation and safe next steps.'
        : 'Assigned navigation level (Green/Yellow/Red), explicit factors explaining the recommendation, and practical questions to ask a doctor.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      tag: 'Navigation Triage',
    },
  ];

  return (
    <div id="ai-insights-view" className="space-y-12 py-6 sm:py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 text-xs font-bold border border-cyan-200 dark:border-cyan-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isPidgin ? 'System Architecture & Transparency' : 'AI Transparency & Pipeline'}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isPidgin ? 'How CareGuide AI Dey Work' : 'How CareGuide Works'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          CareGuide combines conversational AI, curated health information, and predefined safety rules.
          The AI can make mistakes. It is intended for health information and navigation, not diagnosis or treatment.
        </p>
      </div>

      {/* Visual Pipeline (Required in Section 17) */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 transition-colors">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            System Demonstration Pipeline
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            End-to-End Health Navigation Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Notice: This demonstration visualizes architectural flow without exposing internal chain-of-thought.
          </p>
        </div>

        <div className="space-y-4 relative">
          {pipelineSteps.map((step, idx) => {
            const isLast = idx === pipelineSteps.length - 1;
            return (
              <React.Fragment key={step.id}>
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-teal-300 dark:hover:border-teal-500 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 shrink-0">
                      {step.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{step.title}</h3>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {step.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                    {step.tag}
                  </span>
                </div>

                {!isLast && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-5 h-5 text-slate-400 dark:text-slate-600 animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* The "Why am I seeing this recommendation?" Framework */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            "Why am I seeing this recommendation?"
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Every health navigation result generated by CareGuide explicitly states the clinical and contextual factors that contributed to its assessment:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span><strong>Duration factor:</strong> Has the symptom lasted hours, days, or weeks?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span><strong>Progression trend:</strong> Is the concern improving with self-care or getting worse?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span><strong>Safety screening check:</strong> Confirmation that zero life-threatening signals were triggered.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Deterministic Rule Precedence
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            LLMs are probabilistic by nature. For patient safety, CareGuide incorporates a <strong>hardcoded deterministic safety layer</strong> that intercepts obvious emergency signs:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400 font-bold">•</span>
              <span>Bypasses AI latency during chest pain or severe breathlessness.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400 font-bold">•</span>
              <span>Prevents LLM hallucinations or minimization of medical emergencies.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400 font-bold">•</span>
              <span>Instantly surfaces direct phone lines and emergency room protocols.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-800 to-slate-900 dark:from-teal-950 dark:to-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-transparent dark:border-slate-800">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">Experience CareGuide in Action</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Try entering a normal symptom or test the safety emergency guardrail.
          </p>
        </div>
        <button
          id="insights-start-check-btn"
          onClick={onStartHealthCheck}
          className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-md shrink-0 cursor-pointer"
        >
          Start Health Check
        </button>
      </div>
    </div>
  );
};
