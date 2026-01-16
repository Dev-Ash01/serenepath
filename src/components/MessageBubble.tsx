// components/MessageBubble.tsx
import React from 'react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  emotion?: string;
  timestamp: string;
}

export function MessageBubble({ message }: { message: Message }) {
  const isBot = message.role === 'bot';
  const isCrisis = message.emotion === 'crisis';

  const emotionColors: Record<string, string> = {
    sadness: 'bg-blue-50 border-blue-200',
    anxiety: 'bg-orange-50 border-orange-200',
    anger: 'bg-red-50 border-red-200',
    calm: 'bg-green-50 border-green-200',
    hope: 'bg-yellow-50 border-yellow-200',
    neutral: 'bg-gray-50 border-gray-200',
    crisis: 'bg-red-100 border-red-500',
  };

  const emotionIcons: Record<string, string> = {
    sadness: '😔',
    anxiety: '😰',
    anger: '😠',
    calm: '😌',
    hope: '🌟',
    neutral: '💭',
    crisis: '⚠️',
  };

  const bgColor = emotionColors[message.emotion || 'neutral'] || emotionColors.neutral;
  const icon = emotionIcons[message.emotion || 'neutral'];

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`
          max-w-xs lg:max-w-md xl:max-w-lg
          rounded-lg p-4 text-sm leading-relaxed
          ${
            isBot
              ? `${bgColor} border text-slate-900`
              : 'bg-teal-600 text-white'
          }
          animate-fadeIn
        `}
      >
        {isBot && message.emotion && !isCrisis && (
          <div className='text-xs opacity-70 mb-2'>{icon} {message.emotion}</div>
        )}

        {isCrisis && (
          <div className='text-xs font-bold mb-2 text-red-700'>
            🚨 CRISIS RESOURCES
          </div>
        )}

        <div className='whitespace-pre-wrap break-words'>{message.content}</div>

        <div
          className={`
            text-xs mt-2 opacity-60
            ${isBot ? 'text-slate-600' : 'text-teal-100'}
          `}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
