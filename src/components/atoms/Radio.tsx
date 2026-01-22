import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const radioId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="radio"
            id={radioId}
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={radioId}
            className={cn(
              'relative flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all cursor-pointer',
              'peer-focus:ring-2 peer-focus:ring-primary-500/20',
              'peer-checked:border-primary-600',
              'peer-disabled:bg-neutral-100 peer-disabled:cursor-not-allowed',
              'border-neutral-300 bg-white',
              className
            )}
          >
            {props.checked && (
              <div className="w-2.5 h-2.5 rounded-full bg-primary-600"></div>
            )}
          </label>
        </div>
        {(label || description) && (
          <div className="ml-3 flex-1">
            {label && (
              <label
                htmlFor={radioId}
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

Radio.displayName = 'Radio';

export default Radio;
