'use client';

import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import CrisisModal from './CrisisModal';
import SessionReminder from './SessionReminder';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  emotion?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectEmotion = (text: string): string => {
    const emotionKeywords: { [key: string]: string[] } = {
      sad: ['sad', 'depressed', 'unhappy', 'down', 'blue'],
      anxious: ['anxious', 'worried', 'nervous', 'stressed', 'panic'],
      angry: ['angry', 'furious', 'mad', 'frustrated', 'irritated'],
      happy: ['happy', 'great', 'wonderful', 'excited', 'joy'],
      scared: ['scared', 'afraid', 'terrified', 'frightened', 'fear'],
      lonely: ['lonely', 'alone', 'isolated', 'abandoned', 'disconnected'],
      exhausted: ['tired', 'exhausted', 'drained', 'burned out', 'fatigued'],
      hopeful: ['hope', 'better', 'improve', 'positive', 'optimistic'],
    };

    const lowerText = text.toLowerCase();
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        return emotion;
      }
    }
    return 'thoughtful';
  };

  const checkCrisisKeywords = (text: string): boolean => {
    const crisisKeywords = [
      'suicide',
      'kill myself',
      'harm myself',
      'self harm',
      'hurt myself',
      'end it all',
      'no point living',
      'want to die',
      'should be dead',
      'overdose',
    ];

    const lowerText = text.toLowerCase();
    return crisisKeywords.some((keyword) => lowerText.includes(keyword));
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      emotion: detectEmotion(input),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    if (checkCrisisKeywords(input)) {
      setShowCrisisModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-5),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date(),
          emotion: detectEmotion(data.response),
        };

        setMessages((prev) => [...prev, botMessage]);
        setSessionNotes(
          (prev) =>
            `${prev}\nUser: ${input}\nBot: ${data.response}\n---`
        );
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'I encountered an issue processing your message. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Connection error. Please check your internet and try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900">SerenePath</h1>
          <p className="text-sm text-slate-600">
            A safe space to talk and be heard
          </p>
        </div>
      </div>

      <SessionReminder />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-2xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">💙</div>
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">
                Welcome to SerenePath
              </h2>
              <p className="text-slate-600 max-w-md">
                I'm here to listen and support you. Feel free to share what's on
                your mind. Everything you tell me stays confidential and is just
                between us.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-300 animate-pulse"></div>
              <div className="w-8 h-8 rounded-full bg-slate-300 animate-pulse delay-100"></div>
              <div className="w-8 h-8 rounded-full bg-slate-300 animate-pulse delay-200"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            💙 This is a supportive space. If you're in crisis, please reach out
            to a mental health professional.
          </p>
        </div>
      </div>

      {showCrisisModal && (
        <CrisisModal onClose={() => setShowCrisisModal(false)} />
      )}
    </div>
  );
}
