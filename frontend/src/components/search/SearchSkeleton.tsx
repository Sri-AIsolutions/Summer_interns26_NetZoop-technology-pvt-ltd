import { Skeleton } from "@/components/common";

export function SearchSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-card border border-slate-200 bg-white"
        >
          <div className="h-1 w-full bg-gradient-to-r from-brand-300 via-brand-500 to-brand-300 bg-[length:200%_100%] animate-shimmer" />
          <div className="p-6 animate-pulse">
            <div className="flex items-start justify-between gap-2 mb-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="mb-4 h-4 w-full" />
            <div className="flex gap-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="mt-3 h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
