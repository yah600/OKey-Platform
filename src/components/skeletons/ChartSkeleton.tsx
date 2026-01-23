import Skeleton from '@/components/atoms/Skeleton';

interface ChartSkeletonProps {
  height?: number;
  title?: boolean;
}

/**
 * Chart Skeleton
 * Loading state for charts and graphs
 */
export function ChartSkeleton({ height = 300, title = true }: ChartSkeletonProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200">
      {title && <Skeleton variant="text" width="40%" className="mb-6" />}
      <Skeleton variant="rectangular" height={height} />
      <div className="flex items-center justify-center gap-6 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton variant="circular" width={12} height={12} />
            <Skeleton variant="text" width={60} />
          </div>
        ))}
      </div>
    </div>
  );
}
