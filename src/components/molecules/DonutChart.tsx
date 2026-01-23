import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface DonutChartSegment {
  label: string;
  value: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

export interface DonutChartProps extends HTMLAttributes<HTMLDivElement> {
  data: DonutChartSegment[];
  size?: number;
  innerRadiusPercent?: number;
  showLegend?: boolean;
  showPercentages?: boolean;
  centerContent?: React.ReactNode;
}

export default function DonutChart({
  className,
  data,
  size = 200,
  innerRadiusPercent = 60,
  showLegend = true,
  showPercentages = true,
  centerContent,
  ...props
}: DonutChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center text-sm text-neutral-500', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        No data available
      </div>
    );
  }

  const total = data.reduce((sum, segment) => sum + segment.value, 0);

  const colorClasses = {
    primary: { fill: '#2563eb', text: 'text-blue-600', bg: 'bg-blue-600' },
    success: { fill: '#16a34a', text: 'text-green-600', bg: 'bg-green-600' },
    warning: { fill: '#ea580c', text: 'text-orange-600', bg: 'bg-orange-600' },
    error: { fill: '#dc2626', text: 'text-red-600', bg: 'bg-red-600' },
    neutral: { fill: '#525252', text: 'text-neutral-600', bg: 'bg-neutral-600' },
    blue: { fill: '#2563eb', text: 'text-blue-600', bg: 'bg-blue-600' },
    green: { fill: '#16a34a', text: 'text-green-600', bg: 'bg-green-600' },
    orange: { fill: '#ea580c', text: 'text-orange-600', bg: 'bg-orange-600' },
    red: { fill: '#dc2626', text: 'text-red-600', bg: 'bg-red-600' },
    purple: { fill: '#9333ea', text: 'text-purple-600', bg: 'bg-purple-600' },
  };

  // Calculate segments
  const radius = 50; // SVG viewBox is 0-100
  const innerRadius = radius * (innerRadiusPercent / 100);
  const cx = 50;
  const cy = 50;

  let currentAngle = -90; // Start at top

  const segments = data.map((segment) => {
    const percentage = total > 0 ? (segment.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;

    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    currentAngle = endAngle;

    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate arc points
    const outerStart = {
      x: cx + radius * Math.cos(startRad),
      y: cy + radius * Math.sin(startRad),
    };
    const outerEnd = {
      x: cx + radius * Math.cos(endRad),
      y: cy + radius * Math.sin(endRad),
    };
    const innerStart = {
      x: cx + innerRadius * Math.cos(endRad),
      y: cy + innerRadius * Math.sin(endRad),
    };
    const innerEnd = {
      x: cx + innerRadius * Math.cos(startRad),
      y: cy + innerRadius * Math.sin(startRad),
    };

    const largeArcFlag = angle > 180 ? 1 : 0;

    // SVG path for donut segment
    const path = [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ');

    return {
      ...segment,
      path,
      percentage,
    };
  });

  return (
    <div className={cn('flex flex-col items-center gap-4', className)} {...props}>
      {/* Chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.path}
              fill={colorClasses[segment.color || 'primary'].fill}
              className="transition-opacity hover:opacity-80 cursor-pointer"
              opacity={0.9}
            >
              <title>
                {segment.label}: {segment.value.toLocaleString()} ({segment.percentage.toFixed(1)}%)
              </title>
            </path>
          ))}
        </svg>

        {/* Center Content */}
        {centerContent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {centerContent}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="grid grid-cols-1 gap-2 w-full">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className={cn('w-3 h-3 rounded-sm flex-shrink-0', colorClasses[segment.color || 'primary'].bg)}
                />
                <span className="text-neutral-700 truncate">{segment.label}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-neutral-900 font-medium">{segment.value.toLocaleString()}</span>
                {showPercentages && (
                  <span className="text-neutral-600 text-xs min-w-[3rem] text-right">
                    {segment.percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
