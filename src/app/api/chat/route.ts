import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractKeywords } from '@/lib/keywords';
import { detectCrisis } from '@/lib/crisis';
import { compressContext } from '@/lib/sessionMemory';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ChatRequest {
  message: string;
  sessionMemory: any;
  conversationHistory: any[];
}

interface ChatResponse {
  response: string;
  emotion: string;
  emotionScore: number;
  isCrisis: boolean;
  updatedMemory: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionMemory, conversationHistory }: ChatRequest = req.body;

    // 1. Extract keywords from user message
    const keywords = extractKeywords(message);

    // 2. Detect crisis signals
    const crisisDetection = detectCrisis(message);
    if (crisisDetection.isCrisis) {
      return res.status(200).json({
        response: crisisDetection.response,
        emotion: 'crisis',
        emotionScore: 1.0,
        isCrisis: true,
        updatedMemory: sessionMemory,
      });
    }

    // 3. Compress context using keyword map
    const compressedContext = compressContext(
      sessionMemory,
      conversationHistory,
      keywords
    );

    // 4. Build therapeutic prompt
    const therapeuticPrompt = buildTherapeuticPrompt(
      message,
      keywords,
      compressedContext,
      sessionMemory
    );

    // 5. Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const geminiResponse = await model.generateContent(therapeuticPrompt);
    const responseText =
      geminiResponse.response.text() ||
      'I hear you. Tell me more about what you are experiencing.';

    // 6. Update session memory with new keywords and emotional trajectory
    const updatedMemory = updateSessionMemory(
      sessionMemory,
      keywords,
      message,
      responseText
    );

    res.status(200).json({
      response: responseText,
      emotion: keywords.primaryEmotion || 'neutral',
      emotionScore: keywords.emotionIntensity || 0.5,
      isCrisis: false,
      updatedMemory,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: 'Failed to process message. Please try again.',
    });
  }
}

function buildTherapeuticPrompt(
  userMessage: string,
  keywords: any,
  compressedContext: string,
  sessionMemory: any
): string {
  return `You are a compassionate, empathetic therapist. Your role is to:
1. Deeply understand the user's emotional experience
2. Validate their feelings without judgment
3. Help them explore underlying emotions and patterns
4. Guide them toward insight and comfort
5. Suggest practical, grounded coping strategies
6. Never diagnose, prescribe, or make clinical recommendations

User's emotional context:
${compressedContext}

Key themes from this conversation:
- Primary emotions: ${keywords.emotions?.join(', ') || 'unclear'}
- Situations/stressors: ${keywords.situations?.join(', ') || 'unclear'}
- Emotional trend: ${sessionMemory?.emotionalTrajectory?.slice(-3)?.map((t: any) => t.emotion).join(' → ') || 'neutral'}

User's current message: "${userMessage}"

Respond with:
- Genuine warmth and understanding
- Validation of their experience
- A therapeutic question or gentle insight
- Practical support if appropriate
- Keep it conversational, 3-5 sentences max

Remember: You're here to listen, understand, and guide—not to fix or minimize their experience.`;
}

function updateSessionMemory(
  sessionMemory: any,
  keywords: any,
  userMessage: string,
  response: string
): any {
  const turn = (sessionMemory?.turn || 0) + 1;

  // Add to emotional trajectory
  const emotionalTrajectory = sessionMemory?.emotionalTrajectory || [];
  emotionalTrajectory.push({
    turn,
    emotion: keywords.primaryEmotion || 'neutral',
    intensity: keywords.emotionIntensity || 0.5,
    timestamp: new Date().toISOString(),
  });

  // Keep last 20 for memory
  if (emotionalTrajectory.length > 20) {
    emotionalTrajectory.shift();
  }

  // Merge keywords into keyword map
  const keywordMap = sessionMemory?.keywordMap || {
    emotions: [],
    situations: [],
    themes: [],
    values: [],
  };

  // Add new keywords (avoid duplicates)
  if (keywords.emotions)
    keywordMap.emotions = [
      ...new Set([...keywordMap.emotions, ...keywords.emotions]),
    ];
  if (keywords.situations)
    keywordMap.situations = [
      ...new Set([...keywordMap.situations, ...keywords.situations]),
    ];

  return {
    ...sessionMemory,
    turn,
    lastUpdateTime: new Date().toISOString(),
    emotionalTrajectory,
    keywordMap,
    lastUserMessage: userMessage.substring(0, 100),
    lastBotResponse: response.substring(0, 100),
  };
}
