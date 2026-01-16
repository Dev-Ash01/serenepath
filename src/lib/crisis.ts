// lib/crisis.ts
// Crisis detection and safe escalation

const crisisKeywords = [
  'suicide',
  'kill myself',
  'end my life',
  'jump off',
  'hang myself',
  'overdose',
  'cut myself',
  'hurt myself',
  'self harm',
  'want to die',
  'better off dead',
  'no reason to live',
];

const severeKeywords = [
  'hurt someone',
  'violence',
  'harm others',
  'kill someone',
  'attack',
];

const concernKeywords = [
  'everything is hopeless',
  'nobody cares',
  'i am worthless',
  'no one would miss me',
  'burden',
  'mistake',
];

export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: 'low' | 'medium' | 'high';
  response: string;
  resources: string[];
}

export function detectCrisis(message: string): CrisisDetectionResult {
  const lowerMessage = message.toLowerCase();
  let severity: 'low' | 'medium' | 'high' = 'low';
  let isCrisis = false;

  // Check for direct crisis language
  for (const keyword of crisisKeywords) {
    if (lowerMessage.includes(keyword)) {
      severity = 'high';
      isCrisis = true;
      break;
    }
  }

  // Check for violence/harm to others
  for (const keyword of severeKeywords) {
    if (lowerMessage.includes(keyword)) {
      severity = 'high';
      isCrisis = true;
      break;
    }
  }

  // Check for concerning patterns
  if (!isCrisis) {
    let concernCount = 0;
    for (const keyword of concernKeywords) {
      if (lowerMessage.includes(keyword)) {
        concernCount++;
      }
    }
    if (concernCount >= 2) {
      severity = 'medium';
      isCrisis = true;
    }
  }

  if (!isCrisis) {
    return {
      isCrisis: false,
      severity: 'low',
      response: '',
      resources: [],
    };
  }

  const crisisResources = getCrisisResources();
  const response = buildCrisisResponse(severity, crisisResources);

  return {
    isCrisis: true,
    severity,
    response,
    resources: crisisResources,
  };
}

function getCrisisResources(): string[] {
  // Auto-detect region based on timezone or use default
  // For now, provide multiple regions
  return [
    '🇺🇸 US: 988 Suicide & Crisis Lifeline (call/text 988)',
    '🇮🇳 India: AASRA 9820466726 | iCall 1860 2662 345',
    '🇬🇧 UK: Samaritans 116 123',
    '🇨🇦 Canada: 1-833-456-4566',
    '🇦🇺 Australia: 1300 659 467',
    '🇲🇽 Mexico: 5255 5259 8121',
    'International: findahelpline.com',
  ];
}

function buildCrisisResponse(
  severity: 'low' | 'medium' | 'high',
  resources: string[]
): string {
  const baseMessage = `I notice you're in deep pain right now, and I want you to know that I'm not equipped to help with this level of crisis. But real, trained professionals ARE. Please reach out to one of these resources immediately:

${resources.join('\n')}

If you're in immediate danger:
🚨 Call emergency services (911 in US, 112 in India, 999 in UK)
🚨 Go to the nearest emergency room
🚨 Tell someone you trust right now

Your life has value. This pain is temporary, even if it doesn't feel that way. Professional help can change things.`;

  return baseMessage;
}

export function isRecoveringFromCrisis(
  sessionMemory: any
): 'recovering' | 'monitoring' | 'safe' {
  if (!sessionMemory?.lastCrisisDetection) {
    return 'safe';
  }

  const timeSinceCrisis =
    Date.now() - new Date(sessionMemory.lastCrisisDetection).getTime();
  const minutesSinceCrisis = timeSinceCrisis / (1000 * 60);

  if (minutesSinceCrisis < 5) {
    return 'recovering';
  } else if (minutesSinceCrisis < 60) {
    return 'monitoring';
  }
  return 'safe';
}
