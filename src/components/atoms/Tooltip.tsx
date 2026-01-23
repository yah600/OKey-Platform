import { useState, useRef, ReactNode, cloneElement, isValidElement } from 'react';
import { cn } from '../../lib/utils';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowPositionClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-neutral-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-neutral-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-neutral-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-neutral-900',
  };

  // Clone the child element to attach event handlers
  const childElement = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })
    : children;

  return (
    <div className="relative inline-block">
      {childElement}

      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-sm text-white bg-neutral-900 rounded-lg shadow-lg whitespace-nowrap',
            'animate-fadeIn',
            positionClasses[position],
            className
          )}
          role="tooltip"
        >
          {content}

          {/* Arrow */}
          <div
            className={cn(
              'absolute w-0 h-0 border-4',
              arrowPositionClasses[position]
            )}
          />
        </div>
      )}
    </div>
  );
}
