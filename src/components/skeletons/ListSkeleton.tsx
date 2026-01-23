import Skeleton from '@/components/atoms/Skeleton';

interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  showActions?: boolean;
}

/**
 * List Skeleton
 * Loading state for lists with avatars and actions
 */
export function ListSkeleton({ items = 5, showAvatar = true, showActions = true }: ListSkeletonProps) {
  return (
    <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl bg-white">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          {showAvatar && <Skeleton variant="circular" width={48} height={48} />}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
          {showActions && <Skeleton variant="rectangular" width={80} height={32} />}
        </div>
      ))}
    </div>
  );
}
