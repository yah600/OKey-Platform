import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', label, ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn('w-px bg-neutral-200', className)}
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn('relative flex items-center', className)}
          {...props}
        >
          <div className="flex-grow border-t border-neutral-200"></div>
          <span className="px-3 text-xs text-neutral-500 bg-white">{label}</span>
          <div className="flex-grow border-t border-neutral-200"></div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn('h-px bg-neutral-200', className)}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export default Divider;
