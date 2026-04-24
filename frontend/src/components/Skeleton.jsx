function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`}
      aria-hidden
    />
  );
}

export function RideCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-full max-w-md" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-full sm:h-10 sm:w-28" />
      </div>
    </div>
  );
}

export function RideListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading rides">
      {Array.from({ length: count }).map((_, i) => (
        <RideCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
