import { Language, UrgencyLevel } from '../types';

export const TRANSLATIONS = {
  en: {
    appTitle: 'CareGuide AI',
    tagline: 'Understand your symptoms. Know your next step.',
    heroDescription:
      'CareGuide AI provides general health information and helps you navigate possible next steps. It does not replace a qualified healthcare professional.',
    startHealthCheck: 'Start Health Check',
    browseTopics: 'Explore Health Topics',
    navHome: 'Home',
    navChat: 'AI Assistant',
    navLibrary: 'Health Library',
    navInsights: 'AI Insights',
    navAbout: 'About & Ethics',
    emergencyNotice: 'Emergency Alert',
    emergencyHeading: 'URGENT MEDICAL ATTENTION',
    emergencyBody:
      'Some of the information you provided may indicate a medical emergency. Seek immediate medical attention or contact your local emergency service.',
    emergencyCallNigeria: 'Nigeria Emergency: 112 / 199',
    emergencyCallGeneral: 'Emergency Services: 112 / 911',
    emergencyActionAdvice: 'Please do not drive yourself. Have someone take you to the nearest hospital or call emergency response now.',
    urgencyGreen: 'Monitor / General Information',
    urgencyYellow: 'Consider Professional Care',
    urgencyRed: 'Urgent Medical Attention',
    urgencySubtext: 'Navigation guidance only — not a medical diagnosis.',
    whyHeading: 'Why this recommendation?',
    nextStepsHeading: 'Recommended Next Steps',
    doctorQuestionsHeading: 'Questions to ask a Healthcare Professional',
    disclaimerBanner:
      'CareGuide AI provides general health information and navigation support. It is not a medical professional and does not diagnose or treat medical conditions. For emergencies, seek immediate medical attention.',
    copySummary: 'Copy Visit Summary',
    summaryCopied: 'Summary Copied to Clipboard!',
    prepareVisit: 'Prepare for My Healthcare Visit',
    quickStartTitle: 'Quick Start Symptom Examples',
    quickStartSubtitle: 'Click any common concern to start a health navigation session:',
    featuresTitle: 'How CareGuide AI Guides You',
    features: [
      {
        title: '1. Understand',
        desc: 'Describe your symptoms in plain language. CareGuide helps clarify what you are experiencing without confusing medical jargon.',
      },
      {
        title: '2. Check Urgency',
        desc: 'Instant deterministic safety screening combined with navigation triage to identify whether home observation, clinical review, or immediate emergency care is indicated.',
      },
      {
        title: '3. Prepare for Care',
        desc: 'Generate a structured consultation summary with duration, key details, and tailored questions to discuss with your doctor or nurse.',
      },
    ],
    chatPlaceholder: 'Describe your symptom or health concern in your own words...',
    chatSend: 'Send Concern',
    resetChat: 'New Consultation',
    activePipeline: 'Active Pipeline Stage',
  },
  pcm: {
    appTitle: 'CareGuide AI',
    tagline: 'Understand your symptom. Know wetin be your next step.',
    heroDescription:
      'CareGuide AI dey provide general health information and e dey help you know the correct next step. E no be doctor and e no dey replace qualified healthcare professional.',
    startHealthCheck: 'Start Health Check Now',
    browseTopics: 'Check Health Topics',
    navHome: 'Home',
    navChat: 'Health Assistant',
    navLibrary: 'Health Library',
    navInsights: 'AI Insights',
    navAbout: 'About & Safety',
    emergencyNotice: 'Emergency Wahala',
    emergencyHeading: 'URGENT MEDICAL ATTENTION',
    emergencyBody:
      'Some of the information wey you give fit mean say na serious medical emergency. Make you rush go hospital or call your local emergency service right now.',
    emergencyCallNigeria: 'Nigeria Emergency: 112 / 199',
    emergencyCallGeneral: 'Emergency Lines: 112 / 911',
    emergencyActionAdvice: 'Abeg no drive by yourself. Make person carry you go nearest hospital emergency room sharp-sharp.',
    urgencyGreen: 'Dey Watch Am / General Information',
    urgencyYellow: 'Go See Doctor / Health Clinic',
    urgencyRed: 'Urgent Medical Attention Sharp-Sharp',
    urgencySubtext: 'Na navigation guidance be this — e no be medical diagnosis at all.',
    whyHeading: 'Why you dey see this recommendation?',
    nextStepsHeading: 'Next Steps Wey You Fit Take',
    doctorQuestionsHeading: 'Questions Wey You Fit Ask Doctor or Nurse',
    disclaimerBanner:
      'CareGuide AI dey give general health information and navigation support. E no be medical professional and e no dey diagnose or treat sickness. For emergency matter, rush go hospital immediately.',
    copySummary: 'Copy Visit Summary',
    summaryCopied: 'Summary Don Copy to Clipboard!',
    prepareVisit: 'Prepare for My Doctor Visit',
    quickStartTitle: 'Quick Start Example Matters',
    quickStartSubtitle: 'Click any of these common matters make we start check:',
    featuresTitle: 'How CareGuide AI Dey Help You',
    features: [
      {
        title: '1. Understand',
        desc: 'Explain wetin dey worry you in simple language. CareGuide go help break am down without big grammar.',
      },
      {
        title: '2. Check Urgency',
        desc: 'Strong safety screening to know whether na something you fit monitor with self-care, or whether you suppose see doctor or rush emergency.',
      },
      {
        title: '3. Prepare for Care',
        desc: 'Generate clean summary of your symptoms, duration, and good questions wey you go ask your doctor when you reach hospital.',
      },
    ],
    chatPlaceholder: 'Write wetin dey worry your body or how you dey feel...',
    chatSend: 'Send Concern',
    resetChat: 'Start Fresh Check',
    activePipeline: 'Active Pipeline Stage',
  },
};

export function getUrgencyBadgeText(level: UrgencyLevel, lang: Language): string {
  const t = TRANSLATIONS[lang];
  switch (level) {
    case 'GREEN':
      return t.urgencyGreen;
    case 'YELLOW':
      return t.urgencyYellow;
    case 'RED':
      return t.urgencyRed;
  }
}
