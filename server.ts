import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { checkEmergencySymptoms } from './src/utils/safetyChecker.ts';

dotenv.config();

const PORT = 3000;
const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// Lazy/safe initialization of Google Gen AI
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'CareGuide AI',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Deterministic safety check endpoint
app.post('/api/safety-check', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Text input is required' });
    return;
  }
  if (text.trim().length > 1500) {
    res.status(400).json({ error: 'Input is too long for safety screening.' });
    return;
  }
  const result = checkEmergencySymptoms(text);
  res.json(result);
});

// Strict medical safety sanitizer to ensure NO diagnosis or medication prescribing occurs
function sanitizeMedicalContent(text: string): string {
  if (!text) return '';
  let cleaned = text;

  // 1. Remove pharmaceutical dosages (e.g. 500mg, 10ml, etc.)
  cleaned = cleaned.replace(/\b\d+\s*(mg|milligram|mcg|microgram|ml|milliliter)s?\b/gi, '[consult a doctor or pharmacist for dosage]');
  cleaned = cleaned.replace(/\btake\s+\d+\s*(tablet|pill|capsule)s?\b/gi, 'discuss appropriate medication with a healthcare provider');
  cleaned = cleaned.replace(/\bprescribe\s+[a-zA-Z]+/gi, 'recommend consulting a doctor for any prescriptions');

  // 2. Prevent definitive diagnostic claims (e.g. "you have malaria", "you are suffering from asthma")
  cleaned = cleaned.replace(/\byou\s+(have|are\s+suffering\s+from|are\s+diagnosed\s+with)\s+([a-zA-Z\s]+)/gi, (_match, _verb, condition) => {
    return `your symptoms may be related to conditions such as ${condition.trim()}`;
  });

  return cleaned;
}

// Health Assistant Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, language = 'en', userProfile = {} } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Valid messages array is required' });
      return;
    }

    if (typeof language !== 'string' || !['en', 'pcm'].includes(language)) {
      res.status(400).json({ error: 'Unsupported language value' });
      return;
    }

    const normalizedLanguage: 'en' | 'pcm' = language === 'pcm' ? 'pcm' : 'en';
    const latestUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    const userText = latestUserMsg ? latestUserMsg.content : '';

    const allUserTexts = messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content)
      .join(' \n ');

    // 1. DETERMINISTIC SAFETY SCREENING (Pre-LLM Guardrail)
    // Both individual message and conversation context are screened.
    // Obvious emergency symptoms trigger the emergency UI before conversational flow.
    const check1 = checkEmergencySymptoms(userText);
    const check2 = checkEmergencySymptoms(allUserTexts);
    const emergencySignal = check1.isEmergency ? check1 : check2;

    if (emergencySignal.isEmergency) {
      const isPidgin = normalizedLanguage === 'pcm';
      res.json({
        role: 'assistant',
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
              ? 'These symptoms fit be dangerous if delay happen'
              : 'Symptoms indicate potential acute physiological compromise requiring clinical triage',
            isPidgin
              ? 'CareGuide AI no dey treat emergencies'
              : 'Immediate emergency services or hospital evaluation is necessary',
          ],
          educationalInfo: isPidgin
            ? emergencySignal.immediateAdvicePidgin
            : emergencySignal.immediateAdvice,
          recommendedNextSteps: [
            isPidgin
              ? 'Call emergency line immediately: 112 or 199 (Nigeria) / 911 / 112'
              : 'Call emergency medical services immediately (Nigeria 112/199, US 911, UK 999, or local emergency number)',
            isPidgin
              ? 'No drive car by yourself; make family or neighbor carry you go hospital'
              : 'Do not drive yourself. Have an emergency responder, friend, or relative transport you',
            isPidgin
              ? 'Stay calm, sit comfortably, and let someone stay with you'
              : 'Sit upright or lie comfortably and notify someone nearby of your state',
          ],
          questionsForDoctor: [
            isPidgin
              ? 'Doctor, what emergency tests do I need right away?'
              : 'Doctor, what emergency tests (ECG, blood gas, imaging, cardiac markers) are required immediately?',
            isPidgin
              ? 'What caused this sudden severe symptom?'
              : 'What is the immediate cause of this severe acute flare?',
          ],
          disclaimer:
            'CareGuide AI provides general health information and navigation support. It is not a medical professional and does not diagnose or treat medical conditions. For emergencies, seek immediate medical attention.',
        },
        content: isPidgin
          ? `⚠️ **URGENT MEDICAL ATTENTION**: ${emergencySignal.immediateAdvicePidgin}`
          : `⚠️ **URGENT MEDICAL ATTENTION**: ${emergencySignal.immediateAdvice}`,
      });
      return;
    }

    // 2. GEMINI AI NAVIGATION ASSISTANT (Guarded: Never overrides emergency rules)
    const ai = getGeminiClient();
    const isPidgin = normalizedLanguage === 'pcm';

    if (ai) {
      try {
        const systemInstruction = `You are CareGuide AI, an empathetic, highly responsible health navigation assistant.
TARGET AUDIENCE: General users and African / Nigerian communities seeking clear, jargon-free health navigation.
LANGUAGE: ${isPidgin ? 'Nigerian Pidgin English (warm, respectful, natural Nigerian Pidgin without derogatory stereotypes)' : 'Simple, plain, empathetic English'}.
PRIVACY: Do not request unnecessary personally identifiable information such as full names, phone numbers, home addresses, national IDs, or payment details. Keep the conversation focused on health context only.

STRICT HEALTHCARE BOUNDARIES:
1. You are NOT a doctor or healthcare professional.
2. NEVER diagnose any disease or condition (never say "You have malaria" or "You are suffering from bronchitis").
3. NEVER prescribe any medication, and NEVER specify pharmaceutical dosages (do not say "take 500mg of paracetamol every 4 hours").
4. NEVER claim medical certainty.
5. All outputs are general health education and navigation guidance to help the user decide an appropriate next step.

NAVIGATION WORKFLOW TO FOLLOW:
1. Acknowledge the user's concern with warmth and compassion.
2. Confirm that no obvious emergency red flags were reported.
3. If duration, severity, age group, or progression was not mentioned, provide 1-2 brief friendly follow-up questions.
4. Provide general educational health information (common causes, physiology in plain language, safe supportive self-care like clean water hydration, rest, cooling cloth).
5. Assign an Urgency Level:
   - GREEN: "Monitor / General Information" (mild, recent, improving, no red flags)
   - YELLOW: "Consider Professional Care" (symptoms lasting several days, getting worse, noticeable impact, or vulnerable age)
   - RED: "Urgent Medical Attention" (any worsening warning signs)
6. State 2-3 specific reasons under "Why this recommendation?" citing duration, severity trends, and absence/presence of warning flags.
7. Recommend safe supportive next steps (rest, hydration, symptom journal, or consulting a healthcare professional).
8. Suggest 2-3 practical questions the user can ask their healthcare provider.`;

        const formattedChat = messages.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

        const prompt = `Here is the conversation history:
${formattedChat}

User details (if provided): Age: ${userProfile.ageGroup || 'Not specified'}, Duration: ${userProfile.duration || 'Not specified'}, Severity: ${userProfile.severity || 'Not specified'}.

Please generate a structured navigation response adhering strictly to the safety guidelines.`;

        // 5-second timeout safeguard to ensure instant responsiveness
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 5000)
        );

        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.3,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                acknowledgement: {
                  type: Type.STRING,
                  description: 'Empathetic acknowledgement of user concern',
                },
                urgencyLevel: {
                  type: Type.STRING,
                  description: 'GREEN, YELLOW, or RED',
                },
                urgencyLabel: {
                  type: Type.STRING,
                  description: 'Label corresponding to urgency level',
                },
                whyFactors: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2 to 4 bullet points explaining why this level was selected',
                },
                educationalInfo: {
                  type: Type.STRING,
                  description: 'Plain language general educational information',
                },
                recommendedNextSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Safe next steps and self-care recommendations',
                },
                questionsForDoctor: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2-3 thoughtful questions to ask a doctor or nurse',
                },
                followUpQuestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '1-3 relevant clarifying questions if context is incomplete',
                },
                disclaimer: {
                  type: Type.STRING,
                  description: 'Safety disclaimer reminding user this is not a diagnosis',
                },
              },
              required: [
                'acknowledgement',
                'urgencyLevel',
                'urgencyLabel',
                'whyFactors',
                'educationalInfo',
                'recommendedNextSteps',
                'questionsForDoctor',
                'disclaimer',
              ],
            },
          },
        });

        const response = await Promise.race([aiPromise, timeoutPromise]);
        const rawText = response.text || '{}';
        const parsed = JSON.parse(rawText);

        // Normalize urgency level
        let level: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
        if (parsed.urgencyLevel === 'YELLOW' || parsed.urgencyLevel === 'RED') {
          level = parsed.urgencyLevel;
        }

        const cleanAck = sanitizeMedicalContent(parsed.acknowledgement || 'Thank you for sharing your concern.');
        const cleanEdu = sanitizeMedicalContent(parsed.educationalInfo || 'General rest, hydration, and monitoring are standard supportive measures.');
        const cleanSteps = Array.isArray(parsed.recommendedNextSteps)
          ? parsed.recommendedNextSteps.map((s: string) => sanitizeMedicalContent(s))
          : ['Rest and drink plenty of clean fluids', 'Monitor if symptoms change or persist'];
        const cleanWhy = Array.isArray(parsed.whyFactors)
          ? parsed.whyFactors.map((w: string) => sanitizeMedicalContent(w))
          : ['Symptoms appear mild or early-stage', 'No emergency red flags reported'];
        const cleanQuestions = Array.isArray(parsed.questionsForDoctor)
          ? parsed.questionsForDoctor.map((q: string) => sanitizeMedicalContent(q))
          : ['What should I monitor over the next 48 hours?', 'When should I return for an evaluation?'];

        res.json({
          role: 'assistant',
          navigation: {
            acknowledgement: cleanAck,
            urgencyLevel: level,
            urgencyLabel: parsed.urgencyLabel || (level === 'YELLOW' ? 'Consider Professional Care' : 'Monitor / General Information'),
            whyFactors: cleanWhy,
            educationalInfo: cleanEdu,
            recommendedNextSteps: cleanSteps,
            questionsForDoctor: cleanQuestions,
            followUpQuestions: parsed.followUpQuestions || [],
            disclaimer:
              'CareGuide AI provides general health information and navigation support. It is not a medical professional and does not diagnose or treat medical conditions. For emergencies, seek immediate medical attention.',
          },
          content: `${cleanAck}\n\n${cleanEdu}`,
        });
        return;
      } catch (geminiError) {
        console.warn('Gemini API call timed out or failed, using high-reliability deterministic fallback:', geminiError);
      }
    }

    // 3. CURATED DETERMINISTIC HEALTH ENGINE (Zero downtime, strict safety)
    const fallbackResponse = generateCuratedNavigation(userText, normalizedLanguage, userProfile);
    res.json({
      role: 'assistant',
      navigation: fallbackResponse,
      content: `${fallbackResponse.acknowledgement}\n\n${fallbackResponse.educationalInfo}`,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'An internal server error occurred',
      message: error?.message || 'Unknown error',
    });
  }
});

// Helper for deterministic, medically safe navigation for common symptoms
function generateCuratedNavigation(
  text: string,
  lang: 'en' | 'pcm',
  profile: { ageGroup?: string; duration?: string; severity?: string }
) {
  const isPidgin = lang === 'pcm';
  const lower = text.toLowerCase();

  // Basic symptom detection
  let topic = 'general';
  let urgency: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';

  if (lower.includes('cough')) topic = 'cough';
  else if (lower.includes('headache') || lower.includes('head pain')) topic = 'headache';
  else if (lower.includes('fever') || lower.includes('temperature') || lower.includes('hot body')) topic = 'fever';
  else if (lower.includes('throat')) topic = 'sore-throat';
  else if (lower.includes('stomach') || lower.includes('belly') || lower.includes('diarrhea') || lower.includes('vomit')) topic = 'digestive';
  else if (lower.includes('dizzy') || lower.includes('dizziness')) topic = 'dizziness';

  // Urgency logic based on duration and severity
  const durationLong =
    lower.includes('week') ||
    lower.includes('month') ||
    lower.includes('several days') ||
    lower.includes('3 days') ||
    lower.includes('4 days') ||
    lower.includes('5 days');
  const severityHigh = lower.includes('severe') || lower.includes('worse') || lower.includes('terrible');

  if (severityHigh || durationLong) {
    urgency = 'YELLOW';
  }

  // SYMPTOM SPECIFIC SAFE GUIDANCE (No diagnosis, no drug prescribing)
  if (topic === 'headache') {
    if (isPidgin) {
      return {
        acknowledgement: 'We hear say head dey pain you. Take heart, headache fit make person uncomfortable.',
        urgencyLevel: urgency,
        urgencyLabel: urgency === 'YELLOW' ? 'Go See Doctor / Health Clinic' : 'Dey Watch Am / General Information',
        whyFactors: [
          durationLong ? 'The headache don last for some days now' : 'The headache just start recently',
          severityHigh ? 'The pain dey strong well-well' : 'The headache dey mild without any red flags',
          'No warning signs like stiff neck, blurred vision, or fainting detected',
        ],
        educationalInfo:
          'Common reasons wey dey cause mild headache include say water no reach body (dehydration), stress, too much screen time, or lack of sleep. Make you rest for quiet, dim room and drink plenty clean water.',
        recommendedNextSteps: [
          'Drink 2 to 3 cups of clean water slowly',
          'Rest your head for quiet place wey breezy and dim',
          'Take small break from phone screen and television',
          urgency === 'YELLOW'
            ? 'Make you visit local clinic or pharmacy make health worker examine you properly'
            : 'Observe your head for the next 24 to 48 hours to see whether e go calm down',
        ],
        questionsForDoctor: [
          'Doctor, what common triggers could be causing my headaches?',
          'At what point should I be examined in person?',
          'What warning signs should make me return immediately?',
        ],
        followUpQuestions: [
          'How many days now since the headache start?',
          'You get any eye trouble or vomiting with the headache?',
        ],
        disclaimer:
          'CareGuide AI dey give general health information and navigation support. E no be doctor and e no dey replace qualified healthcare professional. For emergency, rush go hospital sharp-sharp.',
      };
    }

    return {
      acknowledgement: 'Thank you for sharing your concern. We understand that headaches can be uncomfortable and disruptive.',
      urgencyLevel: urgency,
      urgencyLabel: urgency === 'YELLOW' ? 'Consider Professional Care' : 'Monitor / General Information',
      whyFactors: [
        durationLong ? 'Headache has persisted for multiple days' : 'Headache is reported as recent and mild',
        severityHigh ? 'Discomfort is marked and requires medical oversight' : 'Symptoms are reported as mild without emergency warning signs',
        'No critical neurological red flags (such as neck stiffness, sudden weakness, or visual changes) were detected',
      ],
      educationalInfo:
        'Mild headaches are commonly associated with muscle tension, eye strain, mild dehydration, stress, or lack of restorative sleep. Staying well-hydrated, resting in a quiet dim space, and taking a break from electronic screens are safe foundational self-care measures.',
      recommendedNextSteps: [
        'Drink 2 to 3 glasses of clean water and stay well hydrated',
        'Rest in a quiet, dimly lit, well-ventilated room',
        'Take a scheduled break from digital screens and bright glare',
        urgency === 'YELLOW'
          ? 'Schedule an evaluation with a doctor, nurse, or community clinic for clinical examination'
          : 'Observe your symptoms over the next 24 to 48 hours',
      ],
      questionsForDoctor: [
        'What common triggers could be contributing to my headaches?',
        'What specific changes or warning signs should prompt an immediate clinic visit?',
        'Would any lifestyle adjustments or ergonomic checks be helpful?',
      ],
      followUpQuestions: [
        'How many days have you been experiencing this headache?',
        'Do you notice it more after screen time, reading, or lack of sleep?',
      ],
      disclaimer:
        'CareGuide AI provides general health information and navigation support. It is not a medical professional and does not diagnose or treat medical conditions. For emergencies, seek immediate medical attention.',
    };
  }

  if (topic === 'cough') {
    if (isPidgin) {
      return {
        acknowledgement: 'We hear say you get cough. We understand say cough fit disturb person sleep and comfort.',
        urgencyLevel: urgency,
        urgencyLabel: urgency === 'YELLOW' ? 'Go See Doctor / Health Clinic' : 'Dey Watch Am / General Information',
        whyFactors: [
          durationLong ? 'The cough don last for some days or weeks' : 'The cough just start recently (early stage)',
          severityHigh ? 'The cough dey disturb chest or sleep heavily' : 'The cough is mild without any breathing distress',
          'No warning signs like difficulty breathing, chest pain, or coughing up blood',
        ],
        educationalInfo:
          'Mild cough wey just start often happen when body dey fight mild cold, dust, or airway irritation. Warm clean water, honey (for adults), and rest dey help soothe the throat naturally.',
        recommendedNextSteps: [
          'Drink warm clean water or soothing warm tea steadily',
          'Avoid smoke, dust, and cold environments',
          'Rest well make your immune system work',
          urgency === 'YELLOW'
            ? 'Visit a community healthcare worker or clinic if the cough continues past several days'
            : 'Monitor the cough for the next 24 to 48 hours to check if it improves',
        ],
        questionsForDoctor: [
          'Doctor, how long does a common viral cough usually last?',
          'What signs should make me bring this cough for full clinic testing?',
          'Are there soothing remedies appropriate for my age group?',
        ],
        followUpQuestions: [
          'Is the cough dry or are you bringing up phlegm/mucus?',
          'Are you experiencing any fever or difficulty breathing?',
        ],
        disclaimer:
          'CareGuide AI dey give general health information and navigation support. E no be doctor and e no dey replace qualified healthcare professional. For emergency, rush go hospital sharp-sharp.',
      };
    }

    return {
      acknowledgement: 'Thank you for sharing your concern. We understand that a cough can be disruptive and tiring.',
      urgencyLevel: urgency,
      urgencyLabel: urgency === 'YELLOW' ? 'Consider Professional Care' : 'Monitor / General Information',
      whyFactors: [
        durationLong ? 'Cough has lasted for several days or more' : 'Symptoms appear to be in early stages (e.g. 1-2 days)',
        severityHigh ? 'Cough is severe or noticeably fatiguing' : 'Cough is reported as mild without breathing distress',
        'No emergency warning signs (such as gasping, chest tightness, or coughing blood) were detected',
      ],
      educationalInfo:
        'A mild cough of recent onset (1–2 days) is frequently the respiratory tract naturally clearing mild viral irritation or environmental dust. Staying well-hydrated with clean warm fluids, resting, and avoiding tobacco or cooking smoke are safe supportive first steps.',
      recommendedNextSteps: [
        'Drink warm clean fluids such as warm water or broth throughout the day',
        'Rest in a clean, well-ventilated room away from dust or smoke',
        'Keep a brief note of whether the cough is dry or productive',
        urgency === 'YELLOW'
          ? 'Schedule a visit with a healthcare professional or community clinic for physical examination'
          : 'Observe your symptoms for the next 24 to 48 hours',
      ],
      questionsForDoctor: [
        'What is the expected timeline for recovery from this cough?',
        'What symptoms (such as high fever or shortness of breath) should trigger immediate re-evaluation?',
        'Do I need a chest exam or sputum test if the cough persists?',
      ],
      followUpQuestions: [
        'Is the cough dry, or are you coughing up any mucus?',
        'Are you experiencing any fever, chills, or body aches?',
      ],
      disclaimer:
        'CareGuide AI provides general health information and navigation support. It is not a medical professional and does not diagnose or treat medical conditions. For emergencies, seek immediate medical attention.',
    };
  }

  // General curated fallback
  if (isPidgin) {
    return {
      acknowledgement: 'We hear you well and we understand wetin you dey experience.',
      urgencyLevel: urgency,
      urgencyLabel: urgency === 'YELLOW' ? 'Go See Doctor / Health Clinic' : 'Dey Watch Am / General Information',
      whyFactors: [
        durationLong ? 'The symptom don last for some days now' : 'The symptom just start recently',
        severityHigh ? 'The pain or discomfort dey noticeable well-well' : 'No serious emergency signs dey for wetin you talk',
        'No signs of emergency danger like breath seizure or loss of consciousness',
      ],
      educationalInfo:
        'General health knowledge show say body dey react when infection, stress, or tiredness dey. Make you rest well-well, drink plenty clean water, and avoid too much sun or heavy work.',
      recommendedNextSteps: [
        'Drink plenty clean water or oral rehydration fluids steadily',
        'Rest for cool, ventilated place and sleep well',
        urgency === 'YELLOW'
          ? 'Make you visit local clinic or registered pharmacy make healthcare worker examine you properly'
          : 'Monitor your body for 24-48 hours to see whether e dey improve',
      ],
      questionsForDoctor: [
        'Doctor, how long should I expect this recovery to take?',
        'Do I need any blood test like malaria RDT or checkup?',
        'What specific red flags should make me return immediately?',
      ],
      followUpQuestions: [
        'How many days now since this symptom start?',
        'You get any other signs like fever, cold, or body weakness?',
      ],
      disclaimer:
        'CareGuide AI dey give general health information and navigation support. E no be doctor and e no dey replace qualified healthcare professional. For emergency, rush go hospital sharp-sharp.',
    };
  }

  return {
    acknowledgement: 'Thank you for sharing your concern. We understand this can be uncomfortable.',
    urgencyLevel: urgency,
    urgencyLabel: urgency === 'YELLOW' ? 'Consider Professional Care' : 'Monitor / General Information',
    whyFactors: [
      durationLong ? 'Symptoms have lasted for several days or more' : 'Symptoms appear to be in early stages',
      severityHigh ? 'Discomfort is marked and requires medical oversight' : 'Symptoms are reported as mild without red flags',
      'No emergency warning signs (such as breathing distress or chest pressure) were detected',
    ],
    educationalInfo:
      'Many common symptoms represent the body’s natural response to mild viral illness, fatigue, or mild dehydration. Adequate rest, clean fluid hydration, and careful monitoring are safe foundational measures.',
    recommendedNextSteps: [
      'Prioritize clean water hydration and restorative rest',
      'Keep a brief log of when the symptom occurs and if anything makes it better or worse',
      urgency === 'YELLOW'
        ? 'Schedule a consultation with a qualified doctor, nurse, or community healthcare center for clinical examination'
        : 'Observe your symptoms for the next 24 to 48 hours',
    ],
    questionsForDoctor: [
      'What is the most probable cause of this symptom given my history?',
      'Are there any diagnostic tests (e.g. malaria test, blood count) indicated?',
      'What specific changes in my condition should trigger immediate return?',
    ],
    followUpQuestions: [
      'How many days have you been experiencing this?',
      'Are you experiencing any other symptoms, such as fever or body aches?',
    ],
    disclaimer:
      'CareGuide AI provides general health information and navigation support. It is not a medical professional and does not diagnose or treat medical conditions. For emergencies, seek immediate medical attention.',
  };
}

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareGuide AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
