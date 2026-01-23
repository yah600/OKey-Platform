import Skeleton from '@/components/atoms/Skeleton';

interface FormSkeletonProps {
  fields?: number;
  showSubmitButton?: boolean;
}

/**
 * Form Skeleton
 * Loading state for forms
 */
export function FormSkeleton({ fields = 5, showSubmitButton = true }: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="rectangular" height={40} />
        </div>
      ))}

      {showSubmitButton && (
        <div className="flex items-center gap-3 pt-4">
          <Skeleton variant="rectangular" width={120} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </div>
      )}
    </div>
  );
}
