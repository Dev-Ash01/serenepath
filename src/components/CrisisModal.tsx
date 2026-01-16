// components/CrisisModal.tsx
import React, { useState } from 'react';

interface CrisisModalProps {
  resources: string[];
}

export function CrisisModal({ resources }: CrisisModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (acknowledged) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-2xl max-w-md w-full p-6'>
        <div className='text-center mb-6'>
          <div className='text-5xl mb-3'>🚨</div>
          <h2 className='text-2xl font-bold text-red-600 mb-2'>
            I\'m Concerned About You
          </h2>
          <p className='text-slate-600'>
            I\'ve detected language that suggests you may be in crisis. I\'m not equipped to help with this level of distress.
          </p>
        </div>

        <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-6'>
          <h3 className='font-bold text-red-900 mb-3'>
            Please reach out for professional help:
          </h3>
          <div className='space-y-2 text-sm'>
            {resources.length > 0 ? (
              resources.map((resource, idx) => (
                <div key={idx} className='text-red-800'>
                  {resource}
                </div>
              ))
            ) : (
              <>
                <div className='text-red-800'>
                  🇺🇸 US: 988 Suicide & Crisis Lifeline
                </div>
                <div className='text-red-800'>
                  🇮🇳 India: AASRA 9820466726 | iCall 1860 2662 345
                </div>
                <div className='text-red-800'>
                  🇬🇧 UK: Samaritans 116 123
                </div>
              </>
            )}
          </div>
        </div>

        <div className='bg-yellow-50 p-4 rounded mb-6'>
          <p className='text-sm text-slate-700'>
            <strong>If you\'re in immediate danger:</strong>
            <br />
            📞 Call emergency services (911 in US, 112 in India, 999 in UK)
            <br />
            🏥 Go to the nearest emergency room
            <br />
            👤 Tell someone you trust right now
          </p>
        </div>

        <div className='bg-blue-50 p-4 rounded mb-6'>
          <p className='text-sm text-slate-700'>
            Your life has value. This pain is temporary, even if it doesn\'t feel that way right now. Professional help can change things.
          </p>
        </div>

        <button
          onClick={() => setAcknowledged(true)}
          className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition'
        >
          I Acknowledge & Will Seek Help
        </button>

        <p className='text-xs text-slate-500 text-center mt-4'>
          Our conversation has been paused. Please prioritize your safety.
        </p>
      </div>
    </div>
  );
}
