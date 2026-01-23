import Skeleton from '@/components/atoms/Skeleton';

/**
 * Property Card Skeleton
 * Loading state for property cards in grid layouts
 */
export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Image */}
      <Skeleton variant="rectangular" height={200} className="rounded-none" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton variant="text" width="80%" height={24} />

        {/* Address */}
        <Skeleton variant="text" width="60%" />

        {/* Features */}
        <div className="flex items-center gap-4">
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={80} />
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="text" width={100} height={28} />
          <Skeleton variant="rectangular" width={100} height={36} />
        </div>
      </div>
    </div>
  );
}

/**
 * Property Card Grid Skeleton
 * Loading state for grid of property cards
 */
export function PropertyCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
