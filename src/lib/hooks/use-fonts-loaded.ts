import { useState, useEffect } from 'react';

/**
 * Hook to check if custom fonts (Inter and Asta Sans) are loaded
 * This prevents GSAP SplitText and other font-dependent operations from running too early
 */
export function useFontsLoaded() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkFonts = async () => {
      try {
        // Check if document.fonts API is available
        if (!document.fonts) {
          // Fallback for browsers without Font Loading API
          setTimeout(() => {
            if (isMounted) setFontsLoaded(true);
          }, 1000);
          return;
        }

        // If fonts are already loaded, check immediately
        if (document.fonts.status === 'loaded') {
          try {
            const interLoaded = document.fonts.check('16px Inter');
            const astaLoaded = document.fonts.check('16px "Asta Sans"');
            
            if (interLoaded && astaLoaded) {
              if (isMounted) setFontsLoaded(true);
              return;
            }
          } catch {
            // If check() fails, just wait for fonts.ready
          }
        }

        // Wait for all fonts to be ready
        await document.fonts.ready;
        
        if (isMounted) setFontsLoaded(true);
      } catch (error) {
        // On error, proceed anyway after a delay
        setTimeout(() => {
          if (isMounted) setFontsLoaded(true);
        }, 800);
      }
    };

    checkFonts();

    return () => {
      isMounted = false;
    };
  }, []);

  return fontsLoaded;
}
