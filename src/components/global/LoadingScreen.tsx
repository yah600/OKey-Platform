import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading your dashboard...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">O'</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">O'Key Platform</h1>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
}

// Skeleton loader component for content
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <SkeletonLoader className="h-6 w-32 mb-4" />
      <SkeletonLoader className="h-4 w-full mb-2" />
      <SkeletonLoader className="h-4 w-3/4" />
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <SkeletonLoader className="h-4 w-48" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b flex items-center gap-4">
          <SkeletonLoader className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader className="h-4 w-full" />
            <SkeletonLoader className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
