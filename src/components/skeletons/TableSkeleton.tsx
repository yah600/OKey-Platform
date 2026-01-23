import Skeleton from '@/components/atoms/Skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

/**
 * Table Skeleton
 * Loading state for data tables
 */
export function TableSkeleton({ rows = 5, columns = 4, showHeader = true }: TableSkeletonProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {showHeader && (
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} variant="text" width="80%" />
            ))}
          </div>
        </div>
      )}
      <div className="divide-y divide-neutral-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} variant="text" width={colIndex === 0 ? '90%' : '70%'} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
