// components/SessionReminder.tsx
import React, { useEffect, useState } from 'react';

export function SessionReminder() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className='fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-lg animate-slideUp'>
      <p className='text-sm text-slate-700'>
        <strong>💙 Remember:</strong> I\'m an AI trained to listen and provide support. I have real limits and cannot diagnose, prescribe, or guarantee results. For ongoing support, please consider speaking with a licensed therapist.
      </p>
      <button
        onClick={() => setIsVisible(false)}
        className='text-xs text-blue-600 hover:text-blue-800 font-medium mt-2'
      >
        Got it, dismiss
      </button>
    </div>
  );
}
