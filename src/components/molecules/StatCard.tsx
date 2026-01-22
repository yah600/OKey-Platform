import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  change?: number;
  changeLabel?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  footer?: ReactNode;
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      title,
      value,
      icon: Icon,
      iconColor,
      change,
      changeLabel,
      variant = 'default',
      footer,
      ...props
    },
    ref
  ) => {
    const variantColors = {
      default: 'bg-neutral-100 text-neutral-600',
      primary: 'bg-primary-100 text-primary-600',
      success: 'bg-green-100 text-green-600',
      warning: 'bg-amber-100 text-amber-600',
      error: 'bg-red-100 text-red-600',
    };

    const isPositive = change !== undefined && change > 0;
    const isNegative = change !== undefined && change < 0;

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white border border-neutral-200 rounded-lg p-6 transition-all hover:border-neutral-300',
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-neutral-600 mb-1">{title}</p>
            <p className="text-3xl font-semibold text-neutral-900">{value}</p>
          </div>
          {Icon && (
            <div
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center',
                iconColor || variantColors[variant]
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>

        {(change !== undefined || footer) && (
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : isNegative ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : null}
                <span
                  className={cn(
                    'text-sm font-medium',
                    isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-neutral-600'
                  )}
                >
                  {isPositive && '+'}
                  {change}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-neutral-500 ml-1">{changeLabel}</span>
                )}
              </div>
            )}
            {footer && <div className="text-sm text-neutral-600">{footer}</div>}
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

export default StatCard;
