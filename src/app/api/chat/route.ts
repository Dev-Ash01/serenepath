import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { detectEmotion, checkCrisisKeywords } from '@/lib/keywords';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Crisis check
    if (checkCrisisKeywords(message)) {
      return NextResponse.json(
        { error: 'Crisis detected - escalating' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build context from history
    let context = 'You are a supportive, empathetic therapist-like chatbot. ';
    context += 'Listen carefully, validate emotions, and provide thoughtful guidance. ';
    context += 'Never provide medical advice. ';

    if (history && history.length > 0) {
      context += '\nPrevious conversation:\n';
      history.slice(-5).forEach((msg: any) => {
        context += `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}\n`;
      });
    }

    const result = await model.generateContent(
      context + `\nUser says: "${message}"\n\nRespond with empathy and support:`
    );

    const responseText =
      result.response.candidates?.?.content?.parts?.?.text ||
      'I hear you. Please tell me more about how you are feeling.';

    const emotion = detectEmotion(message);

    return NextResponse.json({
      response: responseText,
      emotion,
      timestamp: new Date(),
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
