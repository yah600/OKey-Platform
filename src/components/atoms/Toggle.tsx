import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, size = 'md', id, ...props }, ref) => {
    const toggleId = id || label?.toLowerCase().replace(/\s/g, '-');

    const sizeClasses = {
      sm: {
        track: 'w-9 h-5',
        thumb: 'w-4 h-4',
        translate: 'translate-x-4',
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
      },
    };

    const { track, thumb, translate } = sizeClasses[size];

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id={toggleId}
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={toggleId}
            className={cn(
              'relative inline-flex items-center rounded-full transition-colors cursor-pointer',
              'peer-focus:ring-2 peer-focus:ring-primary-500/20 peer-focus:outline-none',
              'peer-checked:bg-primary-600',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              'bg-neutral-200',
              track,
              className
            )}
          >
            <span
              className={cn(
                'inline-block rounded-full bg-white transition-transform',
                'ml-0.5',
                props.checked ? translate : 'translate-x-0.5',
                thumb
              )}
            />
          </label>
        </div>
        {(label || description) && (
          <div className="ml-3 flex-1">
            {label && (
              <label
                htmlFor={toggleId}
                className="text-sm font-medium text-neutral-900 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;
