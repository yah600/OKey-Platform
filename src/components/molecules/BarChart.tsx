import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
}

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  data: BarChartDataPoint[];
  height?: number;
  direction?: 'vertical' | 'horizontal';
  valuePrefix?: string;
  valueSuffix?: string;
  showValues?: boolean;
  showGrid?: boolean;
}

export default function BarChart({
  className,
  data,
  height = 300,
  direction = 'vertical',
  valuePrefix = '',
  valueSuffix = '',
  showValues = true,
  showGrid = true,
  ...props
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center text-sm text-neutral-500', className)}
        style={{ height }}
        {...props}
      >
        No data available
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);

  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-orange-600',
    error: 'bg-red-600',
    neutral: 'bg-neutral-600',
  };

  if (direction === 'horizontal') {
    return (
      <div className={cn('space-y-3', className)} {...props}>
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const barColor = colorClasses[item.color || 'primary'];

          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-700 font-medium">{item.label}</span>
                {showValues && (
                  <span className="text-sm text-neutral-600">
                    {valuePrefix}
                    {item.value.toLocaleString()}
                    {valueSuffix}
                  </span>
                )}
              </div>
              <div className="relative w-full h-8 bg-neutral-100 rounded-lg overflow-hidden">
                <div
                  className={cn('h-full rounded-lg transition-all duration-500', barColor)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical bars
  return (
    <div className={cn('relative', className)} style={{ height }} {...props}>
      {/* Grid Lines */}
      {showGrid && (
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div key={percent} className="border-t border-neutral-200" />
          ))}
        </div>
      )}

      {/* Bars Container */}
      <div className="relative h-full flex items-end justify-around gap-2 px-2">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const barColor = colorClasses[item.color || 'primary'];

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              {/* Value Label */}
              {showValues && (
                <div className="text-xs font-medium text-neutral-700 mb-1">
                  {valuePrefix}
                  {item.value.toLocaleString()}
                  {valueSuffix}
                </div>
              )}

              {/* Bar */}
              <div className="relative w-full flex flex-col justify-end" style={{ height: 'calc(100% - 32px)' }}>
                <div
                  className={cn(
                    'w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer',
                    barColor
                  )}
                  style={{ height: `${percentage}%` }}
                  title={`${item.label}: ${valuePrefix}${item.value.toLocaleString()}${valueSuffix}`}
                />
              </div>

              {/* Label */}
              <div className="text-xs text-neutral-600 text-center mt-2 line-clamp-2">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
