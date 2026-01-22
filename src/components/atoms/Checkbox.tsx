import { forwardRef, InputHTMLAttributes } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, indeterminate, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={cn(
              'relative flex items-center justify-center w-5 h-5 rounded border-2 transition-all cursor-pointer',
              'peer-focus:ring-2 peer-focus:ring-primary-500/20',
              'peer-checked:bg-primary-600 peer-checked:border-primary-600',
              'peer-disabled:bg-neutral-100 peer-disabled:cursor-not-allowed',
              !props.checked && !indeterminate && 'border-neutral-300 bg-white',
              indeterminate && 'bg-primary-600 border-primary-600',
              className
            )}
          >
            {indeterminate ? (
              <Minus className="w-3 h-3 text-white" />
            ) : (
              props.checked && <Check className="w-3 h-3 text-white" />
            )}
          </label>
        </div>
        {(label || description) && (
          <div className="ml-3 flex-1">
            {label && (
              <label
                htmlFor={checkboxId}
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

Checkbox.displayName = 'Checkbox';

export default Checkbox;
