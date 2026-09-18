import React, { useState } from 'react';
import { Check, Copy, Download, FileText, Printer, ShieldCheck, X } from 'lucide-react';
import { Language, UrgencyLevel, VisitSummary } from '../types';
import { TRANSLATIONS } from '../utils/pidginTranslations';

interface VisitSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: VisitSummary | null;
  language: Language;
}

export const VisitSummaryModal: React.FC<VisitSummaryModalProps> = ({
  isOpen,
  onClose,
  summary,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen || !summary) return null;

  const isPidgin = language === 'pcm';
  const t = TRANSLATIONS[language];

  const getUrgencyBadge = (level: UrgencyLevel) => {
    switch (level) {
      case 'GREEN':
        return {
          label: isPidgin ? 'Dey Watch Am / General Information' : 'Monitor / General Information',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'YELLOW':
        return {
          label: isPidgin ? 'Go See Doctor / Health Clinic' : 'Consider Professional Care',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'RED':
        return {
          label: isPidgin ? 'URGENT MEDICAL ATTENTION' : 'Urgent Medical Attention',
          color: 'bg-red-100 text-red-800 border-red-300',
        };
    }
  };

  const badge = getUrgencyBadge(summary.navigationLevel);

  const formattedPlainText = `CAREGUIDE AI - PREPARE FOR MY HEALTHCARE VISIT
Generated: ${summary.generatedAt}
Notice: Navigation guidance only - not a medical diagnosis.

1. MAIN CONCERN:
${summary.mainConcern}

2. DURATION:
${summary.duration || 'Not specified'}

3. SYMPTOMS MENTIONED:
${summary.symptomsMentioned.map((s) => `• ${s}`).join('\n') || 'None recorded'}

4. IMPORTANT DETAILS:
${summary.importantDetails.map((d) => `• ${d}`).join('\n') || 'None recorded'}

5. NAVIGATION LEVEL:
${badge.label}

6. QUESTIONS TO ASK HEALTHCARE PROFESSIONAL:
${summary.questionsToAsk.map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None'}

DISCLAIMER: CareGuide AI is not a doctor and does not diagnose conditions or prescribe medications.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedPlainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="visit-summary-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="visit-summary-modal-content"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-6 sm:px-8 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                CareGuide Consultation Prep
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {isPidgin ? 'Prepare for My Doctor Visit' : 'Prepare for My Healthcare Visit'}
              </h2>
            </div>
          </div>
          <button
            id="close-visit-summary-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200 max-h-[75vh] overflow-y-auto">
          {/* Navigation Level Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 gap-3">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isPidgin ? 'Navigation Level' : 'Navigation Level'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Generated: {summary.generatedAt}
            </span>
          </div>

          {/* Section 1: Main Concern */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isPidgin ? 'Main Concern' : 'Main Concern'}
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white">
              {summary.mainConcern}
            </div>
          </div>

          {/* Section 2: Duration */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isPidgin ? 'How Long E Don Last (Duration)' : 'Duration'}
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200">
              {summary.duration || (isPidgin ? 'Not specified during session' : 'Not specified')}
            </div>
          </div>

          {/* Section 3: Symptoms Mentioned */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isPidgin ? 'Symptoms Mentioned' : 'Symptoms Mentioned'}
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              {summary.symptomsMentioned.length > 0 ? (
                <ul className="space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
                  {summary.symptomsMentioned.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400 italic">None specifically isolated</span>
              )}
            </div>
          </div>

          {/* Section 4: Important Details */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isPidgin ? 'Important Details & Context' : 'Important Details'}
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              {summary.importantDetails.length > 0 ? (
                <ul className="space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
                  {summary.importantDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400 italic">No additional medical details entered</span>
              )}
            </div>
          </div>

          {/* Section 5: Questions to ask doctor */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              {isPidgin ? 'Questions to Ask Healthcare Professional' : 'Questions to Ask a Healthcare Professional'}
            </h3>
            <div className="space-y-2">
              {summary.questionsToAsk.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 text-sm font-medium text-teal-950 dark:text-teal-200 flex items-start gap-2.5"
                >
                  <span className="font-bold text-teal-700 dark:text-teal-400 shrink-0">{idx + 1}.</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
            {isPidgin
              ? 'Notice: This summary is generated from your chat input. Take am show your doctor or nurse make them fit examine you well.'
              : 'Notice: This summary is generated from your inputs to assist your discussion with a licensed healthcare practitioner. It does not replace medical records.'}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="print-summary-btn"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="whitespace-nowrap">{isPidgin ? 'Print Summary' : 'Print / Save PDF'}</span>
          </button>

          <button
            id="copy-summary-btn"
            onClick={handleCopy}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-teal-700 hover:bg-teal-800 text-white active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="whitespace-nowrap">{t.summaryCopied}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="whitespace-nowrap">{t.copySummary}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
