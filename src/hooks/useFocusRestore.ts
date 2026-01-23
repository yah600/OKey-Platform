import { useEffect, useRef } from 'react';

/**
 * Focus Restore Hook
 * Restores focus to trigger element when modal closes
 */
export function useFocusRestore(isOpen: boolean) {
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
    } else if (previousFocus.current) {
      previousFocus.current.focus();
      previousFocus.current = null;
    }
  }, [isOpen]);
}
