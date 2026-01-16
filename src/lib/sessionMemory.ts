// lib/sessionMemory.ts
// Session state management and context compression

export interface SessionMemory {
  sessionId: string;
  startTime: string;
  turn: number;
  lastUpdateTime: string;
  keywordMap: {
    emotions: string[];
    situations: string[];
    themes: string[];
    values: string[];
  };
  emotionalTrajectory: Array<{
    turn: number;
    emotion: string;
    intensity: number;
    timestamp: string;
  }>;
  therapistNotes: string;
  lastUserMessage: string;
  lastBotResponse: string;
}

export function initializeSession(): SessionMemory {
  return {
    sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startTime: new Date().toISOString(),
    turn: 0,
    lastUpdateTime: new Date().toISOString(),
    keywordMap: {
      emotions: [],
      situations: [],
      themes: [],
      values: [],
    },
    emotionalTrajectory: [],
    therapistNotes: '',
    lastUserMessage: '',
    lastBotResponse: '',
  };
}

export function compressContext(
  sessionMemory: SessionMemory,
  conversationHistory: Array<{ role: string; content: string }>,
  keywords: any
): string {
  // Instead of sending entire history, send structured summary
  const emotionalTrend = getEmotionalTrend(sessionMemory);
  const recentThemes = getRecentThemes(sessionMemory);

  return `
Session Context (optimized for token efficiency):

Emotional Journey:
- Current emotion: ${keywords.primaryEmotion}
- Trend: ${emotionalTrend}
- Intensity: ${(keywords.emotionIntensity * 100).toFixed(0)}%

Key Topics:
- Situations: ${sessionMemory.keywordMap.situations.slice(-3).join(', ') || 'personal'}
- Themes: ${recentThemes.join(', ') || 'general support'}
- Previous focus: ${sessionMemory.therapistNotes || 'initial exploration'}

Recent conversation tone: ${getConversationTone(conversationHistory)}

This approach keeps context (~200 tokens) vs full history (2000+ tokens)
`;
}

function getEmotionalTrend(sessionMemory: SessionMemory): string {
  const trajectory = sessionMemory.emotionalTrajectory;
  if (trajectory.length < 2) return 'just starting';

  const recent = trajectory.slice(-3);
  const intensities = recent.map((t) => t.intensity);

  const isImproving =
    intensities[intensities.length - 1] < intensities[0];
  const isWorsening =
    intensities[intensities.length - 1] > intensities[0];

  if (isImproving) {
    return 'improving 📈';
  } else if (isWorsening) {
    return 'intensifying 📉';
  }
  return 'stable ➡️';
}

function getRecentThemes(sessionMemory: SessionMemory): string[] {
  const themes = sessionMemory.keywordMap.themes;
  return themes.slice(-3);
}

function getConversationTone(
  conversationHistory: Array<{ role: string; content: string }>
): string {
  if (conversationHistory.length === 0) return 'opening exploration';
  if (conversationHistory.length < 3) return 'initial disclosure';
  if (conversationHistory.length < 6) return 'deepening understanding';
  return 'established rapport';
}

export function getSentimentShift(sessionMemory: SessionMemory): {
  improved: boolean;
  percentChange: number;
} {
  const trajectory = sessionMemory.emotionalTrajectory;
  if (trajectory.length < 2) {
    return { improved: false, percentChange: 0 };
  }

  const first = trajectory[0].intensity;
  const last = trajectory[trajectory.length - 1].intensity;
  const percentChange = ((last - first) / first) * 100;

  return {
    improved: percentChange < 0,
    percentChange: Math.abs(percentChange),
  };
}

export function shouldProvideReminder(sessionMemory: SessionMemory): boolean {
  // Every 5 turns, remind user about AI limitations
  return sessionMemory.turn % 5 === 0 && sessionMemory.turn > 0;
}

export function getReminderMessage(): string {
  return `\n\n*Reminder: I'm an AI trained to listen and provide support, but I have real limits. I cannot diagnose, prescribe, or guarantee results. If you need ongoing support, please consider speaking with a licensed therapist.*`;
}

export function getSessionSummary(sessionMemory: SessionMemory): string {
  const duration = Math.floor(
    (Date.now() - new Date(sessionMemory.startTime).getTime()) / (1000 * 60)
  );
  const shift = getSentimentShift(sessionMemory);

  return `
Session Summary:
- Duration: ${duration} minutes
- Messages exchanged: ${sessionMemory.turn}
- Primary emotions explored: ${sessionMemory.keywordMap.emotions.join(', ') || 'various'}
- Emotional shift: ${shift.improved ? 'Improved ✓' : 'Still exploring'} (${shift.percentChange.toFixed(0)}%)
- Key areas: ${sessionMemory.keywordMap.situations.join(', ') || 'personal'}

Session ID: ${sessionMemory.sessionId}
`;
}

export function archiveSession(sessionMemory: SessionMemory): object {
  // Prepare session for storage (compress sensitive data)
  return {
    sessionId: sessionMemory.sessionId,
    duration: Date.now() - new Date(sessionMemory.startTime).getTime(),
    turns: sessionMemory.turn,
    keywordMap: sessionMemory.keywordMap,
    emotionalTrajectory: sessionMemory.emotionalTrajectory,
    sentiment_shift: getSentimentShift(sessionMemory),
    timestamp: sessionMemory.lastUpdateTime,
    // Raw messages are NOT stored for privacy
  };
}
