import { HTMLAttributes } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LineChartDataPoint {
  label: string;
  value: number;
}

export interface LineChartProps extends HTMLAttributes<HTMLDivElement> {
  data: LineChartDataPoint[];
  height?: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  showTrend?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  showGrid?: boolean;
}

export default function LineChart({
  className,
  data,
  height = 200,
  color = 'primary',
  showTrend = false,
  valuePrefix = '',
  valueSuffix = '',
  showGrid = true,
  ...props
}: LineChartProps) {
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
  const minValue = Math.min(...values);
  const range = maxValue - minValue;

  // Calculate percentage positions for each point
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = range === 0 ? 50 : ((maxValue - d.value) / range) * 80 + 10; // 10% padding top/bottom
    return { x, y, value: d.value, label: d.label };
  });

  // Create SVG path
  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Create area path (fill under line)
  const areaData = `${pathData} L 100 100 L 0 100 Z`;

  // Calculate trend
  const trend = data.length >= 2 ? data[data.length - 1].value - data[0].value : 0;
  const trendPercent = data[0].value !== 0 ? (trend / data[0].value) * 100 : 0;

  const colorClasses = {
    primary: {
      line: 'stroke-primary-600',
      area: 'fill-primary-600/10',
      dot: 'fill-primary-600',
      trend: trend >= 0 ? 'text-green-600' : 'text-red-600',
    },
    success: {
      line: 'stroke-green-600',
      area: 'fill-green-600/10',
      dot: 'fill-green-600',
      trend: trend >= 0 ? 'text-green-600' : 'text-red-600',
    },
    warning: {
      line: 'stroke-orange-600',
      area: 'fill-orange-600/10',
      dot: 'fill-orange-600',
      trend: trend >= 0 ? 'text-green-600' : 'text-red-600',
    },
    error: {
      line: 'stroke-red-600',
      area: 'fill-red-600/10',
      dot: 'fill-red-600',
      trend: trend >= 0 ? 'text-green-600' : 'text-red-600',
    },
    neutral: {
      line: 'stroke-neutral-600',
      area: 'fill-neutral-600/10',
      dot: 'fill-neutral-600',
      trend: trend >= 0 ? 'text-green-600' : 'text-red-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={cn('relative', className)} {...props}>
      {/* Trend Indicator */}
      {showTrend && (
        <div className="absolute top-0 right-0 flex items-center gap-1 text-sm font-medium">
          {trend >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span className={colors.trend}>
            {trend >= 0 ? '+' : ''}
            {trendPercent.toFixed(1)}%
          </span>
        </div>
      )}

      {/* Chart */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
      >
        {/* Grid Lines */}
        {showGrid && (
          <g className="opacity-10">
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                className="stroke-neutral-900"
                strokeWidth="0.2"
              />
            ))}
          </g>
        )}

        {/* Area Fill */}
        <path d={areaData} className={colors.area} />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          className={colors.line}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Hover Target (invisible larger circle) */}
            <circle
              cx={p.x}
              cy={p.y}
              r="3"
              fill="transparent"
              vectorEffect="non-scaling-stroke"
            >
              <title>
                {p.label}: {valuePrefix}
                {p.value.toLocaleString()}
                {valueSuffix}
              </title>
            </circle>
            {/* Visible Dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r="1.5"
              className={colors.dot}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>

      {/* Labels */}
      <div className="flex items-center justify-between mt-2 text-xs text-neutral-600">
        {data.map((d, i) => {
          // Show first, last, and middle labels for readability
          const showLabel =
            i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2);
          return showLabel ? (
            <div key={i} className="text-center">
              {d.label}
            </div>
          ) : (
            <div key={i} />
          );
        })}
      </div>
    </div>
  );
}
