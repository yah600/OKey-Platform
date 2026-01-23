import Skeleton from '@/components/atoms/Skeleton';

/**
 * Dashboard Skeleton
 * Loading state for dashboard pages with stat cards and charts
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200">
            <Skeleton variant="text" width="60%" className="mb-2" />
            <Skeleton variant="text" width="40%" height={32} className="mb-1" />
            <Skeleton variant="text" width="50%" />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <Skeleton variant="text" width="40%" className="mb-4" />
          <Skeleton variant="rectangular" height={300} />
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <Skeleton variant="text" width="40%" className="mb-4" />
          <Skeleton variant="rectangular" height={300} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <Skeleton variant="text" width="30%" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
              <Skeleton variant="rectangular" width={100} height={32} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
