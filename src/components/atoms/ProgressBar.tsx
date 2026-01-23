import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  showLabel?: boolean;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
  striped?: boolean;
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      max = 100,
      size = 'md',
      color = 'primary',
      showLabel = false,
      label,
      showPercentage = false,
      animated = false,
      striped = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    const colorClasses = {
      primary: 'bg-primary-600',
      success: 'bg-green-600',
      warning: 'bg-orange-600',
      error: 'bg-red-600',
      neutral: 'bg-neutral-600',
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {/* Label */}
        {(showLabel || label || showPercentage) && (
          <div className="flex items-center justify-between mb-2">
            {(showLabel || label) && (
              <div className="text-sm font-medium text-neutral-700">
                {label || 'Progress'}
              </div>
            )}
            {showPercentage && (
              <div className="text-sm text-neutral-600">
                {Math.round(percentage)}%
              </div>
            )}
          </div>
        )}

        {/* Progress Bar Container */}
        <div
          className={cn(
            'w-full bg-neutral-200 rounded-full overflow-hidden',
            sizeClasses[size]
          )}
        >
          {/* Progress Bar Fill */}
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              colorClasses[color],
              striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:30px_100%]',
              animated && striped && 'animate-stripe'
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
