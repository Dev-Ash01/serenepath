// components/ChatInterface.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { CrisisModal } from './CrisisModal';
import { SessionReminder } from './SessionReminder';
import { initializeSession, SessionMemory, getReminderMessage } from '@/lib/sessionMemory';

interface Message {
  role: 'user' | 'bot';
  content: string;
  emotion?: string;
  timestamp: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Hello, I\'m SerenePath. I\'m here to listen and support you. What\'s on your mind today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionMemory, setSessionMemory] = useState<SessionMemory>(initializeSession());
  const [crisisState, setCrisisState] = useState<{
    isActive: boolean;
    resources: string[];
  }>({ isActive: false, resources: [] });
  const [showReminder, setShowReminder] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call API with session context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          sessionMemory,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      // Check for crisis
      if (data.isCrisis) {
        setCrisisState({
          isActive: true,
          resources: data.updatedMemory.resources || [],
        });
        const botMessage: Message = {
          role: 'bot',
          content: data.response,
          emotion: 'crisis',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }

      // Add bot response
      const botMessage: Message = {
        role: 'bot',
        content: data.response,
        emotion: data.emotion,
        timestamp: new Date().toISOString(),
      };

      // Add reminder if needed
      const updatedMemory = data.updatedMemory;
      if (updatedMemory.turn % 5 === 0) {
        botMessage.content += getReminderMessage();
        setShowReminder(true);
        setTimeout(() => setShowReminder(false), 5000);
      }

      setMessages((prev) => [...prev, botMessage]);
      setSessionMemory(updatedMemory);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'bot',
        content: 'I had trouble processing that. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className='flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100'>
      {/* Header */}
      <div className='bg-white border-b border-slate-200 shadow-sm'>
        <div className='max-w-2xl mx-auto px-4 py-4'>
          <h1 className='text-2xl font-bold text-teal-700'>SerenePath</h1>
          <p className='text-sm text-slate-600'>A compassionate AI companion for emotional support</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className='flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full space-y-4'>
        {messages.map((message, idx) => (
          <MessageBubble key={idx} message={message} />
        ))}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-slate-200 rounded-lg px-4 py-3 max-w-xs'>
              <div className='flex space-x-2'>
                <div className='w-2 h-2 bg-slate-600 rounded-full animate-bounce'></div>
                <div className='w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-100'></div>
                <div className='w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-200'></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className='bg-white border-t border-slate-200 px-4 py-4'>
        <div className='max-w-2xl mx-auto'>
          <div className='flex gap-3'>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Share what\'s on your mind...'
              rows={3}
              disabled={isLoading || crisisState.isActive}
              className='flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none disabled:bg-slate-100'
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim() || crisisState.isActive}
              className='bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition h-fit'
            >
              Send
            </button>
          </div>
          <p className='text-xs text-slate-500 mt-2'>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Crisis Modal */}
      {crisisState.isActive && <CrisisModal resources={crisisState.resources} />}

      {/* Session Reminder */}
      {showReminder && <SessionReminder />}

      {/* Disclaimers */}
      <div className='bg-slate-100 border-t border-slate-200 px-4 py-3 text-xs text-slate-600'>
        <p>
          ⚠️ SerenePath is not a substitute for professional mental health treatment. In crisis? Call 988 (US) or local resources.
        </p>
      </div>
    </div>
  );
}
