export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-neutral-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-neutral-200 rounded w-1/3 mb-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-neutral-200 rounded-lg p-4">
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardLoading() {
  return (
    <div className="animate-pulse bg-white border border-neutral-200 rounded-lg p-6">
      <div className="h-4 bg-neutral-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-neutral-200 rounded"></div>
        <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
        <div className="h-3 bg-neutral-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function TableLoading() {
  return (
    <div className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 py-4 border-b border-neutral-100">
          <div className="w-12 h-12 bg-neutral-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-3 bg-neutral-200 rounded w-1/3"></div>
          </div>
          <div className="w-20 h-8 bg-neutral-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
