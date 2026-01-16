// lib/keywords.ts
// Keyword extraction and emotion detection from user messages

const emotionKeywords: Record<string, string[]> = {
  sadness: [
    'sad',
    'depressed',
    'hopeless',
    'down',
    'miserable',
    'unhappy',
    'tears',
    'crying',
    'devastated',
  ],
  anxiety: [
    'anxious',
    'worried',
    'nervous',
    'stressed',
    'panic',
    'afraid',
    'scared',
    'tense',
    'overwhelmed',
  ],
  anger: [
    'angry',
    'furious',
    'mad',
    'frustrated',
    'irritated',
    'rage',
    'annoyed',
    'bitter',
  ],
  loneliness: [
    'alone',
    'lonely',
    'isolated',
    'abandoned',
    'disconnected',
    'nobody',
    'unsupported',
  ],
  fatigue: [
    'tired',
    'exhausted',
    'burnt out',
    'drained',
    'depleted',
    'no energy',
    'fatigued',
  ],
  hope: [
    'better',
    'hopeful',
    'improving',
    'positive',
    'good',
    'better days',
    'progress',
  ],
  calm: ['calm', 'peaceful', 'relaxed', 'okay', 'fine', 'grounded', 'centered'],
  shame: [
    'ashamed',
    'embarrassed',
    'guilty',
    'worthless',
    'failure',
    'stupid',
    'inadequate',
  ],
};

const situationKeywords: Record<string, string[]> = {
  work: [
    'job',
    'work',
    'boss',
    'colleague',
    'deadline',
    'project',
    'office',
    'career',
    'promotion',
  ],
  relationship: [
    'partner',
    'relationship',
    'boyfriend',
    'girlfriend',
    'husband',
    'wife',
    'spouse',
    'love',
    'breakup',
  ],
  family: [
    'parent',
    'mother',
    'father',
    'sibling',
    'brother',
    'sister',
    'family',
    'home',
  ],
  health: ['sick', 'illness', 'pain', 'health', 'doctor', 'hospital', 'injury'],
  finance: ['money', 'financial', 'debt', 'bills', 'loan', 'broke', 'poor'],
  education: [
    'school',
    'college',
    'university',
    'exam',
    'study',
    'grades',
    'student',
  ],
  social: [
    'friend',
    'friends',
    'social',
    'party',
    'people',
    'crowd',
    'event',
    'meeting',
  ],
};

const coreThemes: Record<string, string[]> = {
  self_worth: [
    'worthless',
    'enough',
    'capable',
    'confident',
    'confidence',
    'believe in myself',
  ],
  perfectionism: [
    'perfect',
    'failure',
    'mistake',
    'should',
    'ought',
    'standards',
    'expectations',
  ],
  control: ['control', 'power', 'helpless', 'powerless', 'stuck', 'trapped'],
  belonging: ['belong', 'fit in', 'accepted', 'rejected', 'included', 'excluded'],
  meaning: [
    'purpose',
    'meaning',
    'direction',
    'lost',
    'pointless',
    'reason',
    'why',
  ],
};

export interface ExtractedKeywords {
  primaryEmotion: string;
  emotions: string[];
  emotionIntensity: number;
  situations: string[];
  themes: string[];
  keywords: string[];
  raw: string[];
}

export function extractKeywords(text: string): ExtractedKeywords {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  const detectedEmotions: string[] = [];
  let primaryEmotion = '';
  let emotionIntensity = 0;

  // Detect emotions
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const matches = keywords.filter((k) => text.includes(k));
    if (matches.length > 0) {
      detectedEmotions.push(emotion);
      if (detectedEmotions.length === 1) {
        primaryEmotion = emotion;
      }
      emotionIntensity = Math.min(1, emotionIntensity + matches.length * 0.1);
    }
  }

  // Detect situations
  const detectedSituations: string[] = [];
  for (const [situation, keywords] of Object.entries(situationKeywords)) {
    if (keywords.some((k) => text.includes(k))) {
      detectedSituations.push(situation);
    }
  }

  // Detect themes
  const detectedThemes: string[] = [];
  for (const [theme, keywords] of Object.entries(coreThemes)) {
    if (keywords.some((k) => text.includes(k))) {
      detectedThemes.push(theme);
    }
  }

  return {
    primaryEmotion: primaryEmotion || 'neutral',
    emotions: detectedEmotions,
    emotionIntensity: Math.min(1, emotionIntensity || 0.3),
    situations: detectedSituations,
    themes: detectedThemes,
    keywords: words.filter((w) => w.length > 3),
    raw: words,
  };
}

export function formatKeywordMap(keywords: ExtractedKeywords): string {
  return `
Emotions: ${keywords.emotions.join(', ') || 'not clearly expressed'}
Intensity: ${(keywords.emotionIntensity * 100).toFixed(0)}%
Situations: ${keywords.situations.join(', ') || 'personal'}
Core themes: ${keywords.themes.join(', ') || 'general emotional exploration'}
`;
}
