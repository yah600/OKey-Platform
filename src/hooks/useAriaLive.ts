import { useEffect, useState } from 'react';

/**
 * ARIA Live Region Hook
 * Announce dynamic content to screen readers
 */
export function useAriaLive() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const announce = (text: string, priority: 'polite' | 'assertive' = 'polite') => {
    setMessage(text);
  };

  return { message, announce };
}

/**
 * ARIA Live Region Component
 */
export function AriaLiveRegion({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
