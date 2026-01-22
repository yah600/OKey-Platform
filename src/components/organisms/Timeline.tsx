import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export default function Timeline({ items, className }: TimelineProps) {
  const variantColors = {
    default: 'bg-neutral-200 border-neutral-300',
    success: 'bg-green-100 border-green-300',
    warning: 'bg-amber-100 border-amber-300',
    error: 'bg-red-100 border-red-300',
  };

  const iconColors = {
    default: 'text-neutral-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
  };

  return (
    <div className={cn('relative', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const variant = item.variant || 'default';

        return (
          <div key={item.id} className="relative pb-8 last:pb-0">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-neutral-200" aria-hidden="true" />
            )}

            <div className="relative flex items-start gap-4">
              {/* Icon/Indicator */}
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center',
                  variantColors[variant],
                  iconColors[variant]
                )}
              >
                {item.icon || (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                  <span className="text-xs text-neutral-500 flex-shrink-0">{item.timestamp}</span>
                </div>
                {item.description && (
                  <p className="text-sm text-neutral-600">{item.description}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
