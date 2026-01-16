// src/lib/emotion.ts
// Optional ONNX model for local emotion detection (improves accuracy without API calls)

export interface EmotionResult {
  emotion: string;
  confidence: number;
  shouldUseLocal: boolean; // if confidence > 85%, use local result instead of API call
}

/**
 * Detect emotion using keyword patterns
 * This is a lightweight, no-dependency approach
 * For higher accuracy, integrate ONNX Runtime with a pre-trained model
 */
export function detectEmotionLocal(message: string): EmotionResult {
  const messageLower = message.toLowerCase();

  // Emotion patterns (keyword matching)
  const patterns = {
    anxious: {
      keywords: [
        "anxious",
        "nervous",
        "worried",
        "stressed",
        "panic",
        "afraid",
        "scared",
        "tense",
      ],
      weight: 1,
    },
    sad: {
      keywords: [
        "sad",
        "depressed",
        "unhappy",
        "down",
        "upset",
        "lonely",
        "hopeless",
        "despair",
      ],
      weight: 1,
    },
    angry: {
      keywords: [
        "angry",
        "furious",
        "frustrated",
        "mad",
        "irritated",
        "resentful",
        "rage",
      ],
      weight: 1,
    },
    calm: {
      keywords: [
        "calm",
        "peaceful",
        "relaxed",
        "serene",
        "peaceful",
        "content",
        "happy",
      ],
      weight: 1,
    },
    hopeful: {
      keywords: [
        "hopeful",
        "optimistic",
        "excited",
        "positive",
        "looking forward",
        "better",
      ],
      weight: 1,
    },
    exhausted: {
      keywords: [
        "exhausted",
        "tired",
        "drained",
        "burnt out",
        "overwhelmed",
        "fatigued",
      ],
      weight: 1,
    },
    confused: {
      keywords: [
        "confused",
        "uncertain",
        "lost",
        "unsure",
        "don't know",
        "unclear",
      ],
      weight: 1,
    },
    grateful: {
      keywords: ["grateful", "thankful", "appreciate", "blessed", "lucky"],
      weight: 1,
    },
  };

  const scores: { [key: string]: number } = {};
  let totalMatches = 0;

  // Score each emotion
  for (const [emotion, config] of Object.entries(patterns)) {
    let emotionScore = 0;
    for (const keyword of config.keywords) {
      if (messageLower.includes(keyword)) {
        emotionScore += config.weight;
        totalMatches++;
      }
    }
    scores[emotion] = emotionScore;
  }

  // If no keywords matched, return neutral with low confidence
  if (totalMatches === 0) {
    return {
      emotion: "neutral",
      confidence: 0.5,
      shouldUseLocal: false,
    };
  }

  // Find emotion with highest score
  const topEmotion = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const emotion = topEmotion[0];
  const score = topEmotion[1];

  // Calculate confidence (0-1 scale)
  const confidence = Math.min(score / totalMatches, 1.0);

  return {
    emotion,
    confidence: Math.round(confidence * 100) / 100,
    shouldUseLocal: confidence > 0.85, // Use local result if very confident
  };
}

/**
 * Get emoji for emotion (for UI display)
 */
export function getEmotionEmoji(emotion: string): string {
  const emojiMap: { [key: string]: string } = {
    anxious: "😰",
    sad: "😔",
    angry: "😠",
    calm: "😌",
    hopeful: "🌟",
    exhausted: "😫",
    confused: "😕",
    grateful: "🙏",
    neutral: "😐",
  };
  return emojiMap[emotion.toLowerCase()] || "😐";
}

/**
 * Get color for emotion (for UI styling)
 */
export function getEmotionColor(emotion: string): string {
  const colorMap: { [key: string]: string } = {
    anxious: "#FF6B6B", // Red
    sad: "#4ECDC4", // Teal
    angry: "#FF4444", // Dark Red
    calm: "#95E1D3", // Light Green
    hopeful: "#FFE66D", // Gold
    exhausted: "#9B59B6", // Purple
    confused: "#BDC3C7", // Gray
    grateful: "#F7B731", // Orange
    neutral: "#74B9FF", // Blue
  };
  return colorMap[emotion.toLowerCase()] || "#74B9FF";
}

/**
 * Optional: Integrate ONNX Runtime for better emotion detection
 * Uncomment and install: npm install onnxruntime-web
 *
 * import * as ort from 'onnxruntime-web';
 *
 * export async function detectEmotionONNX(message: string): Promise<EmotionResult> {
 *   // Load pre-trained emotion detection model
 *   // Encode message to tensor
 *   // Run inference
 *   // Return emotion with confidence
 * }
 */
