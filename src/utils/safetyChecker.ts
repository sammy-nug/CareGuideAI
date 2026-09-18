import { EmergencySignal } from '../types';

interface EmergencyRule {
  category: string;
  keywords: RegExp[];
  reason: string;
  reasonPidgin: string;
}

const EMERGENCY_RULES: EmergencyRule[] = [
  {
    category: 'Severe Chest Pain / Cardiovascular Emergency',
    keywords: [
      /\b(severe\s+chest\s+pain|crushing\s+chest\s+pain|crushing\s+chest\s+pressure|heavy\s+(weight|pressure)\s+on\s+(my\s+)?chest|chest\s+tightness\s+radiating|chest\s+pain\s+(spreading|shooting|radiating)\s+to\s+(the\s+)?(arm|arms|jaw|back|neck|shoulder))\b/i,
      /\bchest\s+(pain|pressure|tightness)\s*(\+|\band\b|\&|,|\bwith\b)\s*(shortness\s+of\s+breath|difficulty\s+breathing|trouble\s+breathing|can'?t\s+breathe|cannot\s+breathe|hard\s+to\s+breathe|struggling\s+to\s+breathe|gasping|sweating|vomiting|dizziness|fainting)\b/i,
      /\b(shortness\s+of\s+breath|difficulty\s+breathing|trouble\s+breathing|can'?t\s+breathe|cannot\s+breathe|hard\s+to\s+breathe)\s*(\+|\band\b|\&|,|\bwith\b)\s*chest\s+(pain|pressure|tightness)\b/i,
      /\b(heart\s+attack|cardiac\s+arrest|myocardial\s+infarction)\b/i,
      /\b(my\s+chest\s+dey\s+pain\s+me\s+well\s+well|serious\s+chest\s+pain|crushing\s+pain\s+for\s+chest)\b/i,
    ],
    reason: 'Severe or crushing chest pain, especially with shortness of breath or radiating to the arm/jaw, indicates potential acute coronary syndrome requiring immediate emergency evaluation.',
    reasonPidgin: 'Serious chest pain wey dey heavy or dey spread go hand or neck, or with breath difficulty, need immediate emergency doctor check.',
  },
  {
    category: 'Breathing Emergency',
    keywords: [
      /\b(difficulty\s+breathing|can'?t\s+breathe|cannot\s+breathe|struggling\s+to\s+breathe|severe\s+shortness\s+of\s+breath|extreme\s+shortness\s+of\s+breath|gasping\s+for\s+air|gasping\s+for\s+breath|suffocating|choking|blue\s+lips|lips\s+turned\s+blue|cyanosis)\b/i,
      /\b(hard\s+to\s+breathe\s+at\s+all|breathless\s+sitting\s+still|wheezing\s+severely\s+and\s+can'?t\s+speak|unable\s+to\s+breathe)\b/i,
      /\b(breath\s+dey\s+seize|hard\s+to\s+breathe|can\s+no\s+breathe|no\s+fit\s+breathe)\b/i,
    ],
    reason: 'Severe difficulty breathing, gasping for air, or signs of low oxygen (blue lips) represent a critical respiratory emergency.',
    reasonPidgin: 'Wahala to breathe or when breath dey seize na serious emergency wey need urgent medical care sharp-sharp.',
  },
  {
    category: 'Loss of Consciousness / Unresponsiveness',
    keywords: [
      /\b(lost\s+consciousness|loss\s+of\s+consciousness|losing\s+consciousness|passed\s+out|passing\s+out|blacked\s+out|blacking\s+out|unresponsive|unresponsiveness|unconscious|unconsciousness)\b/i,
      /\b(fainted\s+and\s+(won'?t|cannot|can'?t)\s+wake|cannot\s+wake\s+up|unable\s+to\s+wake(\s+up)?|won'?t\s+wake\s+up|collapsed\s+and\s+not\s+responding|collapsed\s+suddenly|found\s+unconscious|found\s+unresponsive|in\s+a\s+coma|comatose)\b/i,
      /\b(person\s+faint|faint\s+wey\s+no\s+wake|fall\s+down\s+unconscious|fall\s+down\s+no\s+fit\s+wake)\b/i,
    ],
    reason: 'Loss of consciousness, unresponsiveness, or inability to awaken is an acute neurological/cardiovascular emergency requiring immediate clinical evaluation and resuscitation support.',
    reasonPidgin: 'Person wey faint or wey no fit wake up need emergency hospital care immediately.',
  },
  {
    category: 'Severe Bleeding',
    keywords: [
      /\b(severe\s+(uncontrolled\s+)?bleeding|uncontrolled\s+bleeding|bleeding\s+uncontrollably|bleeding\s+heavily|heavy\s+bleeding|profuse\s+bleeding|massive\s+bleeding|bleeding\s+(that\s+)?(won'?t|doesn'?t|can'?t|cannot)\s+stop|can'?t\s+stop\s+(the\s+)?bleeding|cannot\s+stop\s+(the\s+)?bleeding)\b/i,
      /\b(gushing\s+blood|blood\s+(is\s+)?gushing|spurting\s+blood|blood\s+spurting|arterial\s+bleeding|blood\s+soaking\s+through|hemorrhag(e|ing)|massive\s+blood\s+loss)\b/i,
      /\b(coughing\s+up\s+(large\s+amounts\s+of\s+)?blood|coughing\s+blood|vomiting\s+blood|throwing\s+up\s+blood|hematemesis|vomiting\s+coffee\s+ground\s+material|black\s+tarry\s+stools\s+with\s+dizziness)\b/i,
      /\b(blood\s+dey\s+rush|blood\s+no\s+dey\s+stop|blood\s+dey\s+gush|blood\s+dey\s+pour)\b/i,
    ],
    reason: 'Severe or uncontrolled bleeding, arterial spurting, or internal bleeding (vomiting/coughing blood) can rapidly lead to hemorrhagic shock and requires immediate surgical or emergency intervention.',
    reasonPidgin: 'Blood wey dey rush or no gree stop, or vomiting blood na direct emergency wey require hospital sharp-sharp.',
  },
  {
    category: 'Stroke Symptoms (FAST Signs)',
    keywords: [
      /\b(face\s+droop(ing)?|drooping\s+face|facial\s+droop(ing)?|one\s+side\s+of\s+(my\s+|the\s+)?face\s+is\s+numb|facial\s+paralysis)\b/i,
      /\b(arm\s+weakness|can'?t\s+raise\s+(one\s+|my\s+)?arm|sudden\s+paralysis|sudden\s+weakness\s+on\s+one\s+side|one\s+sided\s+weakness)\b/i,
      /\b(slurred\s+speech|can'?t\s+speak\s+clearly|speech\s+is\s+slurred|sudden\s+loss\s+of\s+speech|words\s+are\s+jumbled|inability\s+to\s+speak)\b/i,
      /\b(stroke|mini\s+stroke|signs\s+of\s+stroke|transient\s+ischemic\s+attack|tia)\b/i,
    ],
    reason: 'Sudden facial drooping, one-sided weakness, or slurred speech are hallmarks of acute stroke—a time-critical medical emergency requiring immediate thrombolytic or neurovascular care.',
    reasonPidgin: 'Face wey bend to one side, hand wey weak suddenly, or mouth wey no fit talk sharp na emergency wey need urgent attention.',
  },
  {
    category: 'Severe Allergic Reaction (Anaphylaxis)',
    keywords: [
      /\b(severe\s+allergic\s+reaction|anaphylaxis|anaphylactic\s+shock|throat\s+(is\s+)?closing|throat\s+swelling|swollen\s+throat|tongue\s+(is\s+)?swollen|swollen\s+tongue|lips\s+and\s+face\s+swelling\s+rapidly)\b/i,
      /\b(can'?t\s+swallow\s+and\s+can'?t\s+breathe|hives\s+with\s+(difficulty\s+breathing|shortness\s+of\s+breath|throat\s+tightness))\b/i,
    ],
    reason: 'Airway swelling (throat or tongue) combined with respiratory compromise indicates life-threatening anaphylaxis requiring immediate epinephrine and emergency stabilization.',
    reasonPidgin: 'Throat wey dey close or tongue wey swell reach where person no fit breathe na serious allergy wey need urgent hospital.',
  },
  {
    category: 'Seizure / Convulsions',
    keywords: [
      /\b(having\s+a\s+seizure|convulsing|convulsions|epileptic\s+fit|shaking\s+uncontrollably\s+and\s+unresponsive|foaming\s+at\s+the\s+mouth\s+with\s+shaking)\b/i,
      /\b(body\s+dey\s+shake\s+violently|fit\s+dey\s+catch)\b/i,
    ],
    reason: 'Active or repetitive seizures (status epilepticus) require emergency airway protection and anti-epileptic intervention.',
    reasonPidgin: 'When person dey shake body uncontrollably (convulsion/fit), make una seek medical help immediately.',
  },
  {
    category: 'Sudden Severe Confusion / Delirium',
    keywords: [
      /\b(sudden\s+severe\s+confusion|suddenly\s+confused|acute\s+delirium|disoriented\s+and\s+doesn'?t\s+know\s+who\s+they\s+are|hallucinating\s+with\s+high\s+fever\s+and\s+stiff\s+neck|stiff\s+neck\s+with\s+high\s+fever)\b/i,
      /\b(head\s+don\s+turn\s+suddenly|dey\s+talk\s+incoherent\s+suddenly)\b/i,
    ],
    reason: 'Sudden acute disorientation or high fever with neck stiffness may indicate central nervous system infections (such as meningitis) or severe metabolic crisis.',
    reasonPidgin: 'Sudden confusion where person no know where him dey or who him be na warning sign for emergency checkup.',
  },
  {
    category: 'Self-Harm / Mental Health Crisis',
    keywords: [
      /\b(suicide|suicidal|kill\s+myself|end\s+my\s+life|want\s+to\s+die|hang\s+myself|overdose\s+intentionally|self[\s-]harm\s+urgently)\b/i,
    ],
    reason: 'Active intent or risk of self-harm or suicide is a critical emergency requiring compassionate, immediate crisis intervention.',
    reasonPidgin: 'Any thought to harm yourself or end life need urgent compassionate support and crisis help right now.',
  },
  {
    category: 'Poisoning / Critical Exposure',
    keywords: [
      /\b(swallowed\s+poison|swallowed\s+bleach|ingested\s+battery|chemical\s+burn|snake\s+bite|venomous\s+bite|dog\s+bite\s+from\s+rabid)\b/i,
      /\b(severe\s+burns\s+over\s+large\s+area|high\s+fever\s+in\s+newborn|baby\s+under\s+3\s+months\s+with\s+fever)\b/i,
    ],
    reason: 'Toxic ingestions, envenomations, extensive burns, or neonatal fever demand immediate emergency triage and specialized antidotes/care.',
    reasonPidgin: 'Poisons, snake bites, or severe burns need emergency hospital care without waiting.',
  },
];

/**
 * Deterministic Safety Screening function.
 * Evaluates the text against strict emergency rules without relying on LLM randomness.
 * Guarantees that any red-flag emergency symptoms are intercepted immediately.
 */
export function checkEmergencySymptoms(inputText: string): EmergencySignal {
  if (!inputText || typeof inputText !== 'string') {
    return {
      isEmergency: false,
      category: '',
      reason: '',
      matchedSignals: [],
      immediateAdvice: '',
      immediateAdvicePidgin: '',
    };
  }

  const normalized = inputText.trim();
  const matchedSignals: string[] = [];
  let triggeredCategory = '';
  let reasonEn = '';
  let reasonPcm = '';

  // 1. Cross-symptom Composite Check: Chest symptom + Respiratory distress anywhere in text
  const hasChestSymptom = /\b(chest\s+(pain|pressure|tightness|discomfort)|pain\s+in\s+(my\s+)?chest)\b/i.test(normalized);
  const hasBreathingSymptom = /\b(difficulty\s+breathing|shortness\s+of\s+breath|trouble\s+breathing|can'?t\s+breathe|cannot\s+breathe|hard\s+to\s+breathe|struggling\s+to\s+breathe|gasping)\b/i.test(normalized);

  if (hasChestSymptom && hasBreathingSymptom) {
    const chestMatch = normalized.match(/\b(chest\s+(pain|pressure|tightness|discomfort)|pain\s+in\s+(my\s+)?chest)\b/i);
    const breathMatch = normalized.match(/\b(difficulty\s+breathing|shortness\s+of\s+breath|trouble\s+breathing|can'?t\s+breathe|cannot\s+breathe|hard\s+to\s+breathe|struggling\s+to\s+breathe|gasping)\b/i);

    if (chestMatch) matchedSignals.push(chestMatch[0]);
    if (breathMatch) matchedSignals.push(breathMatch[0]);

    triggeredCategory = 'Severe Chest Pain / Cardiovascular Emergency';
    reasonEn = 'Chest symptoms combined with breathing difficulty is a classic sign of cardiovascular compromise or acute pulmonary emergency.';
    reasonPcm = 'Chest pain wey follow breath difficulty na high-level emergency wey need hospital sharp-sharp.';
  }

  // 2. Individual Rule Checks
  for (const rule of EMERGENCY_RULES) {
    for (const pattern of rule.keywords) {
      const match = normalized.match(pattern);
      if (match) {
        matchedSignals.push(match[0]);
        if (!triggeredCategory) {
          triggeredCategory = rule.category;
          reasonEn = rule.reason;
          reasonPcm = rule.reasonPidgin;
        }
      }
    }
  }

  if (matchedSignals.length > 0) {
    return {
      isEmergency: true,
      category: triggeredCategory,
      reason: reasonEn,
      matchedSignals: Array.from(new Set(matchedSignals)),
      immediateAdvice:
        'Some of the information you provided indicates a potential medical emergency. Seek immediate medical attention or contact your local emergency services (e.g. 112, 199, or 911) right now.',
      immediateAdvicePidgin:
        'Some of wetin you tell us mean say na serious medical emergency. Make you rush go hospital or call your local emergency service (112 / 199) right now.',
    };
  }

  return {
    isEmergency: false,
    category: '',
    reason: '',
    matchedSignals: [],
    immediateAdvice: '',
    immediateAdvicePidgin: '',
  };
}
