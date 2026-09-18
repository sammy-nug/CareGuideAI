import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  Copy,
  FileText,
  HelpCircle,
  Info,
  Phone,
  PhoneCall,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import {
  ChatMessage,
  EmergencySignal,
  Language,
  PipelineStage,
  StructuredNavigation,
  UrgencyLevel,
  VisitSummary,
} from '../types';
import { checkEmergencySymptoms } from '../utils/safetyChecker';
import { TRANSLATIONS } from '../utils/pidginTranslations';
import { VisitSummaryModal } from './VisitSummaryModal';

interface ChatViewProps {
  language: Language;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
  onOpenEmergencyModal: () => void;
  onPipelineUpdate?: (stage: PipelineStage) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  language,
  initialQuery,
  onClearInitialQuery,
  onOpenEmergencyModal,
  onPipelineUpdate,
}) => {
  const isPidgin = language === 'pcm';
  const t = TRANSLATIONS[language];

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Load from local session if available
    const saved = localStorage.getItem('careguide_chat_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'initial-welcome',
        role: 'assistant',
        content: isPidgin
          ? 'Hello! I be CareGuide AI health assistant. Wetin dey worry your body today? Explain in your own words, and I go help you understand wetin e fit mean, check how urgent e be, and help you know the correct next step.'
          : 'Hello! I am CareGuide AI. Please describe what health concern or symptom you are experiencing in your own words. I will help you understand it, assess urgency, and guide your next steps.',
        timestamp: Date.now(),
        language,
      },
    ];
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{
    ageGroup?: string;
    duration?: string;
    severity?: string;
  }>({});

  const [activeVisitSummary, setActiveVisitSummary] = useState<VisitSummary | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Persist session to local storage
  useEffect(() => {
    try {
      localStorage.setItem('careguide_chat_session', JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // Handle incoming initialQuery from Quick Start
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');
    setErrorMsg(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
      language,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    if (onPipelineUpdate) onPipelineUpdate('safety');

    // 1. Instant Client-Side Deterministic Safety Screening Check
    const emergencySignal: EmergencySignal = checkEmergencySymptoms(query);

    if (emergencySignal.isEmergency) {
      if (onPipelineUpdate) onPipelineUpdate('safety');

      const emergencyAssistantMessage: ChatMessage = {
        id: `assistant-emergency-${Date.now()}`,
        role: 'assistant',
        content: isPidgin
          ? `⚠️ **URGENT MEDICAL ATTENTION NEEDED**: ${emergencySignal.immediateAdvicePidgin}`
          : `⚠️ **URGENT MEDICAL ATTENTION**: ${emergencySignal.immediateAdvice}`,
        timestamp: Date.now(),
        language,
        emergencyAlert: emergencySignal,
        navigation: {
          acknowledgement: isPidgin
            ? 'We hear wetin you talk, but we notice serious emergency sign wey need urgent attention now.'
            : 'We acknowledge your message, but urgent warning signs were detected that require immediate medical attention.',
          urgencyLevel: 'RED',
          urgencyLabel: 'URGENT MEDICAL ATTENTION',
          whyFactors: [
            isPidgin
              ? `Emergency signal detected: ${emergencySignal.category} (${emergencySignal.matchedSignals.join(', ')})`
              : `High-risk emergency sign detected: ${emergencySignal.category} (${emergencySignal.matchedSignals.join(', ')})`,
            isPidgin
              ? 'These symptoms fit cause serious danger if delay happen'
              : 'Symptoms indicate potential acute physiological compromise requiring clinical triage',
            isPidgin
              ? 'CareGuide AI no be emergency clinic'
              : 'Immediate emergency services or hospital evaluation is necessary',
          ],
          educationalInfo: isPidgin
            ? emergencySignal.immediateAdvicePidgin
            : emergencySignal.immediateAdvice,
          recommendedNextSteps: [
            isPidgin
              ? 'Call emergency lines now: 112 or 199 (Nigeria) / 911 / 112'
              : 'Call emergency medical services immediately (Nigeria 112/199, US 911, UK 999, or local emergency number)',
            isPidgin
              ? 'No drive yourself; make someone carry you go emergency hospital now now'
              : 'Do not drive yourself. Have an emergency responder, relative, or neighbor transport you immediately',
            isPidgin
              ? 'Sit down comfortably, no stress yourself, and make someone stay with you'
              : 'Sit upright or lie comfortably and notify someone nearby of your state',
          ],
          questionsForDoctor: [
            isPidgin
              ? 'Doctor, what emergency tests do I need right away?'
              : 'Doctor, what emergency tests (ECG, blood gas, imaging) are required immediately?',
            isPidgin
              ? 'What caused this sudden severe symptom?'
              : 'What is the immediate cause of this severe acute flare?',
          ],
          disclaimer:
            'CareGuide AI provides general health information and navigation support. It is not a medical professional and does not diagnose or treat medical conditions. For emergencies, seek immediate medical attention.',
        },
      };

      setMessages([...updatedMessages, emergencyAssistantMessage]);
      return;
    }

    // 2. Non-emergency: Call Server-side API
    setLoading(true);
    if (onPipelineUpdate) onPipelineUpdate('conversation');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          language,
          userProfile,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content || '',
        timestamp: Date.now(),
        language,
        emergencyAlert: data.emergencyAlert,
        navigation: data.navigation,
      };

      setMessages([...updatedMessages, assistantMsg]);
      if (onPipelineUpdate) onPipelineUpdate('navigation');
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(
        isPidgin
          ? 'Network problem small. We use our offline health system answer your matter below:'
          : 'Unable to reach the live AI server. Switched to offline health knowledge system:'
      );

      // Local graceful fallback
      const fallbackNav: StructuredNavigation = {
        acknowledgement: isPidgin
          ? 'We hear you well and we understand wetin you dey experience.'
          : 'Thank you for sharing your concern. We understand this can be uncomfortable.',
        urgencyLevel: 'GREEN',
        urgencyLabel: isPidgin ? 'Dey Watch Am / General Information' : 'Monitor / General Information',
        whyFactors: [
          'No acute emergency red flags were reported in your concern',
          'Supportive general self-care and observation are appropriate first steps',
        ],
        educationalInfo: isPidgin
          ? 'Many common symptoms come from tiredness, mild infection, or needing clean water. Rest well and drink plenty water.'
          : 'Many common symptoms represent mild viral illnesses, fatigue, or mild dehydration. Rest and clean hydration are standard supportive measures.',
        recommendedNextSteps: [
          'Drink plenty of clean water and rest in a well-ventilated space',
          'If the symptom lasts more than 2-3 days or worsens, visit a healthcare center',
        ],
        questionsForDoctor: [
          'What could be causing this symptom given my general health history?',
          'What red flag signs should prompt me to return immediately?',
        ],
        disclaimer:
          'CareGuide AI provides general health information and navigation support. It is not a medical professional and does not diagnose or treat medical conditions. For emergencies, seek immediate medical attention.',
      };

      const fallbackMsg: ChatMessage = {
        id: `assistant-fallback-${Date.now()}`,
        role: 'assistant',
        content: fallbackNav.educationalInfo,
        timestamp: Date.now(),
        language,
        navigation: fallbackNav,
      };

      setMessages([...updatedMessages, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    const resetMsg: ChatMessage[] = [
      {
        id: `welcome-reset-${Date.now()}`,
        role: 'assistant',
        content: isPidgin
          ? 'Fresh session don start. Wetin dey worry your body today?'
          : 'New session started. Please describe your health concern or symptom in your own words.',
        timestamp: Date.now(),
        language,
      },
    ];
    setMessages(resetMsg);
    setUserProfile({});
    setErrorMsg(null);
    try {
      localStorage.removeItem('careguide_chat_session');
    } catch {
      // ignore
    }
    if (onPipelineUpdate) onPipelineUpdate('idle');
  };

  const handleGenerateVisitSummary = (navigation?: StructuredNavigation) => {
    // Extract facts strictly from user messages
    const userInputs = messages.filter((m) => m.role === 'user').map((m) => m.content);
    const mainConcern = userInputs[0] || 'General Health Concern';
    const allText = userInputs.join(' ');

    // Extract symptoms mentions
    const symptomKeywords = [
      'cough',
      'fever',
      'headache',
      'throat',
      'diarrhea',
      'vomiting',
      'dizzy',
      'dizziness',
      'stomach pain',
      'chest pain',
      'back pain',
      'sweating',
      'chills',
      'fatigue',
      'weakness',
    ];

    const detectedSymptoms = symptomKeywords.filter((s) => allText.toLowerCase().includes(s));

    const durationKeywords = ['day', 'days', 'week', 'weeks', 'yesterday', 'today', 'morning', 'month'];
    let durationString = userProfile.duration || '';
    if (!durationString) {
      for (const word of durationKeywords) {
        const regex = new RegExp(`\\b(\\w+\\s+${word}|${word})\\b`, 'i');
        const match = allText.match(regex);
        if (match) {
          durationString = match[0];
          break;
        }
      }
    }

    const importantDetails: string[] = [];
    if (userProfile.ageGroup) importantDetails.push(`Age Group: ${userProfile.ageGroup}`);
    if (userProfile.severity) importantDetails.push(`Self-Reported Severity: ${userProfile.severity}`);
    if (userInputs.length > 1) {
      importantDetails.push(`Follow-up context: "${userInputs.slice(1).join('; ')}"`);
    }

    const summary: VisitSummary = {
      mainConcern,
      duration: durationString || (isPidgin ? 'Mentioned in chat session' : 'Reported during chat'),
      symptomsMentioned: detectedSymptoms.length > 0 ? detectedSymptoms : [mainConcern],
      importantDetails,
      questionsToAsk: navigation?.questionsForDoctor || [
        'What is the most likely diagnosis for these symptoms?',
        'Do I need any blood tests or imaging?',
        'What symptoms should make me return immediately?',
      ],
      navigationLevel: navigation?.urgencyLevel || 'GREEN',
      generatedAt: new Date().toLocaleString(),
    };

    setActiveVisitSummary(summary);
    setIsSummaryModalOpen(true);
    if (onPipelineUpdate) onPipelineUpdate('summary');
  };

  return (
    <div id="ai-health-assistant-view" className="max-w-4xl mx-auto py-4 sm:py-8 space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs gap-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-800 dark:bg-teal-700 text-white flex items-center justify-center font-bold shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {isPidgin ? 'CareGuide AI Health Consultation' : 'Clinical Health Navigation Workspace'}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Screening Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isPidgin
                ? 'Conversational navigation • No be medical diagnosis'
                : 'Interactive clinical triage • Not medical diagnosis or prescription'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="reset-chat-btn"
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            title="Reset consultation"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{t.resetChat}</span>
          </button>
        </div>
      </div>

      {/* Patient Context Filters Bar */}
      <div className="bg-slate-100/90 dark:bg-slate-900 p-3 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2.5 text-xs transition-colors">
        <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
          <span>{isPidgin ? 'Patient Context (Optional):' : 'Patient Context Filters:'}</span>
        </span>
        <select
          id="select-age-group"
          value={userProfile.ageGroup || ''}
          onChange={(e) => setUserProfile({ ...userProfile, ageGroup: e.target.value })}
          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-600 cursor-pointer"
        >
          <option value="">{isPidgin ? 'Age: Not selected' : 'Age Group: Unspecified'}</option>
          <option value="Child (<12)">Child (&lt;12 yrs)</option>
          <option value="Teenager (13-19)">Teenager (13-19 yrs)</option>
          <option value="Adult (20-59)">Adult (20-59 yrs)</option>
          <option value="Senior (60+)">Senior (60+ yrs)</option>
        </select>

        <select
          id="select-severity"
          value={userProfile.severity || ''}
          onChange={(e) => setUserProfile({ ...userProfile, severity: e.target.value })}
          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-600 cursor-pointer"
        >
          <option value="">{isPidgin ? 'Severity: Not selected' : 'Severity: Self-Reported'}</option>
          <option value="Mild (manageable)">Mild (manageable at home)</option>
          <option value="Moderate (disruptive)">Moderate (disrupts routine)</option>
          <option value="Severe (intense)">Severe (intense discomfort)</option>
        </select>

        <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-auto hidden md:inline">
          {isPidgin ? 'Informs risk evaluation' : 'Informs risk evaluation & checklist customization'}
        </span>
      </div>

      {/* Network / Offline Notice Banner */}
      {errorMsg && (
        <div
          id="chat-error-banner"
          className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl flex items-center justify-between text-xs text-amber-950 dark:text-amber-200 font-medium animate-in fade-in"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-lg text-amber-800 dark:text-amber-300 transition-colors cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chat Messages Log */}
      <div
        id="chat-messages-container"
        className="space-y-6 min-h-[440px] max-h-[640px] overflow-y-auto p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors"
      >
        {/* Empty State / Launchpad when only 1 welcome message exists */}
        {messages.length <= 1 && (
          <div id="consultation-empty-launchpad" className="p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-teal-100/70 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isPidgin ? 'How CareGuide Health Consultation dey work' : 'How CareGuide Health Navigation Works'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isPidgin
                    ? 'Type wetin dey worry you. We go check urgent warning signs first, tell you wetin e fit mean, and prepare questions for your doctor.'
                    : 'Describe your symptoms naturally. Our deterministic safety layer checks for emergencies, assesses urgency (Green, Yellow, Red), and generates doctor-ready visit notes.'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                {isPidgin ? 'Try one of these quick checks:' : 'Quick Consultation Starters:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleSendMessage(isPidgin ? 'I get mild headache since morning' : 'I have a mild headache since this morning')}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-teal-50/60 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left text-slate-800 dark:text-slate-200 font-medium hover:border-teal-300 dark:hover:border-teal-500 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>"{isPidgin ? 'Mild headache since morning' : 'Mild headache since morning'}"</span>
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border dark:border-emerald-800">Green</span>
                </button>
                <button
                  onClick={() => handleSendMessage(isPidgin ? 'Cough and light fever for 3 days now' : 'Cough and light fever for 3 days now')}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-teal-50/60 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left text-slate-800 dark:text-slate-200 font-medium hover:border-teal-300 dark:hover:border-teal-500 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>"{isPidgin ? 'Cough and fever for 3 days' : 'Cough and fever for 3 days'}"</span>
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border dark:border-amber-800">Yellow</span>
                </button>
                <button
                  onClick={() => handleSendMessage(isPidgin ? 'Severe chest pain wey spread go left arm and hard to breathe' : 'Severe chest pain radiating to left arm and difficulty breathing')}
                  className="p-2.5 rounded-xl bg-red-50/70 hover:bg-red-100/90 dark:bg-red-950/30 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-left text-red-950 dark:text-red-200 font-semibold hover:border-red-400 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>"Severe chest pain + difficulty breathing"</span>
                  <span className="text-[10px] font-bold text-red-900 dark:text-red-200 bg-red-200 dark:bg-red-900/80 px-2 py-0.5 rounded">Red Emergency</span>
                </button>
                <button
                  onClick={() => handleSendMessage(isPidgin ? 'Person just faint and no fit wake up' : 'Someone collapsed and is unresponsive')}
                  className="p-2.5 rounded-xl bg-red-50/70 hover:bg-red-100/90 dark:bg-red-950/30 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-left text-red-950 dark:text-red-200 font-semibold hover:border-red-400 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>"Loss of consciousness / faint"</span>
                  <span className="text-[10px] font-bold text-red-900 dark:text-red-200 bg-red-200 dark:bg-red-900/80 px-2 py-0.5 rounded">Red Emergency</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const hasEmergency = msg.emergencyAlert?.isEmergency;
          const nav = msg.navigation;

          return (
            <div
              key={msg.id}
              id={`chat-msg-${msg.id}`}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    hasEmergency
                      ? 'bg-red-600 text-white'
                      : 'bg-teal-800 dark:bg-teal-700 text-white'
                  }`}
                >
                  {hasEmergency ? <ShieldAlert className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-6 space-y-4 ${
                  isUser
                    ? 'bg-slate-900 dark:bg-teal-900/70 text-white shadow-xs rounded-tr-xs'
                    : hasEmergency
                    ? 'bg-red-50/80 dark:bg-red-950/30 border-2 border-red-500 dark:border-red-600 text-slate-900 dark:text-slate-100 rounded-tl-xs shadow-xs'
                    : 'bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 rounded-tl-xs shadow-xs'
                }`}
              >
                {/* User Message Text */}
                {isUser && (
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base leading-relaxed font-medium">{msg.content}</p>
                    <span className="text-[10px] text-slate-400 dark:text-teal-200/70 block text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                {/* Assistant Message with Emergency Alert */}
                {!isUser && hasEmergency && (
                  <div id="prominent-red-emergency-panel" className="space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-red-200 dark:border-red-800">
                      <span className="p-1.5 bg-red-600 text-white rounded-lg">
                        <AlertTriangle className="w-5 h-5" />
                      </span>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-400">
                          {t.emergencyNotice}
                        </span>
                        <h3 className="text-lg font-extrabold text-red-900 dark:text-red-200 tracking-tight">
                          {t.emergencyHeading}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 text-red-950 dark:text-red-200 font-bold text-sm leading-relaxed">
                      {isPidgin
                        ? 'Some of the information wey you give fit mean say na serious medical emergency. Seek immediate medical attention or contact your local emergency service now now.'
                        : 'Some of the information you provided indicates a potential medical emergency. Seek immediate medical attention or contact your local emergency service without delay.'}
                    </div>

                    {msg.emergencyAlert?.matchedSignals && msg.emergencyAlert.matchedSignals.length > 0 && (
                      <div className="text-xs text-red-900 dark:text-red-200 font-semibold bg-red-100/90 dark:bg-red-900/40 p-3 rounded-xl border border-red-200 dark:border-red-800">
                        <strong>
                          {isPidgin ? 'Emergency signal detected: ' : 'Critical Warning Signs Detected: '}
                        </strong>
                        <span className="font-bold">{msg.emergencyAlert.matchedSignals.join(', ')}</span>
                      </div>
                    )}

                    {/* Prominent Emergency Dial Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <a
                        href="tel:112"
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xs transition-all active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-4 h-4" />
                          <span>Nigeria Emergency</span>
                        </div>
                        <span className="bg-red-800 px-2 py-0.5 rounded text-xs">112 / 199</span>
                      </a>
                      <a
                        href="tel:911"
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-4 h-4" />
                          <span>General Emergency</span>
                        </div>
                        <span className="bg-slate-700 px-2 py-0.5 rounded text-xs">911 / 112</span>
                      </a>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium italic pt-1">
                      {isPidgin
                        ? 'Abeg no drive yourself. Make someone carry you go emergency hospital now.'
                        : 'Please do not drive yourself. Have an emergency responder, friend, or relative transport you immediately.'}
                    </p>
                  </div>
                )}

                {/* Assistant Structured Navigation (rendered for both normal and emergency guidance) */}
                {!isUser && nav && (
                  <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700/80">
                    {/* Plain language acknowledgement */}
                    {!hasEmergency && (
                      <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {nav?.acknowledgement || msg.content}
                      </div>
                    )}

                    {/* Urgency Badge */}
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl border ${
                        nav.urgencyLevel === 'RED'
                          ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800'
                          : nav.urgencyLevel === 'YELLOW'
                          ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                          : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Navigation Level:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                            nav.urgencyLevel === 'GREEN'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700'
                              : nav.urgencyLevel === 'YELLOW'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-700'
                              : 'bg-red-600 text-white border-red-700'
                          }`}
                        >
                          {nav.urgencyLevel === 'RED' ? 'RED: URGENT MEDICAL ATTENTION' : nav.urgencyLabel}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        {nav.urgencyLevel === 'RED'
                          ? (isPidgin ? 'Emergency checkup needed sharp-sharp' : 'Immediate emergency triage required')
                          : t.urgencySubtext}
                      </span>
                    </div>

                    {/* "Why this recommendation?" Section */}
                    {nav.whyFactors && nav.whyFactors.length > 0 && (
                      <div
                        className={`p-4 rounded-xl border space-y-2 ${
                          nav.urgencyLevel === 'RED'
                            ? 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-900/60'
                            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-700/80'
                        }`}
                      >
                        <h4
                          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            nav.urgencyLevel === 'RED' ? 'text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Info className={`w-3.5 h-3.5 ${nav.urgencyLevel === 'RED' ? 'text-red-600 dark:text-red-400' : 'text-teal-700 dark:text-teal-400'}`} />
                          <span>{t.whyHeading}</span>
                        </h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          {nav.whyFactors.map((factor, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className={nav.urgencyLevel === 'RED' ? 'text-red-600 dark:text-red-400 font-bold' : 'text-teal-700 dark:text-teal-400 font-bold'}>•</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* General Educational Health Information */}
                    {!hasEmergency && nav.educationalInfo && (
                      <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 space-y-2 text-xs sm:text-sm text-teal-950 dark:text-teal-200">
                        <h4 className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          <span>{isPidgin ? 'General Health Knowledge' : 'General Health Education'}</span>
                        </h4>
                        <p className="leading-relaxed">{nav.educationalInfo}</p>
                      </div>
                    )}

                    {/* Recommended Next Steps */}
                    {nav.recommendedNextSteps && nav.recommendedNextSteps.length > 0 && (
                      <div
                        className={`space-y-2 p-4 rounded-xl border ${
                          nav.urgencyLevel === 'RED'
                            ? 'bg-red-50/50 dark:bg-red-950/30 border-red-200 dark:border-red-900/60'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200/90 dark:border-slate-700/80'
                        }`}
                      >
                        <h4
                          className={`text-xs font-bold uppercase tracking-wider ${
                            nav.urgencyLevel === 'RED' ? 'text-red-800 dark:text-red-300' : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {t.nextStepsHeading}
                        </h4>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                          {nav.recommendedNextSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 font-medium">
                              <span className={nav.urgencyLevel === 'RED' ? 'text-red-600 dark:text-red-400 font-extrabold' : 'text-teal-700 dark:text-teal-400 font-bold'}>✓</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Questions for Healthcare Professional */}
                    {nav.questionsForDoctor && nav.questionsForDoctor.length > 0 && (
                      <div className="p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs sm:text-sm">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                          <span>
                            {nav.urgencyLevel === 'RED'
                              ? (isPidgin ? 'Questions for Emergency Doctor:' : 'Questions for Emergency Care Team:')
                              : t.doctorQuestionsHeading}
                          </span>
                        </h4>
                        <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                          {nav.questionsForDoctor.map((q, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-slate-500 dark:text-slate-400 font-bold">{i + 1}.</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Follow-up Questions */}
                    {!hasEmergency && nav.followUpQuestions && nav.followUpQuestions.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1.5 text-xs">
                        <span className="font-bold text-amber-900 dark:text-amber-200">
                          {isPidgin ? 'Helpful follow-up questions:' : 'Helpful context to note:'}
                        </span>
                        <ul className="space-y-1 text-amber-900 dark:text-amber-300">
                          {nav.followUpQuestions.map((fq, i) => (
                            <li key={i}>• {fq}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prepare for My Healthcare Visit Button */}
                    <div className="pt-2">
                      <button
                        id={`generate-summary-btn-${msg.id}`}
                        onClick={() => handleGenerateVisitSummary(nav)}
                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer ${
                          nav.urgencyLevel === 'RED'
                            ? 'bg-red-700 hover:bg-red-800'
                            : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-teal-400" />
                        <span>{isPidgin ? 'Prepare Summary for Doctor / Emergency' : t.prepareVisit}</span>
                      </button>
                    </div>

                    {/* Mandatory Disclaimer under response */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700/80 pt-2 leading-tight">
                      {nav.disclaimer || t.disclaimerBanner}
                    </p>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Multi-Phase Clinical Loading Indicator */}
        {loading && (
          <div className="flex gap-3 sm:gap-4 items-start text-slate-700 dark:text-slate-300 text-sm py-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-800 dark:bg-teal-700 text-white flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl space-y-2 max-w-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-900 dark:text-teal-300">
                <span className="inline-block w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                <span>
                  {isPidgin
                    ? 'Screening for emergency red flags & navigation level...'
                    : 'Screening emergency red-flags & evaluating urgency level...'}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full w-2/3 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form
        id="chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-2 transition-colors"
      >
        <input
          ref={inputRef}
          id="chat-text-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chatPlaceholder}
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-600 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
        />

        <button
          type="submit"
          id="chat-submit-btn"
          disabled={loading || !input.trim()}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{t.chatSend}</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Disclaimer under input */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-2 gap-1 text-center sm:text-left">
        <span>
          {isPidgin
            ? '⚠️ If condition dey very bad or emergency, no wait for chat.'
            : '⚠️ Never wait for an AI chat during life-threatening medical emergencies.'}
        </span>
        <button
          id="chat-bottom-emergency-btn"
          onClick={onOpenEmergencyModal}
          className="text-red-600 dark:text-red-400 font-bold hover:underline cursor-pointer"
        >
          Emergency Contacts (112)
        </button>
      </div>

      {/* Visit Summary Modal */}
      <VisitSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summary={activeVisitSummary}
        language={language}
      />
    </div>
  );
};
