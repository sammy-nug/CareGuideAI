import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Heart,
  HelpCircle,
  Search,
  ShieldAlert,
  Sparkles,
  Thermometer,
  Wind,
  X,
} from 'lucide-react';
import { HEALTH_TOPICS } from '../data/healthTopics';
import { HealthTopic, Language } from '../types';
import { TRANSLATIONS } from '../utils/pidginTranslations';

interface HealthLibraryViewProps {
  language: Language;
  selectedTopicId?: string | null;
  onStartHealthCheck: (query: string) => void;
}

export const HealthLibraryView: React.FC<HealthLibraryViewProps> = ({
  language,
  selectedTopicId,
  onStartHealthCheck,
}) => {
  const isPidgin = language === 'pcm';
  const t = TRANSLATIONS[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTopic, setActiveTopic] = useState<HealthTopic | null>(() => {
    if (selectedTopicId) {
      return HEALTH_TOPICS.find((t) => t.id === selectedTopicId) || null;
    }
    return null;
  });

  const categories = ['All', 'Common', 'Respiratory', 'Digestive', 'Chronic / Tropical', 'Urgent Check'];

  const filteredTopics = HEALTH_TOPICS.filter((topic) => {
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesSearch =
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.commonSymptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="health-library-view" className="space-y-8 py-6 sm:py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isPidgin ? 'Curated Health Knowledge' : 'Curated Internal Health Dataset'}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isPidgin ? 'Verified Health Information Library' : 'Curated Health Information Library'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          {isPidgin
            ? 'Read clear, medically verified educational information for 15 common health matters. E explain wetin dey cause am, general self-care advice, warning signs, and questions to ask doctor.'
            : 'Explore plain-language educational overviews for 15 common health conditions. Learn about general symptoms, safe supportive self-care, warning signs, and questions to ask your healthcare provider.'}
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="health-topic-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isPidgin ? 'Search health topic or symptom...' : 'Search condition or symptom...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-600"
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredTopics.length === 0 ? (
          <div
            id="no-topics-found"
            className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 col-span-full space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {isPidgin ? 'No topic match wetin you search' : 'No matching health topics found'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {isPidgin
                ? `We no find topic for "${searchQuery}". You fit try search another word or reset filters.`
                : `We could not find any topics matching "${searchQuery}". Try a different keyword or reset filters.`}
            </p>
            <button
              id="reset-library-filter-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              {isPidgin ? 'Clear Search & Filter' : 'Reset Search & Filter'}
            </button>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isUrgent = topic.category === 'Urgent Check';
            return (
              <div
                key={topic.id}
                id={`topic-card-${topic.id}`}
                onClick={() => setActiveTopic(topic)}
                className={`group p-5 sm:p-6 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between space-y-4 hover:shadow-sm ${
                  isUrgent
                    ? 'bg-red-50/50 hover:bg-red-50/80 dark:bg-red-950/20 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/60'
                    : 'bg-white hover:bg-slate-50/60 dark:bg-slate-900 dark:hover:bg-slate-800/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                        isUrgent
                          ? 'bg-red-200 dark:bg-red-900/80 text-red-950 dark:text-red-200'
                          : 'bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800'
                      }`}
                    >
                      {topic.category}
                    </span>
                    <span className="text-xs text-teal-700 dark:text-teal-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Read Guide →
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-800 dark:group-hover:text-teal-300 transition-colors">
                    {topic.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {isPidgin && topic.summaryPidgin ? topic.summaryPidgin : topic.summary}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>{topic.commonSymptoms.length} common signs</span>
                  <span>Self-care & red flags</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Topic Modal */}
      {activeTopic && (
        <div
          id="topic-detail-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in"
          onClick={() => setActiveTopic(null)}
        >
          <div
            id="topic-detail-modal-content"
            className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[85vh] flex flex-col transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="bg-slate-900 dark:bg-slate-950 text-white px-6 sm:px-8 py-5 flex items-center justify-between shrink-0 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                  {activeTopic.category} • Health Library
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-0.5">
                  {activeTopic.name}
                </h2>
              </div>
              <button
                id="close-topic-modal-btn"
                onClick={() => setActiveTopic(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-slate-800 dark:text-slate-200 text-sm">
              {/* Overview */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  General Overview
                </h4>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {activeTopic.overview}
                </p>
              </div>

              {/* Common Symptoms */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Common Symptoms & Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeTopic.commonSymptoms.map((sym, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Self Care Information */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>General Self-Care & Supportive Measures</span>
                </h4>
                <ul className="space-y-2">
                  {activeTopic.selfCare.map((care, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-xs sm:text-sm bg-teal-50/60 dark:bg-teal-950/40 p-3 rounded-xl border border-teal-100 dark:border-teal-900">
                      <span className="text-teal-700 dark:text-teal-400 font-bold">✓</span>
                      <span>{care}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warning Signs */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Warning Signs (Red Flags)</span>
                </h4>
                <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-2">
                  <ul className="space-y-1.5 text-xs sm:text-sm text-red-950 dark:text-red-200 font-medium">
                    {activeTopic.warningSigns.map((warn, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400 font-bold">⚠</span>
                        <span>{warn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* When to Seek Care */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  When Professional Care May Be Appropriate
                </h4>
                <p className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                  {activeTopic.whenToSeekCare}
                </p>
              </div>

              {/* Questions for Healthcare Professional */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Questions a User Could Ask a Healthcare Professional</span>
                </h4>
                <div className="space-y-2">
                  {activeTopic.doctorQuestions.map((q, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2">
                      <span className="font-bold text-slate-600 dark:text-slate-400">{i + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                Educational reference only • Not personal medical advice
              </span>

              <button
                id="topic-start-check-btn"
                onClick={() => {
                  const query = isPidgin
                    ? `I wan check my symptom about ${activeTopic.name}.`
                    : `I want to check my symptoms regarding ${activeTopic.name}.`;
                  setActiveTopic(null);
                  onStartHealthCheck(query);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                <span>{isPidgin ? 'Start Check with This Topic' : 'Start Health Check on This'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
