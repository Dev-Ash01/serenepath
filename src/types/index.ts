// src/types/index.ts
// TypeScript type definitions for the entire application

/**
 * User message in the chat
 */
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  emotion?: string; // Detected emotion (user messages)
  emotionConfidence?: number; // Confidence of emotion detection (0-1)
  isCrisis?: boolean; // Whether crisis was detected
}

/**
 * Session memory - compressed context for API calls
 */
export interface SessionMemory {
  sessionId: string;
  userId: string;
  keywordMap: KeywordMap;
  emotionalTrajectory: EmotionalState[];
  crisisDetected: boolean;
  lastUpdated: number;
  messageCount: number;
}

/**
 * Keyword map - compressed representation of conversation
 */
export interface KeywordMap {
  emotions: {
    [emotion: string]: number; // emotion -> frequency
  };
  situations: string[]; // life situations mentioned (job, relationship, health, etc.)
  themes: string[]; // recurring themes (anxiety, loneliness, purpose, etc.)
  intensities: {
    overall: number; // 1-10 scale
    trend: "improving" | "worsening" | "stable";
  };
  therapeuticGoals: string[]; // what user wants to work on
  messageHistory: string[]; // last 5 message summaries (1-2 sentences each)
}

/**
 * Emotional state at a point in time
 */
export interface EmotionalState {
  timestamp: number;
  emotion: string;
  intensity: number; // 1-10
  primaryTheme: string; // main topic of conversation
}

/**
 * API request to chat endpoint
 */
export interface ChatRequest {
  message: string;
  sessionId: string;
  keywordMap: KeywordMap;
  crisisDetected: boolean;
  userEmotion?: string;
}

/**
 * API response from chat endpoint
 */
export interface ChatResponse {
  response: string;
  emotion?: string; // assistant's empathetic understanding
  suggestions?: string[]; // optional therapeutic suggestions
  crisisResponse?: boolean; // true if crisis response was triggered
  sessionUpdated: boolean;
}

/**
 * Crisis detection result
 */
export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: "low" | "medium" | "high"; // severity level
  keywords: string[]; // which keywords triggered crisis
  resources?: CrisisResource[]; // resources to provide
}

/**
 * Crisis resource (hotline, helpline)
 */
export interface CrisisResource {
  country: string;
  name: string;
  phone: string;
  url?: string;
  available24h: boolean;
}

/**
 * User session (stored in Firebase)
 */
export interface UserSession {
  sessionId: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  keywordMap: KeywordMap;
  crisisEscalated: boolean;
  isActive: boolean;
}

/**
 * Emotion detection result
 */
export interface EmotionResult {
  emotion: string;
  confidence: number; // 0-1
  shouldUseLocal: boolean; // if true, use local result instead of API call
}

/**
 * Therapeutic response metadata
 */
export interface TherapeuticMetadata {
  approach: "validation" | "exploration" | "grounding" | "insight" | "support";
  techniques: string[]; // e.g., ["active listening", "cognitive reframe"]
  empathyLevel: number; // 1-10 how empathetic the response is
  appropriateness: number; // 1-10 how appropriate for context
}

/**
 * Session summary (for analytics)
 */
export interface SessionSummary {
  sessionId: string;
  duration: number; // milliseconds
  messageCount: number;
  primaryEmotion: string;
  emotionalTrend: "improved" | "worsened" | "stable";
  crisisDetected: boolean;
  keyThemes: string[];
  completedAt: number;
}

/**
 * Firebase User Document
 */
export interface FirebaseUser {
  uid: string;
  email: string;
  createdAt: number;
  lastLogin: number;
  sessionCount: number;
  totalMessageCount: number;
  privacyConsent: boolean;
}

/**
 * Env variables
 */
export interface EnvConfig {
  NEXT_PUBLIC_FIREBASE_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  NEXT_PUBLIC_FIREBASE_APP_ID: string;
  GEMINI_API_KEY: string;
}

/**
 * Therapeutic prompt configuration
 */
export interface TherapeuticPromptConfig {
  tone: "warm" | "professional" | "supportive";
  approach: "person-centered" | "cognitive" | "somatic" | "mindfulness";
  focusArea: "validation" | "exploration" | "grounding" | "actionable";
  maxResponseLength: number; // tokens
  includeQuestions: boolean; // ask therapeutic questions
  includeTechniques: boolean; // suggest coping techniques
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string;
  code: string;
  timestamp: number;
  details?: Record<string, unknown>;
}
