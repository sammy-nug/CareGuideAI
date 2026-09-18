export type Language = 'en' | 'pcm';

export type UrgencyLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface EmergencySignal {
  isEmergency: boolean;
  category: string;
  reason: string;
  matchedSignals: string[];
  immediateAdvice: string;
  immediateAdvicePidgin: string;
}

export interface StructuredNavigation {
  acknowledgement: string;
  urgencyLevel: UrgencyLevel;
  urgencyLabel: string;
  whyFactors: string[];
  educationalInfo: string;
  recommendedNextSteps: string[];
  questionsForDoctor: string[];
  followUpQuestions?: string[];
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  language: Language;
  emergencyAlert?: EmergencySignal;
  navigation?: StructuredNavigation;
  isStreaming?: boolean;
}

export interface HealthTopic {
  id: string;
  name: string;
  category: 'Common' | 'Respiratory' | 'Digestive' | 'Chronic / Tropical' | 'Urgent Check';
  summary: string;
  summaryPidgin?: string;
  overview: string;
  commonSymptoms: string[];
  selfCare: string[];
  warningSigns: string[];
  whenToSeekCare: string;
  doctorQuestions: string[];
  icon: string;
}

export interface VisitSummary {
  mainConcern: string;
  duration: string;
  symptomsMentioned: string[];
  importantDetails: string[];
  questionsToAsk: string[];
  navigationLevel: UrgencyLevel;
  generatedAt: string;
}

export type PipelineStage = 'idle' | 'concern' | 'safety' | 'conversation' | 'knowledge' | 'navigation' | 'summary';

export type ActiveTab = 'home' | 'chat' | 'library' | 'insights' | 'about';

export type ThemeMode = 'light' | 'dark' | 'system';
